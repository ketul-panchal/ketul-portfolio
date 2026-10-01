/**
 * Ball-pit physics for the Skills section: gravity, collisions, drag-and-throw and
 * tap-to-bounce. Positions are written straight to the DOM, so React never re-renders
 * while the balls move.
 *
 * The simulation runs only while the pit is on screen and something is moving; once the
 * pile settles the loop stops completely. The balls rain in the first time the pit
 * scrolls into view.
 */

const STEP = 1 / 120; // fixed physics step (s): same motion on 60 Hz and 120 Hz screens
const MAX_STEPS_PER_FRAME = 8;
const VELOCITY_ITERATIONS = 8;
const POSITION_ITERATIONS = 4;
const GRAVITY = 2200; // px/s²
const AIR_DAMPING = 0.5; // per second
const FLOOR_FRICTION = 2; // per second, rolling slow-down on the floor
const CONTACT_FRICTION = 0.05; // share of sliding speed lost per ball contact
const RESTITUTION = 0.5;
const MIN_BOUNCE_SPEED = 80; // px/s: slower hits don't bounce, so resting balls stay still
const STICK_SPEED = 20; // px/s: a ball resting on another ball and slower than this stops (static friction)
const CONTACT_MARGIN = 1; // px: balls (or a ball and a wall) this close count as touching
const OVERLAP_SLOP = 0.5; // px of overlap left alone, so resting contacts don't jiggle
const SLEEP_DRIFT = 1; // px a ball may wander from where it was and still count as resting
const SLEEP_FRAMES = 30; // frames everything must stay within SLEEP_DRIFT before the loop stops
const FILL = 0.36; // share of the pit covered by balls
const MIN_RADIUS = 26;
const MAX_RADIUS = 96;
const WALL_GAP = 6; // px between the side walls and the pit edge (keeps shadows visible)
const FLOOR_GAP = 22; // px between the floor and the pit's bottom edge
const MAX_THROW_SPEED = 3500; // px/s
const TAP_DISTANCE = 6; // px a pointer may move before a press becomes a drag
const HOLD_TO_GRAB = 180; // ms a finger rests on a ball before it can be dragged vertically

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const shuffle = (list) => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Pointer velocity over the recent samples, capped so a flick can't launch a ball too hard
const velocityOf = (samples) => {
  const first = samples[0];
  const last = samples[samples.length - 1];
  const dt = (last.t - first.t) / 1000;
  if (dt < 0.008) return { x: 0, y: 0 };
  const vx = (last.x - first.x) / dt;
  const vy = (last.y - first.y) / dt;
  const scale = Math.min(1, MAX_THROW_SPEED / (Math.hypot(vx, vy) || 1));
  return { x: vx * scale, y: vy * scale };
};

export function createBallPit(container, elements, { reduceMotion = false } = {}) {
  const balls = elements.map((el) => ({
    el,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    inside: false, // has entered the pit (the ceiling only applies after that)
    onBall: false, // resting on another ball this step
    dragging: false,
    drawnX: NaN,
    drawnY: NaN,
  }));

  let width = 0; // area the ball centres move in, after the wall/floor gaps
  let height = 0;
  let radius = 0;
  let dropped = false;
  let visible = false;
  let running = false;
  let frameId = 0;
  let lastTime = 0;
  let accumulator = 0;
  let restFrames = 0;
  let restAnchor = null; // positions at the start of the current resting stretch
  let drag = null;
  let suppressClick = false;

  // ─── Physics ─────────────────────────────────────────────────────────────
  // Each step: gravity, then velocities (touching balls stop pushing into each other), then
  // movement, then overlap clean-up. Fixing velocities before moving means resting balls
  // never sink into each other, so stacks stay still instead of jiggling.

  const bounce = (speed) => (Math.abs(speed) > MIN_BOUNCE_SPEED ? RESTITUTION : 0);

  const solveVelocities = () => {
    const left = WALL_GAP + radius;
    const right = WALL_GAP + width - radius;
    const floor = height - radius;
    for (const b of balls) {
      if (b.dragging) continue;
      if (b.x <= left + CONTACT_MARGIN && b.vx < 0) b.vx *= -bounce(b.vx);
      else if (b.x >= right - CONTACT_MARGIN && b.vx > 0) b.vx *= -bounce(b.vx);
      if (b.y >= floor - CONTACT_MARGIN) {
        if (b.vy > 0) b.vy *= -bounce(b.vy);
      } else if (b.inside && b.y <= radius + CONTACT_MARGIN && b.vy < 0) {
        b.vy *= -bounce(b.vy);
      }
    }

    const reach = radius * 2 + CONTACT_MARGIN;
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      for (let k = i + 1; k < balls.length; k++) {
        const b = balls[k];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= reach * reach || distSq < 1e-12) continue;

        // A held ball doesn't give way, so it shoves the others
        const wa = a.dragging ? 0 : 1;
        const wb = b.dragging ? 0 : 1;
        if (wa + wb === 0) continue;

        const dist = Math.sqrt(distSq);
        const nx = dx / dist;
        const ny = dy / dist;
        if (ny > 0.5) a.onBall = true; // b is underneath a
        else if (ny < -0.5) b.onBall = true;

        const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (approach >= 0) continue;
        const impulse = (-(1 + bounce(approach)) * approach) / (wa + wb);
        a.vx -= nx * impulse * wa;
        a.vy -= ny * impulse * wa;
        b.vx += nx * impulse * wb;
        b.vy += ny * impulse * wb;

        // Friction along the contact, so piles settle instead of sliding around
        const slide = (b.vx - a.vx) * -ny + (b.vy - a.vy) * nx;
        const friction = (slide * CONTACT_FRICTION) / (wa + wb);
        a.vx -= ny * friction * wa;
        a.vy += nx * friction * wa;
        b.vx += ny * friction * wb;
        b.vy -= nx * friction * wb;
      }
    }
  };

  const keepInside = () => {
    const left = WALL_GAP + radius;
    const right = WALL_GAP + width - radius;
    const floor = height - radius;
    for (const b of balls) {
      if (b.dragging) continue;
      b.x = clamp(b.x, left, right);
      if (b.y > floor) b.y = floor;
      else if (b.inside && b.y < radius) b.y = radius;
      if (!b.inside && b.y >= radius) b.inside = true;
    }
  };

  // Push apart balls that still overlap (beyond a little slop), then keep them inside
  const solvePositions = () => {
    const minDist = radius * 2;
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      for (let k = i + 1; k < balls.length; k++) {
        const b = balls[k];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= minDist * minDist) continue;

        const wa = a.dragging ? 0 : 1;
        const wb = b.dragging ? 0 : 1;
        if (wa + wb === 0) continue;

        let dist = Math.sqrt(distSq);
        if (dist < 1e-6) {
          // Exactly on top of each other: separate them vertically
          dx = 0;
          dy = 1;
          dist = 1;
        }
        const overlap = minDist - dist - OVERLAP_SLOP;
        if (overlap <= 0) continue;
        const push = overlap / (wa + wb);
        const nx = dx / dist;
        const ny = dy / dist;
        a.x -= nx * push * wa;
        a.y -= ny * push * wa;
        b.x += nx * push * wb;
        b.y += ny * push * wb;
      }
    }
    keepInside();
  };

  const step = (dt) => {
    const air = Math.exp(-AIR_DAMPING * dt);
    const rolling = Math.exp(-FLOOR_FRICTION * dt);
    const floor = height - radius;
    for (const b of balls) {
      b.onBall = false;
      if (b.dragging) continue;
      b.vy += GRAVITY * dt;
      b.vx *= air;
      b.vy *= air;
      if (b.y >= floor - CONTACT_MARGIN) b.vx *= rolling;
    }

    for (let i = 0; i < VELOCITY_ITERATIONS; i++) solveVelocities();

    // Static friction: a slow ball resting on another ball stays put instead of creeping.
    // (Before moving, otherwise it would still inch along every step.) Balls on the floor
    // keep sliding under the weight above them, so the pile spreads out into neat rows.
    for (const b of balls) {
      if (!b.dragging && b.onBall && Math.abs(b.vx) + Math.abs(b.vy) < STICK_SPEED) {
        b.vx = 0;
        b.vy = 0;
      }
    }

    for (const b of balls) {
      if (b.dragging) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
    }

    for (let i = 0; i < POSITION_ITERATIONS; i++) solvePositions();
  };

  // ─── Rendering and the frame loop ────────────────────────────────────────

  const draw = () => {
    for (const b of balls) {
      const x = b.x - radius;
      const y = b.y - radius;
      if (Math.abs(x - b.drawnX) < 0.05 && Math.abs(y - b.drawnY) < 0.05) continue;
      b.drawnX = x;
      b.drawnY = y;
      b.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }
  };

  // Stops the loop once no ball has wandered more than SLEEP_DRIFT for SLEEP_FRAMES frames.
  // Stacked balls jiggle by fractions of a pixel as gravity and the overlap fix fight, so this
  // looks at drift over the whole stretch rather than at single frames.
  const hasSettled = () => {
    if (drag) {
      restAnchor = null;
      return false;
    }
    const drifted =
      !restAnchor ||
      balls.some((b, i) => Math.abs(b.x - restAnchor[i * 2]) > SLEEP_DRIFT || Math.abs(b.y - restAnchor[i * 2 + 1]) > SLEEP_DRIFT);
    if (drifted) {
      restAnchor = balls.flatMap((b) => [b.x, b.y]);
      restFrames = 0;
      return false;
    }
    if (++restFrames < SLEEP_FRAMES) return false;
    for (const b of balls) {
      b.vx = 0;
      b.vy = 0;
    }
    restAnchor = null;
    return true;
  };

  const frame = (now) => {
    frameId = 0;
    accumulator += Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    let steps = 0;
    while (accumulator >= STEP && steps < MAX_STEPS_PER_FRAME) {
      step(STEP);
      accumulator -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) accumulator = 0;
    draw();

    if (hasSettled()) {
      running = false;
      return;
    }
    frameId = requestAnimationFrame(frame);
  };

  const wake = () => {
    restFrames = 0;
    restAnchor = null;
    if (running || !visible || !dropped) return;
    running = true;
    lastTime = performance.now();
    accumulator = 0;
    frameId = requestAnimationFrame(frame);
  };

  const pause = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    running = false;
  };

  // ─── Layout ──────────────────────────────────────────────────────────────

  // Waiting above the pit (hidden by its overflow) until the first drop
  const park = () => {
    for (const b of balls) {
      b.x = WALL_GAP + width / 2;
      b.y = -radius * 3;
    }
  };

  // Line the balls up above the pit in random order, so they rain in one after another
  const lineUpAbove = () => {
    shuffle(balls).forEach((b, i) => {
      b.x = WALL_GAP + radius + Math.random() * Math.max(0, width - radius * 2);
      b.y = -radius - i * radius * 2.4;
      b.vx = (Math.random() - 0.5) * 160;
      b.vy = 0;
      b.inside = false;
    });
  };

  const drop = () => {
    dropped = true;
    lineUpAbove();
    if (reduceMotion) {
      // No rain: work out where the pile ends up and show that straight away
      for (let i = 0; i < 900; i++) step(STEP);
      for (const b of balls) {
        b.vx = 0;
        b.vy = 0;
      }
      draw();
    }
  };

  const resize = () => {
    const nextWidth = container.clientWidth - WALL_GAP * 2;
    const nextHeight = container.clientHeight - FLOOR_GAP;
    if (nextWidth <= 0 || nextHeight <= 0) return;

    // Size the balls so they always cover about the same share of the pit
    const nextRadius = clamp(
      Math.sqrt((FILL * nextWidth * nextHeight) / (balls.length * Math.PI)),
      MIN_RADIUS,
      MAX_RADIUS
    );

    if (dropped && width && height) {
      for (const b of balls) {
        b.x = WALL_GAP + ((b.x - WALL_GAP) / width) * nextWidth;
        b.y = (b.y / height) * nextHeight;
      }
    }
    width = nextWidth;
    height = nextHeight;
    radius = nextRadius;
    container.style.setProperty('--ball-size', `${radius * 2}px`);

    if (dropped) {
      // Pull everything back inside the new walls straight away, even while paused off screen
      for (let i = 0; i < POSITION_ITERATIONS * 2; i++) solvePositions();
    } else {
      park();
    }
    for (const b of balls) b.drawnX = NaN;
    draw();
    wake();
  };

  // ─── Interaction ─────────────────────────────────────────────────────────

  const ballFrom = (target) => {
    const el = target.closest?.('.skill-ball');
    return el ? balls.find((b) => b.el === el) : null;
  };

  const pointInPit = (e) => {
    const rect = container.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const grab = (ball) => {
    ball.dragging = true;
    ball.vx = 0;
    ball.vy = 0;
    ball.el.classList.add('is-dragging');
    drag.grabbed = true;
  };

  const handlePointerDown = (e) => {
    if (drag || !dropped || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const ball = ballFrom(e.target);
    if (!ball) return;

    suppressClick = false;
    const point = pointInPit(e);
    drag = {
      ball,
      pointerId: e.pointerId,
      touch: e.pointerType === 'touch',
      grabbed: false,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startTime: e.timeStamp,
      offsetX: point.x - ball.x,
      offsetY: point.y - ball.y,
      samples: [],
    };
    ball.el.setPointerCapture?.(e.pointerId);
    // A mouse grabs straight away; a finger waits to see if it's scrolling the page
    if (!drag.touch) grab(ball);
    wake();
  };

  const handlePointerMove = (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const dx = Math.abs(e.clientX - drag.startX);
    const dy = Math.abs(e.clientY - drag.startY);
    if (Math.hypot(dx, dy) > TAP_DISTANCE) drag.moved = true;

    if (!drag.grabbed) {
      // Sideways, or after resting on the ball for a moment: it's a drag.
      // A quick vertical swipe is left to the page (the browser then cancels the pointer).
      const held = e.timeStamp - drag.startTime >= HOLD_TO_GRAB;
      if (!drag.moved) return;
      if (!held && dy >= dx) return;
      grab(drag.ball);
    }

    const { ball } = drag;
    const point = pointInPit(e);
    ball.x = clamp(point.x - drag.offsetX, WALL_GAP + radius, WALL_GAP + width - radius);
    ball.y = clamp(point.y - drag.offsetY, radius, height - radius);
    ball.inside = true;

    drag.samples.push({ t: e.timeStamp, x: ball.x, y: ball.y });
    while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 100) drag.samples.shift();
    // The held ball moves at the pointer's speed, so it shoves others realistically
    const v = velocityOf(drag.samples);
    ball.vx = v.x;
    ball.vy = v.y;
    wake();
  };

  const release = (e, canThrow) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const { ball } = drag;
    if (drag.grabbed) {
      ball.dragging = false;
      ball.el.classList.remove('is-dragging');
      // Throw with the speed of the last 100ms of movement; a pointer held still drops the ball
      const recent = drag.samples.filter((s) => e.timeStamp - s.t <= 100);
      const v = canThrow && recent.length ? velocityOf([...recent, { t: e.timeStamp, x: ball.x, y: ball.y }]) : { x: 0, y: 0 };
      ball.vx = v.x;
      ball.vy = v.y;
    }
    // The click that follows a drag isn't a tap
    suppressClick = drag.grabbed && drag.moved;
    drag = null;
    wake();
  };

  const handlePointerUp = (e) => release(e, true);
  const handlePointerCancel = (e) => release(e, false);

  // Once a finger has grabbed a ball, keep the page from scrolling under it
  const handleTouchMove = (e) => {
    if (drag?.touch && drag.grabbed && e.cancelable) e.preventDefault();
  };

  // The ball hops; balls around it are nudged out of the way, so one at the bottom of
  // the pile can still jump
  const hop = (ball) => {
    const speed = Math.sqrt(2 * GRAVITY * Math.min(height * 0.45, 280));
    ball.vy = -speed;
    ball.vx += (Math.random() - 0.5) * 300;
    ball.inside = true;
    for (const other of balls) {
      if (other === ball || other.dragging) continue;
      const dx = other.x - ball.x;
      const dy = other.y - ball.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > radius * 3) continue;
      const strength = speed * 0.6 * (1 - dist / (radius * 3));
      other.vx += (dx / dist) * strength;
      other.vy += (dy / dist) * strength - strength * 0.5;
      other.inside = true;
    }
    wake();
  };

  // Tap, click, Enter or Space
  const handleClick = (e) => {
    const ball = ballFrom(e.target);
    if (!ball || !dropped) return;
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    hop(ball);
  };

  // ─── Setup ───────────────────────────────────────────────────────────────

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        pause();
        return;
      }
      if (!dropped && entry.intersectionRatio >= 0.2) drop();
      wake();
    },
    { threshold: [0, 0.2] }
  );

  resize();
  container.classList.add('is-ready');
  resizeObserver.observe(container);
  intersectionObserver.observe(container);
  container.addEventListener('pointerdown', handlePointerDown);
  container.addEventListener('pointermove', handlePointerMove);
  container.addEventListener('pointerup', handlePointerUp);
  container.addEventListener('pointercancel', handlePointerCancel);
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('click', handleClick);

  return {
    destroy() {
      pause();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerCancel);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handleClick);
      container.classList.remove('is-ready');
      for (const b of balls) b.el.classList.remove('is-dragging');
    },
  };
}

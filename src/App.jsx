import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/ui/CustomCursor';
import SplashScreen from './components/layout/SplashScreen';
import SmoothScroll from './components/layout/SmoothScroll';
import './styles/index.css';

// Lazy-load the main page so the splash screen renders immediately. The chunk
// downloads while the loader counts, and the page mounts underneath the splash
// so it is fully painted by the time the splash opens up to reveal it.
const loadHome = () => import('./pages/Home');
const Home = lazy(loadHome);

function App() {
  // 'loading' → 'revealing' (splash opening, page intro playing) → 'done'
  const [phase, setPhase] = useState('loading');
  const [homeReady, setHomeReady] = useState(false);

  useEffect(() => {
    loadHome().then(() => setHomeReady(true));
  }, []);

  const handleReveal = useCallback(() => setPhase('revealing'), []);
  const handleComplete = useCallback(() => setPhase('done'), []);

  return (
    <ErrorBoundary>
      <div className="App">
        <CustomCursor />

        <SmoothScroll paused={phase !== 'done'}>
          <Suspense fallback={null}>
            <Home playIntro={phase !== 'loading'} />
          </Suspense>
        </SmoothScroll>

        {phase !== 'done' && (
          <SplashScreen
            ready={homeReady}
            onReveal={handleReveal}
            onComplete={handleComplete}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;

import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { SiUpwork } from 'react-icons/si';

// Where a project link goes, so its button can say so
const LINK_TYPES = [
  { host: 'apps.apple.com', label: 'View on the App Store', Icon: FaApple },
  { host: 'play.google.com', label: 'Get it on Google Play', Icon: FaGooglePlay },
  { host: 'github.com', label: 'View the code on GitHub', Icon: FiGithub },
  { host: 'upwork.com', label: 'View on Upwork', Icon: SiUpwork },
];

/** `{ label, Icon }` for a project's link, or null when it has none (or a placeholder like "#"). */
export function describeLink(url) {
  try {
    const { hostname } = new URL(url);
    return LINK_TYPES.find((type) => hostname.endsWith(type.host)) ?? { label: 'Visit the live site', Icon: FiArrowUpRight };
  } catch {
    return null;
  }
}

import { BadgeFrame } from './BadgeFrame';
import { BadgeLabel } from './BadgeLabel';
import { BadgeProvider } from './BadgeProvider';

interface BadgeComponent {
  Provider: typeof BadgeProvider;
  Frame: typeof BadgeFrame;
  Label: typeof BadgeLabel;
}

// Main component that combines all parts
const Badge: BadgeComponent = {
  Provider: BadgeProvider,
  Frame: BadgeFrame,
  Label: BadgeLabel,
};

export default Badge;
export { BadgeFrame, BadgeLabel, BadgeProvider };


import FeatureCard from './FeatureCard.jsx';

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const FEATURES = [
  {
    title: 'A range with real edges',
    description:
      'Set a minimum and a maximum. The counter clamps to them and the rail shows exactly where the value sits between the two.',
    accent: 'primary',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 12h16M4 8.5v7M20 8.5v7M13 12l-2.5-2.5M13 12l-2.5 2.5" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Move by 1 or by 100',
    description:
      'Six preset steps sit under the buttons, and the settings panel takes any custom step you type.',
    accent: 'accent',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 18v-4h4v4M10 18V9h4v9M16 18V5h4v13M3 21h18" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Statistics that keep score',
    description:
      'Highest, lowest, and how many times you pressed each button — all counted for the session and animated on update.',
    accent: 'warm',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 15.5 9 10l3.5 3.5L20 6M20 6h-4.5M20 6v4.5M3.5 20h17" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Every change is logged',
    description:
      'The activity timeline records what happened, the value before and after, and how long ago it was.',
    accent: 'primary',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 7.5V12l3 1.8" {...stroke} />
        <circle cx="12" cy="12" r="8" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Keyboard first',
    description:
      'Plus, minus and R work anywhere on the page. Inside the counter panel the arrow keys work too, and every control has a visible focus ring.',
    accent: 'accent',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <rect x="2.5" y="6" width="19" height="12" rx="2.6" {...stroke} />
        <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M8 14h8" {...stroke} />
      </svg>
    ),
  },
  {
    title: 'Two themes, both designed',
    description:
      'A dark surface for focus and a light one for daylight. The light palette is drawn from scratch, not inverted.',
    accent: 'warm',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" opacity="0.55" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <div className="features">
      {FEATURES.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          index={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          accent={feature.accent}
        />
      ))}
    </div>
  );
}

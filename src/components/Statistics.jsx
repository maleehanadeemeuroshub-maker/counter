import useCountUp from '../hooks/useCountUp.js';

const formatter = new Intl.NumberFormat('en-US');

/** One statistic. The number tweens towards its new target on every change. */
function StatCard({ label, value, accent = 'primary', caption, index = 0 }) {
  const display = useCountUp(value);

  return (
    <article className="stat" data-accent={accent} style={{ '--d': `${index * 60}ms` }}>
      <p className="stat__label">{label}</p>
      <p className="stat__value">{formatter.format(display)}</p>
      <p className="stat__caption">{caption}</p>
    </article>
  );
}

export default function Statistics({ value, stats }) {
  const cards = [
    { label: 'Current value', value, accent: 'primary', caption: 'Where the counter stands now' },
    { label: 'Highest value', value: stats.highest, accent: 'accent', caption: 'Peak reached this session' },
    { label: 'Lowest value', value: stats.lowest, accent: 'warm', caption: 'Floor reached this session' },
    { label: 'Increments', value: stats.increments, accent: 'accent', caption: 'Times you pressed plus' },
    { label: 'Decrements', value: stats.decrements, accent: 'warm', caption: 'Times you pressed minus' },
    { label: 'Resets', value: stats.resets, accent: 'primary', caption: 'Trips back to zero' },
  ];

  return (
    <div className="stats">
      {cards.map((card, index) => (
        <StatCard
          key={card.label}
          index={index}
          label={card.label}
          value={card.value}
          accent={card.accent}
          caption={card.caption}
        />
      ))}
    </div>
  );
}

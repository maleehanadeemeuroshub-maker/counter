/**
 * Presentational card. Everything it shows arrives through props —
 * the icon is passed in as JSX so the card stays reusable.
 */
export default function FeatureCard({ icon, title, description, accent = 'primary', index = 0 }) {
  return (
    <article className="feature" data-accent={accent} style={{ '--d': `${index * 70}ms` }}>
      <span className="feature__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="feature__title">{title}</h3>
      <p className="feature__text">{description}</p>
    </article>
  );
}

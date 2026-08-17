const LINE_ONE = ['Count', 'Every', 'Moment.'];
const LINE_TWO = ['Control', 'Every', 'Value.'];

/** Splits a line into words so each one can slide up on its own delay. */
function Line({ words, offset, accent = false }) {
  return (
    <span className={`hero__line${accent ? ' hero__line--accent' : ''}`}>
      {words.map((word, index) => (
        <span className="word" key={word}>
          <span className="word__inner" style={{ '--d': `${offset + index * 80}ms` }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Hero({ value, status }) {
  return (
    <section className="hero" id="top">
      <div className="shell hero__inner">
        <p className="eyebrow hero__eyebrow">React &bull; Interactive UI</p>

        <h1 className="hero__title">
          <Line words={LINE_ONE} offset={320} />
          <Line words={LINE_TWO} offset={500} accent />
        </h1>

        <p className="hero__lead">
          A beautifully engineered counter experience built with React, state management, and
          thoughtful interaction design.
        </p>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#counter">
            <span className="btn__label">Start counting</span>
          </a>
          <a className="btn btn--ghost" href="#features">
            <span className="btn__label">Explore features</span>
          </a>
        </div>

        <dl className="hero__facts">
          <div className="hero__fact">
            <dt>Live value</dt>
            <dd>{value}</dd>
          </div>
          <div className="hero__fact">
            <dt>State</dt>
            <dd>{status}</dd>
          </div>
          <div className="hero__fact">
            <dt>Shortcuts</dt>
            <dd>
              <kbd>+</kbd> <kbd>&minus;</kbd> <kbd>R</kbd>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

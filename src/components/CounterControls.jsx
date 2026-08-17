export default function CounterControls({
  step,
  presets,
  onIncrement,
  onDecrement,
  onReset,
  onStepChange,
  canIncrement,
  canDecrement,
  canReset,
}) {
  return (
    <div className="controls">
      <div className="controls__row">
        <button
          type="button"
          className="op op--minus"
          onClick={onDecrement}
          disabled={!canDecrement}
          aria-label={`Decrease by ${step}`}
          title={canDecrement ? `Decrease by ${step}` : 'Already at the minimum'}
        >
          <span className="op__glyph">&minus;</span>
        </button>

        <div className="controls__step" aria-hidden="true">
          <span className="controls__step-label">Step</span>
          <span className="controls__step-value" key={step}>
            {step}
          </span>
        </div>

        <button
          type="button"
          className="op op--plus"
          onClick={onIncrement}
          disabled={!canIncrement}
          aria-label={`Increase by ${step}`}
          title={canIncrement ? `Increase by ${step}` : 'Already at the maximum'}
        >
          <span className="op__glyph">+</span>
        </button>
      </div>

      <div className="chips" role="group" aria-label="Step value">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`chip${preset === step ? ' is-active' : ''}`}
            onClick={() => onStepChange(preset)}
            aria-pressed={preset === step}
          >
            <span className="chip__label">{preset}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn--ghost btn--reset"
        onClick={onReset}
        disabled={!canReset}
        title={canReset ? 'Send the counter back to zero' : 'The counter is already at zero'}
      >
        <span className="btn__label">
          <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
            <path
              d="M4 10a6 6 0 1 0 1.9-4.4M4.4 4v3.2h3.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reset
        </span>
      </button>

      <p className="controls__hint">
        Press <kbd>+</kbd> or <kbd>&minus;</kbd> anywhere on the page, <kbd>R</kbd> to reset.
      </p>
    </div>
  );
}

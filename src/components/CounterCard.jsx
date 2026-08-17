const formatter = new Intl.NumberFormat('en-US');

export default function CounterCard({ value, status, tone, min, max, progress, zeroMark, lastAction }) {
  return (
    <div className="counter" data-tone={tone}>
      <div className="counter__aura" aria-hidden="true" />

      <div className="counter__head">
        <p className="eyebrow">Current value</p>
        {/* keyed by status so the pill re-plays its slide-in on every change */}
        <p className="status" key={status}>
          <span className="status__dot" aria-hidden="true" />
          {status}
        </p>
      </div>

      <div className="counter__display" role="status" aria-live="polite" aria-atomic="true">
        {/* keyed by action id so the same button pressed twice still animates */}
        <span
          key={lastAction.id}
          className={`counter__value counter__value--${lastAction.type}`}
          aria-hidden="true"
        >
          {formatter.format(value)}
        </span>
        <span className="sr-only">{`Value ${value}. ${status}.`}</span>
      </div>

      <div className="rail">
        <div className="rail__track">
          <div className="rail__fill" style={{ width: `${progress * 100}%` }} />
          {zeroMark !== null && (
            <span className="rail__zero" style={{ left: `${zeroMark * 100}%` }} aria-hidden="true" />
          )}
          <span className="rail__knob" style={{ left: `${progress * 100}%` }} aria-hidden="true" />
        </div>
        <div className="rail__scale">
          <span>Min {formatter.format(min)}</span>
          {zeroMark !== null && <span className="rail__scale-zero">0</span>}
          <span>Max {formatter.format(max)}</span>
        </div>
      </div>
    </div>
  );
}

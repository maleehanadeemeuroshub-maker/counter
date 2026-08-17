import { useEffect, useState } from 'react';
import { LIMITS } from '../hooks/useCounter.js';

/**
 * A single numeric field. It validates while you type and applies the
 * change when you leave the field or press Enter, so the counter never
 * jumps around mid-keystroke. Escape restores the current value.
 */
function Field({ id, label, hint, value, validate, apply }) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const check = (raw) => {
    const trimmed = raw.trim();
    if (trimmed === '' || trimmed === '-') return 'Enter a number.';
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return 'Numbers only.';
    return validate(Math.round(parsed));
  };

  const handleChange = (event) => {
    const raw = event.target.value;
    setDraft(raw);
    setError(check(raw));
  };

  const revert = () => {
    setDraft(String(value));
    setError(null);
  };

  const commit = () => {
    const problem = check(draft);
    if (problem) {
      revert();
      return;
    }
    apply(Math.round(Number(draft.trim())));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
    if (event.key === 'Escape') {
      revert();
      event.currentTarget.blur();
    }
  };

  const invalid = Boolean(error) && focused;

  return (
    <div className={`field${invalid ? ' is-invalid' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__shell">
        <input
          id={id}
          className="field__input"
          type="number"
          inputMode="numeric"
          value={draft}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            commit();
          }}
          onKeyDown={handleKeyDown}
          aria-invalid={invalid}
          aria-describedby={`${id}-note`}
        />
        <span className="field__underline" aria-hidden="true" />
      </div>
      <p className={`field__note${invalid ? ' field__note--error' : ''}`} id={`${id}-note`}>
        {invalid ? error : hint}
      </p>
    </div>
  );
}

export default function CounterSettings({ min, max, step, onMinChange, onMaxChange, onStepChange }) {
  return (
    <div className="settings">
      <div className="settings__head">
        <p className="eyebrow">Range settings</p>
        <h3 className="settings__title">Set the boundaries</h3>
        <p className="settings__lead">
          The counter clamps itself to this range. Change a bound and the current value moves inside
          it straight away.
        </p>
      </div>

      <div className="settings__grid">
        <Field
          id="setting-min"
          label="Minimum value"
          hint="The lowest value the counter can reach."
          value={min}
          validate={(next) =>
            next >= max
              ? 'Minimum must stay below the maximum.'
              : next < LIMITS.bound.min
                ? 'That is below the supported range.'
                : null
          }
          apply={onMinChange}
        />
        <Field
          id="setting-max"
          label="Maximum value"
          hint="The highest value the counter can reach."
          value={max}
          validate={(next) =>
            next <= min
              ? 'Maximum must stay above the minimum.'
              : next > LIMITS.bound.max
                ? 'That is above the supported range.'
                : null
          }
          apply={onMaxChange}
        />
        <Field
          id="setting-step"
          label="Step value"
          hint={`How far each press moves the counter (${LIMITS.step.min}–${LIMITS.step.max}).`}
          value={step}
          validate={(next) =>
            next < LIMITS.step.min || next > LIMITS.step.max
              ? `Pick a step between ${LIMITS.step.min} and ${LIMITS.step.max}.`
              : null
          }
          apply={onStepChange}
        />
      </div>

      <p className="settings__foot">Press Enter to apply, Escape to undo.</p>
    </div>
  );
}

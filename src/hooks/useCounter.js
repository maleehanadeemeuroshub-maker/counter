import { useCallback, useMemo, useRef, useState } from 'react';

/** Quick-pick step values offered under the counter. */
export const STEP_PRESETS = [1, 5, 10, 25, 50, 100];

/** Hard rails so a typo in the settings panel can never break the UI. */
export const LIMITS = {
  step: { min: 1, max: 1000 },
  bound: { min: -1000000, max: 1000000 },
};

const HISTORY_SIZE = 40;

const DEFAULTS = { value: 0, step: 1, min: -100, max: 500 };

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/**
 * Owns every piece of counter state and returns the actions that change it.
 * Keeping this in one hook means App and the components below it stay
 * presentational — they receive values and callbacks as props.
 */
export default function useCounter(options = {}) {
  const start = { ...DEFAULTS, ...options };

  const [value, setValue] = useState(start.value);
  const [step, setStepState] = useState(start.step);
  const [min, setMinState] = useState(start.min);
  const [max, setMaxState] = useState(start.max);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    highest: start.value,
    lowest: start.value,
    increments: 0,
    decrements: 0,
    resets: 0,
  });
  // `id` changes on every action so the number can replay its animation
  // even when the same button is pressed twice in a row.
  const [lastAction, setLastAction] = useState({ type: 'idle', id: 0 });

  const entryId = useRef(0);
  const actionId = useRef(0);

  /** Single write path: log the change, update stats, move the value. */
  const commit = useCallback((type, from, to) => {
    entryId.current += 1;
    actionId.current += 1;

    const entry = { id: entryId.current, type, from, to, delta: to - from, at: Date.now() };

    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_SIZE));
    setStats((prev) => ({
      highest: Math.max(prev.highest, to),
      lowest: Math.min(prev.lowest, to),
      increments: prev.increments + (type === 'increment' ? 1 : 0),
      decrements: prev.decrements + (type === 'decrement' ? 1 : 0),
      resets: prev.resets + (type === 'reset' ? 1 : 0),
    }));
    setValue(to);
    setLastAction({ type, id: actionId.current });
  }, []);

  const resetTarget = clamp(0, min, max);

  const increment = useCallback(() => {
    const next = clamp(value + step, min, max);
    if (next !== value) commit('increment', value, next);
  }, [value, step, min, max, commit]);

  const decrement = useCallback(() => {
    const next = clamp(value - step, min, max);
    if (next !== value) commit('decrement', value, next);
  }, [value, step, min, max, commit]);

  const reset = useCallback(() => {
    const next = clamp(0, min, max);
    if (next !== value) commit('reset', value, next);
  }, [value, min, max, commit]);

  const clearHistory = useCallback(() => setHistory([]), []);

  /** Each setter returns true when the value was accepted. */
  const setStep = useCallback((next) => {
    if (!Number.isFinite(next)) return false;
    const rounded = Math.round(next);
    if (rounded < LIMITS.step.min || rounded > LIMITS.step.max) return false;
    setStepState(rounded);
    return true;
  }, []);

  const setMin = useCallback(
    (next) => {
      if (!Number.isFinite(next)) return false;
      const rounded = Math.round(next);
      if (rounded >= max || rounded < LIMITS.bound.min) return false;
      setMinState(rounded);
      setValue((current) => clamp(current, rounded, max));
      return true;
    },
    [max],
  );

  const setMax = useCallback(
    (next) => {
      if (!Number.isFinite(next)) return false;
      const rounded = Math.round(next);
      if (rounded <= min || rounded > LIMITS.bound.max) return false;
      setMaxState(rounded);
      setValue((current) => clamp(current, min, rounded));
      return true;
    },
    [min],
  );

  const status = useMemo(() => {
    if (value >= max) return 'Maximum reached';
    if (value <= min) return 'Minimum reached';
    if (value === 0) return 'Zero';
    return value > 0 ? 'Positive' : 'Negative';
  }, [value, min, max]);

  const tone = useMemo(() => {
    if (value >= max || value <= min) return 'limit';
    if (value === 0) return 'zero';
    return value > 0 ? 'positive' : 'negative';
  }, [value, min, max]);

  const span = max - min;
  const progress = span > 0 ? clamp((value - min) / span, 0, 1) : 0;
  const zeroMark = span > 0 && min < 0 && max > 0 ? (0 - min) / span : null;

  return {
    // state
    value,
    step,
    min,
    max,
    history,
    stats,
    status,
    tone,
    lastAction,
    progress,
    zeroMark,
    // derived flags
    canIncrement: value < max,
    canDecrement: value > min,
    canReset: value !== resetTarget,
    // actions
    increment,
    decrement,
    reset,
    clearHistory,
    setStep,
    setMin,
    setMax,
  };
}

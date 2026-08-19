import { useCallback, useEffect, useState } from 'react';
import Ambient from './components/Ambient.jsx';
import FlowWaveBackground from './components/FlowWaveBackground.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CounterCard from './components/CounterCard.jsx';
import CounterControls from './components/CounterControls.jsx';
import CounterSettings from './components/CounterSettings.jsx';
import Features from './components/Features.jsx';
import Statistics from './components/Statistics.jsx';
import History from './components/History.jsx';
import Footer from './components/Footer.jsx';
import Section from './components/Section.jsx';
import useCounter, { STEP_PRESETS } from './hooks/useCounter.js';

const THEME_KEY = 'counter.theme';

/* Storage can throw in private browsing, so both sides are guarded. */
const readInitialTheme = () => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (error) {
    /* fall through to the system preference */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const saveTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* the theme still applies for this visit */
  }
};

const isTypingTarget = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export default function App() {
  const counter = useCounter();
  const [theme, setTheme] = useState(readInitialTheme);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  // The 3D scene falls back to the flat Ambient backdrop if WebGL init throws.
  const [flowWaveFailed, setFlowWaveFailed] = useState(false);

  /* Theme: reflected on <html> so every CSS variable switches at once. */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0E0C09' : '#F6F1E7');
    saveTheme(theme);
  }, [theme]);

  /* The Flow Wave background only suits the dark palette and only runs when
     motion is welcome — light theme and reduced-motion both get the plain,
     static Ambient backdrop instead. */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const showFlowWave = theme === 'dark' && !reducedMotion && !flowWaveFailed;
  const handleFlowWaveError = useCallback(() => setFlowWaveFailed(true), []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('is-theming');
    window.setTimeout(() => root.classList.remove('is-theming'), 480);
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  /* Page-wide shortcuts. Typing in a field is never hijacked. */
  const { increment, decrement, reset } = counter;
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        increment();
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        decrement();
      } else if (event.key === 'r' || event.key === 'R') {
        reset();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [increment, decrement, reset]);

  /* Arrow keys work while focus is inside the counter panel. */
  const handlePanelKeyDown = (event) => {
    if (isTypingTarget(event.target)) return;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      increment();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      decrement();
    }
  };

  return (
    <>
      {showFlowWave ? (
        <FlowWaveBackground active onError={handleFlowWaveError} />
      ) : (
        <Ambient />
      )}
      <a className="skip-link" href="#counter">
        Skip to the counter
      </a>

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero value={counter.value} status={counter.status} />

        <section className="section section--counter" id="counter">
          <div className="shell">
            <header className="section__head">
              <div>
                <p className="eyebrow">Live state</p>
                <h2 className="section__title">The counter</h2>
                <p className="section__lead">
                  One value, held in React state. Every control below writes to it and every panel on
                  this page reads from it.
                </p>
              </div>
            </header>

            <div
              className="panel"
              role="group"
              aria-label="Counter"
              tabIndex={-1}
              onKeyDown={handlePanelKeyDown}
            >
              <div className="panel__main">
                <CounterCard
                  value={counter.value}
                  status={counter.status}
                  tone={counter.tone}
                  min={counter.min}
                  max={counter.max}
                  progress={counter.progress}
                  zeroMark={counter.zeroMark}
                  lastAction={counter.lastAction}
                />
                <CounterControls
                  step={counter.step}
                  presets={STEP_PRESETS}
                  onIncrement={counter.increment}
                  onDecrement={counter.decrement}
                  onReset={counter.reset}
                  onStepChange={counter.setStep}
                  canIncrement={counter.canIncrement}
                  canDecrement={counter.canDecrement}
                  canReset={counter.canReset}
                />
              </div>

              <CounterSettings
                min={counter.min}
                max={counter.max}
                step={counter.step}
                onMinChange={counter.setMin}
                onMaxChange={counter.setMax}
                onStepChange={counter.setStep}
              />
            </div>
          </div>
        </section>

        <Section
          id="features"
          eyebrow="What it does"
          title="Small app, real behaviour"
          lead="Nothing here is a placeholder — every control on the page changes state you can see somewhere else."
        >
          <Features />
        </Section>

        <Section
          id="statistics"
          eyebrow="Session totals"
          title="Statistics"
          lead="Recorded from the moment the page loaded. Reload to start a fresh session."
        >
          <Statistics value={counter.value} stats={counter.stats} />
        </Section>

        <Section
          id="history"
          eyebrow="Activity log"
          title="History"
          lead="The last forty changes, newest first, with the value before and after each one."
        >
          <History history={counter.history} onClear={counter.clearHistory} />
        </Section>
      </main>

      <Footer />
    </>
  );
}

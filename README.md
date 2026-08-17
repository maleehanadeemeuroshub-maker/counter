# Counter

A counter application built as a real product page rather than a tutorial exercise. One value lives
in React state; a bounded range, a step control, session statistics and a timestamped activity log
all read from it and write back to it.

Built with React 18 and Vite. No UI library, no animation library — the motion is CSS.

---

## Features

- **Bounded range.** Minimum and maximum are editable. The counter clamps to them, the buttons
  disable at the edges, and a rail under the number shows where the value sits between the two.
- **Step control.** Six presets (1, 5, 10, 25, 50, 100) plus any custom step from 1 to 1000.
- **Live status.** Zero, positive, negative, minimum reached, maximum reached — each with its own
  accent colour, driving the glow behind the card.
- **Session statistics.** Current, highest and lowest value, plus how many times each button was
  pressed. Every number tweens to its new total.
- **Activity log.** The last forty changes, newest first, with the before and after value and a
  relative timestamp that keeps itself current.
- **Designed empty state** for the log, with a button to clear it once entries exist.
- **Dark and light themes.** The light palette is drawn from scratch, not inverted, and the choice
  is remembered between visits.
- **Keyboard support.** `+` and `−` work anywhere on the page, `R` resets, and the arrow keys work
  while focus is inside the counter panel. Typing in an input is never hijacked.
- **Motion that respects the reader.** A staggered page-load sequence, one-time scroll reveals, and
  a full `prefers-reduced-motion` fallback.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 |
| Build tool | Vite 5 |
| Language | JavaScript (JSX) |
| Styling | CSS3 with custom properties, no preprocessor |
| Motion | CSS animations, transitions and transforms |
| Runtime dependencies | `react`, `react-dom` — nothing else |

## React concepts demonstrated

**Components** — the page is composed of nine reusable components plus a `Section` shell. Each one
does a single job and can be dropped somewhere else unchanged.

**Props** — `FeatureCard`, `StatCard`, `Field`, `CounterCard` and `History` are entirely
presentational. They receive their data and their callbacks from above, including JSX (the feature
icons are passed as props).

**State** — all mutable state lives in the `useCounter` hook: value, step, minimum, maximum,
history and statistics. Theme state lives in `App`. Nothing below them holds duplicate state.

**Events** — click handlers on every control, `change`/`focus`/`blur`/`keydown` on the settings
inputs, and window-level `keydown` and `scroll` listeners registered and cleaned up in effects.

**JSX and conditional rendering** — the history section swaps between the timeline and its empty
state, the zero marker only renders when zero is inside the range, and validation messages replace
hint text only while a field is focused and invalid.

**Hooks** — `useState`, `useEffect`, `useCallback`, `useMemo` and `useRef`, plus three custom hooks.

## Component architecture

```text
src/
├── components/
│   ├── Ambient.jsx           background layers: grid, glows, particles, grain
│   ├── Navbar.jsx            sticky nav, scroll state, mobile menu, theme toggle
│   ├── Hero.jsx              word-reveal heading and calls to action
│   ├── CounterCard.jsx       the value, its status and the min/max rail
│   ├── CounterControls.jsx   plus, minus, reset and the step presets
│   ├── CounterSettings.jsx   minimum, maximum and step inputs with validation
│   ├── Features.jsx          feature data, mapped into cards
│   ├── FeatureCard.jsx       one feature (presentational)
│   ├── Statistics.jsx        the six statistic cards
│   ├── History.jsx           grouped activity timeline and empty state
│   ├── Section.jsx           shared section shell with a scroll reveal
│   └── Footer.jsx
├── hooks/
│   ├── useCounter.js         every piece of counter state and the actions on it
│   ├── useCountUp.js         requestAnimationFrame tween for the statistics
│   └── useReveal.js          Intersection Observer reveal that fires once
├── styles/
│   ├── globals.css           tokens, base styles and component styles
│   ├── animations.css        keyframes, entrance sequence, reveal states
│   └── responsive.css        breakpoints, touch tuning, reduced motion
├── App.jsx                   theme, keyboard shortcuts, page composition
└── main.jsx
```

Data flows one way: `useCounter` holds the state, `App` passes values and callbacks down, and the
components below render what they are given.

## Installation

Requires Node 18 or newer.

```bash
npm install
```

## Running locally

```bash
npm run dev
```

Vite prints a local address — by default `http://localhost:5173`.

## Build

```bash
npm run build     # production build into dist/
npm run preview   # serve that build locally to check it
```

## Deployment

The build output in `dist/` is static, so any static host works.

- **Vercel / Netlify** — connect the repository. Build command `npm run build`, output directory
  `dist`.
- **GitHub Pages** — add `base: '/<repository-name>/'` to `vite.config.js`, run `npm run build`,
  and publish `dist`.

## Design notes

The palette is a single brand purple (`#7C5CFF`) on a near-black ground, with teal and amber used
only to signal direction: teal for growth, amber for decline. Nothing else is coloured.

Type is set in Sora for display and numerals, Inter for body copy, and JetBrains Mono for labels,
timestamps and anything numeric that needs to line up. The counter number is the one place the
design raises its voice — everything around it stays quiet.

The rail beneath the number is the piece that ties the app together: it gives the minimum and
maximum settings something visible to do, and it is the reason the bounds feel like part of the
product rather than a settings form.

## Future improvements

- Persist the counter, bounds and log to `localStorage` so a session survives a reload.
- Multiple named counters with independent settings.
- Export the activity log as CSV or JSON.
- Undo and redo built on the existing history entries.
- A small sparkline of the value over time above the statistics.
- Unit tests for `useCounter` with Vitest and React Testing Library.

## Notes

The brief listed an `assets/` folder. Every icon in this project is an inline SVG so it can inherit
`currentColor` and respond to the theme, and the favicon is a data URI in `index.html`, so the
folder would have been empty — it has been left out rather than committed as dead weight.

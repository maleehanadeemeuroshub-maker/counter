import { useEffect, useState } from 'react';

const LABELS = {
  increment: 'Counter increased',
  decrement: 'Counter decreased',
  reset: 'Counter reset',
};

const ICONS = {
  increment: 'M10 15.5v-11M5.5 9 10 4.5 14.5 9',
  decrement: 'M10 4.5v11M5.5 11l4.5 4.5L14.5 11',
  reset: 'M4.5 10a5.5 5.5 0 1 0 1.7-4M4.8 4.6v3.1h3.1',
};

const startOfDay = (time) => {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

function dayLabel(time, now) {
  const diff = Math.round((startOfDay(now) - startOfDay(time)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function timeAgo(time, now) {
  const seconds = Math.max(0, Math.round((now - time) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? '' : 's'} ago`;
}

function groupByDay(entries, now) {
  const groups = [];
  entries.forEach((entry) => {
    const label = dayLabel(entry.at, now);
    const current = groups[groups.length - 1];
    if (current && current.label === label) current.items.push(entry);
    else groups.push({ label, items: [entry] });
  });
  return groups;
}

function EmptyState() {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="20" cy="20" r="12.5" strokeDasharray="3 5" />
          <path d="M14.5 20h11M20 14.5v11" strokeLinecap="round" />
        </svg>
      </span>
      <p className="empty__title">No activity yet</p>
      <p className="empty__text">
        Start interacting with the counter and your actions will appear here.
      </p>
    </div>
  );
}

export default function History({ history, onClear }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (history.length === 0) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, [history.length]);

  if (history.length === 0) {
    return (
      <div className="log">
        <EmptyState />
      </div>
    );
  }

  const groups = groupByDay(history, now);

  return (
    <div className="log">
      <div className="log__bar">
        <p className="log__count">
          {history.length} {history.length === 1 ? 'action' : 'actions'} recorded
        </p>
        <button type="button" className="btn btn--quiet" onClick={onClear}>
          <span className="btn__label">Clear log</span>
        </button>
      </div>

      {groups.map((group) => (
        <div className="log__group" key={group.label}>
          <p className="log__day">{group.label}</p>
          <ol className="log__list">
            {group.items.map((entry) => (
              <li className="entry" key={entry.id} data-type={entry.type}>
                <span className="entry__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[entry.type]} />
                  </svg>
                </span>
                <span className="entry__delta">
                  {entry.type === 'reset'
                    ? 'Reset'
                    : `${entry.delta > 0 ? '+' : '\u2212'}${Math.abs(entry.delta)}`}
                </span>
                <span className="entry__body">
                  <span className="entry__label">{LABELS[entry.type]}</span>
                  <span className="entry__values">
                    {entry.from} <span aria-hidden="true">&rarr;</span> {entry.to}
                  </span>
                </span>
                <time className="entry__time" dateTime={new Date(entry.at).toISOString()}>
                  {timeAgo(entry.at, now)}
                </time>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

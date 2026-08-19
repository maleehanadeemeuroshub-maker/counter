import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { href: '#counter', label: 'Counter' },
  { href: '#features', label: 'Features' },
  { href: '#statistics', label: 'Statistics' },
  { href: '#history', label: 'History' },
];

function Mark() {
  return (
    <span className="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
        <path
          d="M8.5 12.5h6M11.5 9.5v6M17.5 20.5h6"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function ThemeIcon({ theme }) {
  return (
    <svg className="theme-toggle__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      {theme === 'dark' ? (
        <path
          d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4.1" />
          <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
        </g>
      )}
    </svg>
  );
}

const HIDE_THRESHOLD = 80;

export default function Navbar({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 10);

        if (currentScrollY <= HIDE_THRESHOLD) {
          setHidden(false);
        } else {
          setHidden(currentScrollY > lastScrollY.current);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const query = window.matchMedia('(min-width: 901px)');
    const onChange = (event) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}${hidden ? ' is-hidden' : ''}`}>
      <div className="nav__inner shell">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <Mark />
          <span className="brand__name">Counter</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className="nav__link"
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
          >
            <ThemeIcon theme={theme} />
            <span className="theme-toggle__label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>

          <button
            type="button"
            className={`burger${open ? ' is-active' : ''}`}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="burger__bar" />
            <span className="burger__bar" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav className="menu__list" aria-label="Sections">
          {LINKS.map((link, index) => (
            <a
              key={link.href}
              className="menu__link"
              href={link.href}
              style={{ '--d': `${60 + index * 55}ms` }}
              onClick={() => setOpen(false)}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span>{link.label}</span>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

const LINKS = [
  { href: '#counter', label: 'Counter' },
  { href: '#features', label: 'Features' },
  { href: '#statistics', label: 'Statistics' },
  { href: '#history', label: 'History' },
  { href: '/flow-wave.html', label: 'Flow Wave', external: true },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <p className="footer__name">Counter</p>
          <p className="footer__line">Built with React.</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          {LINKS.map((link) => (
            <a
              key={link.href}
              className="footer__link"
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer__meta">
          <p className="footer__stack">React &bull; JavaScript &bull; CSS</p>
          <p className="footer__copy">&copy; 2026 Counter</p>
        </div>
      </div>
    </footer>
  );
}

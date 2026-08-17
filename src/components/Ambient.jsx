const PARTICLES = [
  { left: '8%', top: '18%', delay: '0s', duration: '17s', size: '3px' },
  { left: '22%', top: '62%', delay: '2.4s', duration: '21s', size: '2px' },
  { left: '35%', top: '30%', delay: '5.1s', duration: '19s', size: '2px' },
  { left: '48%', top: '78%', delay: '1.2s', duration: '23s', size: '3px' },
  { left: '61%', top: '22%', delay: '3.6s', duration: '18s', size: '2px' },
  { left: '74%', top: '55%', delay: '6.2s', duration: '22s', size: '3px' },
  { left: '86%', top: '34%', delay: '0.8s', duration: '20s', size: '2px' },
  { left: '92%', top: '72%', delay: '4.4s', duration: '24s', size: '2px' },
];

/** Purely decorative depth layers behind the page content. */
export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__grid" />
      <div className="ambient__glow ambient__glow--primary" />
      <div className="ambient__glow ambient__glow--accent" />
      <div className="ambient__glow ambient__glow--warm" />
      <div className="ambient__particles">
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>
      <div className="ambient__grain" />
    </div>
  );
}

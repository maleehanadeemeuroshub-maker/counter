/** Purely decorative depth layers behind the page content: a faint grid
 * and two soft, slow-drifting glows. No grain, no particles — restraint
 * reads as more considered than a busy background. */
export default function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__grid" />
      <div className="ambient__glow ambient__glow--primary" />
      <div className="ambient__glow ambient__glow--accent" />
    </div>
  );
}

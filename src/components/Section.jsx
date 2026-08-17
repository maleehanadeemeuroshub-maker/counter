import useReveal from '../hooks/useReveal.js';

/**
 * Shared section shell: consistent heading block plus a one-time
 * scroll reveal for everything inside it.
 */
export default function Section({ id, eyebrow, title, lead, children }) {
  const [ref, revealed] = useReveal();

  return (
    <section className={`section reveal${revealed ? ' is-visible' : ''}`} id={id} ref={ref}>
      <div className="shell">
        <header className="section__head">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="section__title">{title}</h2>
            {lead && <p className="section__lead">{lead}</p>}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

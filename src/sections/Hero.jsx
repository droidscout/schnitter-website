import './Hero.css';

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="chip hero__chip">
            {(() => {
              const words = ['Heizung', 'Sanitär', 'Klima', 'Lüftung', 'Elektro'];
              const tokens = [];
              words.forEach((w, i) => {
                tokens.push({ t: w, sep: false });
                if (i < words.length - 1) tokens.push({ t: '·', sep: true });
              });
              return tokens.map((tok, idx) => (
                <span
                  key={idx}
                  className={tok.sep ? 'hero__chip-sep' : 'hero__chip-item'}
                  aria-hidden={tok.sep ? 'true' : undefined}
                >
                  {tok.t}
                </span>
              ));
            })()}
          </span>
          <h1>
            Schnitter GbR</h1><h2>Ihr Meisterbetrieb im Bereich Haustechnik aus München<br /> - zuverlässig & kompetent.
          </h2>
          <p>
            Wir begleiten Eigentümer, Architekturbüros, Hausverwaltungen und Gewerbe bei der Planung, Umsetzung und Wartung im Bereich der gesamten Haustechnik. Persönlich, termintreu und mit Blick auf Energieeffizienz.
          </p>
          <div className="hero__actions">
            <a className="accent-button" href="#contact">
              Kontakt
            </a>
            <a className="hero__secondary" href="#about">
              Mehr erfahren
            </a>
          </div>
        </div>
        <div className="hero__card">
          <div className="hero__badge">
            <h3>24/7 Service & Notfall</h3>
            <p>Notdienst für Vertragspartner</p>
          </div>
{/*           <div className="hero__stat">
            <h3>24/7 Service</h3>
            <p>Notdienst für Bestandkund:innen – wir sind erreichbar.</p>
          </div> */}
        </div>
      </div>
    </section>
  );
}

import './Hero.css';

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="chip hero__chip">Heizung · Sanitär · Klima</span>
          <h1>
            Haustechnik aus München,
            <br />
            zuverlässig & energieeffizient.
          </h1>
          <p>
            Wir begleiten Eigentümer:innen, Architekturbüros und Gewerbe bei der Planung, Umsetzung und Wartung moderner
            Haustechniklösungen. Persönlich, termintreu und mit Blick auf Nachhaltigkeit.
          </p>
          <div className="hero__actions">
            <a className="accent-button" href="#contact">
              Projekt anfragen
            </a>
            <a className="hero__secondary" href="#services">
              Leistungen entdecken
            </a>
          </div>
        </div>
        <div className="hero__card">
          <div className="hero__badge">
            <span>25+</span>
            Jahre Erfahrung
          </div>
          <div className="hero__stat">
            <h3>500+ Projekte</h3>
            <p>Sanierungs- und Neubauprojekte in München und Umland.</p>
          </div>
          <div className="hero__stat">
            <h3>24/7 Service</h3>
            <p>Notdienst für Bestandkund:innen – wir sind erreichbar.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

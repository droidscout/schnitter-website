import './About.css';
import { highlights } from '../data/services.js';

export function About() {
  return (
    <section id="about" className="about">
      <div className="container about__inner">
        <div className="about__media">
          <div className="about__image" role="presentation" />
          <div className="about__overlay">
            <p>Geprüfter Innungsbetrieb</p>
            <span className="about__overlay-badge">SHK München</span>
          </div>
        </div>
        <div className="about__content">
          <span className="about__eyebrow">Über uns</span>
          <h2>Technik, die begeistert und Bestand hat</h2>
          <p>
            Schnitter GbR Haustechnik steht für zuverlässige Projektabwicklung, saubere Ausführung und nachhaltige Anlagen - schnell, effizient und lösungsorientiert.
            Unsere Firma setzt auf qualitativ hochwertige Markenprodukte und transparente Kommunikation.
          </p>
          <ul className="about__highlights">
            {highlights.map((item) => (
              <li key={item.label}>
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </li>
            ))}
          </ul>
          <div className="about__cta">
            <a className="accent-button about__cta-button" href="#contact">
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

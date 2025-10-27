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
            Schnitter GbR Haustechnik steht für zuverlässige Projektabwicklung, saubere Ausführung und nachhaltige Anlagen.
            Unser Team aus Meister:innen, Techniker:innen und Monteur:innen setzt auf hochwertige Markenprodukte und
            transparente Kommunikation.
          </p>
          <ul className="about__highlights">
            {highlights.map((item) => (
              <li key={item.label}>
                <span>{item.value}</span>
                {item.label}
              </li>
            ))}
          </ul>
          <div className="about__cta">
            <a className="accent-button" href="#contact">
              Beratung anfordern
            </a>
            <a className="about__phone" href="tel:+498936109524">
              089 361 095 24
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

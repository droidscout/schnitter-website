import { services } from '../data/services.js';
import './Services.css';

export function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="services__header">
          <span className="services__eyebrow">Leistungen</span>
          <h2>Ganzheitliche Haustechnik für Wohn- und Gewerbeprojekte</h2>
          <p>
            Von der ersten Idee bis zur fertigen Anlage – wir kombinieren Expertise aus Sanitär, Heizung und Klimatechnik
            und liefern technisch wie ästhetisch überzeugende Lösungen.
          </p>
        </div>
        <div className="services__grid">
          {services.map((service) => (
            <article key={service.title} className="services__card">
              <div className="services__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

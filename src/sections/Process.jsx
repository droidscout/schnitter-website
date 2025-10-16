import './Process.css';
import { steps } from '../data/services.js';

export function Process() {
  return (
    <section id="process" className="process">
      <div className="container">
        <div className="process__header">
          <span className="process__eyebrow">Ablauf</span>
          <h2>Transparente Projektphasen – klar strukturiert und effizient</h2>
          <p>
            Unser eingespieltes Team koordiniert alle Gewerke, überwacht Termine und sorgt dafür, dass Ihr Projekt
            reibungslos umgesetzt wird.
          </p>
        </div>
        <div className="process__timeline">
          {steps.map((step, index) => (
            <article key={step.title} className="process__item">
              <div className="process__number">{String(index + 1).padStart(2, '0')}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

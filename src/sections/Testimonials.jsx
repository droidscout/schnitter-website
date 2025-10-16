import './Testimonials.css';
import { testimonials } from '../data/services.js';

export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <span className="testimonials__eyebrow">Referenzen</span>
          <h2>Wertschätzung von Kund:innen, die auf uns vertrauen</h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.author} className="testimonials__card">
              <p>&ldquo;{testimonial.quote}&rdquo;</p>
              <footer>{testimonial.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

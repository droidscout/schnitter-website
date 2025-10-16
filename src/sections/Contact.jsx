import './Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container contact__inner">
        <div className="contact__content">
          <span className="contact__eyebrow">Kontakt</span>
          <h2>Ihre Anfrage – wir melden uns innerhalb von 24 Stunden</h2>
          <p>
            Erzählen Sie uns von Ihrem Projekt. Ob Badmodernisierung, Heizungssanierung oder komplexe Lüftungskonzepte –
            wir beraten Sie persönlich und transparent.
          </p>
          <div className="contact__options">
            <div>
              <h3>Telefon</h3>
              <a href="tel:+49891234567">089 / 123 45 67</a>
            </div>
            <div>
              <h3>Email</h3>
              <a href="mailto:service@schnitter-haustechnik.de">service@schnitter-haustechnik.de</a>
            </div>
            <div>
              <h3>Adresse</h3>
              <p>Schleißheimer Str. 123<br />80797 München</p>
            </div>
          </div>
        </div>
        <form className="contact__form">
          <div className="contact__group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" placeholder="Max Mustermann" required />
          </div>
          <div className="contact__group">
            <label htmlFor="email">E-Mail</label>
            <input id="email" name="email" type="email" placeholder="sie@unternehmen.de" required />
          </div>
          <div className="contact__group">
            <label htmlFor="phone">Telefon</label>
            <input id="phone" name="phone" type="tel" placeholder="+49 ..." />
          </div>
          <div className="contact__group">
            <label htmlFor="message">Projektbeschreibung</label>
            <textarea id="message" name="message" rows="4" placeholder="Worum geht es in Ihrem Projekt?" />
          </div>
          <button type="submit" className="accent-button contact__submit">
            Anfrage senden
          </button>
          <p className="contact__privacy">
            Mit dem Absenden stimmen Sie einer Kontaktaufnahme per E-Mail oder Telefon zu. Ihre Daten werden vertraulich
            behandelt.
          </p>
        </form>
      </div>
    </section>
  );
}

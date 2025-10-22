import './Contact.css';

export function Contact() {
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("URL ", `${import.meta.env.VITE_API_BASE_URL || ''}`);
    fetch(`${import.meta.env.VITE_API_BASE_URL || ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'Senden fehlgeschlagen');
        alert('Vielen Dank! Bitte bestätigen Sie Ihre E-Mail über den zugesandten Link.');
        form.reset();
      })
      .catch((err) => alert(err.message || 'Ein Fehler ist aufgetreten.'));
  }
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
            <a href="tel:+498936109524">089 361 095 24</a>
            </div>
            <div>
              <h3>Email</h3>
              <a href="mailto:haustechnik@schnittergbr.de">haustechnik@schnittergbr.de</a>
            </div>
            <div>
            <h3>Adresse</h3>
            <p>Bahnweg 51, 85774 Unterföhring</p>
            </div>
          </div>
        </div>
        <form className="contact__form" onSubmit={handleSubmit}>
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
            <label htmlFor="message">Ihre Nachricht</label>
            <textarea id="message" name="message" rows="4" placeholder="Teile Sie uns etwas mit." />
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

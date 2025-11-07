import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <span className="footer__logo">Schnitter GbR Haustechnik Meisterbetrieb</span>
          <p>Ihr Partner für Heizung, Sanitär, Klima, Lüftung, Elektro in München und Umgebung.</p>
        </div>
        <div className="footer__info">
          <div>
            <h4>Kontakt</h4>
            <a href="tel:+498936109524">089 361 095 24</a>
            <a href="mailto:haustechnik@schnittergbr.de">Haustechnik@SchnitterGbR.de</a>
          </div>
          <div>
            <h4>Bürozeiten</h4>
            <p>Mo – Do: 09:00 – 17:00 Uhr</p>
            <p>Fr: 09:00 – 12:00 Uhr</p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} Schnitter GbR</span>
          <div className="footer__links">
            <a href="/schnitter/impressum">Impressum</a>
            <a href="/schnitter/datenschutz">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

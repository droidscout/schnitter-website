import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <span className="footer__logo">Schnitter Haustechnik</span>
          <p>Ihr Partner für Sanitär, Heizung und Klimatechnik in München und Umgebung.</p>
        </div>
        <div className="footer__info">
          <div>
            <h4>Kontakt</h4>
            <a href="tel:+498936109524">089 361 095 24</a>
            <a href="mailto:haustechnik@schnittergbr.de">haustechnik@schnittergbr.de</a>
          </div>
          <div>
            <h4>Bürozeiten</h4>
            <p>Mo – Fr: 08:00 – 17:00 Uhr</p>
            <p>Notdienst für Bestandkund:innen 24/7</p>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} Schnitter Haustechnik</span>
          <div className="footer__links">
            <a href="/impressum">Impressum</a>
            <a href="/datenschutz">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

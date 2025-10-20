import './Impressum.css';

export function Impressum() {
  return (
    <section id="impressum" className="impressum">
      <div className="container impressum__inner">
        <h2>Rudolf und Thomas Schnitter GbR</h2>
        <p>
          Bahnweg 51, 85774 Unterföhring
        </p>
        <p>
          Telefon: <a href="tel:+498936109524">089 361 095 24</a>
        </p>
        <p>
          E‑Mail: <a href="mailto:haustechnik@schnittergbr.de">haustechnik@schnittergbr.de</a>
        </p>
        <p>
          <strong>Leistungsbeschreibung</strong><br />
          Elektroinstallation, Regelungstechnik, Schaltschrankbau, Heizungen, Öl- und Gasfeuerung, Kunden- und Stördienst,
          Werksvertretung, Spezial-Heizkessel, Solaranlagen, gesamte Haustechnik.
        </p>
        <p>
          <strong>Eingetragene Berufe</strong><br />
          Elektrotechniker<br />
          Installateur und Heizungsbauer (Beschränkt auf Montage und Instandhaltung von Oelfeuerungsanlagen sowie seit
          23.11.2001 auf Gas- installationen)
        </p>
        <p>
          <strong>Weitere Informationen</strong><br />
          Ausbildungsbetrieb ja
        </p>
      </div>
    </section>
  );
}

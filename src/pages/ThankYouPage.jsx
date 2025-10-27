import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import '../index.css';

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main>
        <section className="datenschutz">
          <div className="container datenschutz__inner">
            <h1>Vielen Dank für Ihre Kontaktanfrage!</h1>
            <p>Ihre Anfrage wurde bestätigt und an uns übermittelt.</p>
            <p>
              <a href="/schnitter">Zurück zur Startseite</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { Impressum } from '../sections/Impressum.jsx';
import '../index.css';

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main>
        <Impressum />
      </main>
      <Footer />
    </>
  );
}


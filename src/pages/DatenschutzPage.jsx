import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { Datenschutz } from '../sections/Datenschutz.jsx';
import '../index.css';

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main>
        <Datenschutz />
      </main>
      <Footer />
    </>
  );
}


import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Hero } from './sections/Hero.jsx';
import { About } from './sections/About.jsx';
import { Testimonials } from './sections/Testimonials.jsx';
import { Contact } from './sections/Contact.jsx';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;

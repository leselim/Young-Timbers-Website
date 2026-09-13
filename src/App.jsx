import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Capabilities from './components/Capabilities.jsx';
import Services from './components/Services.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <Header />

      <main id="main">
        <Hero />
        <Capabilities />
        <Services />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Capabilities from './components/Capabilities.jsx';
import Services from './components/Services.jsx';
import Work from './components/Work.jsx';
import Faq from './components/Faq.jsx';
import Founder from './components/Founder.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ThresholdCaseStudy from './pages/ThresholdCaseStudy.jsx';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Services />
      <Work />
      <Faq />
      <Founder />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to content</a>

      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/threshold" element={<ThresholdCaseStudy />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import AgendaCreator from './components/AgendaCreator';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [language, setLanguage] = useState<'est' | 'eng'>('est');

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation
        language={language}
        setLanguage={setLanguage}
      />

      <Routes>
        <Route path="/" element={<Home language={language} />} />
        <Route path="/about" element={<About language={language} />} />
        <Route path="/services" element={<Services language={language} />} />
        <Route path="/contact" element={<Contact language={language} />} />
        <Route path="/agenda" element={<AgendaCreator language={language} />} />
      </Routes>

      <Footer language={language} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

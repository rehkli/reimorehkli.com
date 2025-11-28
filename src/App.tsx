import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
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

const routeToLanguageMap: { [key: string]: 'est' | 'eng' } = {
  '/': 'est',
  '/avaleht': 'est',
  '/minust': 'est',
  '/teenused': 'est',
  '/kontakt': 'est',
  '/home': 'eng',
  '/about': 'eng',
  '/services': 'eng',
  '/contact': 'eng',
  '/agenda': 'est'
};

function AppContent() {
  const [language, setLanguage] = useState<'est' | 'eng'>('est');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const detectedLang = routeToLanguageMap[location.pathname];
    if (detectedLang && detectedLang !== language) {
      setLanguage(detectedLang);
    }
  }, [location.pathname]);

  const handleLanguageChange = (newLang: 'est' | 'eng') => {
    setLanguage(newLang);

    const currentPath = location.pathname;
    let newPath = currentPath;

    if (newLang === 'est') {
      if (currentPath === '/home') newPath = '/avaleht';
      else if (currentPath === '/about') newPath = '/minust';
      else if (currentPath === '/services') newPath = '/teenused';
      else if (currentPath === '/contact') newPath = '/kontakt';
    } else {
      if (currentPath === '/' || currentPath === '/avaleht') newPath = '/home';
      else if (currentPath === '/minust') newPath = '/about';
      else if (currentPath === '/teenused') newPath = '/services';
      else if (currentPath === '/kontakt') newPath = '/contact';
    }

    if (newPath !== currentPath) {
      navigate(newPath);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation
        language={language}
        setLanguage={handleLanguageChange}
      />

      <Routes>
        <Route path="/" element={<Home language={language} />} />
        <Route path="/avaleht" element={<Home language={language} />} />
        <Route path="/home" element={<Home language={language} />} />

        <Route path="/minust" element={<About language={language} />} />
        <Route path="/about" element={<About language={language} />} />

        <Route path="/teenused" element={<Services language={language} />} />
        <Route path="/services" element={<Services language={language} />} />

        <Route path="/kontakt" element={<Contact language={language} />} />
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

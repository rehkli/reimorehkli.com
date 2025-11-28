import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import AgendaCreator from './components/AgendaCreator';
import Footer from './components/Footer';

function App() {
  const [language, setLanguage] = useState<'est' | 'eng'>('est');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        language={language}
        setLanguage={setLanguage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {currentPage === 'home' && <Home language={language} setCurrentPage={setCurrentPage} />}
      {currentPage === 'about' && <About language={language} />}
      {currentPage === 'services' && <Services language={language} setCurrentPage={setCurrentPage} />}
      {currentPage === 'contact' && <Contact language={language} />}
      {currentPage === 'agenda' && <AgendaCreator language={language} />}

      <Footer language={language} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;

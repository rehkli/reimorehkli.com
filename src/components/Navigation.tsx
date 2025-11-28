import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { translations } from '../translations';

interface NavigationProps {
  language: 'est' | 'eng';
  setLanguage: (lang: 'est' | 'eng') => void;
}

export default function Navigation({ language, setLanguage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const t = translations[language];

  const navItems = [
    { id: 'home', path: '/', label: t.nav.home },
    { id: 'about', path: '/about', label: t.nav.about },
    { id: 'services', path: '/services', label: t.nav.services },
    { id: 'contact', path: '/contact', label: t.nav.contact },
    { id: 'agenda', path: '/agenda', label: t.nav.agenda }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-mint border-b-4 border-teal z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="hover:scale-105 transition-transform"
          >
            <img
              src="/valge logo.svg"
              alt="Reimo Rehkli"
              className="h-12 md:h-14"
              style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(76%) saturate(478%) hue-rotate(130deg) brightness(93%) contrast(93%)' }}
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navItems.slice(0, 3).map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                  location.pathname === item.path
                    ? 'bg-pink-light text-teal border-2 border-teal'
                    : 'bg-white text-teal hover:bg-lemon border-2 border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/contact"
              className="bg-lemon text-teal px-6 py-2 rounded-full font-black text-sm border-4 border-teal shadow-md hover:shadow-lg transition-all"
            >
              {t.nav.contact}
            </Link>

            <div className="flex gap-2 ml-2">
              <button
                onClick={() => setLanguage('est')}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all border-2 ${
                  language === 'est'
                    ? 'bg-purple-light text-teal border-teal'
                    : 'bg-white text-teal border-transparent hover:border-teal'
                }`}
              >
                EST
              </button>
              <button
                onClick={() => setLanguage('eng')}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all border-2 ${
                  language === 'eng'
                    ? 'bg-purple-light text-teal border-teal'
                    : 'bg-white text-teal border-transparent hover:border-teal'
                }`}
              >
                ENG
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-teal"
          >
            {mobileMenuOpen ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left py-3 px-4 rounded-2xl font-bold mb-2 transition-all ${
                  location.pathname === item.path
                    ? 'bg-lemon text-teal border-2 border-teal'
                    : 'bg-white text-teal hover:bg-pink-light'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setLanguage('est')}
                className={`flex-1 px-3 py-2 rounded-full text-sm font-black transition-all border-2 ${
                  language === 'est'
                    ? 'bg-purple-light text-teal border-teal'
                    : 'bg-white text-teal border-transparent'
                }`}
              >
                EST
              </button>
              <button
                onClick={() => setLanguage('eng')}
                className={`flex-1 px-3 py-2 rounded-full text-sm font-black transition-all border-2 ${
                  language === 'eng'
                    ? 'bg-purple-light text-teal border-teal'
                    : 'bg-white text-teal border-transparent'
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

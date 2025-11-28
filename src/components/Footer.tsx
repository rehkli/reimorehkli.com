import { Link } from 'react-router-dom';
import { translations } from '../translations';

interface FooterProps {
  language: 'est' | 'eng';
}

export default function Footer({ language }: FooterProps) {
  const t = translations[language];

  const navItems = [
    { id: 'home', path: '/', label: t.nav.home },
    { id: 'about', path: '/about', label: t.nav.about },
    { id: 'services', path: '/services', label: t.nav.services },
    { id: 'contact', path: '/contact', label: t.nav.contact },
    { id: 'agenda', path: '/agenda', label: t.nav.agenda }
  ];

  return (
    <footer className="bg-teal text-white py-8 sm:py-12 border-t-4 border-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-6 sm:mb-8">
          <div>
            <img
              src="/valge logo.svg"
              alt="Reimo Rehkli"
              className="h-12 sm:h-16 md:h-20 mb-4"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-mint font-semibold text-sm sm:text-base break-words">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-black text-lemon mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.quickLinks}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="text-white hover:text-lemon transition-colors font-semibold text-sm sm:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lemon mb-3 sm:mb-4 text-sm sm:text-base">{t.footer.social}</h4>
            <div className="space-y-1.5 sm:space-y-2">
              <a
                href="https://www.linkedin.com/in/reimo-rehkli/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white hover:text-lemon transition-colors font-semibold text-sm sm:text-base"
              >
                LinkedIn
              </a>
              <a
                href="mailto:reimo@teamlab.ee"
                className="block text-white hover:text-lemon transition-colors font-semibold text-sm sm:text-base break-all"
              >
                {language === 'est' ? 'E-post' : 'Email'}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-mint pt-6 sm:pt-8 text-center text-white">
          <p className="font-semibold text-sm sm:text-base">
            {t.footer.madeWith}
          </p>
          <p className="mt-2 text-xs sm:text-sm opacity-80">{language === 'est' ? t.footer.copyright : '© 2025 Reimo Rehkli. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}

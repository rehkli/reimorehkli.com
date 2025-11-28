import { translations } from '../translations';

interface FooterProps {
  language: 'est' | 'eng';
  setCurrentPage: (page: string) => void;
}

export default function Footer({ language, setCurrentPage }: FooterProps) {
  const t = translations[language];

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'contact', label: t.nav.contact },
    { id: 'agenda', label: t.nav.agenda }
  ];

  return (
    <footer className="bg-teal text-white py-12 border-t-4 border-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          <div>
            <img
              src="/valge logo.svg"
              alt="Reimo Rehkli"
              className="h-16 md:h-20 mb-4"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-mint font-semibold">{t.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-black text-lemon mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentPage(item.id);
                      window.scrollTo(0, 0);
                    }}
                    className="text-white hover:text-lemon transition-colors font-semibold"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lemon mb-4">{t.footer.social}</h4>
            <div className="space-y-2">
              <a
                href="https://www.linkedin.com/in/reimo-rehkli/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white hover:text-lemon transition-colors font-semibold"
              >
                LinkedIn
              </a>
              <a
                href="mailto:reimo@teamlab.ee"
                className="block text-white hover:text-lemon transition-colors font-semibold"
              >
                {language === 'est' ? 'E-post' : 'Email'}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-mint pt-8 text-center text-white">
          <p className="font-semibold">
            {t.footer.madeWith}
          </p>
          <p className="mt-2 text-sm opacity-80">{language === 'est' ? t.footer.copyright : '© 2025 Reimo Rehkli. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}

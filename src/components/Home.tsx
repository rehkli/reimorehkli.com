import { ArrowRight } from 'lucide-react';
import { translations } from '../translations';

interface HomeProps {
  language: 'est' | 'eng';
  setCurrentPage: (page: string) => void;
}

export default function Home({ language, setCurrentPage }: HomeProps) {
  const t = translations[language];

  return (
    <div className="pt-20">
      <section className="min-h-screen flex items-center bg-lemon relative overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-8xl font-black text-teal mb-16 leading-none text-chunky uppercase">
              {t.hero.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setCurrentPage('services')}
                className="bg-mint text-teal px-12 py-6 rounded-full font-black text-xl btn-chunky inline-flex items-center justify-center gap-3"
              >
                {t.hero.cta1}
                <ArrowRight size={28} strokeWidth={3} />
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className="bg-pink-light text-teal px-12 py-6 rounded-full font-black text-xl btn-chunky"
              >
                {t.hero.cta2}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 text-6xl">✨</div>
      </section>

      <section className="py-32 bg-mint relative">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-teal leading-tight text-chunky text-center mb-12 uppercase">
              {t.pocket.title}
            </h2>
            <div className="flex justify-center gap-6 flex-wrap mt-16">
              <div className="w-24 h-24 bg-lemon rounded-full border-4 border-teal shadow-lg"></div>
              <div className="w-24 h-24 bg-pink-light rounded-full border-4 border-teal shadow-lg"></div>
              <div className="w-24 h-24 bg-purple-light rounded-full border-4 border-teal shadow-lg"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-teal leading-tight text-chunky mb-8 uppercase">
                {t.impact.title}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {t.impact.description}
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-lemon p-8 rounded-3xl card-chunky">
                <p className="text-2xl font-black text-teal text-chunky uppercase">{t.impact.feature1}</p>
              </div>
              <div className="bg-mint p-8 rounded-3xl card-chunky">
                <p className="text-2xl font-black text-teal text-chunky uppercase">{t.impact.feature2}</p>
              </div>
              <div className="bg-pink-light p-8 rounded-3xl card-chunky">
                <p className="text-2xl font-black text-teal text-chunky uppercase">{t.impact.feature3}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-lemon">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center text-teal mb-16 text-chunky">
            {t.testimonials.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-white p-10 rounded-3xl card-chunky">
              <p className="text-xl font-bold text-teal mb-8 leading-snug">
                "{t.testimonials.quote1}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-mint rounded-full border-4 border-teal flex items-center justify-center text-teal font-black text-lg">
                  ÜN
                </div>
                <div>
                  <p className="font-black text-teal text-lg">{t.testimonials.author1}</p>
                  <p className="text-gray-600 text-sm">{t.testimonials.role1}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl card-chunky">
              <p className="text-xl font-bold text-teal mb-8 leading-snug">
                "{t.testimonials.quote2}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-pink-light rounded-full border-4 border-teal flex items-center justify-center text-teal font-black text-lg">
                  AA
                </div>
                <div>
                  <p className="font-black text-teal text-lg">{t.testimonials.author2}</p>
                  <p className="text-gray-600 text-sm">{t.testimonials.role2}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-3xl card-chunky">
              <p className="text-xl font-bold text-teal mb-8 leading-snug">
                "{t.testimonials.quote3}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-light rounded-full border-4 border-teal flex items-center justify-center text-teal font-black text-lg">
                  PR
                </div>
                <div>
                  <p className="font-black text-teal text-lg">{t.testimonials.author3}</p>
                  <p className="text-gray-600 text-sm">{t.testimonials.role3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-mint text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-black text-teal mb-8 text-chunky max-w-4xl mx-auto leading-tight">
            {t.callout.title}
          </h2>
          <p className="text-2xl text-teal mb-12 max-w-2xl mx-auto font-bold">
            {t.callout.description}
          </p>
          <a
            href="https://cal.com/reimo-rehkli-h0i4uj/45-min-konsultatsioon"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lemon text-teal px-14 py-7 rounded-full font-black text-2xl btn-chunky inline-flex items-center gap-3"
          >
            {t.callout.cta}
            <ArrowRight size={32} strokeWidth={3} />
          </a>
        </div>
      </section>
    </div>
  );
}

import { Lightbulb, MessageSquare, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { translations } from '../translations';

interface ServicesProps {
  language: 'est' | 'eng';
  setCurrentPage: (page: string) => void;
}

export default function Services({ language, setCurrentPage }: ServicesProps) {
  const t = translations[language].services;

  const services = [
    {
      icon: Lightbulb,
      title: t.service1.title,
      description: t.service1.description,
      duration: t.service1.duration,
      outcomes: t.service1.outcomes
    },
    {
      icon: MessageSquare,
      title: t.service2.title,
      description: t.service2.description,
      duration: t.service2.duration,
      outcomes: t.service2.outcomes
    },
    {
      icon: Users,
      title: t.service3.title,
      description: t.service3.description,
      duration: t.service3.duration,
      outcomes: t.service3.outcomes
    },
    {
      icon: GraduationCap,
      title: t.service4.title,
      description: t.service4.description,
      duration: t.service4.duration,
      outcomes: t.service4.outcomes
    }
  ];

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            {t.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl card-chunky"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-mint rounded-full border-4 border-teal flex items-center justify-center mb-6">
                  <Icon size={28} className="text-teal sm:w-8 sm:h-8" strokeWidth={3} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-teal mb-4 break-words">
                  {service.title}
                </h3>
                <p className="text-base sm:text-lg font-bold text-teal mb-6 leading-snug">
                  {service.description}
                </p>
                <div className="space-y-3">
                  <div className="bg-lemon/30 px-4 py-3 rounded-xl border-2 border-teal">
                    <p className="text-sm font-bold text-teal">
                      {service.duration}
                    </p>
                  </div>
                  <div className="bg-lemon/30 px-4 py-3 rounded-xl border-2 border-teal">
                    <p className="text-sm font-bold text-teal">
                      {service.outcomes}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.philosophy.title}</h2>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed">
              {t.philosophy.description}
            </p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://cal.com/reimo-rehkli-h0i4uj/45-min-konsultatsioon"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            {t.cta}
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

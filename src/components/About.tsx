import { CheckCircle, User, Heart, Coffee } from 'lucide-react';
import { translations } from '../translations';

interface AboutProps {
  language: 'est' | 'eng';
}

export default function About({ language }: AboutProps) {
  const t = translations[language].about;

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-20 bg-lemon">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-teal mb-6 text-chunky">
              {t.title}
            </h1>
          </div>

          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl mb-12 sm:mb-16 card-chunky">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-mint rounded-full border-4 border-teal flex items-center justify-center">
                <User size={48} className="text-teal sm:w-16 sm:h-16" />
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              {t.story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-teal text-base sm:text-lg leading-relaxed mb-6 font-medium break-words">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-teal mb-6 sm:mb-8 text-center text-chunky">
              {t.values.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {[t.values.value1, t.values.value2, t.values.value3, t.values.value4].map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-6 rounded-2xl card-chunky"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <CheckCircle size={20} className="text-mint flex-shrink-0 mt-1 sm:w-6 sm:h-6" strokeWidth={3} />
                    <p className="text-teal text-sm sm:text-base leading-relaxed font-medium break-words">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
              {t.credentials.title}
            </h2>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <ul className="space-y-3 sm:space-y-4">
                {[t.credentials.item1, t.credentials.item2, t.credentials.item3, t.credentials.item4].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 sm:gap-4 text-base sm:text-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-coral-50 p-6 sm:p-8 md:p-12 rounded-3xl shadow-lg">
            <div className="text-center mb-6">
              <Coffee size={40} className="mx-auto text-green-600 mb-4 sm:w-12 sm:h-12" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                {t.personal.title}
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-2xl mx-auto break-words">
              {t.personal.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

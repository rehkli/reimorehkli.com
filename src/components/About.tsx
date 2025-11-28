import { CheckCircle, User, Heart, Coffee } from 'lucide-react';
import { translations } from '../translations';

interface AboutProps {
  language: 'est' | 'eng';
}

export default function About({ language }: AboutProps) {
  const t = translations[language].about;

  return (
    <div className="pt-32 pb-20 bg-lemon">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-teal mb-6 text-chunky">
              {t.title}
            </h1>
          </div>

          <div className="bg-white p-12 rounded-3xl mb-16 card-chunky">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-mint rounded-full border-4 border-teal flex items-center justify-center">
                <User size={64} className="text-teal" />
              </div>
            </div>
            <div className="prose prose-lg max-w-none">
              {t.story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-teal text-lg leading-relaxed mb-6 font-medium">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-4xl font-black text-teal mb-8 text-center text-chunky">
              {t.values.title}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[t.values.value1, t.values.value2, t.values.value3, t.values.value4].map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl card-chunky"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle size={24} className="text-mint flex-shrink-0 mt-1" strokeWidth={3} />
                    <p className="text-teal leading-relaxed font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {t.credentials.title}
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <ul className="space-y-4">
                {[t.credentials.item1, t.credentials.item2, t.credentials.item3, t.credentials.item4].map((item, index) => (
                  <li key={index} className="flex items-center gap-4 text-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-coral-50 p-12 rounded-3xl shadow-lg">
            <div className="text-center mb-6">
              <Coffee size={48} className="mx-auto text-green-600 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {t.personal.title}
              </h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">
              {t.personal.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

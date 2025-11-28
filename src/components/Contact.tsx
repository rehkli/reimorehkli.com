import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { translations } from '../translations';
import emailjs from '@emailjs/browser';

interface ContactProps {
  language: 'est' | 'eng';
}

export default function Contact({ language }: ContactProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const t = translations[language].contact;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await emailjs.send(
        'service_reimo',
        'template_contact',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'reimo@teamlab.ee',
        },
        'YOUR_PUBLIC_KEY'
      );

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-green-200 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {language === 'est' ? 'Kontaktinfo' : 'Contact Info'}
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-green-600 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                    <Mail size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">{language === 'est' ? 'E-post' : 'Email'}</p>
                    <a
                      href="mailto:reimo@teamlab.ee"
                      className="text-green-600 hover:text-green-700 text-sm sm:text-base break-all"
                    >
                      reimo@teamlab.ee
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-green-600 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                    <MapPin size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                      {language === 'est' ? 'Asukoht' : 'Location'}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base break-words">{t.info.location}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">{t.info.availability}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                {language === 'est' ? 'Kiire broneerimine' : 'Quick Booking'}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {language === 'est'
                  ? 'Broneeri tasuta 45-minutiline konsultatsioon'
                  : 'Book a free 45-minute consultation'}
              </p>
              <a
                href="https://cal.com/reimo-rehkli-h0i4uj/45-min-konsultatsioon"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-yellow-400 text-gray-800 text-center px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-all text-sm sm:text-base"
              >
                {language === 'est' ? 'Vali sobiv aeg' : 'Choose a time'}
              </a>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {language === 'est' ? 'Saada sõnum' : 'Send a message'}
              </h2>
              {submitted ? (
                <div className="text-center py-8 sm:py-12">
                  <CheckCircle size={48} className="text-green-600 mx-auto mb-4 sm:w-16 sm:h-16" />
                  <p className="text-lg sm:text-xl font-semibold text-gray-800">
                    {t.form.success}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-red-600 text-4xl sm:text-5xl mb-4">✕</div>
                  <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words px-2">
                    {language === 'est' ? 'Viga sõnumi saatmisel' : 'Error sending message'}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base break-words px-2">
                    {language === 'est' ? 'Palun proovi uuesti või kirjuta otse aadressile reimo@teamlab.ee' : 'Please try again or email directly to reimo@teamlab.ee'}
                  </p>
                  <button
                    onClick={() => setError(false)}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
                  >
                    {language === 'est' ? 'Proovi uuesti' : 'Try again'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      {t.form.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      {t.form.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      {t.form.message}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-green-600 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-6 py-3 sm:py-4 rounded-full font-semibold hover:bg-green-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                  >
                    {loading ? (language === 'est' ? 'Saadan...' : 'Sending...') : t.form.submit}
                    {!loading && <Send size={18} className="sm:w-5 sm:h-5" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

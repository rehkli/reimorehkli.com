import { Link } from 'react-router-dom';

interface CTAContentProps {
  content: {
    heading_est: string;
    heading_eng: string;
    text_est: string;
    text_eng: string;
    button_label_est: string;
    button_label_eng: string;
    button_link: string;
    bg_color: string;
  };
  language: 'est' | 'eng';
}

export default function CTAContent({ content, language }: CTAContentProps) {
  const heading = language === 'est' ? content.heading_est : content.heading_eng;
  const text = language === 'est' ? content.text_est : content.text_eng;
  const buttonLabel = language === 'est' ? content.button_label_est : content.button_label_eng;

  if (!heading && !text) return null;

  const isExternal = content.button_link?.startsWith('http');

  return (
    <div
      className="rounded-2xl border-4 border-teal p-8 md:p-12 text-center shadow-lg"
      style={{ backgroundColor: content.bg_color || '#C8F3E6' }}
    >
      {heading && (
        <h2 className="text-3xl md:text-4xl font-black text-teal mb-4">
          {heading}
        </h2>
      )}

      {text && (
        <p className="text-teal font-semibold text-lg mb-6 max-w-2xl mx-auto">
          {text}
        </p>
      )}

      {buttonLabel && content.button_link && (
        isExternal ? (
          <a
            href={content.button_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-lemon text-teal px-8 py-3 rounded-full font-black border-4 border-teal shadow-md hover:shadow-lg transition-all"
          >
            {buttonLabel}
          </a>
        ) : (
          <Link
            to={content.button_link}
            className="inline-block bg-lemon text-teal px-8 py-3 rounded-full font-black border-4 border-teal shadow-md hover:shadow-lg transition-all"
          >
            {buttonLabel}
          </Link>
        )
      )}
    </div>
  );
}

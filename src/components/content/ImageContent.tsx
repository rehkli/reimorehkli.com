interface ImageContentProps {
  content: {
    url: string;
    alt_est: string;
    alt_eng: string;
  };
  language: 'est' | 'eng';
}

export default function ImageContent({ content, language }: ImageContentProps) {
  if (!content.url) return null;

  const altText = language === 'est' ? content.alt_est : content.alt_eng;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-teal shadow-md">
      <img
        src={content.url}
        alt={altText || ''}
        className="w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}

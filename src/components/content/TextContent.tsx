import DOMPurify from 'dompurify';

interface TextContentProps {
  content: {
    html: string;
  };
}

export default function TextContent({ content }: TextContentProps) {
  if (!content.html) return null;

  const sanitizedHTML = DOMPurify.sanitize(content.html);

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-teal prose-p:text-teal prose-p:font-semibold prose-a:text-teal prose-a:font-bold prose-a:underline prose-strong:text-teal prose-ul:text-teal prose-ol:text-teal prose-li:font-semibold"
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

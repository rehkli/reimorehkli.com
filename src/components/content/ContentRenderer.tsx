import type { ContentBlock } from '../../lib/supabase';
import TextContent from './TextContent';
import ImageContent from './ImageContent';
import CTAContent from './CTAContent';

interface ContentRendererProps {
  blocks: ContentBlock[];
  language: 'est' | 'eng';
}

export default function ContentRenderer({ blocks, language }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return <TextContent key={block.id} content={block.content} />;
          case 'image':
            return <ImageContent key={block.id} content={block.content} language={language} />;
          case 'cta':
            return <CTAContent key={block.id} content={block.content} language={language} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

import { Plus, Type, Image, Megaphone } from 'lucide-react';
import { useState } from 'react';
import type { ContentBlock } from '../../lib/supabase';

interface BlockSelectorProps {
  onAddBlock: (block: ContentBlock) => void;
}

export default function BlockSelector({ onAddBlock }: BlockSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const createBlock = (type: 'text' | 'image' | 'cta') => {
    const baseBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      order: 0,
    };

    let content;
    switch (type) {
      case 'text':
        content = { html: '' };
        break;
      case 'image':
        content = { url: '', alt_est: '', alt_eng: '' };
        break;
      case 'cta':
        content = {
          heading_est: '',
          heading_eng: '',
          text_est: '',
          text_eng: '',
          button_label_est: '',
          button_label_eng: '',
          button_link: '',
          bg_color: '#C8F3E6'
        };
        break;
    }

    onAddBlock({ ...baseBlock, content } as ContentBlock);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <Plus size={20} />
        Add Content Block
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white border-2 border-teal rounded-2xl shadow-lg p-2 z-20 min-w-[200px]">
            <button
              type="button"
              onClick={() => createBlock('text')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-mint transition-all flex items-center gap-3 font-bold text-teal"
            >
              <Type size={20} />
              Text Block
            </button>
            <button
              type="button"
              onClick={() => createBlock('image')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-mint transition-all flex items-center gap-3 font-bold text-teal"
            >
              <Image size={20} />
              Image Block
            </button>
            <button
              type="button"
              onClick={() => createBlock('cta')}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-mint transition-all flex items-center gap-3 font-bold text-teal"
            >
              <Megaphone size={20} />
              CTA Block
            </button>
          </div>
        </>
      )}
    </div>
  );
}

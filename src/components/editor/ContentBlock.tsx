import { Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import TextEditor from './TextEditor';
import ImageBlock from './ImageBlock';
import CTABlock from './CTABlock';
import type { ContentBlock as ContentBlockType } from '../../lib/supabase';

interface ContentBlockProps {
  block: ContentBlockType;
  onChange: (block: ContentBlockType) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSelectFromLibrary?: () => void;
}

export default function ContentBlock({
  block,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onSelectFromLibrary
}: ContentBlockProps) {
  const getBlockTitle = () => {
    switch (block.type) {
      case 'text':
        return 'Text Block';
      case 'image':
        return 'Image Block';
      case 'cta':
        return 'Call to Action Block';
      default:
        return 'Content Block';
    }
  };

  return (
    <div className="bg-white border-2 border-teal rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="text-teal" size={20} />
          <h3 className="font-black text-teal">{getBlockTitle()}</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 text-teal hover:bg-mint rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronUp size={20} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 text-teal hover:bg-mint rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronDown size={20} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {block.type === 'text' && (
        <TextEditor
          value={block.content.html || ''}
          onChange={(html) => onChange({ ...block, content: { html } })}
        />
      )}

      {block.type === 'image' && (
        <ImageBlock
          value={block.content}
          onChange={(content) => onChange({ ...block, content })}
          onSelectFromLibrary={onSelectFromLibrary}
        />
      )}

      {block.type === 'cta' && (
        <CTABlock
          value={block.content}
          onChange={(content) => onChange({ ...block, content })}
        />
      )}
    </div>
  );
}

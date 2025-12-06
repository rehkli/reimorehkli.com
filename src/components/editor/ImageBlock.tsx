import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

interface ImageBlockProps {
  value: {
    url: string;
    alt_est: string;
    alt_eng: string;
  };
  onChange: (value: { url: string; alt_est: string; alt_eng: string }) => void;
  onSelectFromLibrary?: () => void;
}

export default function ImageBlock({ value, onChange, onSelectFromLibrary }: ImageBlockProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const url = await uploadImage(file);
      onChange({ ...value, url });
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange({ url: '', alt_est: '', alt_eng: '' });
  };

  return (
    <div className="space-y-4">
      {!value.url ? (
        <div className="border-2 border-dashed border-teal rounded-2xl p-8 text-center">
          <Upload className="mx-auto mb-4 text-teal" size={48} />
          <p className="text-teal font-semibold mb-4">Upload an image</p>
          <div className="flex gap-4 justify-center">
            <label className="bg-lemon text-teal px-6 py-2 rounded-full font-bold border-2 border-teal cursor-pointer hover:shadow-md transition-all">
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {onSelectFromLibrary && (
              <button
                type="button"
                onClick={onSelectFromLibrary}
                className="bg-white text-teal px-6 py-2 rounded-full font-bold border-2 border-teal hover:bg-mint transition-all"
              >
                From Library
              </button>
            )}
          </div>
          {uploading && <p className="mt-4 text-teal font-semibold">Uploading...</p>}
          {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={value.url}
              alt="Preview"
              className="w-full rounded-2xl border-2 border-teal"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-teal font-bold mb-2">Alt Text (EST)</label>
              <input
                type="text"
                value={value.alt_est}
                onChange={(e) => onChange({ ...value, alt_est: e.target.value })}
                className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="Image description in Estonian"
              />
            </div>
            <div>
              <label className="block text-teal font-bold mb-2">Alt Text (ENG)</label>
              <input
                type="text"
                value={value.alt_eng}
                onChange={(e) => onChange({ ...value, alt_eng: e.target.value })}
                className="w-full px-4 py-2 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="Image description in English"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

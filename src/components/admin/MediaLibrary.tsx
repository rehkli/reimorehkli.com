import { useEffect, useState } from 'react';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { supabase, uploadImage, getMediaLibrary } from '../../lib/supabase';
import type { MediaItem } from '../../lib/supabase';

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const data = await getMediaLibrary();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const url = await uploadImage(file);

        const img = new Image();
        img.src = url;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const { error: insertError } = await supabase
          .from('media_library')
          .insert([{
            url,
            filename: file.name,
            width: img.width,
            height: img.height,
            file_size: file.size,
          }]);

        if (insertError) throw insertError;
      }

      await loadMedia();
    } catch (err: any) {
      setError(err.message || 'Failed to upload media');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.filename}?`)) return;

    setDeleting(item.id);
    try {
      const fileName = item.url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('media').remove([fileName]);
      }

      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      setMedia(media.filter(m => m.id !== item.id));
    } catch (error) {
      console.error('Failed to delete media:', error);
      alert('Failed to delete media');
    } finally {
      setDeleting(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (loading) {
    return <div className="text-teal font-bold">Loading media...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-teal">Media Library</h1>
        <label className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2">
          <Upload size={20} />
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border-2 border-teal overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square bg-mint relative">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-bold text-teal truncate" title={item.filename}>
                  {item.filename}
                </p>
                {item.width && item.height && (
                  <p className="text-xs text-teal font-semibold">
                    {item.width} × {item.height}
                  </p>
                )}
                {item.file_size && (
                  <p className="text-xs text-teal font-semibold">
                    {(item.file_size / 1024).toFixed(1)} KB
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 bg-lemon text-teal px-3 py-2 rounded-full font-bold text-xs hover:shadow-md transition-all flex items-center justify-center gap-1"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check size={14} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-teal p-12 text-center">
          <Upload className="mx-auto mb-4 text-teal" size={48} />
          <p className="text-teal font-semibold mb-4">No media files yet</p>
          <label className="inline-flex items-center gap-2 bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all cursor-pointer">
            <Upload size={20} />
            Upload Your First Image
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}

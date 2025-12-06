import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import type { BlogPost, ContentBlock as ContentBlockType } from '../../lib/supabase';
import ContentBlock from '../editor/ContentBlock';
import BlockSelector from '../editor/BlockSelector';

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [activeTab, setActiveTab] = useState<'est' | 'eng'>('est');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    slug_est: '',
    slug_eng: '',
    title_est: '',
    title_eng: '',
    content: [] as ContentBlockType[],
    featured_image_url: null as string | null,
    is_published: false,
    published_at: null as string | null,
  });

  useEffect(() => {
    if (!isNew && id) {
      loadPost(id);
    }
  }, [id, isNew]);

  const loadPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          slug_est: data.slug_est,
          slug_eng: data.slug_eng,
          title_est: data.title_est,
          title_eng: data.title_eng,
          content: data.content || [],
          featured_image_url: data.featured_image_url,
          is_published: data.is_published,
          published_at: data.published_at,
        });
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      setError('Failed to load post');
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[äöüõ]/g, (match) => {
        const map: any = { ä: 'a', ö: 'o', ü: 'u', õ: 'o' };
        return map[match] || match;
      })
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (lang: 'est' | 'eng', value: string) => {
    const slugKey = lang === 'est' ? 'slug_est' : 'slug_eng';
    const titleKey = lang === 'est' ? 'title_est' : 'title_eng';

    setFormData({
      ...formData,
      [titleKey]: value,
      [slugKey]: formData[slugKey] || generateSlug(value),
    });
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, featured_image_url: url });
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddBlock = (block: ContentBlockType) => {
    const newBlocks = [...formData.content, { ...block, order: formData.content.length }];
    setFormData({ ...formData, content: newBlocks });
  };

  const handleUpdateBlock = (index: number, block: ContentBlockType) => {
    const newBlocks = [...formData.content];
    newBlocks[index] = block;
    setFormData({ ...formData, content: newBlocks });
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newBlocks });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...formData.content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setFormData({ ...formData, content: newBlocks });
  };

  const handleSave = async (publish: boolean = false) => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!formData.title_est || !formData.title_eng || !formData.slug_est || !formData.slug_eng) {
        throw new Error('Title and slug are required for both languages');
      }

      const postData = {
        ...formData,
        is_published: publish,
        published_at: publish && !formData.published_at ? new Date().toISOString() : formData.published_at,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        setSuccess('Post created successfully!');
        setTimeout(() => navigate(`/admin/blog/${data.id}`), 1000);
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        setSuccess('Post saved successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/blog')}
            className="p-2 text-teal hover:bg-mint rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-black text-teal">
            {isNew ? 'New Blog Post' : 'Edit Blog Post'}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-white text-teal px-6 py-3 rounded-full font-black border-2 border-teal hover:bg-mint transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={20} />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-2xl font-semibold">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border-2 border-teal p-6 space-y-6">
        <div>
          <h3 className="text-xl font-black text-teal mb-4">Featured Image</h3>
          {!formData.featured_image_url ? (
            <div className="border-2 border-dashed border-teal rounded-2xl p-8 text-center">
              <Upload className="mx-auto mb-4 text-teal" size={48} />
              <p className="text-teal font-semibold mb-4">Upload a featured image</p>
              <label className="bg-lemon text-teal px-6 py-2 rounded-full font-bold border-2 border-teal cursor-pointer hover:shadow-md transition-all inline-block">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              {uploadingImage && <p className="mt-4 text-teal font-semibold">Uploading...</p>}
            </div>
          ) : (
            <div className="relative">
              <img
                src={formData.featured_image_url}
                alt="Featured"
                className="w-full rounded-2xl border-2 border-teal max-h-96 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured_image_url: null })}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-b-2 border-mint pb-4">
          <button
            onClick={() => setActiveTab('est')}
            className={`px-6 py-2 rounded-full font-black transition-all ${
              activeTab === 'est'
                ? 'bg-lemon text-teal'
                : 'bg-mint text-teal hover:bg-lemon'
            }`}
          >
            Estonian
          </button>
          <button
            onClick={() => setActiveTab('eng')}
            className={`px-6 py-2 rounded-full font-black transition-all ${
              activeTab === 'eng'
                ? 'bg-lemon text-teal'
                : 'bg-mint text-teal hover:bg-lemon'
            }`}
          >
            English
          </button>
        </div>

        {activeTab === 'est' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-teal font-bold mb-2">Title (Estonian)</label>
              <input
                type="text"
                value={formData.title_est}
                onChange={(e) => handleTitleChange('est', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label className="block text-teal font-bold mb-2">Slug (Estonian)</label>
              <input
                type="text"
                value={formData.slug_est}
                onChange={(e) => setFormData({ ...formData, slug_est: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="post-url"
              />
              <p className="text-sm text-teal font-semibold mt-1">
                URL: /blogi/{formData.slug_est}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-teal font-bold mb-2">Title (English)</label>
              <input
                type="text"
                value={formData.title_eng}
                onChange={(e) => handleTitleChange('eng', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label className="block text-teal font-bold mb-2">Slug (English)</label>
              <input
                type="text"
                value={formData.slug_eng}
                onChange={(e) => setFormData({ ...formData, slug_eng: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-teal focus:outline-none focus:ring-2 focus:ring-lemon font-semibold"
                placeholder="post-url"
              />
              <p className="text-sm text-teal font-semibold mt-1">
                URL: /blog/{formData.slug_eng}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-teal">Content Blocks</h2>
          <BlockSelector onAddBlock={handleAddBlock} />
        </div>

        {formData.content.length > 0 ? (
          <div className="space-y-4">
            {formData.content.map((block, index) => (
              <ContentBlock
                key={block.id}
                block={block}
                onChange={(updated) => handleUpdateBlock(index, updated)}
                onDelete={() => handleDeleteBlock(index)}
                onMoveUp={() => handleMoveBlock(index, 'up')}
                onMoveDown={() => handleMoveBlock(index, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < formData.content.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-teal p-12 text-center">
            <p className="text-teal font-semibold mb-4">No content blocks yet</p>
            <p className="text-teal font-semibold text-sm">
              Add text, images, or call-to-action blocks to build your blog post
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

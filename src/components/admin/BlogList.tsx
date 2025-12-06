import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../lib/supabase';

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'published') return post.is_published;
    if (filter === 'draft') return !post.is_published;
    return true;
  });

  if (loading) {
    return <div className="text-teal font-bold">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-teal">Blog Posts</h1>
        <Link
          to="/admin/blog/new"
          className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Post
        </Link>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full font-bold transition-all ${
            filter === 'all'
              ? 'bg-lemon text-teal border-2 border-teal'
              : 'bg-white text-teal border-2 border-teal hover:bg-mint'
          }`}
        >
          All ({posts.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-full font-bold transition-all ${
            filter === 'published'
              ? 'bg-lemon text-teal border-2 border-teal'
              : 'bg-white text-teal border-2 border-teal hover:bg-mint'
          }`}
        >
          Published ({posts.filter(p => p.is_published).length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-full font-bold transition-all ${
            filter === 'draft'
              ? 'bg-lemon text-teal border-2 border-teal'
              : 'bg-white text-teal border-2 border-teal hover:bg-mint'
          }`}
        >
          Drafts ({posts.filter(p => !p.is_published).length})
        </button>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border-2 border-teal overflow-hidden hover:shadow-lg transition-all">
              {post.featured_image_url && (
                <img
                  src={post.featured_image_url}
                  alt={post.title_est}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-teal text-lg flex-1">{post.title_est}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${
                    post.is_published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {post.published_at && (
                  <p className="text-sm text-teal font-semibold">
                    {new Date(post.published_at).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Link
                    to={`/admin/blog/${post.id}`}
                    className="flex-1 bg-lemon text-teal px-4 py-2 rounded-full font-bold text-center hover:shadow-md transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title_est)}
                    disabled={deleting === post.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-teal p-12 text-center">
          <p className="text-teal font-semibold mb-4">
            {filter === 'all' ? 'No blog posts yet' : `No ${filter} posts`}
          </p>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Your First Post
          </Link>
        </div>
      )}
    </div>
  );
}

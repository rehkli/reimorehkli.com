import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, Image as ImageIcon, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalMedia: 0,
  });
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [pagesResult, postsResult, mediaResult] = await Promise.all([
        supabase.from('pages').select('*', { count: 'exact' }),
        supabase.from('blog_posts').select('*', { count: 'exact' }),
        supabase.from('media_library').select('*', { count: 'exact' }),
      ]);

      const publishedPages = pagesResult.data?.filter(p => p.is_published).length || 0;
      const publishedPosts = postsResult.data?.filter(p => p.is_published).length || 0;

      setStats({
        totalPages: pagesResult.count || 0,
        publishedPages,
        totalPosts: postsResult.count || 0,
        publishedPosts,
        totalMedia: mediaResult.count || 0,
      });

      setRecentPages(pagesResult.data?.slice(0, 5) || []);
      setRecentPosts(postsResult.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-teal font-bold">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-teal mb-2">Dashboard</h1>
        <p className="text-teal font-semibold">Welcome to your content management system</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border-2 border-teal p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-lemon p-3 rounded-full">
              <FileText className="text-teal" size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-teal">{stats.totalPages}</p>
              <p className="text-teal font-semibold text-sm">Total Pages</p>
            </div>
          </div>
          <p className="text-teal font-semibold text-sm">
            {stats.publishedPages} published
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-teal p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-pink-light p-3 rounded-full">
              <BookOpen className="text-teal" size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-teal">{stats.totalPosts}</p>
              <p className="text-teal font-semibold text-sm">Blog Posts</p>
            </div>
          </div>
          <p className="text-teal font-semibold text-sm">
            {stats.publishedPosts} published
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-teal p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-light p-3 rounded-full">
              <ImageIcon className="text-teal" size={24} />
            </div>
            <div>
              <p className="text-3xl font-black text-teal">{stats.totalMedia}</p>
              <p className="text-teal font-semibold text-sm">Media Files</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border-2 border-teal p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-teal">Recent Pages</h2>
            <Link
              to="/admin/pages/new"
              className="bg-lemon text-teal p-2 rounded-full hover:shadow-md transition-all"
            >
              <Plus size={20} />
            </Link>
          </div>
          {recentPages.length > 0 ? (
            <div className="space-y-2">
              {recentPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/admin/pages/${page.id}`}
                  className="block p-3 rounded-xl hover:bg-mint transition-all"
                >
                  <p className="font-bold text-teal">{page.title_est}</p>
                  <p className="text-sm text-teal font-semibold">
                    {page.is_published ? 'Published' : 'Draft'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-teal font-semibold">No pages yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border-2 border-teal p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-teal">Recent Blog Posts</h2>
            <Link
              to="/admin/blog/new"
              className="bg-lemon text-teal p-2 rounded-full hover:shadow-md transition-all"
            >
              <Plus size={20} />
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/blog/${post.id}`}
                  className="block p-3 rounded-xl hover:bg-mint transition-all"
                >
                  <p className="font-bold text-teal">{post.title_est}</p>
                  <p className="text-sm text-teal font-semibold">
                    {post.is_published ? 'Published' : 'Draft'}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-teal font-semibold">No blog posts yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

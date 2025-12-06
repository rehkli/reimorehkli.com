import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Page } from '../../lib/supabase';

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Failed to load pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPages(pages.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete page:', error);
      alert('Failed to delete page');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-teal font-bold">Loading pages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-teal">Pages</h1>
        <Link
          to="/admin/pages/new"
          className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          New Page
        </Link>
      </div>

      {pages.length > 0 ? (
        <div className="bg-white rounded-2xl border-2 border-teal overflow-hidden">
          <table className="w-full">
            <thead className="bg-mint">
              <tr>
                <th className="text-left px-6 py-4 font-black text-teal">Title (EST)</th>
                <th className="text-left px-6 py-4 font-black text-teal">Slug (EST)</th>
                <th className="text-left px-6 py-4 font-black text-teal">Status</th>
                <th className="text-left px-6 py-4 font-black text-teal">Menu</th>
                <th className="text-left px-6 py-4 font-black text-teal">Footer</th>
                <th className="text-left px-6 py-4 font-black text-teal">Order</th>
                <th className="text-right px-6 py-4 font-black text-teal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-t-2 border-mint">
                  <td className="px-6 py-4 font-semibold text-teal">{page.title_est}</td>
                  <td className="px-6 py-4 font-semibold text-teal text-sm">/{page.slug_est}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      page.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal">
                    {page.show_in_menu ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal">
                    {page.show_in_footer ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-teal">{page.display_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/pages/${page.id}`}
                        className="p-2 text-teal hover:bg-mint rounded-full transition-all"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(page.id, page.title_est)}
                        disabled={deleting === page.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-teal p-12 text-center">
          <p className="text-teal font-semibold mb-4">No pages yet</p>
          <Link
            to="/admin/pages/new"
            className="inline-flex items-center gap-2 bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            Create Your First Page
          </Link>
        </div>
      )}
    </div>
  );
}

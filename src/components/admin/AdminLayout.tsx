import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, BookOpen, Image as ImageIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const navItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/pages', icon: FileText, label: 'Pages' },
    { path: '/admin/blog', icon: BookOpen, label: 'Blog Posts' },
    { path: '/admin/media', icon: ImageIcon, label: 'Media Library' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-mint flex">
      <aside className="w-64 bg-teal text-white flex flex-col border-r-4 border-gray-900">
        <div className="p-6 border-b-2 border-mint">
          <Link to="/admin" className="block">
            <img
              src="/valge logo.svg"
              alt="Admin"
              className="h-12 mb-2"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <p className="text-mint font-bold text-sm">Admin Panel</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-lemon text-teal'
                  : 'text-white hover:bg-mint hover:text-teal'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-mint">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-white hover:bg-red-600 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import AgendaCreator from './components/AgendaCreator';
import Footer from './components/Footer';
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import PagesList from './components/admin/PagesList';
import PageEditor from './components/admin/PageEditor';
import BlogList from './components/admin/BlogList';
import BlogEditor from './components/admin/BlogEditor';
import MediaLibrary from './components/admin/MediaLibrary';
import DynamicPage from './components/DynamicPage';
import BlogListPublic from './components/BlogList';
import BlogPost from './components/BlogPost';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const routeToLanguageMap: { [key: string]: 'est' | 'eng' } = {
  '/': 'est',
  '/avaleht': 'est',
  '/minust': 'est',
  '/teenused': 'est',
  '/kontakt': 'est',
  '/blogi': 'est',
  '/home': 'eng',
  '/about': 'eng',
  '/services': 'eng',
  '/contact': 'eng',
  '/blog': 'eng',
  '/agenda': 'est',
  '/create-agenda': 'eng'
};

function AppContent() {
  const [language, setLanguage] = useState<'est' | 'eng'>('est');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    let detectedLang = routeToLanguageMap[path];

    if (!detectedLang) {
      if (path.startsWith('/blogi/')) detectedLang = 'est';
      else if (path.startsWith('/blog/')) detectedLang = 'eng';
    }

    if (detectedLang && detectedLang !== language) {
      setLanguage(detectedLang);
    }
  }, [location.pathname]);

  const handleLanguageChange = (newLang: 'est' | 'eng') => {
    setLanguage(newLang);

    const currentPath = location.pathname;
    let newPath = currentPath;

    if (newLang === 'est') {
      if (currentPath === '/home') newPath = '/avaleht';
      else if (currentPath === '/about') newPath = '/minust';
      else if (currentPath === '/services') newPath = '/teenused';
      else if (currentPath === '/contact') newPath = '/kontakt';
      else if (currentPath === '/create-agenda') newPath = '/agenda';
    } else {
      if (currentPath === '/' || currentPath === '/avaleht') newPath = '/home';
      else if (currentPath === '/minust') newPath = '/about';
      else if (currentPath === '/teenused') newPath = '/services';
      else if (currentPath === '/kontakt') newPath = '/contact';
      else if (currentPath === '/agenda') newPath = '/create-agenda';
    }

    if (newPath !== currentPath) {
      navigate(newPath);
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen">
        <ScrollToTop />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/pages" element={
            <ProtectedRoute>
              <AdminLayout>
                <PagesList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/pages/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <PageEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog" element={
            <ProtectedRoute>
              <AdminLayout>
                <BlogList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/blog/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <BlogEditor />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/media" element={
            <ProtectedRoute>
              <AdminLayout>
                <MediaLibrary />
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Navigation
        language={language}
        setLanguage={handleLanguageChange}
      />

      <Routes>
        <Route path="/" element={<Home language={language} />} />
        <Route path="/avaleht" element={<Home language={language} />} />
        <Route path="/home" element={<Home language={language} />} />

        <Route path="/minust" element={<About language={language} />} />
        <Route path="/about" element={<About language={language} />} />

        <Route path="/teenused" element={<Services language={language} />} />
        <Route path="/services" element={<Services language={language} />} />

        <Route path="/kontakt" element={<Contact language={language} />} />
        <Route path="/contact" element={<Contact language={language} />} />

        <Route path="/agenda" element={<AgendaCreator language={language} />} />
        <Route path="/create-agenda" element={<AgendaCreator language={language} />} />

        <Route path="/blogi" element={<BlogListPublic language={language} />} />
        <Route path="/blog" element={<BlogListPublic language={language} />} />
        <Route path="/blogi/:slug" element={<BlogPost language={language} />} />
        <Route path="/blog/:slug" element={<BlogPost language={language} />} />

        <Route path="/:slug" element={<DynamicPage language={language} />} />
      </Routes>

      <Footer language={language} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

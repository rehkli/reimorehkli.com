import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug } from '../lib/supabase';
import type { Page } from '../lib/supabase';
import ContentRenderer from './content/ContentRenderer';

interface DynamicPageProps {
  language: 'est' | 'eng';
}

export default function DynamicPage({ language }: DynamicPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPage(slug);
    }
  }, [slug, language]);

  const loadPage = async (pageSlug: string) => {
    setLoading(true);
    setNotFound(false);

    try {
      const data = await getPageBySlug(pageSlug, language);
      if (data) {
        setPage(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-mint rounded-2xl w-1/2"></div>
            <div className="h-4 bg-mint rounded w-3/4"></div>
            <div className="h-4 bg-mint rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-teal mb-4">
            {language === 'est' ? 'Lehte ei leitud' : 'Page Not Found'}
          </h1>
          <p className="text-teal font-semibold mb-6">
            {language === 'est'
              ? 'Kahjuks ei leitud sellel aadressil ühtegi lehte.'
              : 'Sorry, we could not find a page at this address.'}
          </p>
          <button
            onClick={() => navigate(language === 'est' ? '/' : '/home')}
            className="bg-lemon text-teal px-6 py-3 rounded-full font-black border-4 border-teal shadow-md hover:shadow-lg transition-all"
          >
            {language === 'est' ? 'Tagasi avalehele' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  const title = language === 'est' ? page.title_est : page.title_eng;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-teal mb-8">{title}</h1>
        <ContentRenderer blocks={page.content} language={language} />
      </div>
    </div>
  );
}

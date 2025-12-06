import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getBlogPostBySlug } from '../lib/supabase';
import type { BlogPost as BlogPostType } from '../lib/supabase';
import ContentRenderer from './content/ContentRenderer';

interface BlogPostProps {
  language: 'est' | 'eng';
}

export default function BlogPost({ language }: BlogPostProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug, language]);

  const loadPost = async (postSlug: string) => {
    setLoading(true);
    setNotFound(false);

    try {
      const data = await getBlogPostBySlug(postSlug, language);
      if (data) {
        setPost(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-mint rounded-2xl w-2/3"></div>
            <div className="h-4 bg-mint rounded w-1/4"></div>
            <div className="h-64 bg-mint rounded-2xl"></div>
            <div className="h-4 bg-mint rounded w-full"></div>
            <div className="h-4 bg-mint rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-teal mb-4">
            {language === 'est' ? 'Postitust ei leitud' : 'Post Not Found'}
          </h1>
          <p className="text-teal font-semibold mb-6">
            {language === 'est'
              ? 'Kahjuks ei leitud seda blogi postitust.'
              : 'Sorry, we could not find this blog post.'}
          </p>
          <Link
            to={language === 'est' ? '/blogi' : '/blog'}
            className="inline-flex items-center gap-2 bg-lemon text-teal px-6 py-3 rounded-full font-black border-4 border-teal shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
            {language === 'est' ? 'Tagasi blogile' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const title = language === 'est' ? post.title_est : post.title_eng;
  const blogPath = language === 'est' ? '/blogi' : '/blog';
  const backText = language === 'est' ? 'Tagasi blogile' : 'Back to Blog';
  const publishedText = language === 'est' ? 'Avaldatud' : 'Published';

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          to={blogPath}
          className="inline-flex items-center gap-2 text-teal font-bold hover:underline mb-6"
        >
          <ArrowLeft size={20} />
          {backText}
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-teal mb-4">{title}</h1>
            {post.published_at && (
              <p className="text-teal font-semibold">
                {publishedText} {new Date(post.published_at).toLocaleDateString(
                  language === 'est' ? 'et-EE' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </p>
            )}
          </header>

          {post.featured_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden border-2 border-teal">
              <img
                src={post.featured_image_url}
                alt={title}
                className="w-full h-auto"
              />
            </div>
          )}

          <ContentRenderer blocks={post.content} language={language} />

          <div className="mt-12 pt-8 border-t-2 border-mint">
            <Link
              to={blogPath}
              className="inline-flex items-center gap-2 bg-lemon text-teal px-6 py-3 rounded-full font-black border-2 border-teal shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft size={20} />
              {backText}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

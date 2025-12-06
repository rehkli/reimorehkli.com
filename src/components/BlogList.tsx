import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts } from '../lib/supabase';
import type { BlogPost } from '../lib/supabase';

interface BlogListProps {
  language: 'est' | 'eng';
}

export default function BlogList({ language }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPublishedBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (content: any[], maxLength: number = 150): string => {
    if (!content || content.length === 0) return '';

    const textBlock = content.find(block => block.type === 'text');
    if (!textBlock || !textBlock.content.html) return '';

    const text = textBlock.content.html.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-mint rounded-2xl w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-mint rounded-2xl h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const blogPath = language === 'est' ? 'blogi' : 'blog';
  const title = language === 'est' ? 'Blogi' : 'Blog';
  const readMore = language === 'est' ? 'Loe edasi' : 'Read More';
  const noPosts = language === 'est' ? 'Postitusi pole veel avaldatud' : 'No posts published yet';

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-black text-teal mb-12">{title}</h1>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const postTitle = language === 'est' ? post.title_est : post.title_eng;
              const postSlug = language === 'est' ? post.slug_est : post.slug_eng;
              const excerpt = getExcerpt(post.content);

              return (
                <Link
                  key={post.id}
                  to={`/${blogPath}/${postSlug}`}
                  className="bg-white rounded-2xl border-2 border-teal overflow-hidden hover:shadow-lg transition-all group"
                >
                  {post.featured_image_url && (
                    <div className="aspect-video bg-mint overflow-hidden">
                      <img
                        src={post.featured_image_url}
                        alt={postTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-black text-teal mb-3 group-hover:text-teal transition-colors">
                      {postTitle}
                    </h2>

                    {excerpt && (
                      <p className="text-teal font-semibold text-sm mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                    )}

                    {post.published_at && (
                      <p className="text-teal font-semibold text-xs mb-4">
                        {new Date(post.published_at).toLocaleDateString(
                          language === 'est' ? 'et-EE' : 'en-US',
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )}
                      </p>
                    )}

                    <span className="text-teal font-black text-sm group-hover:underline">
                      {readMore} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-mint rounded-2xl border-2 border-teal p-12 text-center">
            <p className="text-teal font-semibold text-lg">{noPosts}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_login: string | null;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'cta';
  content: any;
  order: number;
}

export interface Page {
  id: string;
  slug_est: string;
  slug_eng: string;
  title_est: string;
  title_eng: string;
  content: ContentBlock[];
  show_in_menu: boolean;
  show_in_footer: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug_est: string;
  slug_eng: string;
  title_est: string;
  title_eng: string;
  content: ContentBlock[];
  featured_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt_text_est: string;
  alt_text_eng: string;
  width: number | null;
  height: number | null;
  file_size: number | null;
  created_at: string;
}

export async function getPublishedPages() {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Page[];
}

export async function getPageBySlug(slug: string, language: 'est' | 'eng') {
  const column = language === 'est' ? 'slug_est' : 'slug_eng';
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq(column, slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data as Page | null;
}

export async function getPublishedBlogPosts(limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string, language: 'est' | 'eng') {
  const column = language === 'est' ? 'slug_est' : 'slug_eng';
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq(column, slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data as BlogPost | null;
}

export async function getMediaLibrary() {
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MediaItem[];
}

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('media').getPublicUrl(filePath);

  return data.publicUrl;
}

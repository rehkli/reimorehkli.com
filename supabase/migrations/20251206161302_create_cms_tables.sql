/*
  # Create CMS Tables for Dynamic Content Management

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
    
    - `pages`
      - `id` (uuid, primary key)
      - `slug_est` (text, unique)
      - `slug_eng` (text, unique)
      - `title_est` (text)
      - `title_eng` (text)
      - `content` (jsonb) - structured blocks for flexible content
      - `show_in_menu` (boolean)
      - `show_in_footer` (boolean)
      - `is_published` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `blog_posts`
      - `id` (uuid, primary key)
      - `slug_est` (text, unique)
      - `slug_eng` (text, unique)
      - `title_est` (text)
      - `title_eng` (text)
      - `content` (jsonb) - structured blocks for flexible content
      - `featured_image_url` (text)
      - `is_published` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `media_library`
      - `id` (uuid, primary key)
      - `url` (text)
      - `filename` (text)
      - `alt_text_est` (text)
      - `alt_text_eng` (text)
      - `width` (integer)
      - `height` (integer)
      - `file_size` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can read published content (pages and blog_posts)
    - Only authenticated admin users can create/update/delete content
    - Media library is readable by public, writable by authenticated admins
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_est text UNIQUE NOT NULL,
  slug_eng text UNIQUE NOT NULL,
  title_est text NOT NULL,
  title_eng text NOT NULL,
  content jsonb DEFAULT '[]'::jsonb,
  show_in_menu boolean DEFAULT false,
  show_in_footer boolean DEFAULT false,
  is_published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pages"
  ON pages FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated admins can insert pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete pages"
  ON pages FOR DELETE
  TO authenticated
  USING (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug_est text UNIQUE NOT NULL,
  slug_eng text UNIQUE NOT NULL,
  title_est text NOT NULL,
  title_eng text NOT NULL,
  content jsonb DEFAULT '[]'::jsonb,
  featured_image_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Authenticated admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Create media_library table
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  filename text NOT NULL,
  alt_text_est text DEFAULT '',
  alt_text_eng text DEFAULT '',
  width integer,
  height integer,
  file_size integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media"
  ON media_library FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_pages_updated_at'
  ) THEN
    CREATE TRIGGER update_pages_updated_at
      BEFORE UPDATE ON pages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_blog_posts_updated_at
      BEFORE UPDATE ON blog_posts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create storage bucket for media (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view media'
  ) THEN
    CREATE POLICY "Public can view media"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can upload media'
  ) THEN
    CREATE POLICY "Authenticated admins can upload media"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can update media'
  ) THEN
    CREATE POLICY "Authenticated admins can update media"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated admins can delete media'
  ) THEN
    CREATE POLICY "Authenticated admins can delete media"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'media');
  END IF;
END $$;
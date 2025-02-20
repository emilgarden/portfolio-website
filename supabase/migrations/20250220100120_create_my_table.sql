CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  technologies TEXT[],
  category TEXT,
  github_url TEXT,
  live_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_slug ON projects(slug);

CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  text_color TEXT,
  categories TEXT[],
  related TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  technologies TEXT[],
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  background_color TEXT,
  text_color TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE technologies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

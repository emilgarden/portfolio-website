-- Tømmer eksisterende data
TRUNCATE TABLE projects, experiences, skills, technologies CASCADE;

-- Legger til technologies først siden andre tabeller refererer til disse
INSERT INTO technologies (name, category) VALUES
  ('Next.js', 'Frontend'),
  ('TypeScript', 'Programming'),
  ('Tailwind CSS', 'Frontend'),
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('AWS', 'Cloud'),
  ('Docker', 'DevOps'),
  ('MongoDB', 'Database'),
  ('Python', 'Programming'),
  ('SQL', 'Database');

-- Legger til flere prosjekter
INSERT INTO projects (title, description, short_description, image_url, technologies, category, github_url, live_url, slug, featured, status, sort_order) VALUES
(
  'Portfolio Nettside',
  'Min personlige portfolio bygget med Next.js og Tailwind CSS. Fokus på moderne webutvikling og beste praksis for ytelse.',
  'Personlig portfolio med Next.js og Tailwind',
  '/images/projects/portfolio.jpg',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS'],
  'Web Utvikling',
  'https://github.com/username/portfolio',
  'https://portfolio.no',
  'portfolio-website',
  true,
  'published',
  1
),
(
  'E-commerce Platform',
  'Full-stack e-handelsløsning bygget med React og Node.js. Inkluderer handlekurv, betalingsintegrasjon og admin-panel.',
  'Modern e-handelsløsning',
  '/images/projects/ecommerce.jpg',
  ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
  'Web Utvikling',
  'https://github.com/username/ecommerce',
  'https://demo-shop.no',
  'ecommerce-platform',
  true,
  'published',
  2
),
(
  'Task Manager App',
  'En produktivitetsapp bygget med Vue.js og Firebase. Støtter drag-and-drop, real-time oppdateringer og team-samarbeid.',
  'Moderne task manager',
  '/images/projects/taskmanager.jpg',
  ARRAY['Vue.js', 'Firebase', 'Vuex', 'TailwindCSS'],
  'Web Applikasjon',
  'https://github.com/username/taskmanager',
  'https://task-app.no',
  'task-manager',
  false,
  'published',
  3
),
(
  'Weather Dashboard',
  'Værapplikasjon som viser sanntidsdata og prognoser. Bruker OpenWeather API og D3.js for datavisualisering.',
  'Interaktiv værapplikasjon',
  '/images/projects/weather.jpg',
  ARRAY['React', 'D3.js', 'API Integration', 'CSS Grid'],
  'Data Visualisering',
  'https://github.com/username/weather',
  'https://weather-dash.no',
  'weather-dashboard',
  false,
  'published',
  4
),
(
  'Blogg CMS',
  'Skreddersydd CMS-system bygget med Next.js og Supabase. Støtter markdown, bildeopplasting og SEO-optimalisering.',
  'Modern blogging platform',
  '/images/projects/blog-cms.jpg',
  ARRAY['Next.js', 'Supabase', 'TailwindCSS', 'MDX'],
  'CMS',
  'https://github.com/username/blog-cms',
  'https://blog-cms-demo.no',
  'blog-cms',
  true,
  'published',
  5
),
(
  'AI Chat Interface',
  'Chat-grensesnitt for AI-modeller, bygget med React og OpenAI API. Inkluderer stemme-til-tekst og kontekstbaserte svar.',
  'AI-drevet chatbot',
  '/images/projects/ai-chat.jpg',
  ARRAY['React', 'OpenAI API', 'WebSocket', 'TailwindCSS'],
  'AI/ML',
  'https://github.com/username/ai-chat',
  'https://ai-chat-demo.no',
  'ai-chat-interface',
  true,
  'published',
  6
);

-- Legger til experiences basert på ExperienceContent.tsx
INSERT INTO experiences (title, company, start_date, end_date, description, technologies, sort_order) VALUES
(
  'Senior Fullstack Utvikler',
  'TechCorp AS',
  '2021-01-01',
  NULL,
  'Leder utviklingen av selskapets hovedprodukt, en skybasert SaaS-løsning. Ansvarlig for arkitektur og tekniske beslutninger.',
  ARRAY['React', 'Node.js', 'AWS', 'TypeScript'],
  1
),
(
  'Frontend Utvikler',
  'WebSolutions Norge',
  '2019-01-01',
  '2020-12-31',
  'Utviklet responsive web-applikasjoner for diverse kunder. Fokus på brukeropplevelse og ytelse.',
  ARRAY['Vue.js', 'Nuxt.js', 'SCSS', 'JavaScript'],
  2
),
(
  'Junior Utvikler',
  'StartupHub',
  '2018-01-01',
  '2018-12-31',
  'Fullstack utvikling for tidligfase startups. Varierte prosjekter fra MVP til produksjonsklare løsninger.',
  ARRAY['React', 'Express', 'MongoDB', 'Docker'],
  3
);

-- Legger til skills basert på SkillsContent.tsx
INSERT INTO skills (title, description, technologies, background_color, text_color, sort_order) VALUES
(
  'Web Utvikling',
  'Frontend og backend utvikling med moderne teknologier og rammeverk.',
  ARRAY['React', 'Next.js', 'Node.js', 'TypeScript'],
  'bg-blue-100',
  'text-blue-800',
  1
),
(
  'Applikasjonsutvikling',
  'Utvikling av skalerbare og robuste applikasjoner.',
  ARRAY['Docker', 'AWS', 'MongoDB', 'Redis'],
  'bg-green-100',
  'text-green-800',
  2
),
(
  'Data & Analyse',
  'Dataanalyse og visualisering med moderne verktøy.',
  ARRAY['Python', 'SQL', 'Tableau', 'Power BI'],
  'bg-purple-100',
  'text-purple-800',
  3
);

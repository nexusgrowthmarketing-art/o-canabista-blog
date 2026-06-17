-- ============================================================
-- O CANABISTA — schema + segurança (RLS) + conteúdo inicial
-- Cole TUDO no SQL Editor do Supabase e clique em "Run".
-- Pode rodar mais de uma vez (recria as tabelas e o seed).
-- ============================================================

-- ---------- Tabelas ----------
create table if not exists public.posts (
  slug            text primary key,
  title           text not null,
  subtitle        text,
  excerpt         text not null default '',
  content         text,
  cover_image     text,
  cover_variant   text not null default 'img-1',
  leaf            text,
  video_url       text,
  featured        boolean not null default false,
  category        text not null default 'Cultivo',
  tags            text[] not null default '{}',
  badge_label     text not null default '',
  badge_variant   text not null default 'default',
  author_name     text not null default 'Redação O Canabista',
  rating          numeric not null default 8.5,
  read_time       integer not null default 5,
  status          text not null default 'rascunho',
  seo_title       text,
  seo_description  text,
  social_image    text,
  published_at    timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.team (
  id         text primary key,
  name       text not null,
  email      text not null,
  role       text not null default 'Autor',
  status     text not null default 'convidado',
  color      text not null default '#4ade80',
  joined_at  timestamptz not null default now()
);

create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_category_idx on public.posts (category);

-- ---------- Segurança (RLS) ----------
alter table public.posts enable row level security;
alter table public.team  enable row level security;

-- Público pode LER apenas posts publicados.
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select
  using (status = 'publicado');

-- A tabela de equipe NÃO é pública (sem policy = sem acesso anônimo).
-- As escritas do painel usam a service_role key (que ignora o RLS), no servidor.

-- ---------- Conteúdo inicial (seed) ----------
truncate public.posts;
insert into public.posts (slug, title, subtitle, excerpt, content, cover_image, cover_variant, leaf, video_url, featured, category, tags, badge_label, badge_variant, author_name, rating, read_time, status, seo_title, seo_description, social_image, published_at, updated_at) values
  ('guia-definitivo-cultivo-indoor', 'Guia Definitivo do Cultivo Indoor', 'Da germinação à colheita', 'Tudo o que você precisa saber para montar seu espaço de cultivo, escolher iluminação, controlar temperatura e umidade, e maximizar a produção da sua planta.', '<p>Tudo o que você precisa saber para montar seu espaço de cultivo, escolher iluminação, controlar temperatura e umidade, e maximizar a produção da sua planta.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Guia Definitivo do Cultivo Indoor" pelo painel.</p>', null, 'img-4', '🌿', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 'Cultivo', array['Cultivo']::text[], 'Em Destaque', 'default', 'Redação O Canabista', 9.2, 15, 'publicado', 'Guia Definitivo do Cultivo Indoor', 'Tudo o que você precisa saber para montar seu espaço de cultivo, escolher iluminação, controlar temperatura e umidade, e maximizar a produção da sua planta.', null, '2026-06-16T12:00:00.000Z', '2026-06-16T12:00:00.000Z'),
  ('iluminacao-led-vs-hps', 'Iluminação LED vs HPS', null, 'Comparativo completo entre LED e HPS: consumo, calor, espectro e custo-benefício para cada fase do cultivo.', '<p>Comparativo completo entre LED e HPS: consumo, calor, espectro e custo-benefício para cada fase do cultivo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Iluminação LED vs HPS" pelo painel.</p>', null, 'img-1', '🌱', null, false, 'Cultivo', array['Cultivo']::text[], 'Cultivo', 'default', 'Redação O Canabista', 8.9, 12, 'publicado', 'Iluminação LED vs HPS', 'Comparativo completo entre LED e HPS: consumo, calor, espectro e custo-benefício para cada fase do cultivo.', null, '2026-06-15T12:00:00.000Z', '2026-06-15T12:00:00.000Z'),
  ('top-10-strains-2026', 'Top 10 Strains de 2026', null, 'As variedades mais buscadas do ano, com perfis de aroma, efeitos e dificuldade de cultivo.', '<p>As variedades mais buscadas do ano, com perfis de aroma, efeitos e dificuldade de cultivo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Top 10 Strains de 2026" pelo painel.</p>', null, 'img-2', '🌿', null, false, 'Variedades', array['Variedades']::text[], 'Premium', 'gold', 'Redação O Canabista', 9.5, 8, 'publicado', 'Top 10 Strains de 2026', 'As variedades mais buscadas do ano, com perfis de aroma, efeitos e dificuldade de cultivo.', null, '2026-06-14T12:00:00.000Z', '2026-06-14T12:00:00.000Z'),
  ('cbd-para-ansiedade', 'CBD para Ansiedade', null, 'O que a ciência diz sobre o uso de CBD no manejo da ansiedade, dosagens e formas de consumo.', '<p>O que a ciência diz sobre o uso de CBD no manejo da ansiedade, dosagens e formas de consumo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "CBD para Ansiedade" pelo painel.</p>', null, 'img-3', '🍃', null, false, 'Medicinal', array['Medicinal']::text[], 'Medicinal', 'default', 'Redação O Canabista', 9.1, 10, 'publicado', 'CBD para Ansiedade', 'O que a ciência diz sobre o uso de CBD no manejo da ansiedade, dosagens e formas de consumo.', null, '2026-06-13T12:00:00.000Z', '2026-06-13T12:00:00.000Z'),
  ('hidroponia-em-casa', 'Hidroponia em Casa', null, 'Montagem de um sistema hidropônico caseiro: equipamentos, solução nutritiva e manutenção.', '<p>Montagem de um sistema hidropônico caseiro: equipamentos, solução nutritiva e manutenção.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Hidroponia em Casa" pelo painel.</p>', null, 'img-4', '🌾', null, false, 'Cultivo', array['Cultivo']::text[], 'Novo', 'dark', 'Redação O Canabista', 8.7, 14, 'publicado', 'Hidroponia em Casa', 'Montagem de um sistema hidropônico caseiro: equipamentos, solução nutritiva e manutenção.', null, '2026-06-12T12:00:00.000Z', '2026-06-12T12:00:00.000Z'),
  ('historia-do-canhamo', 'História do Cânhamo', null, 'Do uso milenar às aplicações industriais modernas: a trajetória do cânhamo pela civilização.', '<p>Do uso milenar às aplicações industriais modernas: a trajetória do cânhamo pela civilização.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "História do Cânhamo" pelo painel.</p>', null, 'img-5', '🌱', null, false, 'Cultura', array['Cultura']::text[], 'Cultura', 'default', 'Redação O Canabista', 8.4, 20, 'publicado', 'História do Cânhamo', 'Do uso milenar às aplicações industriais modernas: a trajetória do cânhamo pela civilização.', null, '2026-06-11T12:00:00.000Z', '2026-06-11T12:00:00.000Z'),
  ('extracao-de-resina', 'Extração de Resina', null, 'Métodos de extração de resina, do hash tradicional às técnicas modernas livres de solvente.', '<p>Métodos de extração de resina, do hash tradicional às técnicas modernas livres de solvente.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Extração de Resina" pelo painel.</p>', null, 'img-6', '🌿', null, false, 'Cultivo', array['Cultivo']::text[], 'Top', 'gold', 'Redação O Canabista', 9, 16, 'publicado', 'Extração de Resina', 'Métodos de extração de resina, do hash tradicional às técnicas modernas livres de solvente.', null, '2026-06-10T12:00:00.000Z', '2026-06-10T12:00:00.000Z'),
  ('germinacao-passo-a-passo', 'Germinação Passo a Passo', null, 'O método mais confiável para germinar sementes com alta taxa de sucesso, do papel toalha ao substrato.', '<p>O método mais confiável para germinar sementes com alta taxa de sucesso, do papel toalha ao substrato.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Germinação Passo a Passo" pelo painel.</p>', null, 'img-7', '🌱', null, false, 'Cultivo', array['Cultivo']::text[], 'Iniciante', 'default', 'Redação O Canabista', 9.3, 7, 'publicado', 'Germinação Passo a Passo', 'O método mais confiável para germinar sementes com alta taxa de sucesso, do papel toalha ao substrato.', null, '2026-06-09T12:00:00.000Z', '2026-06-09T12:00:00.000Z'),
  ('nutricao-e-fertilizantes', 'Nutrição e Fertilizantes', null, 'Macro e micronutrientes, tabelas de alimentação e como ler sinais de deficiência na planta.', '<p>Macro e micronutrientes, tabelas de alimentação e como ler sinais de deficiência na planta.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Nutrição e Fertilizantes" pelo painel.</p>', null, 'img-8', '🌿', null, false, 'Cultivo', array['Cultivo']::text[], 'Intermediário', 'default', 'Redação O Canabista', 8.8, 13, 'publicado', 'Nutrição e Fertilizantes', 'Macro e micronutrientes, tabelas de alimentação e como ler sinais de deficiência na planta.', null, '2026-06-08T12:00:00.000Z', '2026-06-08T12:00:00.000Z'),
  ('tecnicas-de-poda-lst', 'Técnicas de Poda LST', null, 'Low Stress Training na prática: como moldar a planta para mais luz e produção sem estresse.', '<p>Low Stress Training na prática: como moldar a planta para mais luz e produção sem estresse.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Técnicas de Poda LST" pelo painel.</p>', null, 'img-9', '🍃', null, false, 'Cultivo', array['Cultivo']::text[], 'Avançado', 'gold', 'Redação O Canabista', 9.4, 18, 'publicado', 'Técnicas de Poda LST', 'Low Stress Training na prática: como moldar a planta para mais luz e produção sem estresse.', null, '2026-06-07T12:00:00.000Z', '2026-06-07T12:00:00.000Z'),
  ('controle-de-pragas', 'Controle de Pragas', null, 'Identificação e combate às pragas mais comuns no cultivo, com foco em manejo integrado.', '<p>Identificação e combate às pragas mais comuns no cultivo, com foco em manejo integrado.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Controle de Pragas" pelo painel.</p>', null, 'img-1', '🌾', null, false, 'Cultivo', array['Cultivo']::text[], 'Cultivo', 'default', 'Redação O Canabista', 8.6, 11, 'publicado', 'Controle de Pragas', 'Identificação e combate às pragas mais comuns no cultivo, com foco em manejo integrado.', null, '2026-06-06T12:00:00.000Z', '2026-06-06T12:00:00.000Z'),
  ('cura-e-secagem-perfeita', 'Cura e Secagem Perfeita', null, 'O processo de cura que define aroma, sabor e potência — temperatura, umidade e tempo ideais.', '<p>O processo de cura que define aroma, sabor e potência — temperatura, umidade e tempo ideais.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Cura e Secagem Perfeita" pelo painel.</p>', null, 'img-3', '🌱', null, false, 'Cultivo', array['Cultivo']::text[], 'Cultivo', 'default', 'Redação O Canabista', 9, 9, 'publicado', 'Cura e Secagem Perfeita', 'O processo de cura que define aroma, sabor e potência — temperatura, umidade e tempo ideais.', null, '2026-06-05T12:00:00.000Z', '2026-06-05T12:00:00.000Z'),
  ('estufa-automatizada-diy', 'Estufa Automatizada DIY', null, 'Como automatizar sua estufa com sensores, temporizadores e controle de clima de baixo custo.', '<p>Como automatizar sua estufa com sensores, temporizadores e controle de clima de baixo custo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Estufa Automatizada DIY" pelo painel.</p>', null, 'img-5', '🌿', null, false, 'Cultivo', array['Cultivo']::text[], 'Novo', 'dark', 'Redação O Canabista', 8.9, 22, 'publicado', 'Estufa Automatizada DIY', 'Como automatizar sua estufa com sensores, temporizadores e controle de clima de baixo custo.', null, '2026-06-04T12:00:00.000Z', '2026-06-04T12:00:00.000Z'),
  ('a-origem-da-cannabis', 'A Origem da Cannabis', null, 'Documentário sobre as raízes históricas e geográficas da planta e sua relação com a humanidade.', '<p>Documentário sobre as raízes históricas e geográficas da planta e sua relação com a humanidade.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "A Origem da Cannabis" pelo painel.</p>', null, 'img-2', '🍃', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 'Cultura', array['Cultura']::text[], 'Documentário', 'default', 'Redação O Canabista', 9.2, 25, 'publicado', 'A Origem da Cannabis', 'Documentário sobre as raízes históricas e geográficas da planta e sua relação com a humanidade.', null, '2026-06-03T12:00:00.000Z', '2026-06-03T12:00:00.000Z'),
  ('mestres-do-cultivo-br', 'Mestres do Cultivo BR', null, 'Entrevistas com cultivadores brasileiros de referência sobre técnica, ética e comunidade.', '<p>Entrevistas com cultivadores brasileiros de referência sobre técnica, ética e comunidade.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Mestres do Cultivo BR" pelo painel.</p>', null, 'img-6', '🌾', null, false, 'Cultura', array['Cultura']::text[], 'Entrevista', 'default', 'Redação O Canabista', 8.7, 19, 'publicado', 'Mestres do Cultivo BR', 'Entrevistas com cultivadores brasileiros de referência sobre técnica, ética e comunidade.', null, '2026-06-02T12:00:00.000Z', '2026-06-02T12:00:00.000Z'),
  ('legalizacao-no-brasil', 'Legalização no Brasil', null, 'Panorama atualizado do cenário jurídico e político da cannabis no Brasil e o que esperar.', '<p>Panorama atualizado do cenário jurídico e político da cannabis no Brasil e o que esperar.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Legalização no Brasil" pelo painel.</p>', null, 'img-4', '🌱', null, false, 'Cultura', array['Cultura']::text[], 'Especial', 'gold', 'Redação O Canabista', 9.1, 17, 'publicado', 'Legalização no Brasil', 'Panorama atualizado do cenário jurídico e político da cannabis no Brasil e o que esperar.', null, '2026-06-01T12:00:00.000Z', '2026-06-01T12:00:00.000Z'),
  ('filmes-sobre-cannabis', 'Filmes Sobre Cannabis', null, 'Uma seleção de filmes e documentários essenciais sobre a cultura canábica pelo mundo.', '<p>Uma seleção de filmes e documentários essenciais sobre a cultura canábica pelo mundo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Filmes Sobre Cannabis" pelo painel.</p>', null, 'img-9', '🌿', null, false, 'Cultura', array['Cultura']::text[], 'Cultura', 'default', 'Redação O Canabista', 8.5, 14, 'publicado', 'Filmes Sobre Cannabis', 'Uma seleção de filmes e documentários essenciais sobre a cultura canábica pelo mundo.', null, '2026-05-31T12:00:00.000Z', '2026-05-31T12:00:00.000Z'),
  ('musica-e-cannabis', 'Música & Cannabis', null, 'A influência da cannabis na música e como diferentes gêneros celebraram a planta ao longo do tempo.', '<p>A influência da cannabis na música e como diferentes gêneros celebraram a planta ao longo do tempo.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Música & Cannabis" pelo painel.</p>', null, 'img-7', '🍃', null, false, 'Cultura', array['Cultura']::text[], 'Cultura', 'default', 'Redação O Canabista', 8.8, 12, 'publicado', 'Música & Cannabis', 'A influência da cannabis na música e como diferentes gêneros celebraram a planta ao longo do tempo.', null, '2026-05-30T12:00:00.000Z', '2026-05-30T12:00:00.000Z'),
  ('festivais-420-pelo-mundo', 'Festivais 420 pelo Mundo', null, 'Um guia dos maiores festivais e celebrações 420 do planeta, da cultura local à programação.', '<p>Um guia dos maiores festivais e celebrações 420 do planeta, da cultura local à programação.</p>
<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>
<h2>Por que isso importa</h2>
<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>
<p>Substitua este bloco pelo conteúdo real de "Festivais 420 pelo Mundo" pelo painel.</p>', null, 'img-8', '🌾', null, false, 'Cultura', array['Cultura']::text[], 'Trending', 'dark', 'Redação O Canabista', 9, 16, 'publicado', 'Festivais 420 pelo Mundo', 'Um guia dos maiores festivais e celebrações 420 do planeta, da cultura local à programação.', null, '2026-05-29T12:00:00.000Z', '2026-05-29T12:00:00.000Z');

truncate public.team;
insert into public.team (id, name, email, role, status, color, joined_at) values
  ('u-1', 'Você (Proprietário)', 'nexus.growth.marketing@gmail.com', 'Administrador', 'ativo', '#4ade80', '2026-06-16T12:00:00.000Z'),
  ('u-2', 'Marina Editora', 'marina@ocanabista.com.br', 'Editor', 'ativo', '#d4af37', '2026-06-16T12:00:00.000Z'),
  ('u-3', 'Léo Cultivo', 'leo@ocanabista.com.br', 'Autor', 'convidado', '#60a5fa', '2026-06-16T12:00:00.000Z');

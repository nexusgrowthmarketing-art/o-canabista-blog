-- ============================================================
-- O CANABISTA — tabelas extras para PERSISTÊNCIA TOTAL em produção
-- (comentários, curtidas de estampa, stories 48h, newsletter, contato)
--
-- Cole TUDO no SQL Editor do Supabase (projeto o-canabista) e clique "Run".
-- Seguro rodar mais de uma vez (usa "if not exists" / "or replace").
-- Não apaga dados — só cria o que faltar.
--
-- Acesso: o app lê/escreve sempre pelo servidor com a service_role key
-- (que ignora o RLS). Por isso as tabelas ficam fechadas para o público
-- (RLS ligado, sem policy anônima) — igual à tabela `team`.
-- ============================================================

-- ---------- Comentários ----------
create table if not exists public.comments (
  id          text primary key,
  post_slug   text not null,
  author      text not null,
  text        text not null,
  status      text not null default 'aprovado',
  created_at  timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_slug);
create index if not exists comments_status_idx on public.comments (status);

-- ---------- Curtidas das estampas ----------
create table if not exists public.estampa_likes (
  slug   text primary key,
  count  integer not null default 0
);

-- ---------- Stories 48h ----------
create table if not exists public.stories (
  id          text primary key,
  type        text not null,
  media_url   text,
  variant     text,
  emoji       text,
  caption     text,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  sample      boolean not null default false
);
create index if not exists stories_expires_idx on public.stories (expires_at);

-- ---------- Newsletter (assinantes) ----------
create table if not exists public.subscribers (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- ---------- Mensagens de contato ----------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text not null,
  mensagem    text not null,
  created_at  timestamptz not null default now()
);

-- ---------- Segurança (RLS) — tudo fechado ao público ----------
alter table public.comments      enable row level security;
alter table public.estampa_likes enable row level security;
alter table public.stories       enable row level security;
alter table public.subscribers   enable row level security;
alter table public.messages      enable row level security;

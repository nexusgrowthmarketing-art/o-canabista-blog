import fs from "node:fs";
import path from "node:path";
import type { Post, TeamMember } from "../lib/types";

/**
 * Gera o arquivo supabase/schema.sql (tabelas + RLS + seed do conteúdo atual)
 * a partir de content/posts.json e content/team.json.
 * Rode com: npx tsx scripts/gen-supabase-sql.ts
 */

const root = process.cwd();
const posts: Post[] = JSON.parse(
  fs.readFileSync(path.join(root, "content", "posts.json"), "utf-8"),
);
const team: TeamMember[] = JSON.parse(
  fs.readFileSync(path.join(root, "content", "team.json"), "utf-8"),
);

const q = (v: string | undefined | null) =>
  v === undefined || v === null ? "null" : `'${v.replace(/'/g, "''")}'`;
const qArr = (arr: string[]) =>
  `array[${arr.map((t) => q(t)).join(", ")}]::text[]`;
const bool = (b: boolean | undefined) => (b ? "true" : "false");
const num = (n: number | undefined, d = 0) => (n ?? d).toString();

const postCols = [
  "slug",
  "title",
  "subtitle",
  "excerpt",
  "content",
  "cover_image",
  "cover_variant",
  "leaf",
  "video_url",
  "featured",
  "category",
  "tags",
  "badge_label",
  "badge_variant",
  "author_name",
  "rating",
  "read_time",
  "status",
  "seo_title",
  "seo_description",
  "social_image",
  "published_at",
  "updated_at",
];

const postValues = posts
  .map((p) =>
    `  (${[
      q(p.slug),
      q(p.title),
      q(p.subtitle),
      q(p.excerpt),
      q(p.content),
      q(p.coverImage),
      q(p.coverVariant),
      q(p.leaf),
      q(p.videoUrl),
      bool(p.featured),
      q(p.category),
      qArr(p.tags ?? []),
      q(p.badgeLabel),
      q(p.badgeVariant),
      q(p.author?.name),
      num(p.rating, 8.5),
      num(p.readTime, 5),
      q(p.status),
      q(p.seoTitle),
      q(p.seoDescription),
      q(p.socialImage),
      q(p.publishedAt),
      q(p.updatedAt),
    ].join(", ")})`,
  )
  .join(",\n");

const teamCols = ["id", "name", "email", "role", "status", "color", "joined_at"];
const teamValues = team
  .map((m) =>
    `  (${[
      q(m.id),
      q(m.name),
      q(m.email),
      q(m.role),
      q(m.status),
      q(m.color),
      q(m.joinedAt),
    ].join(", ")})`,
  )
  .join(",\n");

const sql = `-- ============================================================
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
insert into public.posts (${postCols.join(", ")}) values
${postValues};

truncate public.team;
insert into public.team (${teamCols.join(", ")}) values
${teamValues};
`;

const outDir = path.join(root, "supabase");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "schema.sql"), sql, "utf-8");
console.log(
  `supabase/schema.sql gerado: ${posts.length} posts + ${team.length} membros.`,
);

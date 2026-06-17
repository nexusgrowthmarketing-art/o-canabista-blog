import { readPosts } from "./store";
import type { Collection, Post } from "./types";

/**
 * API de leitura consumida pelos componentes/páginas.
 * Assíncrona porque a fonte pode ser o Supabase. A implementação real
 * (Supabase ou arquivo) fica em lib/store.ts.
 */

export async function getAllPosts(): Promise<Post[]> {
  const posts = await readPosts();
  return posts
    .filter((p) => p.status === "publicado")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/** Todos os posts, inclusive rascunhos (uso do painel). */
export async function getAllPostsAdmin(): Promise<Post[]> {
  const posts = await readPosts();
  return posts.sort(
    (a, b) =>
      +new Date(b.updatedAt ?? b.publishedAt) -
      +new Date(a.updatedAt ?? a.publishedAt),
  );
}

export async function getFeaturedPost(): Promise<Post | undefined> {
  const posts = (await readPosts()).filter((p) => p.status === "publicado");
  return posts.find((p) => p.featured) ?? posts[0];
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await readPosts();
  return posts.find((p) => p.slug === slug && p.status === "publicado");
}

/** Versão do painel: encontra qualquer post (inclusive rascunho). */
export async function getAnyPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await readPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const slug = categorySlug.toLowerCase();
  const posts = await getAllPosts();
  return posts.filter((p) => slugifyCategory(p.category) === slug);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((p) => p.category)));
}

/**
 * Coleções da home (as "fileiras"). Curadas por slug para manter o layout
 * estável independentemente da ordem do banco.
 */
const COLLECTION_DEFS: { title: string; href: string; slugs: string[] }[] = [
  {
    title: "Em Alta Esta Semana",
    href: "/categoria/cultivo",
    slugs: [
      "iluminacao-led-vs-hps",
      "top-10-strains-2026",
      "cbd-para-ansiedade",
      "hidroponia-em-casa",
      "historia-do-canhamo",
      "extracao-de-resina",
    ],
  },
  {
    title: "Guias de Cultivo",
    href: "/categoria/cultivo",
    slugs: [
      "germinacao-passo-a-passo",
      "nutricao-e-fertilizantes",
      "tecnicas-de-poda-lst",
      "controle-de-pragas",
      "cura-e-secagem-perfeita",
      "estufa-automatizada-diy",
    ],
  },
  {
    title: "Cultura Canábica",
    href: "/categoria/cultura",
    slugs: [
      "a-origem-da-cannabis",
      "mestres-do-cultivo-br",
      "legalizacao-no-brasil",
      "filmes-sobre-cannabis",
      "musica-e-cannabis",
      "festivais-420-pelo-mundo",
    ],
  },
];

export async function getCollections(): Promise<Collection[]> {
  const published = await getAllPosts();
  const bySlug = new Map(published.map((p) => [p.slug, p]));
  return COLLECTION_DEFS.map((def) => ({
    title: def.title,
    href: def.href,
    posts: def.slugs
      .map((s) => bySlug.get(s))
      .filter((p): p is Post => Boolean(p)),
  })).filter((c) => c.posts.length > 0);
}

/** Normaliza nome de categoria para slug de URL (remove acentos). */
export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

/** Gera um slug a partir de um título qualquer (uso do editor). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

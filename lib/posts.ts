import { readPosts } from "./store";
import type { Collection, Post } from "./types";

/**
 * API de leitura consumida pelos componentes/páginas públicas.
 * Lê do "banco" em arquivo (lib/store.ts). Para migrar ao CMS, basta o store
 * passar a buscar do banco real — estas funções não mudam.
 */

export function getAllPosts(): Post[] {
  return readPosts()
    .filter((p) => p.status === "publicado")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/** Todos os posts, inclusive rascunhos (uso do painel). */
export function getAllPostsAdmin(): Post[] {
  return readPosts().sort(
    (a, b) => +new Date(b.updatedAt ?? b.publishedAt) - +new Date(a.updatedAt ?? a.publishedAt),
  );
}

export function getFeaturedPost(): Post {
  const posts = readPosts().filter((p) => p.status === "publicado");
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getPostBySlug(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug && p.status === "publicado");
}

/** Versão do painel: encontra qualquer post (inclusive rascunho). */
export function getAnyPostBySlug(slug: string): Post | undefined {
  return readPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  const slug = categorySlug.toLowerCase();
  return getAllPosts().filter((p) => slugifyCategory(p.category) === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllPosts().map((p) => p.category)));
}

/**
 * Coleções da home (as "fileiras"). Curadas por slug para manter o layout
 * estável independentemente da ordem do banco. Mais à frente isto pode virar
 * um campo no CMS (coleções gerenciáveis).
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

export function getCollections(): Collection[] {
  const published = getAllPosts();
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

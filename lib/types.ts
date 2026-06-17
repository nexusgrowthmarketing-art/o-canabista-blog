/**
 * Tipos do conteúdo. Espelham exatamente o que um CMS (Sanity, Payload, etc.)
 * vai devolver — então a migração para o CMS é só trocar o corpo das funções
 * em `lib/posts.ts`, sem tocar nos componentes.
 */

export type PostStatus = "rascunho" | "publicado";

/** Variantes do "tag" colorido exibido no card (preserva o design original). */
export type BadgeVariant = "default" | "gold" | "dark";

export interface Author {
  name: string;
  slug: string;
  avatar?: string;
}

export interface Post {
  /** Identificador amigável para URL: /posts/[slug] */
  slug: string;
  title: string;
  subtitle?: string;
  /** Resumo curto, usado em listagens e meta description fallback. */
  excerpt: string;
  /** Corpo do post (HTML por enquanto; vira Portable Text/rich text no CMS). */
  content?: string;

  // ----- Mídia -----
  /** Imagem de capa real (URL do CMS). Quando ausente, usa o "pôster" CSS. */
  coverImage?: string;
  /** Variante do pôster em gradiente do design original (placeholder visual). */
  coverVariant: string; // ex.: "img-1" ... "img-9"
  /** Emoji decorativo central do pôster (fidelidade ao design atual). */
  leaf?: string;
  /** Vídeo do post: link do YouTube, Vimeo ou arquivo .mp4. Carregamento lazy. */
  videoUrl?: string;
  /** Marca o post em destaque na home (hero). */
  featured?: boolean;

  // ----- Taxonomia -----
  category: string;
  tags: string[];
  /** Texto visível no selo do card. */
  badgeLabel: string;
  badgeVariant: BadgeVariant;

  // ----- Metadados editoriais -----
  author?: Author;
  rating: number; // ex.: 9.2
  readTime: number; // minutos
  status: PostStatus;
  publishedAt: string; // ISO
  updatedAt?: string; // ISO

  // ----- SEO (campos próprios por post, como pedido na proposta) -----
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string; // imagem específica de compartilhamento
}

export interface Collection {
  title: string;
  /** Slug da categoria/coleção para o link "Ver Todos". */
  href: string;
  posts: Post[];
}

// ===========================================================================
// EQUIPE — membros que ajudam a manter o blog, com papéis/permissões.
// ===========================================================================

/**
 * Papéis da equipe:
 * - Administrador: acesso total (posts, equipe, configurações).
 * - Editor: cria, edita e publica posts de qualquer autor.
 * - Autor: cria e edita os próprios posts (sai como rascunho).
 */
export type Role = "Administrador" | "Editor" | "Autor";

export type MemberStatus = "ativo" | "convidado";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  /** Cor do avatar (inicial) — só visual. */
  color: string;
  joinedAt: string; // ISO
}

// ===========================================================================
// COMENTÁRIOS — interação da audiência nos posts.
// ===========================================================================

export type CommentStatus = "aprovado" | "pendente";

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  text: string;
  createdAt: string; // ISO
  status: CommentStatus;
}

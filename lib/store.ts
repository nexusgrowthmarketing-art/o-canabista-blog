import fs from "node:fs";
import path from "node:path";
import { seedPosts, seedTeam } from "./seed";
import { getSupabaseAdmin } from "./supabase";
import type {
  BadgeVariant,
  Comment,
  CommentStatus,
  Post,
  PostStatus,
  Role,
  TeamMember,
} from "./types";

/**
 * Camada de dados. Duas implementações por trás da MESMA interface:
 *  - Supabase (quando NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY existem)
 *  - Arquivos JSON em /content (fallback de desenvolvimento)
 *
 * Os componentes/páginas não sabem qual está ativa. Trocar de um para o outro
 * é só ter (ou não) as variáveis de ambiente.
 */

// ===========================================================================
// Mapeadores  (banco snake_case  <->  app camelCase)
// ===========================================================================

interface PostRow {
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: string | null;
  cover_image: string | null;
  cover_variant: string;
  leaf: string | null;
  video_url: string | null;
  featured: boolean;
  category: string;
  tags: string[];
  badge_label: string;
  badge_variant: string;
  author_name: string;
  rating: number;
  read_time: number;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  social_image: string | null;
  published_at: string;
  updated_at: string;
}

function rowToPost(r: PostRow): Post {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? undefined,
    excerpt: r.excerpt ?? "",
    content: r.content ?? undefined,
    coverImage: r.cover_image ?? undefined,
    coverVariant: r.cover_variant,
    leaf: r.leaf ?? undefined,
    videoUrl: r.video_url ?? undefined,
    featured: r.featured,
    category: r.category,
    tags: r.tags ?? [],
    badgeLabel: r.badge_label,
    badgeVariant: r.badge_variant as BadgeVariant,
    author: { name: r.author_name, slug: "redacao" },
    rating: Number(r.rating),
    readTime: r.read_time,
    status: r.status as PostStatus,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    socialImage: r.social_image ?? undefined,
    publishedAt: r.published_at,
    updatedAt: r.updated_at,
  };
}

function postToRow(p: Post): PostRow {
  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? null,
    excerpt: p.excerpt ?? "",
    content: p.content ?? null,
    cover_image: p.coverImage ?? null,
    cover_variant: p.coverVariant,
    leaf: p.leaf ?? null,
    video_url: p.videoUrl ?? null,
    featured: p.featured ?? false,
    category: p.category,
    tags: p.tags ?? [],
    badge_label: p.badgeLabel,
    badge_variant: p.badgeVariant,
    author_name: p.author?.name ?? "Redação O Canabista",
    rating: p.rating,
    read_time: p.readTime,
    status: p.status,
    seo_title: p.seoTitle ?? null,
    seo_description: p.seoDescription ?? null,
    social_image: p.socialImage ?? null,
    published_at: p.publishedAt,
    updated_at: p.updatedAt ?? p.publishedAt,
  };
}

interface TeamRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  color: string;
  joined_at: string;
}

function rowToMember(r: TeamRow): TeamMember {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role as Role,
    status: r.status as TeamMember["status"],
    color: r.color,
    joinedAt: r.joined_at,
  };
}

function memberToRow(m: TeamMember): TeamRow {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    status: m.status,
    color: m.color,
    joined_at: m.joinedAt,
  };
}

interface CommentRow {
  id: string;
  post_slug: string;
  author: string;
  text: string;
  status: string;
  created_at: string;
}

function rowToComment(r: CommentRow): Comment {
  return {
    id: r.id,
    postSlug: r.post_slug,
    author: r.author,
    text: r.text,
    status: r.status as CommentStatus,
    createdAt: r.created_at,
  };
}

function commentToRow(c: Comment): CommentRow {
  return {
    id: c.id,
    post_slug: c.postSlug,
    author: c.author,
    text: c.text,
    status: c.status,
    created_at: c.createdAt,
  };
}

// ===========================================================================
// Fallback em arquivo (dev sem Supabase)
// ===========================================================================

const DATA_DIR = path.join(process.cwd(), "content");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const TEAM_FILE = path.join(DATA_DIR, "team.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function fileRead<T>(file: string, seedFn: () => T): T {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
    }
  } catch {
    /* arquivo corrompido — cai no seed */
  }
  const data = seedFn();
  try {
    ensureDir();
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    /* FS somente-leitura */
  }
  return data;
}

function fileWrite<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ===========================================================================
// API pública (assíncrona) — Supabase OU arquivo
// ===========================================================================

// ----- Posts -----
export async function readPosts(): Promise<Post[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) throw new Error(`Supabase readPosts: ${error.message}`);
    return (data as PostRow[]).map(rowToPost);
  }
  return fileRead<Post[]>(POSTS_FILE, seedPosts);
}

export async function upsertPost(post: Post): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb
      .from("posts")
      .upsert(postToRow(post), { onConflict: "slug" });
    if (error) throw new Error(`Supabase upsertPost: ${error.message}`);
    return;
  }
  const posts = fileRead<Post[]>(POSTS_FILE, seedPosts);
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  fileWrite(POSTS_FILE, posts);
}

export async function deletePostBySlug(slug: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("posts").delete().eq("slug", slug);
    if (error) throw new Error(`Supabase deletePost: ${error.message}`);
    return;
  }
  const posts = fileRead<Post[]>(POSTS_FILE, seedPosts).filter(
    (p) => p.slug !== slug,
  );
  fileWrite(POSTS_FILE, posts);
}

// ----- Equipe -----
export async function readTeam(): Promise<TeamMember[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("team")
      .select("*")
      .order("joined_at", { ascending: true });
    if (error) throw new Error(`Supabase readTeam: ${error.message}`);
    return (data as TeamRow[]).map(rowToMember);
  }
  return fileRead<TeamMember[]>(TEAM_FILE, seedTeam);
}

export async function upsertMember(member: TeamMember): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb
      .from("team")
      .upsert(memberToRow(member), { onConflict: "id" });
    if (error) throw new Error(`Supabase upsertMember: ${error.message}`);
    return;
  }
  const team = fileRead<TeamMember[]>(TEAM_FILE, seedTeam);
  const idx = team.findIndex((m) => m.id === member.id);
  if (idx >= 0) team[idx] = member;
  else team.push(member);
  fileWrite(TEAM_FILE, team);
}

export async function deleteMemberById(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("team").delete().eq("id", id);
    if (error) throw new Error(`Supabase deleteMember: ${error.message}`);
    return;
  }
  const team = fileRead<TeamMember[]>(TEAM_FILE, seedTeam).filter(
    (m) => m.id !== id,
  );
  fileWrite(TEAM_FILE, team);
}

// ----- Estampas: curtidas (voto da audiência) -----
const LIKES_FILE = path.join(DATA_DIR, "estampa-likes.json");

export async function readEstampaLikes(): Promise<Record<string, number>> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from("estampa_likes").select("slug, count");
    if (error) throw new Error(`Supabase readEstampaLikes: ${error.message}`);
    const out: Record<string, number> = {};
    for (const r of data as { slug: string; count: number }[]) {
      out[r.slug] = Number(r.count);
    }
    return out;
  }
  try {
    if (fs.existsSync(LIKES_FILE)) {
      return JSON.parse(fs.readFileSync(LIKES_FILE, "utf-8")) as Record<
        string,
        number
      >;
    }
  } catch {
    /* arquivo ausente/corrompido */
  }
  return {};
}

export async function addEstampaLike(slug: string): Promise<number> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data } = await sb
      .from("estampa_likes")
      .select("count")
      .eq("slug", slug)
      .maybeSingle();
    const next = Number(data?.count ?? 0) + 1;
    const { error } = await sb
      .from("estampa_likes")
      .upsert({ slug, count: next }, { onConflict: "slug" });
    if (error) throw new Error(`Supabase addEstampaLike: ${error.message}`);
    return next;
  }
  const likes = await readEstampaLikes();
  likes[slug] = (likes[slug] ?? 0) + 1;
  try {
    ensureDir();
    fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2), "utf-8");
  } catch {
    /* FS somente-leitura em produção (até o Supabase entrar) */
  }
  return likes[slug];
}

// ----- Comentários -----
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

export async function getAllComments(): Promise<Comment[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase getAllComments: ${error.message}`);
    return (data as CommentRow[]).map(rowToComment);
  }
  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      return JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8")) as Comment[];
    }
  } catch {
    /* arquivo ausente/corrompido */
  }
  return [];
}

export async function getCommentsByPost(slug: string): Promise<Comment[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("comments")
      .select("*")
      .eq("post_slug", slug)
      .eq("status", "aprovado")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase getCommentsByPost: ${error.message}`);
    return (data as CommentRow[]).map(rowToComment);
  }
  const all = await getAllComments();
  return all
    .filter((c) => c.postSlug === slug && c.status === "aprovado")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function addComment(comment: Comment): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("comments").insert(commentToRow(comment));
    if (error) throw new Error(`Supabase addComment: ${error.message}`);
    return;
  }
  const all = await getAllComments();
  all.unshift(comment);
  try {
    ensureDir();
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    /* FS somente-leitura em produção (até o Supabase entrar) */
  }
}

export async function deleteComment(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("comments").delete().eq("id", id);
    if (error) throw new Error(`Supabase deleteComment: ${error.message}`);
    return;
  }
  const all = (await getAllComments()).filter((c) => c.id !== id);
  try {
    ensureDir();
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    /* FS somente-leitura */
  }
}

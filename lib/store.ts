import fs from "node:fs";
import path from "node:path";
import { seedPosts, seedTeam } from "./seed";
import { getSupabaseAdmin } from "./supabase";
import type { BadgeVariant, Post, PostStatus, Role, TeamMember } from "./types";

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

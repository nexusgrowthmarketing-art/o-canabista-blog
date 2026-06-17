import fs from "node:fs";
import path from "node:path";
import { seedPosts, seedTeam } from "./seed";
import type { Post, TeamMember } from "./types";

/**
 * "Banco" em arquivo (JSON) — fonte única de verdade do conteúdo.
 *
 * Funciona 100% em desenvolvimento (o painel cria/edita/exclui e persiste).
 * Em produção na Vercel o sistema de arquivos é somente-leitura: a leitura
 * funciona (o site mostra o conteúdo), mas a escrita só passa a persistir
 * quando trocarmos este arquivo por um banco real (Supabase/Payload) —
 * é a única peça que muda. As assinaturas abaixo continuam iguais.
 */

const DATA_DIR = path.join(process.cwd(), "content");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const TEAM_FILE = path.join(DATA_DIR, "team.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string, seedFn: () => T): T {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
    }
  } catch {
    // arquivo corrompido — cai no seed
  }
  const data = seedFn();
  try {
    ensureDir();
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // FS somente-leitura (produção) — segue com o seed em memória
  }
  return data;
}

function writeJson<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// ----- Posts -----
export function readPosts(): Post[] {
  return readJson<Post[]>(POSTS_FILE, seedPosts);
}

export function writePosts(posts: Post[]) {
  writeJson(POSTS_FILE, posts);
}

export function upsertPost(post: Post) {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.slug === post.slug);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  writePosts(posts);
}

export function deletePostBySlug(slug: string) {
  writePosts(readPosts().filter((p) => p.slug !== slug));
}

// ----- Equipe -----
export function readTeam(): TeamMember[] {
  return readJson<TeamMember[]>(TEAM_FILE, seedTeam);
}

export function writeTeam(team: TeamMember[]) {
  writeJson(TEAM_FILE, team);
}

export function upsertMember(member: TeamMember) {
  const team = readTeam();
  const idx = team.findIndex((m) => m.id === member.id);
  if (idx >= 0) team[idx] = member;
  else team.push(member);
  writeTeam(team);
}

export function deleteMemberById(id: string) {
  writeTeam(readTeam().filter((m) => m.id !== id));
}

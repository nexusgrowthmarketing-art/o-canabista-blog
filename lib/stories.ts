import fs from "node:fs";
import path from "node:path";
import { getSupabaseAdmin } from "./supabase";

/**
 * Stories 48h (estilo Instagram). O Marcos sobe, fica 48h no ar e some sozinho.
 * Aparecem na "head" da home.
 *
 * Armazenamento: Supabase (tabela `stories`) quando configurado; senão, arquivo
 * (content/stories.json) para o dev. Os EXEMPLOS abaixo são fixos no código e
 * sempre aparecem na vitrine — não ficam no banco.
 */

export type StoryType = "image" | "video" | "gradient";

export interface Story {
  id: string;
  type: StoryType;
  /** URL da imagem/vídeo. Vazio quando é um story "gradiente" (exemplo). */
  mediaUrl?: string;
  /** Pôster em gradiente (img-1..9) para exemplos sem mídia externa. */
  variant?: string;
  emoji?: string;
  caption?: string;
  createdAt: string; // ISO
  expiresAt: string; // ISO (createdAt + 48h)
  sample?: boolean;
}

const DATA_DIR = path.join(process.cwd(), "content");
const STORIES_FILE = path.join(DATA_DIR, "stories.json");

const FUTURO = "2099-01-01T00:00:00.000Z";

/** Exemplos sempre visíveis (não expiram) para a vitrine ficar viva. */
const SAMPLES: Story[] = [
  {
    id: "s-sample-1",
    type: "gradient",
    variant: "img-4",
    emoji: "🌿",
    caption: "Bem-vindo ao O Canabista! Aqui a cultura tá viva.",
    createdAt: "2026-06-16T12:00:00.000Z",
    expiresAt: FUTURO,
    sample: true,
  },
  {
    id: "s-sample-2",
    type: "gradient",
    variant: "img-7",
    emoji: "🔥",
    caption: "Novidades da semana chegando…",
    createdAt: "2026-06-16T12:00:00.000Z",
    expiresAt: FUTURO,
    sample: true,
  },
  {
    id: "s-sample-3",
    type: "gradient",
    variant: "img-2",
    emoji: "🎬",
    caption: "Bastidores e PUFFERtv em breve.",
    createdAt: "2026-06-16T12:00:00.000Z",
    expiresAt: FUTURO,
    sample: true,
  },
];

// ----- Mapeadores (banco snake_case <-> app camelCase) -----
interface StoryRow {
  id: string;
  type: string;
  media_url: string | null;
  variant: string | null;
  emoji: string | null;
  caption: string | null;
  created_at: string;
  expires_at: string;
  sample: boolean;
}

function rowToStory(r: StoryRow): Story {
  return {
    id: r.id,
    type: r.type as StoryType,
    mediaUrl: r.media_url ?? undefined,
    variant: r.variant ?? undefined,
    emoji: r.emoji ?? undefined,
    caption: r.caption ?? undefined,
    createdAt: r.created_at,
    expiresAt: r.expires_at,
    sample: r.sample || undefined,
  };
}

function storyToRow(s: Story): StoryRow {
  return {
    id: s.id,
    type: s.type,
    media_url: s.mediaUrl ?? null,
    variant: s.variant ?? null,
    emoji: s.emoji ?? null,
    caption: s.caption ?? null,
    created_at: s.createdAt,
    expires_at: s.expiresAt,
    sample: s.sample ?? false,
  };
}

// ----- Fallback em arquivo (dev sem Supabase) -----
function readFileStories(): Story[] {
  try {
    if (fs.existsSync(STORIES_FILE)) {
      return JSON.parse(fs.readFileSync(STORIES_FILE, "utf-8")) as Story[];
    }
  } catch {
    /* arquivo ausente/corrompido */
  }
  return [];
}

function writeFileStories(stories: Story[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2), "utf-8");
}

/** Stories armazenados (sem os exemplos) — Supabase OU arquivo. */
async function readStored(): Promise<Story[]> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { data, error } = await sb
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase readStories: ${error.message}`);
    return (data as StoryRow[]).map(rowToStory);
  }
  return readFileStories();
}

/** Stories ativos (não expirados), mais recentes primeiro, com os exemplos. */
export async function getActiveStories(nowMs: number): Promise<Story[]> {
  const reais = (await readStored()).filter(
    (s) => +new Date(s.expiresAt) > nowMs,
  );
  const todos = [...reais, ...SAMPLES];
  return todos.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

/** Todos (uso do painel), inclusive expirados, exceto exemplos. */
export async function getAllStories(): Promise<Story[]> {
  return (await readStored()).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function addStory(input: {
  type: StoryType;
  mediaUrl?: string;
  caption?: string;
  nowMs: number;
}): Promise<Story> {
  const created = new Date(input.nowMs);
  const expires = new Date(input.nowMs + 48 * 60 * 60 * 1000);
  const story: Story = {
    id: `st-${input.nowMs}-${Math.floor(Math.random() * 1e6)}`,
    type: input.type,
    mediaUrl: input.mediaUrl,
    caption: input.caption,
    createdAt: created.toISOString(),
    expiresAt: expires.toISOString(),
  };

  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("stories").insert(storyToRow(story));
    if (error) throw new Error(`Supabase addStory: ${error.message}`);
    return story;
  }

  const stories = readFileStories();
  stories.unshift(story);
  try {
    writeFileStories(stories);
  } catch {
    /* FS somente-leitura em produção */
  }
  return story;
}

export async function deleteStory(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  if (sb) {
    const { error } = await sb.from("stories").delete().eq("id", id);
    if (error) throw new Error(`Supabase deleteStory: ${error.message}`);
    return;
  }
  const stories = readFileStories().filter((s) => s.id !== id);
  try {
    writeFileStories(stories);
  } catch {
    /* FS somente-leitura */
  }
}

export function isExpired(story: Story, nowMs: number): boolean {
  return +new Date(story.expiresAt) <= nowMs;
}

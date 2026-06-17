import fs from "node:fs";
import path from "node:path";

/**
 * Stories 48h (estilo Instagram). O Marcos sobe, fica 48h no ar e some sozinho.
 * Aparecem na "head" da home.
 *
 * Armazenamento em arquivo (content/stories.json). Funciona 100% em dev;
 * em produção (FS somente-leitura) a leitura funciona (mostra os exemplos e o
 * que estiver no arquivo versionado) e a escrita migra para o banco/Storage
 * do Supabase junto com o resto.
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

function readFile(): Story[] {
  try {
    if (fs.existsSync(STORIES_FILE)) {
      return JSON.parse(fs.readFileSync(STORIES_FILE, "utf-8")) as Story[];
    }
  } catch {
    /* arquivo ausente/corrompido */
  }
  return [];
}

function writeFile(stories: Story[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORIES_FILE, JSON.stringify(stories, null, 2), "utf-8");
}

/** Stories ativos (não expirados), mais recentes primeiro, com os exemplos. */
export function getActiveStories(nowMs: number): Story[] {
  const reais = readFile().filter((s) => +new Date(s.expiresAt) > nowMs);
  const todos = [...reais, ...SAMPLES];
  return todos.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

/** Todos (uso do painel), inclusive expirados, exceto exemplos. */
export function getAllStories(): Story[] {
  return readFile().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export function addStory(input: {
  type: StoryType;
  mediaUrl?: string;
  caption?: string;
  nowMs: number;
}): Story {
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
  const stories = readFile();
  stories.unshift(story);
  try {
    writeFile(stories);
  } catch {
    /* FS somente-leitura em produção */
  }
  return story;
}

export function deleteStory(id: string) {
  const stories = readFile().filter((s) => s.id !== id);
  try {
    writeFile(stories);
  } catch {
    /* FS somente-leitura */
  }
}

export function isExpired(story: Story, nowMs: number): boolean {
  return +new Date(story.expiresAt) <= nowMs;
}

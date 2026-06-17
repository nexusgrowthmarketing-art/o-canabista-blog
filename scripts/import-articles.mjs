import fs from "node:fs";
import path from "node:path";

/**
 * Importa o conteúdo dos artigos escritos pelo workflow de redação para
 * content/posts.json — lendo os .jsonl do workflow (sem passar pelo contexto).
 * Uso: node scripts/import-articles.mjs "<dir-do-workflow>"
 */
const wfDir = process.argv[2];
if (!wfDir || !fs.existsSync(wfDir)) {
  console.error("Dir do workflow inválido:", wfDir);
  process.exit(1);
}

const root = process.cwd();
const postsFile = path.join(root, "content", "posts.json");
const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
const validSlugs = new Set(posts.map((p) => p.slug));

const articles = {}; // slug -> melhor content

function consider(obj) {
  if (Array.isArray(obj)) {
    for (const it of obj) consider(it);
    return;
  }
  if (obj && typeof obj === "object") {
    const { slug, content } = obj;
    if (
      typeof slug === "string" &&
      typeof content === "string" &&
      validSlugs.has(slug) &&
      content.includes("<") // parece HTML de artigo
    ) {
      if (!articles[slug] || content.length > articles[slug].length) {
        articles[slug] = content;
      }
    }
    for (const k of Object.keys(obj)) consider(obj[k]);
  }
}

const files = fs.readdirSync(wfDir).filter((f) => f.endsWith(".jsonl"));
for (const f of files) {
  const lines = fs
    .readFileSync(path.join(wfDir, f), "utf-8")
    .split("\n")
    .filter(Boolean);
  for (const line of lines) {
    try {
      consider(JSON.parse(line));
    } catch {
      /* linha não-JSON */
    }
  }
}

let updated = 0;
const now = new Date().toISOString();
for (const p of posts) {
  if (articles[p.slug]) {
    p.content = articles[p.slug];
    p.updatedAt = now;
    updated++;
  }
}
fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");

const faltam = posts.filter((p) => !articles[p.slug]).map((p) => p.slug);
console.log(
  `Artigos encontrados: ${Object.keys(articles).length} | posts atualizados: ${updated}/${posts.length}`,
);
if (faltam.length) console.log("Ainda com texto de exemplo:", faltam.join(", "));

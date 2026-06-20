// Script pontual: publica UM post (por slug) do content/posts.json no Supabase.
// Reaproveita o mapeamento camelCase -> snake_case do lib/store.ts.
// Uso: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/_publish-one.mjs <slug>
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const slug = process.argv[2];
if (!slug) throw new Error("informe o slug");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("faltam env vars do Supabase");

const posts = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "content", "posts.json"), "utf-8"),
);
const p = posts.find((x) => x.slug === slug);
if (!p) throw new Error(`post "${slug}" não encontrado em posts.json`);

const row = {
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

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await sb.from("posts").upsert(row, { onConflict: "slug" });
if (error) throw new Error(`upsert falhou: ${error.message}`);
console.log(`OK: "${p.title}" publicado no Supabase.`);

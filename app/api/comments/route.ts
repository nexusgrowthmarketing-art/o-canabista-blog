import { NextResponse } from "next/server";
import { addComment, getCommentsByPost } from "@/lib/store";
import type { Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Lista os comentários aprovados de um post: /api/comments?slug=... */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")?.trim() ?? "";
  if (!slug) return NextResponse.json({ comments: [] });
  const comments = await getCommentsByPost(slug);
  return NextResponse.json({ comments });
}

/** Publica um comentário. Body JSON: { slug, author, text, website (honeypot) }. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const slug = (body.slug ?? "").toString().trim();
  const author = (body.author ?? "").toString().trim().slice(0, 60);
  const text = (body.text ?? "").toString().trim().slice(0, 1000);
  const honeypot = (body.website ?? "").toString();

  // Bot preencheu o campo escondido → descarta silenciosamente.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!slug || author.length < 2 || text.length < 2) {
    return NextResponse.json({ error: "Campos inválidos." }, { status: 400 });
  }

  const comment: Comment = {
    id: `c-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    postSlug: slug,
    author,
    text,
    createdAt: new Date().toISOString(),
    status: "aprovado",
  };

  await addComment(comment);
  return NextResponse.json({ comment });
}

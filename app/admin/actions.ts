"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAnyPostBySlug, slugify } from "@/lib/posts";
import {
  deleteMemberById,
  deletePostBySlug,
  upsertMember,
  upsertPost,
} from "@/lib/store";
import type { BadgeVariant, Post, PostStatus, Role, TeamMember } from "@/lib/types";

const AVATAR_COLORS = [
  "#4ade80",
  "#d4af37",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
];

function str(form: FormData, key: string): string {
  return (form.get(key) ?? "").toString().trim();
}

function revalidateAll() {
  // Site pequeno: revalida tudo para refletir mudanças na home, posts e categorias.
  revalidatePath("/", "layout");
}

/** Cria ou atualiza um post a partir do formulário do editor. */
export async function savePost(form: FormData) {
  const originalSlug = str(form, "originalSlug");
  const title = str(form, "title");
  if (!title) redirect("/admin/posts/new?erro=titulo");

  let slug = slugify(str(form, "slug") || title);
  // Evita colisão de slug com OUTRO post.
  const collision = await getAnyPostBySlug(slug);
  if (collision && collision.slug !== originalSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const existing = originalSlug
    ? await getAnyPostBySlug(originalSlug)
    : undefined;
  const now = new Date().toISOString();
  const status = (str(form, "status") || "rascunho") as PostStatus;

  const tags = str(form, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const category = str(form, "category") || "Cultivo";

  const post: Post = {
    slug,
    title,
    subtitle: str(form, "subtitle") || undefined,
    excerpt: str(form, "excerpt"),
    content: str(form, "content"),
    coverImage: str(form, "coverImage") || undefined,
    coverVariant: str(form, "coverVariant") || "img-1",
    leaf: str(form, "leaf") || "🌿",
    videoUrl: str(form, "videoUrl") || undefined,
    featured: form.get("featured") === "on",
    category,
    tags: tags.length ? tags : [category],
    badgeLabel: str(form, "badgeLabel") || category,
    badgeVariant: (str(form, "badgeVariant") || "default") as BadgeVariant,
    author: {
      name: str(form, "authorName") || "Redação O Canabista",
      slug: "redacao",
    },
    rating: Number(str(form, "rating") || "8.5"),
    readTime: Number(str(form, "readTime") || "5"),
    status,
    publishedAt: existing?.publishedAt ?? now,
    updatedAt: now,
    seoTitle: str(form, "seoTitle") || title,
    seoDescription: str(form, "seoDescription") || str(form, "excerpt"),
    socialImage: str(form, "socialImage") || undefined,
  };

  // Se o slug mudou, remove o antigo antes de gravar o novo.
  if (originalSlug && originalSlug !== slug) {
    await deletePostBySlug(originalSlug);
  }

  await upsertPost(post);
  revalidateAll();
  redirect("/admin/posts");
}

/** Exclui um post. */
export async function deletePost(form: FormData) {
  const slug = str(form, "slug");
  if (slug) {
    await deletePostBySlug(slug);
    revalidateAll();
  }
  redirect("/admin/posts");
}

/** Adiciona/convida um membro da equipe. */
export async function addMember(form: FormData) {
  const name = str(form, "name");
  const email = str(form, "email");
  if (!name || !email) redirect("/admin/equipe?erro=campos");

  const member: TeamMember = {
    id: `u-${Date.now()}`,
    name,
    email,
    role: (str(form, "role") || "Autor") as Role,
    status: "convidado",
    color: AVATAR_COLORS[Math.floor(name.length % AVATAR_COLORS.length)],
    joinedAt: new Date().toISOString(),
  };
  await upsertMember(member);
  revalidatePath("/admin/equipe");
  redirect("/admin/equipe");
}

/** Remove um membro da equipe. */
export async function removeMember(form: FormData) {
  const id = str(form, "id");
  if (id) {
    await deleteMemberById(id);
    revalidatePath("/admin/equipe");
  }
  redirect("/admin/equipe");
}

/** Login simples por senha (protótipo). Troca por auth real com o CMS/banco. */
export async function login(form: FormData) {
  const password = str(form, "password");
  const expected = process.env.ADMIN_PASSWORD ?? "canabista";
  if (password !== expected) {
    redirect("/login?erro=1");
  }
  const jar = await cookies();
  jar.set("ocb_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete("ocb_admin");
  redirect("/login");
}

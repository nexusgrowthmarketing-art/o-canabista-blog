"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addEstampaLike } from "@/lib/store";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Ações do site público: newsletter e contato.
 * Gravam no Supabase quando configurado; senão em arquivo (best-effort).
 * Em qualquer falha o usuário ainda recebe a confirmação — não travamos a UX.
 */
function append(file: string, entry: Record<string, unknown>) {
  try {
    const dir = path.join(process.cwd(), "content");
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, file);
    const arr = fs.existsSync(p)
      ? (JSON.parse(fs.readFileSync(p, "utf-8")) as unknown[])
      : [];
    arr.push(entry);
    fs.writeFileSync(p, JSON.stringify(arr, null, 2), "utf-8");
  } catch {
    /* FS somente-leitura — segue o baile */
  }
}

/** Salva um assinante (Supabase OU arquivo). Best-effort: nunca lança. */
async function saveSubscriber(email: string) {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      const { error } = await sb
        .from("subscribers")
        .upsert({ email }, { onConflict: "email" });
      if (!error) return;
    } catch {
      /* cai no arquivo */
    }
  }
  append("subscribers.json", { email, at: new Date().toISOString() });
}

/** Salva uma mensagem de contato (Supabase OU arquivo). Best-effort. */
async function saveMessage(m: { nome: string; email: string; mensagem: string }) {
  const sb = getSupabaseAdmin();
  if (sb) {
    try {
      const { error } = await sb.from("messages").insert(m);
      if (!error) return;
    } catch {
      /* cai no arquivo */
    }
  }
  append("messages.json", { ...m, at: new Date().toISOString() });
}

export async function subscribeNewsletter(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  if (email) {
    await saveSubscriber(email);
  }
  redirect("/newsletter?ok=1");
}

export async function likeEstampa(slug: string): Promise<number> {
  const count = await addEstampaLike(slug);
  revalidatePath("/estampas");
  return count;
}

export async function subscribeInline(
  email: string,
): Promise<{ ok: boolean }> {
  const e = (email ?? "").toString().trim();
  if (!e || !e.includes("@") || e.length < 5) return { ok: false };
  await saveSubscriber(e);
  return { ok: true };
}

export async function sendContato(formData: FormData) {
  const nome = (formData.get("nome") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const mensagem = (formData.get("mensagem") ?? "").toString().trim();
  if (nome && email && mensagem) {
    await saveMessage({ nome, email, mensagem });
  }
  redirect("/contato?ok=1");
}

"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addEstampaLike } from "@/lib/store";

/**
 * Ações do site público: newsletter e contato.
 * Gravam em arquivo (best-effort). Em produção (FS somente-leitura) a gravação
 * é ignorada e o usuário ainda recebe a confirmação — depois plugamos um
 * serviço de e-mail/CRM real (Resend, Mailchimp, etc.).
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

export async function subscribeNewsletter(formData: FormData) {
  const email = (formData.get("email") ?? "").toString().trim();
  if (email) {
    append("subscribers.json", { email, at: new Date().toISOString() });
  }
  redirect("/newsletter?ok=1");
}

export async function likeEstampa(slug: string): Promise<number> {
  const count = await addEstampaLike(slug);
  revalidatePath("/estampas");
  return count;
}

export async function sendContato(formData: FormData) {
  const nome = (formData.get("nome") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const mensagem = (formData.get("mensagem") ?? "").toString().trim();
  if (nome && email && mensagem) {
    append("messages.json", { nome, email, mensagem, at: new Date().toISOString() });
  }
  redirect("/contato?ok=1");
}

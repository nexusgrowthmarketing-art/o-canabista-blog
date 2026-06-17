import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { seedPosts, seedTeam } from "@/lib/seed";
import { readPosts, readTeam, upsertMember, upsertPost } from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Popula o banco (Supabase) com o conteúdo inicial — uma única vez.
 * Idempotente: só insere se as tabelas estiverem vazias.
 * Protegido por token: /api/seed?token=SENHA_DO_PAINEL
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const expected = process.env.ADMIN_PASSWORD ?? "canabista";
  if (token !== expected) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado (faltam variáveis de ambiente)" },
      { status: 400 },
    );
  }

  const existingPosts = await readPosts();
  const existingTeam = await readTeam();

  let postsInserted = 0;
  let teamInserted = 0;

  if (existingPosts.length === 0) {
    for (const p of seedPosts()) {
      await upsertPost(p);
      postsInserted++;
    }
  }
  if (existingTeam.length === 0) {
    for (const m of seedTeam()) {
      await upsertMember(m);
      teamInserted++;
    }
  }

  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    postsInserted,
    teamInserted,
    totalPosts: (await readPosts()).length,
    totalTeam: (await readTeam()).length,
  });
}

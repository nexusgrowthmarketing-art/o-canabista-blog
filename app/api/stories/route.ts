import { NextResponse } from "next/server";
import { getActiveStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

/** Stories ativos (não expirados) para a head da home. */
export async function GET() {
  const stories = getActiveStories(Date.now());
  return NextResponse.json({ stories });
}

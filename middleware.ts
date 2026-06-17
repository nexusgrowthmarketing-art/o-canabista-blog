import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protege o painel: qualquer rota /admin exige o cookie de sessão.
 * Sem cookie → redireciona para /login. Também marca o admin como noindex.
 */
export function middleware(req: NextRequest) {
  const authed = req.cookies.get("ocb_admin")?.value === "1";

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};

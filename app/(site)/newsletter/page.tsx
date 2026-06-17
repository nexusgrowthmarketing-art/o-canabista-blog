import type { Metadata } from "next";
import { subscribeNewsletter } from "@/app/(site)/actions";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Receba os melhores conteúdos do O Canabista no seu e-mail.",
  alternates: { canonical: "/newsletter" },
};

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;

  return (
    <main className="page-wrap">
      <article className="post-article">
        <header className="post-header">
          <span className="post-eyebrow">Newsletter</span>
          <h1 className="post-title">Newsletter Semanal Canabista</h1>
          <div className="post-meta">
            <span>Cultura, cultivo e novidades — toda sexta no seu e-mail.</span>
          </div>
        </header>

        <div className="post-content">
          {ok ? (
            <div className="form-ok">
              ✅ Inscrição recebida! Em breve você recebe os conteúdos do{" "}
              {siteConfig.name}. 🌿
            </div>
          ) : (
            <>
              <p>
                Sem spam — só o melhor sobre o universo canábico, uma vez por
                semana. Cancele quando quiser.
              </p>
              <form className="site-form" action={subscribeNewsletter}>
                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  required
                  aria-label="Seu e-mail"
                />
                <button type="submit" className="estampa-buy">
                  Assinar Grátis →
                </button>
              </form>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
                Conteúdo educativo · Maiores de 18 anos.
              </p>
            </>
          )}
        </div>
      </article>
    </main>
  );
}

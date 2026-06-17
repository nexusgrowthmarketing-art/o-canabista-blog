import type { Metadata } from "next";
import { sendContato } from "@/app/(site)/actions";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com o ${siteConfig.name} — parcerias, imprensa e dúvidas.`,
  alternates: { canonical: "/contato" },
};

export default async function ContatoPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;

  return (
    <main className="page-wrap">
      <article className="post-article">
        <header className="post-header">
          <span className="post-eyebrow">Contato</span>
          <h1 className="post-title">Fale com a gente</h1>
          <div className="post-meta">
            <span>Parcerias, imprensa, publi e ideias.</span>
          </div>
        </header>

        <div className="post-content">
          {ok ? (
            <div className="form-ok">
              ✅ Mensagem enviada! Obrigado pelo contato — retornamos em breve. 🌿
            </div>
          ) : (
            <>
              <p>
                Para parcerias e publicidade, fale direto com{" "}
                <strong>{siteConfig.creator.name}</strong> (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteConfig.creator.handle}
                </a>
                ) ou use o formulário abaixo.
              </p>
              <form className="site-form site-form-col" action={sendContato}>
                <input type="text" name="nome" placeholder="Seu nome" required />
                <input
                  type="email"
                  name="email"
                  placeholder="Seu e-mail"
                  required
                />
                <textarea
                  name="mensagem"
                  placeholder="Sua mensagem"
                  rows={5}
                  required
                />
                <button type="submit" className="estampa-buy">
                  Enviar mensagem
                </button>
              </form>
            </>
          )}
        </div>
      </article>
    </main>
  );
}

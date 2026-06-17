import type { Metadata } from "next";
import Image from "next/image";
import EstampaLike from "@/components/EstampaLike";
import { getEstampas } from "@/lib/estampas";
import { siteConfig } from "@/lib/site";
import { readEstampaLikes } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estampas",
  description:
    "Galeria de estampas e artes do O Canabista — curta a sua favorita e ajude a escolher a próxima peça.",
  alternates: { canonical: "/estampas" },
};

export default async function EstampasPage() {
  const likes = await readEstampaLikes();
  const estampas = getEstampas()
    .map((e) => ({ ...e, likes: likes[e.slug] ?? 0 }))
    .sort((a, b) => b.likes - a.likes);

  const campea = estampas[0]?.likes > 0 ? estampas[0].slug : null;

  return (
    <main className="page-wrap">
      <div className="section-head">
        <h1>Estampas</h1>
        <p>
          Artes autorais do O Canabista. <strong>Curta a sua favorita</strong> —
          a galera ajuda a decidir qual vira a próxima peça. 🌿
        </p>
      </div>

      <div className="estampas-grid">
        {estampas.map((e) => (
          <article key={e.slug} className="estampa-card">
            <div className={`estampa-img ${e.variant}`}>
              {e.image ? (
                <Image
                  src={e.image}
                  alt={e.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <>
                  <div className="img-pattern" />
                  <div className="img-leaf">{e.emoji}</div>
                </>
              )}
              {e.slug === campea && (
                <span className="estampa-top">🔥 Mais curtida</span>
              )}
              {e.sample && <span className="estampa-flag">exemplo</span>}
            </div>
            <div className="estampa-body">
              <h3>{e.title}</h3>
              <p>{e.description}</p>
              <div className="estampa-foot">
                <EstampaLike slug={e.slug} initial={e.likes} />
                <span className="estampa-tag">Coleção</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="estampas-note">
        🎨 As artes acima são <strong>exemplos</strong>. As estampas reais do{" "}
        {siteConfig.creator.name} entram aqui — é só subir as imagens pelo painel
        (ou me mandar os arquivos). As curtidas mostram qual a audiência mais
        gostou.
      </p>
    </main>
  );
}

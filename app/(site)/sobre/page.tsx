import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quem Somos",
  description: `Conheça o ${siteConfig.name}, criado por ${siteConfig.creator.name} — ${siteConfig.tagline}.`,
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  const { creator, social, name, tagline } = siteConfig;

  return (
    <main className="page-wrap">
      <article className="post-article">
        <header className="post-header">
          <span className="post-eyebrow">Sobre</span>
          <h1 className="post-title">Quem Somos</h1>
          <div className="post-meta">
            <strong>{name}</strong>
            <span className="dot" />
            <span>{tagline}</span>
          </div>
        </header>

        <div className="post-content">
          <p>
            O <strong>{name}</strong> é um espaço dedicado à cultura, ao cultivo
            e ao conhecimento canábico — conteúdo educativo, para maiores de 18
            anos, sempre com responsabilidade.
          </p>

          <h2>O criador</h2>
          <p>
            Por trás do projeto está <strong>{creator.name}</strong> (
            {creator.handle}), {creator.role.toLowerCase()} que leva a cultura
            canábica para milhares de pessoas com bom humor, informação e
            estilo. O conteúdo nasce do dia a dia, das viagens e da comunidade
            que acompanha a marca.
          </p>

          <h2>O que você encontra aqui</h2>
          <p>
            Guias de cultivo, perfis de variedades, ciência do CBD, história e
            cultura, além das <Link href="/estampas">estampas</Link> autorais do
            O Canabista. Tudo com curadoria e linguagem acessível.
          </p>

          <h2>Vamos conversar</h2>
          <p>
            Acompanhe no Instagram{" "}
            <a href={social.instagram} target="_blank" rel="noopener noreferrer">
              {creator.handle}
            </a>
            , no YouTube e em{" "}
            <a href={social.site} target="_blank" rel="noopener noreferrer">
              ocanabista.info
            </a>
            . Para parcerias e imprensa, fale com a gente pela{" "}
            <Link href="/contato">página de contato</Link>.
          </p>
          <p>
            <em>Conteúdo educativo · Maiores de 18 anos · Cultive consciência.</em>
          </p>
        </div>
      </article>
    </main>
  );
}

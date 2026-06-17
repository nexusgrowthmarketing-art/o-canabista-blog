/**
 * Configuração global do site.
 * Centraliza nome, URL e metadados base usados por SEO, sitemap, robots e OG.
 */
export const siteConfig = {
  name: "O Canabista",
  tagline: "Cultura, Cultivo & Conhecimento",
  description:
    "O destino definitivo para quem busca conhecimento sobre cultivo, cultura e o universo canábico. Conteúdo educativo, sempre atualizado.",
  // Definida via env em produção (NEXT_PUBLIC_SITE_URL). Fallback só para dev.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ocanabista.com.br",
  locale: "pt-BR",
  // Imagem padrão de compartilhamento (coloque um /public/og-default.png 1200x630).
  ogImage: "/og-default.png",
  nav: [
    { label: "Início", href: "/" },
    { label: "Cultivo", href: "/categoria/cultivo" },
    { label: "Variedades", href: "/categoria/variedades" },
    { label: "Cultura", href: "/categoria/cultura" },
    { label: "Medicinal", href: "/categoria/medicinal" },
    { label: "Receitas", href: "/categoria/receitas" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

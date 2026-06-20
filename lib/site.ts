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
  // Imagem padrão de compartilhamento (1200x630). Gerada dinamicamente em /og
  // via next/og (PNG real, compatível com WhatsApp/Facebook/X).
  ogImage: "/og",
  // Criador / responsável pela marca (perfil real).
  creator: {
    name: "Marcos Meress",
    handle: "@o.canabista",
    role: "Criador de conteúdo digital",
    sponsor: "@pufferfish.supply",
  },
  social: {
    instagram: "https://www.instagram.com/o.canabista/",
    youtube: "https://www.youtube.com/@o.canabista",
    site: "https://ocanabista.info",
  },
  nav: [
    { label: "Início", href: "/" },
    { label: "Cultivo", href: "/categoria/cultivo" },
    { label: "Variedades", href: "/categoria/variedades" },
    { label: "Cultura", href: "/categoria/cultura" },
    { label: "Medicinal", href: "/categoria/medicinal" },
    { label: "Estampas", href: "/estampas" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

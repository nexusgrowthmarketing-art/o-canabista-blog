import type { BadgeVariant, Post, TeamMember } from "./types";

/**
 * Conteúdo inicial (semente). Usado para popular o "banco" em arquivo
 * (content/posts.json e content/team.json) na primeira execução.
 */

interface SeedPost {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  coverVariant: string;
  leaf?: string;
  category: string;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  rating: number;
  readTime: number;
  featured?: boolean;
  videoUrl?: string;
}

const seed: SeedPost[] = [
  {
    slug: "guia-definitivo-cultivo-indoor",
    title: "Guia Definitivo do Cultivo Indoor",
    subtitle: "Da germinação à colheita",
    excerpt:
      "Tudo o que você precisa saber para montar seu espaço de cultivo, escolher iluminação, controlar temperatura e umidade, e maximizar a produção da sua planta.",
    coverVariant: "img-4",
    leaf: "🌿",
    category: "Cultivo",
    badgeLabel: "Em Destaque",
    badgeVariant: "default",
    rating: 9.2,
    readTime: 15,
    featured: true,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    slug: "iluminacao-led-vs-hps",
    title: "Iluminação LED vs HPS",
    excerpt:
      "Comparativo completo entre LED e HPS: consumo, calor, espectro e custo-benefício para cada fase do cultivo.",
    coverVariant: "img-1",
    leaf: "🌱",
    category: "Cultivo",
    badgeLabel: "Cultivo",
    badgeVariant: "default",
    rating: 8.9,
    readTime: 12,
  },
  {
    slug: "top-10-strains-2026",
    title: "Top 10 Strains de 2026",
    excerpt:
      "As variedades mais buscadas do ano, com perfis de aroma, efeitos e dificuldade de cultivo.",
    coverVariant: "img-2",
    leaf: "🌿",
    category: "Variedades",
    badgeLabel: "Premium",
    badgeVariant: "gold",
    rating: 9.5,
    readTime: 8,
  },
  {
    slug: "cbd-para-ansiedade",
    title: "CBD para Ansiedade",
    excerpt:
      "O que a ciência diz sobre o uso de CBD no manejo da ansiedade, dosagens e formas de consumo.",
    coverVariant: "img-3",
    leaf: "🍃",
    category: "Medicinal",
    badgeLabel: "Medicinal",
    badgeVariant: "default",
    rating: 9.1,
    readTime: 10,
  },
  {
    slug: "hidroponia-em-casa",
    title: "Hidroponia em Casa",
    excerpt:
      "Montagem de um sistema hidropônico caseiro: equipamentos, solução nutritiva e manutenção.",
    coverVariant: "img-4",
    leaf: "🌾",
    category: "Cultivo",
    badgeLabel: "Novo",
    badgeVariant: "dark",
    rating: 8.7,
    readTime: 14,
  },
  {
    slug: "historia-do-canhamo",
    title: "História do Cânhamo",
    excerpt:
      "Do uso milenar às aplicações industriais modernas: a trajetória do cânhamo pela civilização.",
    coverVariant: "img-5",
    leaf: "🌱",
    category: "Cultura",
    badgeLabel: "Cultura",
    badgeVariant: "default",
    rating: 8.4,
    readTime: 20,
  },
  {
    slug: "extracao-de-resina",
    title: "Extração de Resina",
    excerpt:
      "Métodos de extração de resina, do hash tradicional às técnicas modernas livres de solvente.",
    coverVariant: "img-6",
    leaf: "🌿",
    category: "Cultivo",
    badgeLabel: "Top",
    badgeVariant: "gold",
    rating: 9.0,
    readTime: 16,
  },
  {
    slug: "germinacao-passo-a-passo",
    title: "Germinação Passo a Passo",
    excerpt:
      "O método mais confiável para germinar sementes com alta taxa de sucesso, do papel toalha ao substrato.",
    coverVariant: "img-7",
    leaf: "🌱",
    category: "Cultivo",
    badgeLabel: "Iniciante",
    badgeVariant: "default",
    rating: 9.3,
    readTime: 7,
  },
  {
    slug: "nutricao-e-fertilizantes",
    title: "Nutrição e Fertilizantes",
    excerpt:
      "Macro e micronutrientes, tabelas de alimentação e como ler sinais de deficiência na planta.",
    coverVariant: "img-8",
    leaf: "🌿",
    category: "Cultivo",
    badgeLabel: "Intermediário",
    badgeVariant: "default",
    rating: 8.8,
    readTime: 13,
  },
  {
    slug: "tecnicas-de-poda-lst",
    title: "Técnicas de Poda LST",
    excerpt:
      "Low Stress Training na prática: como moldar a planta para mais luz e produção sem estresse.",
    coverVariant: "img-9",
    leaf: "🍃",
    category: "Cultivo",
    badgeLabel: "Avançado",
    badgeVariant: "gold",
    rating: 9.4,
    readTime: 18,
  },
  {
    slug: "controle-de-pragas",
    title: "Controle de Pragas",
    excerpt:
      "Identificação e combate às pragas mais comuns no cultivo, com foco em manejo integrado.",
    coverVariant: "img-1",
    leaf: "🌾",
    category: "Cultivo",
    badgeLabel: "Cultivo",
    badgeVariant: "default",
    rating: 8.6,
    readTime: 11,
  },
  {
    slug: "cura-e-secagem-perfeita",
    title: "Cura e Secagem Perfeita",
    excerpt:
      "O processo de cura que define aroma, sabor e potência — temperatura, umidade e tempo ideais.",
    coverVariant: "img-3",
    leaf: "🌱",
    category: "Cultivo",
    badgeLabel: "Cultivo",
    badgeVariant: "default",
    rating: 9.0,
    readTime: 9,
  },
  {
    slug: "estufa-automatizada-diy",
    title: "Estufa Automatizada DIY",
    excerpt:
      "Como automatizar sua estufa com sensores, temporizadores e controle de clima de baixo custo.",
    coverVariant: "img-5",
    leaf: "🌿",
    category: "Cultivo",
    badgeLabel: "Novo",
    badgeVariant: "dark",
    rating: 8.9,
    readTime: 22,
  },
  {
    slug: "a-origem-da-cannabis",
    title: "A Origem da Cannabis",
    excerpt:
      "Documentário sobre as raízes históricas e geográficas da planta e sua relação com a humanidade.",
    coverVariant: "img-2",
    leaf: "🍃",
    category: "Cultura",
    badgeLabel: "Documentário",
    badgeVariant: "default",
    rating: 9.2,
    readTime: 25,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    slug: "mestres-do-cultivo-br",
    title: "Mestres do Cultivo BR",
    excerpt:
      "Entrevistas com cultivadores brasileiros de referência sobre técnica, ética e comunidade.",
    coverVariant: "img-6",
    leaf: "🌾",
    category: "Cultura",
    badgeLabel: "Entrevista",
    badgeVariant: "default",
    rating: 8.7,
    readTime: 19,
  },
  {
    slug: "legalizacao-no-brasil",
    title: "Legalização no Brasil",
    excerpt:
      "Panorama atualizado do cenário jurídico e político da cannabis no Brasil e o que esperar.",
    coverVariant: "img-4",
    leaf: "🌱",
    category: "Cultura",
    badgeLabel: "Especial",
    badgeVariant: "gold",
    rating: 9.1,
    readTime: 17,
  },
  {
    slug: "filmes-sobre-cannabis",
    title: "Filmes Sobre Cannabis",
    excerpt:
      "Uma seleção de filmes e documentários essenciais sobre a cultura canábica pelo mundo.",
    coverVariant: "img-9",
    leaf: "🌿",
    category: "Cultura",
    badgeLabel: "Cultura",
    badgeVariant: "default",
    rating: 8.5,
    readTime: 14,
  },
  {
    slug: "musica-e-cannabis",
    title: "Música & Cannabis",
    excerpt:
      "A influência da cannabis na música e como diferentes gêneros celebraram a planta ao longo do tempo.",
    coverVariant: "img-7",
    leaf: "🍃",
    category: "Cultura",
    badgeLabel: "Cultura",
    badgeVariant: "default",
    rating: 8.8,
    readTime: 12,
  },
  {
    slug: "festivais-420-pelo-mundo",
    title: "Festivais 420 pelo Mundo",
    excerpt:
      "Um guia dos maiores festivais e celebrações 420 do planeta, da cultura local à programação.",
    coverVariant: "img-8",
    leaf: "🌾",
    category: "Cultura",
    badgeLabel: "Trending",
    badgeVariant: "dark",
    rating: 9.0,
    readTime: 16,
  },
];

function corpoExemplo(title: string, excerpt: string): string {
  return [
    `<p>${excerpt}</p>`,
    `<p>Este é um conteúdo de demonstração da estrutura. No painel, este texto vem do campo <strong>conteúdo</strong> do post — com suporte a títulos, listas, imagens e vídeos.</p>`,
    `<h2>Por que isso importa</h2>`,
    `<p>A estrutura já nasce otimizada para SEO: título, descrição, slug amigável, dados estruturados (schema Article), canonical e imagem de compartilhamento são gerados automaticamente a partir dos campos de cada post.</p>`,
    `<p>Substitua este bloco pelo conteúdo real de "${title}" pelo painel.</p>`,
  ].join("\n");
}

const BASE_DATE = new Date("2026-06-16T12:00:00.000Z");

/** Posts hidratados com autor, status, datas e conteúdo. */
export function seedPosts(): Post[] {
  return seed.map((p, i) => {
    const publishedAt = new Date(
      BASE_DATE.getTime() - i * 24 * 60 * 60 * 1000,
    ).toISOString();
    return {
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      excerpt: p.excerpt,
      content: corpoExemplo(p.title, p.excerpt),
      coverVariant: p.coverVariant,
      leaf: p.leaf,
      videoUrl: p.videoUrl,
      featured: p.featured ?? false,
      category: p.category,
      tags: [p.category],
      badgeLabel: p.badgeLabel,
      badgeVariant: p.badgeVariant,
      author: { name: "Redação O Canabista", slug: "redacao" },
      rating: p.rating,
      readTime: p.readTime,
      status: "publicado",
      publishedAt,
      updatedAt: publishedAt,
      seoTitle: p.title,
      seoDescription: p.excerpt,
    };
  });
}

/** Equipe inicial de exemplo. */
export function seedTeam(): TeamMember[] {
  return [
    {
      id: "u-1",
      name: "Você (Proprietário)",
      email: "nexus.growth.marketing@gmail.com",
      role: "Administrador",
      status: "ativo",
      color: "#4ade80",
      joinedAt: BASE_DATE.toISOString(),
    },
    {
      id: "u-2",
      name: "Marina Editora",
      email: "marina@ocanabista.com.br",
      role: "Editor",
      status: "ativo",
      color: "#d4af37",
      joinedAt: BASE_DATE.toISOString(),
    },
    {
      id: "u-3",
      name: "Léo Cultivo",
      email: "leo@ocanabista.com.br",
      role: "Autor",
      status: "convidado",
      color: "#60a5fa",
      joinedAt: BASE_DATE.toISOString(),
    },
  ];
}

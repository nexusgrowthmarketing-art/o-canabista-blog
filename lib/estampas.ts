/**
 * Galeria de "Estampas" — vitrine visual das artes/peças do O Canabista.
 *
 * Por enquanto são exemplos com pôsteres em gradiente (placeholders), prontos
 * para o Marcos subir as artes REAIS pelo painel (campo de imagem). Quando o
 * `image` estiver preenchido, a galeria usa a imagem real no lugar do gradiente.
 */
export interface Estampa {
  slug: string;
  title: string;
  description: string;
  /** Imagem real (URL) — quando vazio, usa o pôster em gradiente. */
  image?: string;
  variant: string; // img-1 ... img-9 (placeholder visual)
  emoji: string;
  /** Preço opcional (ex.: "R$ 79"). Vazio = só exibição. */
  price?: string;
  /** Link de compra opcional (loja / WhatsApp). Vazio = sem botão. */
  link?: string;
  sample?: boolean;
}

export const estampas: Estampa[] = [
  {
    slug: "folha-dourada",
    title: "Folha Dourada",
    description: "Estampa assinatura com a folha em traço dourado sobre fundo escuro.",
    variant: "img-3",
    emoji: "🌿",
    sample: true,
  },
  {
    slug: "indica-sunset",
    title: "Indica Sunset",
    description: "Degradê quente inspirado no fim de tarde do litoral catarinense.",
    variant: "img-5",
    emoji: "🍃",
    sample: true,
  },
  {
    slug: "puffer-classic",
    title: "Puffer Classic",
    description: "Colab com a vibe streetwear — traço forte e atitude.",
    variant: "img-2",
    emoji: "🐡",
    sample: true,
  },
  {
    slug: "cultivo-consciente",
    title: "Cultivo Consciente",
    description: "Tipografia botânica para quem cultiva conhecimento.",
    variant: "img-8",
    emoji: "🌱",
    sample: true,
  },
  {
    slug: "420-vibes",
    title: "420 Vibes",
    description: "Arte comemorativa para a cultura canábica.",
    variant: "img-6",
    emoji: "🌿",
    sample: true,
  },
  {
    slug: "raiz-canhamo",
    title: "Raiz do Cânhamo",
    description: "Homenagem à história milenar da planta.",
    variant: "img-9",
    emoji: "🍃",
    sample: true,
  },
];

export function getEstampas(): Estampa[] {
  return estampas;
}

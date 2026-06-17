import Link from "next/link";
import type { Post } from "@/lib/types";

/**
 * Quebra o título destacando as últimas palavras em verde — reproduz o efeito
 * "Guia Definitivo do <span>Cultivo Indoor</span>" do design original.
 */
function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return { lead: "", accent: title };
  const accent = words.slice(-2).join(" ");
  const lead = words.slice(0, -2).join(" ");
  return { lead, accent };
}

/** Hero da home — destaca o post em evidência. */
export default function Hero({ post }: { post: Post }) {
  const { lead, accent } = splitTitle(post.title);

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-badge">Em Destaque</div>
        <h1 className="hero-title">
          {lead ? `${lead} ` : ""}
          <span>{accent}</span>
        </h1>
        <div className="hero-meta">
          <strong>★ {post.rating.toFixed(1)}</strong>
          <span className="dot" />
          <span>{post.category}</span>
          <span className="dot" />
          <span>{post.readTime} min de leitura</span>
          <span className="dot" />
          <span>Atualizado hoje</span>
        </div>
        <p className="hero-desc">{post.excerpt}</p>
        <div className="hero-actions">
          <Link href={`/posts/${post.slug}`} className="btn-hero read">
            ▶ Ler Agora
          </Link>
          <Link href={`/posts/${post.slug}`} className="btn-hero info">
            ⓘ Mais Informações
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";

/**
 * Card de post (estilo "pôster"). Mantém o visual original:
 * pôster em gradiente + emoji enquanto não há imagem real; quando o post tiver
 * `coverImage` (do CMS), usa next/image automaticamente.
 *
 * Obs.: os botões redondos são decorativos. Como o card inteiro é um link,
 * eles são <span> (não <button>) para manter HTML válido dentro do <a>.
 */
export default function Card({ post }: { post: Post }) {
  const badgeClass =
    post.badgeVariant === "gold"
      ? "card-tag gold"
      : post.badgeVariant === "dark"
        ? "card-tag dark"
        : "card-tag";

  return (
    <Link href={`/posts/${post.slug}`} className="card">
      <div className={`card-image ${post.coverVariant}`}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="280px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <>
            <div className="img-pattern" />
            <div className="img-leaf">{post.leaf ?? "🌿"}</div>
          </>
        )}
      </div>
      <div className="card-overlay" />
      <span className="card-time">{post.readTime} min</span>
      <div className="card-content">
        <span className={badgeClass}>{post.badgeLabel}</span>
        <h3 className="card-title">{post.title}</h3>
        <div className="card-meta">
          <span className="card-rating">★ {post.rating.toFixed(1)}</span>
          <span className="dot" />
          <span>{post.readTime} min</span>
        </div>
        <div className="card-actions" aria-hidden="true">
          <span className="card-btn main">▶</span>
          <span className="card-btn">+</span>
          <span className="card-btn">♡</span>
        </div>
      </div>
    </Link>
  );
}

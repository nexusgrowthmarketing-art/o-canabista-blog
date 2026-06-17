import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/Comments";
import ArticleJsonLd from "@/components/JsonLd";
import VideoEmbed from "@/components/VideoEmbed";
import { getAllPosts, getPostBySlug, slugifyCategory } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Gera as páginas estáticas de cada post no build (SSG = velocidade + SEO). */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/** SEO por post: title, description, canonical, Open Graph e Twitter próprios. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `/posts/${post.slug}`;
  const image = post.socialImage ?? post.coverImage ?? siteConfig.ogImage;

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name ?? siteConfig.name],
      section: post.category,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      images: [image],
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="page-wrap">
      <ArticleJsonLd post={post} />

      <nav className="breadcrumb" aria-label="Trilha de navegação">
        <Link href="/">Início</Link>
        {" / "}
        <Link href={`/categoria/${slugifyCategory(post.category)}`}>
          {post.category}
        </Link>
        {" / "}
        <span>{post.title}</span>
      </nav>

      <article className="post-article">
        <header className="post-header">
          <span className="post-eyebrow">{post.category}</span>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <strong>★ {post.rating.toFixed(1)}</strong>
            <span className="dot" />
            <span>{post.readTime} min de leitura</span>
            <span className="dot" />
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            <span className="dot" />
            <span>{post.author?.name}</span>
          </div>
        </header>

        {post.videoUrl ? (
          <VideoEmbed url={post.videoUrl} />
        ) : (
          <div className={`post-cover card-image ${post.coverVariant}`}>
            <div className="img-pattern" />
            <div className="img-leaf">{post.leaf ?? "🌿"}</div>
          </div>
        )}

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        <footer className="post-footer">
          <span>
            Publicado em {dateFormatter.format(new Date(post.publishedAt))}
          </span>
          <Link href="/" className="row-link">
            Voltar para a Home
          </Link>
        </footer>

        <Comments slug={post.slug} />
      </article>
    </main>
  );
}

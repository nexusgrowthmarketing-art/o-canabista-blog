import { siteConfig } from "@/lib/site";
import type { Post } from "@/lib/types";

/**
 * Dados estruturados schema.org/Article (JSON-LD) para os posts.
 * É o que dá rich results no Google — equivalente ao que um plugin de SEO faria,
 * mas nativo e versionado no código.
 */
export default function ArticleJsonLd({ post }: { post: Post }) {
  const url = `${siteConfig.url}/posts/${post.slug}`;
  const image = post.socialImage ?? post.coverImage ?? siteConfig.ogImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    image: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author?.name ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

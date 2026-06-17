import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, slugifyCategory } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

/** Sitemap nativo do Next (gera /sitemap.xml automaticamente). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map(
    (category) => ({
      url: `${base}/categoria/${slugifyCategory(category)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${base}/posts/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}

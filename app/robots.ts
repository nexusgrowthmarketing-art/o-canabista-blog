import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/** robots.txt nativo do Next (gera /robots.txt automaticamente). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

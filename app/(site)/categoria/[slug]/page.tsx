import type { Metadata } from "next";
import Card from "@/components/Card";
import {
  getAllCategories,
  getPostsByCategory,
  slugifyCategory,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pré-renderiza as categorias que já têm posts. */
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: slugifyCategory(category),
  }));
}

/** Nome legível da categoria a partir do slug. */
async function categoryTitle(slug: string): Promise<string> {
  const categories = await getAllCategories();
  const match = categories.find(
    (c) => slugifyCategory(c) === slug.toLowerCase(),
  );
  if (match) return match;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = await categoryTitle(slug);
  return {
    title,
    description: `Artigos de ${title} no ${siteConfig.name}: ${siteConfig.tagline}.`,
    alternates: { canonical: `/categoria/${slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const title = await categoryTitle(slug);
  const posts = await getPostsByCategory(slug);

  return (
    <main className="page-wrap">
      <div className="section-head">
        <h1>{title}</h1>
        <p>
          {posts.length > 0
            ? `${posts.length} ${posts.length === 1 ? "artigo" : "artigos"} em ${title}.`
            : `Ainda não há artigos publicados em ${title}.`}
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Em breve, novos conteúdos nesta categoria. 🌱
        </div>
      )}
    </main>
  );
}

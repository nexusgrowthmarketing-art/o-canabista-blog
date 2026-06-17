import type { Metadata } from "next";
import Card from "@/components/Card";
import { searchPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  robots: { index: false, follow: true },
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchPosts(query) : [];

  return (
    <main className="page-wrap">
      <div className="section-head">
        <h1>Buscar</h1>
        <form className="search-form" action="/buscar" method="get">
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Buscar artigos, variedades, cultivo…"
            aria-label="Buscar"
          />
          <button type="submit" className="estampa-buy">
            Buscar
          </button>
        </form>
        {query && (
          <p>
            {results.length} resultado{results.length === 1 ? "" : "s"} para
            &nbsp;<strong>“{query}”</strong>.
          </p>
        )}
      </div>

      {query && results.length > 0 ? (
        <div className="posts-grid">
          {results.map((p) => (
            <Card key={p.slug} post={p} />
          ))}
        </div>
      ) : query ? (
        <div className="empty-state">
          Nada encontrado para “{query}”. Tente outra palavra. 🌿
        </div>
      ) : (
        <div className="empty-state">
          Digite algo para buscar nos conteúdos do {siteConfig.name}.
        </div>
      )}
    </main>
  );
}

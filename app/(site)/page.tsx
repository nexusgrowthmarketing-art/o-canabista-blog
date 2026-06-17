import FeaturedBanner from "@/components/FeaturedBanner";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { getCollections, getFeaturedPost } from "@/lib/posts";

export default function HomePage() {
  const featured = getFeaturedPost();
  const collections = getCollections();

  return (
    <>
      <Hero post={featured} />

      <div className="content-section">
        {/* Primeira coleção */}
        {collections[0] && <Row collection={collections[0]} />}

        <FeaturedBanner />

        {/* Demais coleções */}
        {collections.slice(1).map((collection) => (
          <Row key={collection.title} collection={collection} />
        ))}
      </div>
    </>
  );
}

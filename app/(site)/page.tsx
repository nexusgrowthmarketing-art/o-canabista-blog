import FeaturedBanner from "@/components/FeaturedBanner";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import StoriesBar from "@/components/StoriesBar";
import { getCollections, getFeaturedPost } from "@/lib/posts";

export default async function HomePage() {
  const featured = await getFeaturedPost();
  const collections = await getCollections();

  return (
    <>
      <StoriesBar />
      {featured && <Hero post={featured} />}

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

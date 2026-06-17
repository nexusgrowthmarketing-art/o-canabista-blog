import Link from "next/link";

/** Banner da newsletter — estático, idêntico ao design original. */
export default function FeaturedBanner() {
  return (
    <div className="featured-banner">
      <div className="featured-content">
        <h3>Newsletter Semanal Canabista</h3>
        <p>
          Receba os melhores conteúdos sobre cultura, cultivo e novidades direto
          no seu e-mail toda sexta.
        </p>
        <Link href="/newsletter" className="btn-hero read">
          Assinar Grátis →
        </Link>
      </div>
    </div>
  );
}

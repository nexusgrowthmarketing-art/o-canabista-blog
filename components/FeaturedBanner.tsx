import NewsletterInline from "@/components/NewsletterInline";

/** Banner da newsletter com assinatura inline (sem sair da home). */
export default function FeaturedBanner() {
  return (
    <div className="featured-banner">
      <div className="featured-content">
        <h3>Newsletter Semanal Canabista</h3>
        <p>
          Receba os melhores conteúdos sobre cultura, cultivo e novidades direto
          no seu e-mail toda sexta.
        </p>
        <NewsletterInline />
      </div>
    </div>
  );
}

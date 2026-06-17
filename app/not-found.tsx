import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-wrap">
      <div className="section-head">
        <h1>404 — Página não encontrada</h1>
        <p>O conteúdo que você procura não existe ou foi movido.</p>
      </div>
      <div className="empty-state">
        <Link href="/" className="btn-hero read">
          ▶ Voltar para a Home
        </Link>
      </div>
    </main>
  );
}

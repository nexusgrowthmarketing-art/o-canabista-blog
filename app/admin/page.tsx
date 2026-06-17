import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/posts";
import { readTeam } from "@/lib/store";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin();
  const team = await readTeam();
  const publicados = posts.filter((p) => p.status === "publicado").length;
  const rascunhos = posts.filter((p) => p.status === "rascunho").length;
  const recent = posts.slice(0, 5);

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Visão Geral</h1>
          <p>Resumo do conteúdo e da equipe do blog.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-accent">
          + Novo Post
        </Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{posts.length}</div>
          <div className="stat-label">Posts no total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{publicados}</div>
          <div className="stat-label">Publicados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{rascunhos}</div>
          <div className="stat-label">Rascunhos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{team.length}</div>
          <div className="stat-label">Membros da equipe</div>
        </div>
      </div>

      <div className="panel">
        <h2>Posts recentes</h2>
        <div className="table-wrap" style={{ border: "none" }}>
          <table className="data">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Atualizado</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((post) => (
                <tr key={post.slug}>
                  <td>
                    <div className="cell-title">
                      <div className={`cell-thumb ${post.coverVariant}`} />
                      <div>
                        <strong>{post.title}</strong>
                        <small>/{post.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <span className={`pill ${post.status}`}>{post.status}</span>
                  </td>
                  <td>{fmt.format(new Date(post.updatedAt ?? post.publishedAt))}</td>
                  <td>
                    <div className="row-actions">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="btn btn-ghost btn-sm"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { getAllPostsAdmin } from "@/lib/posts";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminPosts() {
  const posts = await getAllPostsAdmin();

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Posts</h1>
          <p>{posts.length} artigos no blog.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-accent">
          + Novo Post
        </Link>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Autor</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th style={{ textAlign: "right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug}>
                <td>
                  <div className="cell-title">
                    <div className={`cell-thumb ${post.coverVariant}`} />
                    <div>
                      <strong>{post.title}</strong>
                      <small>
                        /{post.slug}
                        {post.videoUrl ? " · 🎬 vídeo" : ""}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{post.category}</td>
                <td>{post.author?.name}</td>
                <td>
                  <span className={`pill ${post.status}`}>{post.status}</span>
                </td>
                <td>{fmt.format(new Date(post.updatedAt ?? post.publishedAt))}</td>
                <td>
                  <div className="row-actions">
                    {post.status === "publicado" && (
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        className="btn btn-ghost btn-sm"
                      >
                        Ver
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="btn btn-ghost btn-sm"
                    >
                      Editar
                    </Link>
                    <DeletePostButton slug={post.slug} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

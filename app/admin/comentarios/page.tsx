import Link from "next/link";
import DeleteCommentButton from "@/components/admin/DeleteCommentButton";
import { getAllComments } from "@/lib/store";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminComentarios() {
  const comments = (await getAllComments()).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Comentários</h1>
          <p>{comments.length} comentários na audiência.</p>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="panel">
          <p className="empty">Ainda não há comentários. 🌿</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Autor</th>
                <th>Comentário</th>
                <th>Post</th>
                <th>Data</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.author}</strong>
                  </td>
                  <td style={{ maxWidth: 360 }}>{c.text}</td>
                  <td>
                    <Link
                      href={`/posts/${c.postSlug}`}
                      target="_blank"
                      className="back-link"
                    >
                      /{c.postSlug}
                    </Link>
                  </td>
                  <td>{fmt.format(new Date(c.createdAt))}</td>
                  <td>
                    <div className="row-actions">
                      <DeleteCommentButton id={c.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

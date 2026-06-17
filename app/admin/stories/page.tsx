import { createStory } from "@/app/admin/actions";
import DeleteStoryButton from "@/components/admin/DeleteStoryButton";
import { getAllStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

function restante(expiresAt: string, now: number): string {
  const ms = +new Date(expiresAt) - now;
  if (ms <= 0) return "expirado";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `expira em ${h}h${m.toString().padStart(2, "0")}`;
}

export default function AdminStories() {
  const now = Date.now();
  const stories = getAllStories();

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Stories 48h</h1>
          <p>Publicações que somem sozinhas em 48 horas — aparecem na head da home.</p>
        </div>
      </div>

      <div className="two-col">
        {stories.length === 0 ? (
          <div className="panel">
            <p className="empty">
              Nenhum story ainda. Publique o primeiro ao lado. 🌿
              <br />
              (Os exemplos da home são fixos e não aparecem aqui.)
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Mídia</th>
                  <th>Legenda</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => {
                  const expirado = +new Date(s.expiresAt) <= now;
                  return (
                    <tr key={s.id}>
                      <td>
                        {s.type === "image" && s.mediaUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.mediaUrl}
                            alt=""
                            style={{
                              width: 44,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: 22 }}>
                            {s.type === "video" ? "🎬" : "🌿"}
                          </span>
                        )}
                      </td>
                      <td style={{ maxWidth: 280 }}>{s.caption ?? "—"}</td>
                      <td>
                        <span className={`pill ${expirado ? "rascunho" : "publicado"}`}>
                          {restante(s.expiresAt, now)}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <DeleteStoryButton id={s.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel">
          <h2>Publicar story</h2>
          <form action={createStory}>
            <div className="field">
              <label htmlFor="mediaUrl">URL da imagem ou vídeo</label>
              <input
                id="mediaUrl"
                name="mediaUrl"
                type="url"
                required
                placeholder="https://… (.jpg, .png, .mp4)"
              />
              <div className="hint">
                Cole o link de uma imagem/vídeo já hospedado. O upload de arquivo
                direto entra junto com o Storage do Supabase.
              </div>
            </div>
            <div className="field">
              <label htmlFor="caption">Legenda (opcional)</label>
              <input id="caption" name="caption" type="text" maxLength={120} />
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: "100%" }}>
              Publicar (some em 48h)
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

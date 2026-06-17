import { addMember } from "@/app/admin/actions";
import RemoveMemberButton from "@/components/admin/RemoveMemberButton";
import { readTeam } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminEquipe() {
  const team = await readTeam();

  return (
    <>
      <div className="admin-topbar">
        <div>
          <h1>Equipe</h1>
          <p>Quem ajuda a manter o blog e o que cada um pode fazer.</p>
        </div>
      </div>

      <div className="two-col">
        {/* Lista de membros */}
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Membro</th>
                <th>Papel</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="member-row">
                      <div
                        className="admin-avatar"
                        style={{ background: m.color }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{m.name}</strong>
                        <small>{m.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="pill role">{m.role}</span>
                  </td>
                  <td>
                    <span className={`pill ${m.status}`}>{m.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {m.role !== "Administrador" && (
                        <RemoveMemberButton id={m.id} name={m.name} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adicionar membro + legenda de papéis */}
        <div style={{ display: "grid", gap: 22 }}>
          <div className="panel">
            <h2>Adicionar / convidar</h2>
            <form action={addMember}>
              <div className="field">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="role">Papel</label>
                <select id="role" name="role" defaultValue="Autor">
                  <option value="Administrador">Administrador</option>
                  <option value="Editor">Editor</option>
                  <option value="Autor">Autor</option>
                </select>
              </div>
              <button type="submit" className="btn btn-accent" style={{ width: "100%" }}>
                Adicionar à equipe
              </button>
            </form>
          </div>

          <div className="panel">
            <h2>O que cada papel pode fazer</h2>
            <ul className="roles-legend">
              <li>
                <b>Administrador</b> — acesso total: posts, equipe e configurações.
              </li>
              <li>
                <b>Editor</b> — cria, edita e publica posts de qualquer autor.
              </li>
              <li>
                <b>Autor</b> — cria e edita os próprios posts (saem como rascunho).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

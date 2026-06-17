import type { Metadata } from "next";
import { login } from "@/app/admin/actions";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Entrar no Painel",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="admin-auth">
      <form className="auth-card" action={login}>
        <div className="admin-brand">
          <div className="logo-mark">C</div>
          <div className="logo-text">
            O CANABISTA
            <small>PAINEL</small>
          </div>
        </div>

        <h1>Bem-vindo de volta</h1>
        <p className="sub">Entre para gerenciar o conteúdo do blog.</p>

        {erro && (
          <div className="auth-error">Senha incorreta. Tente novamente.</div>
        )}

        <div className="field">
          <label htmlFor="password">Senha de acesso</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoFocus
            required
          />
        </div>

        <button type="submit" className="btn btn-accent" style={{ width: "100%" }}>
          Entrar no painel
        </button>

        <p className="auth-hint">
          Acesso protegido · Conteúdo educativo · Maiores de 18 anos
        </p>
      </form>
    </div>
  );
}

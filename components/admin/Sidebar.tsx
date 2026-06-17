"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import type { TeamMember } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Visão Geral", ico: "▥" },
  { href: "/admin/posts", label: "Posts", ico: "✎" },
  { href: "/admin/equipe", label: "Equipe", ico: "👥" },
];

export default function Sidebar({ user }: { user?: TeamMember }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <div className="logo-mark">C</div>
        <div className="logo-text">
          O CANABISTA
          <small>PAINEL</small>
        </div>
      </Link>

      <nav className="admin-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? "active" : ""}
          >
            <span className="ico">{item.ico}</span>
            <span className="label">{item.label}</span>
          </Link>
        ))}
        <Link href="/" target="_blank">
          <span className="ico">↗</span>
          <span className="label">Ver o site</span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user">
          <div
            className="admin-avatar"
            style={{ background: user?.color ?? "var(--accent)" }}
          >
            {(user?.name ?? "A").charAt(0).toUpperCase()}
          </div>
          <div className="admin-user-meta">
            <strong>{user?.name ?? "Administrador"}</strong>
            <span>{user?.role ?? "Administrador"}</span>
          </div>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-logout">
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

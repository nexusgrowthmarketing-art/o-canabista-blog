"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

/**
 * Navbar fixa com efeito de "scrolled" (fundo + blur ao rolar) — equivalente
 * ao script original, agora em React.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <div className="nav-left">
        <Link href="/" className="logo">
          <div className="logo-mark">C</div>
          <div className="logo-text">
            O CANABISTA
            <small>CULTURA · CULTIVO · CONHECIMENTO</small>
          </div>
        </Link>
        <ul className="nav-menu">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className={active ? "active" : ""}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="nav-right">
        <Link href="/buscar" className="nav-icon" aria-label="Buscar">
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            role="img"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </Link>
        <svg
          className="bell-icon"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-label="Notificações"
          role="img"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <button className="btn-primary" type="button">
          Assinar
        </button>
      </div>
    </nav>
  );
}

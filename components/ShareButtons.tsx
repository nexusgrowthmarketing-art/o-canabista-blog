"use client";

import { useState } from "react";

/** Botões de compartilhar (WhatsApp, X, Facebook) + copiar link. */
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = (net: "whatsapp" | "x" | "facebook") => {
    const u = window.location.href;
    const t = encodeURIComponent(title);
    const eu = encodeURIComponent(u);
    const links = {
      whatsapp: `https://wa.me/?text=${t}%20${eu}`,
      x: `https://twitter.com/intent/tweet?text=${t}&url=${eu}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
    } as const;
    window.open(links[net], "_blank", "noopener,noreferrer");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  return (
    <div className="share">
      <span className="share-label">Compartilhar:</span>
      <button
        type="button"
        className="share-btn wa"
        onClick={() => share("whatsapp")}
      >
        WhatsApp
      </button>
      <button type="button" className="share-btn x" onClick={() => share("x")}>
        X
      </button>
      <button
        type="button"
        className="share-btn fb"
        onClick={() => share("facebook")}
      >
        Facebook
      </button>
      <button type="button" className="share-btn copy" onClick={copy}>
        {copied ? "Copiado! ✓" : "Copiar link"}
      </button>
    </div>
  );
}

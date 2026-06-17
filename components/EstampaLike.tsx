"use client";

import { useEffect, useState } from "react";
import { likeEstampa } from "@/app/(site)/actions";

/** Botão de curtir uma estampa (voto da audiência), com contador. */
export default function EstampaLike({
  slug,
  initial,
}: {
  slug: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(`estampa-like:${slug}`)) setLiked(true);
    } catch {
      /* sem localStorage */
    }
  }, [slug]);

  async function onLike() {
    if (liked || busy) return;
    setBusy(true);
    setLiked(true);
    setCount((c) => c + 1); // otimista
    try {
      const novo = await likeEstampa(slug);
      setCount(novo);
      localStorage.setItem(`estampa-like:${slug}`, "1");
    } catch {
      setLiked(false);
      setCount((c) => c - 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`estampa-like${liked ? " liked" : ""}`}
      onClick={onLike}
      aria-pressed={liked}
      aria-label={liked ? "Você curtiu" : "Curtir esta estampa"}
      disabled={busy}
    >
      <span className="heart">{liked ? "♥" : "♡"}</span>
      <span className="count">{count}</span>
    </button>
  );
}

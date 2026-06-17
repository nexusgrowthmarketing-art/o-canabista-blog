"use client";

import { type FormEvent, useEffect, useState } from "react";

interface UiComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<UiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setOk(false);
    setSending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: fd.get("author"),
          text: fd.get("text"),
          website: fd.get("website"),
        }),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      if (d.comment) setComments((cs) => [d.comment, ...cs]);
      form.reset();
      setOk(true);
    } catch {
      setError("Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="comments" id="comentarios">
      <h2 className="comments-title">
        Comentários{comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>
      <p className="comments-sub">
        Participe da conversa — respeito e boa vibe. Conteúdo educativo, +18.
      </p>

      <form className="comment-form" onSubmit={onSubmit}>
        <input
          name="author"
          type="text"
          placeholder="Seu nome"
          required
          maxLength={60}
        />
        <textarea
          name="text"
          placeholder="Escreva um comentário…"
          required
          maxLength={1000}
          rows={3}
        />
        {/* honeypot anti-bot (escondido) */}
        <input
          name="website"
          className="hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="comment-actions">
          {ok && <span className="comment-ok">Comentário publicado ✅</span>}
          {error && <span className="comment-err">{error}</span>}
          <button type="submit" className="estampa-buy" disabled={sending}>
            {sending ? "Enviando…" : "Comentar"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="comments-empty">Carregando comentários…</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">Seja o primeiro a comentar. 🌿</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment-avatar">
                {c.author.charAt(0).toUpperCase()}
              </div>
              <div className="comment-body">
                <div className="comment-head">
                  <strong>{c.author}</strong>
                  <span>{fmt(c.createdAt)}</span>
                </div>
                <p>{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Story } from "@/lib/stories";

const DURATION = 5000; // ms por story

export default function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((d) => setStories(d.stories ?? []))
      .catch(() => {});
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const openAt = (i: number) => {
    setIndex(i);
    setProgress(0);
    setOpen(true);
  };

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= stories.length - 1) {
        setOpen(false);
        return i;
      }
      return i + 1;
    });
    setProgress(0);
  }, [stories.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
    setProgress(0);
  }, []);

  // Progresso + auto-avanço
  useEffect(() => {
    if (!open) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / DURATION);
      setProgress(p);
      if (p >= 1) {
        next();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, index, next]);

  // Teclado
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, next, prev]);

  if (stories.length === 0) return null;
  const current = stories[index];

  return (
    <>
      <section className="stories-bar" aria-label="Stories 48 horas">
        <div className="stories-head">
          <span className="stories-badge">48HRS</span>
          <span className="stories-label">com O Canabista</span>
        </div>
        <div className="stories-track">
          {stories.map((s, i) => (
            <button
              key={s.id}
              className="story-dot"
              onClick={() => openAt(i)}
              type="button"
              aria-label={s.caption ?? "Abrir story"}
            >
              <span className="story-ring">
                <span
                  className={`story-thumb ${!s.mediaUrl ? s.variant ?? "" : ""}`}
                  style={
                    s.mediaUrl && s.type === "image"
                      ? { backgroundImage: `url(${s.mediaUrl})` }
                      : undefined
                  }
                >
                  {!s.mediaUrl && (
                    <span className="story-emoji">{s.emoji ?? "🌿"}</span>
                  )}
                </span>
              </span>
              <span className="story-name">Canabista</span>
            </button>
          ))}
        </div>
      </section>

      {open && current && (
        <div className="story-viewer" role="dialog" aria-modal="true">
          <div className="story-progress">
            {stories.map((s, i) => (
              <span key={s.id} className="story-progress-bar">
                <span
                  className="story-progress-fill"
                  style={{
                    width:
                      i < index
                        ? "100%"
                        : i === index
                          ? `${progress * 100}%`
                          : "0%",
                  }}
                />
              </span>
            ))}
          </div>

          <button
            className="story-close"
            onClick={close}
            aria-label="Fechar"
            type="button"
          >
            ✕
          </button>

          <div
            className={`story-stage ${!current.mediaUrl ? current.variant ?? "img-1" : ""}`}
          >
            {current.mediaUrl && current.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={current.mediaUrl}
                autoPlay
                muted
                playsInline
                className="story-media"
              />
            ) : current.mediaUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.mediaUrl}
                alt={current.caption ?? "Story"}
                className="story-media"
              />
            ) : (
              <div className="story-emoji-big">{current.emoji ?? "🌿"}</div>
            )}
            {current.caption && (
              <div className="story-caption">{current.caption}</div>
            )}
          </div>

          <button
            className="story-nav left"
            onClick={prev}
            aria-label="Anterior"
            type="button"
          />
          <button
            className="story-nav right"
            onClick={next}
            aria-label="Próximo"
            type="button"
          />
        </div>
      )}
    </>
  );
}

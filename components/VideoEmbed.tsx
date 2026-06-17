"use client";

import { useState } from "react";

/** Extrai o ID do YouTube de várias formas de URL. */
function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

/**
 * Player de vídeo otimizado para velocidade:
 * - YouTube: mostra só a miniatura + botão play; o iframe pesado só carrega no clique.
 * - Vimeo: iframe com loading="lazy".
 * - Arquivo .mp4/.webm: <video> nativo com preload="none".
 */
export default function VideoEmbed({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);

  const yt = youtubeId(url);
  if (yt) {
    return (
      <div className="post-video">
        {playing ? (
          <iframe
            className="video-frame"
            src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
            title="Vídeo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-facade"
            onClick={() => setPlaying(true)}
            style={{
              backgroundImage: `url(https://i.ytimg.com/vi/${yt}/hqdefault.jpg)`,
            }}
            aria-label="Reproduzir vídeo"
          >
            <span className="video-play">▶</span>
          </button>
        )}
      </div>
    );
  }

  const vimeo = vimeoId(url);
  if (vimeo) {
    return (
      <div className="post-video">
        <iframe
          className="video-frame"
          src={`https://player.vimeo.com/video/${vimeo}`}
          title="Vídeo"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return (
      <div className="post-video">
        <video className="video-frame" controls preload="none">
          <source src={url} />
        </video>
      </div>
    );
  }

  // Fallback genérico
  return (
    <div className="post-video">
      <iframe
        className="video-frame"
        src={url}
        title="Vídeo"
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}

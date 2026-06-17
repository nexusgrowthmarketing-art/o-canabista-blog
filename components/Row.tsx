"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Collection } from "@/lib/types";
import Card from "./Card";

/**
 * "Row" / carrossel horizontal com botões de navegação — equivalente ao
 * scrollCarousel() do HTML original, agora com ref do React.
 */
export default function Row({ collection }: { collection: Collection }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.offsetWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="row">
      <div className="row-header">
        <h2 className="row-title">{collection.title}</h2>
        <Link href={collection.href} className="row-link">
          Ver Todos
        </Link>
      </div>
      <div className="carousel-wrapper">
        <button
          className="carousel-btn prev"
          onClick={() => scroll(-1)}
          aria-label="Anterior"
          type="button"
        >
          ‹
        </button>
        <button
          className="carousel-btn next"
          onClick={() => scroll(1)}
          aria-label="Próximo"
          type="button"
        >
          ›
        </button>
        <div className="carousel" ref={carouselRef}>
          {collection.posts.map((post) => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

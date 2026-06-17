"use client";

import Link from "next/link";
import { useState } from "react";
import { savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/types";

const COVERS = [
  "img-1",
  "img-2",
  "img-3",
  "img-4",
  "img-5",
  "img-6",
  "img-7",
  "img-8",
  "img-9",
];
const LEAVES = ["🌱", "🌿", "🍃", "🌾"];

function clientSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostEditor({
  post,
  categories,
}: {
  post?: Post;
  categories: string[];
}) {
  const isNew = !post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [cover, setCover] = useState(post?.coverVariant ?? "img-1");
  const [leaf, setLeaf] = useState(post?.leaf ?? "🌿");

  return (
    <form action={savePost}>
      <input type="hidden" name="originalSlug" defaultValue={post?.slug ?? ""} />

      <div className="admin-topbar">
        <div>
          <Link href="/admin/posts" className="back-link">
            ← Voltar para Posts
          </Link>
          <h1>{isNew ? "Novo Post" : "Editar Post"}</h1>
        </div>
        <div className="editor-actions">
          <Link href="/admin/posts" className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-accent">
            Salvar
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* ---- Coluna principal ---- */}
        <div className="panel">
          <div className="field">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(clientSlug(e.target.value));
              }}
              placeholder="Ex.: Guia Definitivo do Cultivo Indoor"
            />
          </div>

          <div className="field">
            <label htmlFor="slug">Slug (URL)</label>
            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(clientSlug(e.target.value));
              }}
              placeholder="guia-definitivo-cultivo-indoor"
            />
            <div className="hint">O endereço fica: /posts/{slug || "seu-slug"}</div>
          </div>

          <div className="field">
            <label htmlFor="subtitle">Subtítulo (opcional)</label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              defaultValue={post?.subtitle ?? ""}
            />
          </div>

          <div className="field">
            <label htmlFor="excerpt">Resumo</label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              style={{ minHeight: 80 }}
              placeholder="Frase curta que aparece nas listagens e na busca do Google."
            />
          </div>

          <div className="field">
            <label htmlFor="content">Conteúdo</label>
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content ?? ""}
              placeholder="Escreva o conteúdo do post. Aceita HTML (parágrafos, <h2>, listas, <strong>)."
            />
            <div className="hint">
              Aceita HTML simples. Um editor visual (negrito, listas, imagens) pode
              ser adicionado depois.
            </div>
          </div>

          <div className="field">
            <label htmlFor="videoUrl">🎬 Vídeo (opcional)</label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              defaultValue={post?.videoUrl ?? ""}
              placeholder="Cole o link do YouTube, Vimeo ou um arquivo .mp4"
            />
            <div className="hint">
              O vídeo carrega de forma rápida (lazy): só baixa quando o leitor clica
              em play.
            </div>
          </div>
        </div>

        {/* ---- Coluna lateral ---- */}
        <div style={{ display: "grid", gap: 22 }}>
          <div className="panel">
            <h2>Publicação</h2>
            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={post?.status ?? "rascunho"}>
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
            <div className="field">
              <label className="check">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={post?.featured ?? false}
                />
                Destaque na home (hero)
              </label>
            </div>
            <div className="field">
              <label htmlFor="category">Categoria</label>
              <input
                id="category"
                name="category"
                type="text"
                list="cats"
                defaultValue={post?.category ?? "Cultivo"}
              />
              <datalist id="cats">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="badgeLabel">Selo do card</label>
                <input
                  id="badgeLabel"
                  name="badgeLabel"
                  type="text"
                  defaultValue={post?.badgeLabel ?? ""}
                  placeholder="Novo, Premium…"
                />
              </div>
              <div className="field">
                <label htmlFor="badgeVariant">Cor do selo</label>
                <select
                  id="badgeVariant"
                  name="badgeVariant"
                  defaultValue={post?.badgeVariant ?? "default"}
                >
                  <option value="default">Verde</option>
                  <option value="gold">Dourado</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="panel">
            <h2>Mídia / Capa</h2>
            <div className="field">
              <label htmlFor="coverVariant">Pôster (gradiente)</label>
              <select
                id="coverVariant"
                name="coverVariant"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              >
                {COVERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className={`swatch card-image ${cover}`}>
                <div className="img-pattern" />
                <div className="img-leaf">{leaf}</div>
              </div>
            </div>
            <div className="field">
              <label htmlFor="leaf">Emoji da capa</label>
              <select
                id="leaf"
                name="leaf"
                value={leaf}
                onChange={(e) => setLeaf(e.target.value)}
              >
                {LEAVES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="coverImage">Imagem real (opcional)</label>
              <input
                id="coverImage"
                name="coverImage"
                type="url"
                defaultValue={post?.coverImage ?? ""}
                placeholder="https://… (substitui o pôster)"
              />
            </div>
          </div>

          <div className="panel">
            <h2>Metadados</h2>
            <div className="field-row">
              <div className="field">
                <label htmlFor="rating">Nota</label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  defaultValue={post?.rating ?? 8.5}
                />
              </div>
              <div className="field">
                <label htmlFor="readTime">Min. de leitura</label>
                <input
                  id="readTime"
                  name="readTime"
                  type="number"
                  min="1"
                  defaultValue={post?.readTime ?? 5}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="tags">Tags (separadas por vírgula)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                defaultValue={post?.tags?.join(", ") ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="authorName">Autor</label>
              <input
                id="authorName"
                name="authorName"
                type="text"
                defaultValue={post?.author?.name ?? "Redação O Canabista"}
              />
            </div>
          </div>

          <div className="panel">
            <h2>SEO</h2>
            <div className="field">
              <label htmlFor="seoTitle">Título SEO</label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                defaultValue={post?.seoTitle ?? ""}
                placeholder="Se vazio, usa o título do post"
              />
            </div>
            <div className="field">
              <label htmlFor="seoDescription">Meta description</label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                defaultValue={post?.seoDescription ?? ""}
                style={{ minHeight: 70 }}
                placeholder="Se vazio, usa o resumo"
              />
            </div>
            <div className="field">
              <label htmlFor="socialImage">Imagem de compartilhamento</label>
              <input
                id="socialImage"
                name="socialImage"
                type="url"
                defaultValue={post?.socialImage ?? ""}
                placeholder="https://… (1200x630)"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

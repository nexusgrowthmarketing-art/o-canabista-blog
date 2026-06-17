"use client";

import { deletePost } from "@/app/admin/actions";

export default function DeletePostButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!confirm(`Excluir o post "${title}"? Esta ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="btn btn-danger btn-sm">
        Excluir
      </button>
    </form>
  );
}

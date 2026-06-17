"use client";

import { removeComment } from "@/app/admin/actions";

export default function DeleteCommentButton({ id }: { id: string }) {
  return (
    <form
      action={removeComment}
      onSubmit={(e) => {
        if (!confirm("Excluir este comentário?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">
        Excluir
      </button>
    </form>
  );
}

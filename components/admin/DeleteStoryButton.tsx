"use client";

import { removeStory } from "@/app/admin/actions";

export default function DeleteStoryButton({ id }: { id: string }) {
  return (
    <form
      action={removeStory}
      onSubmit={(e) => {
        if (!confirm("Remover este story?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">
        Remover
      </button>
    </form>
  );
}

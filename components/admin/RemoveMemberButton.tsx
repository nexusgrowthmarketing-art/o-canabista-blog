"use client";

import { removeMember } from "@/app/admin/actions";

export default function RemoveMemberButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={removeMember}
      onSubmit={(e) => {
        if (!confirm(`Remover ${name} da equipe?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn-danger btn-sm">
        Remover
      </button>
    </form>
  );
}

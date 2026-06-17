"use client";

import { type FormEvent, useState } from "react";
import { subscribeInline } from "@/app/(site)/actions";

/** Form de newsletter que assina sem sair da página (na home). */
export default function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    try {
      const r = await subscribeInline(email);
      if (r.ok) setDone(true);
      else setErr(true);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p className="nl-inline-ok">
        ✅ Inscrição feita! Você vai receber o melhor do O Canabista. 🌿
      </p>
    );
  }

  return (
    <form className="nl-inline" onSubmit={onSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        aria-label="Seu e-mail"
        required
      />
      <button type="submit" className="btn-hero read" disabled={busy}>
        {busy ? "Enviando…" : "Assinar Grátis →"}
      </button>
      {err && (
        <span className="nl-inline-err">Confira o e-mail e tente de novo.</span>
      )}
    </form>
  );
}

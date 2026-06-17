"use client";

import { useEffect, useState } from "react";

/**
 * Verificação de idade (+18) — overlay de marca exibido na primeira visita.
 * Boa prática (e muitas vezes exigência legal) para conteúdo canábico.
 * A escolha fica salva no navegador (localStorage), então não reaparece.
 */
export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("ocb_age_ok")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem("ocb_age_ok", "1");
    } catch {
      /* sem localStorage */
    }
    setShow(false);
  };

  return (
    <div
      className="age-gate"
      role="dialog"
      aria-modal="true"
      aria-label="Verificação de idade"
    >
      <div className="age-card">
        <div className="age-logo">
          <span className="logo-mark">C</span> O CANABISTA
        </div>

        {denied ? (
          <>
            <h2>Volte quando fizer 18 anos 🌱</h2>
            <p>Este conteúdo é destinado a maiores de 18 anos.</p>
          </>
        ) : (
          <>
            <span className="age-badge">+18</span>
            <h2>Você tem 18 anos ou mais?</h2>
            <p>
              O Canabista é um espaço <strong>educativo</strong> sobre cultura e
              cultivo canábico, para maiores de idade. Cultive consciência.
            </p>
            <div className="age-actions">
              <button type="button" className="estampa-buy" onClick={accept}>
                Sim, tenho 18+
              </button>
              <button
                type="button"
                className="age-no"
                onClick={() => setDenied(true)}
              >
                Sou menor
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

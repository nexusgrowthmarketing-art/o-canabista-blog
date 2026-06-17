import Link from "next/link";

/** Rodapé global. */
export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <h4>O CANABISTA</h4>
          <p>
            O destino definitivo para quem busca conhecimento sobre cultivo,
            cultura e o universo canábico. Conteúdo de qualidade, sempre
            atualizado.
          </p>
        </div>
        <div className="footer-col">
          <h5>Navegação</h5>
          <ul>
            <li>
              <Link href="/categoria/cultivo">Cultivo</Link>
            </li>
            <li>
              <Link href="/categoria/variedades">Variedades</Link>
            </li>
            <li>
              <Link href="/categoria/medicinal">Medicinal</Link>
            </li>
            <li>
              <Link href="/categoria/cultura">Cultura</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Sobre</h5>
          <ul>
            <li>
              <Link href="/sobre">Quem Somos</Link>
            </li>
            <li>
              <Link href="/contato">Contato</Link>
            </li>
            <li>
              <Link href="/newsletter">Newsletter</Link>
            </li>
            <li>
              <Link href="/parcerias">Parcerias</Link>
            </li>
            <li>
              <Link href="/admin">Painel</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Social</h5>
          <ul>
            <li>
              <a href="https://instagram.com" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://youtube.com" rel="noopener noreferrer" target="_blank">
                YouTube
              </a>
            </li>
            <li>
              <a href="https://telegram.org" rel="noopener noreferrer" target="_blank">
                Telegram
              </a>
            </li>
            <li>
              <a href="https://x.com" rel="noopener noreferrer" target="_blank">
                Twitter/X
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 O Canabista — Todos os direitos reservados.</span>
        <span>
          Conteúdo educativo · Maiores de 18 anos ·{" "}
          <strong>Cultive consciência.</strong>
        </span>
      </div>
    </footer>
  );
}

# HANDOFF — Blog O Canabista

Documento de passagem para continuar/finalizar o projeto em outra sessão.

## Resumo

Blog **"O Canabista"** (cultura, cultivo e conhecimento canábico — educativo, +18).
**Next.js 15 (App Router) + TypeScript.** Cliente/criador: **Marcos Meress**
(@o.canabista, criador de conteúdo digital). Construído pela Nexus.

## Links

- **Produção:** https://o-canabista-blog.vercel.app
- **GitHub:** https://github.com/nexusgrowthmarketing-art/o-canabista-blog (branch `main`; git conectado à Vercel)
- **Vercel:** projeto `o-canabista-blog` (conta `nexusgrowthmarketing-art`)
- **Supabase:** projeto `o-canabista` — https://jfqgggwcppgsbznvpmdj.supabase.co (org "Nexus Growth Marketing")

## Rodar local

```bash
npm install
npm run dev      # http://localhost:3000
```

## Painel admin

- URL: **/admin** (redireciona para **/login**).
- Senha: variável `ADMIN_PASSWORD` (padrão de dev: **`canabista`**).
- Seções: Visão Geral · Posts (CRUD com vídeo + SEO) · Stories 48h · Comentários (moderação) · Equipe (papéis).

## Deploy — REGRA DE OURO

**Sempre rodar `npm run build` antes de subir** (precisa dar `Compiled successfully`). Nunca subir build quebrado. No Windows, parar o dev (porta 3000) antes do build (lock do `.next`).

```bash
# parar dev (porta 3000) → build → reativar dev
npm run build
git add -A && git commit -m "..." && git push
npx vercel deploy --prod --yes
# conferir: curl https://o-canabista-blog.vercel.app/  → 200
```

## Camada de dados

- `lib/store.ts`: usa **Supabase** se as env vars existirem; senão, **arquivos JSON** em `/content`.
- `content/posts.json` (posts), `content/team.json` (equipe), `content/comments.json`, `content/estampa-likes.json`, `content/stories.json`, `content/subscribers.json`.
- Stories: `lib/stories.ts` · Estampas: `lib/estampas.ts` · Config/identidade: `lib/site.ts`.

## ⚠️ PENDÊNCIA CRÍTICA (produção)

A env var **`SUPABASE_SERVICE_ROLE_KEY` na Vercel está VAZIA** (`hasKey:false`). Por isso a produção usa o fallback em arquivo: o site **mostra tudo**, mas as **escritas do painel / curtidas / comentários / stories NÃO persistem online**.

- Tabelas `posts` e `team` já criadas no Supabase; falta a chave + o schema completo.
- Diagnóstico: `GET /api/seed?token=canabista` → retorna `hasUrl` / `hasKey`.
- **Como resolver:**
  1. Vercel → Settings → Environment Variables → editar/recriar `SUPABASE_SERVICE_ROLE_KEY`.
     **DESLIGAR o toggle "Sensitive"** (senão o campo mascara e cola vazio — foi o erro anterior).
  2. Valor: Supabase → Settings → API Keys → aba "Legacy" → `service_role` → Reveal → copiar.
  3. Save → Redeploy.
  4. Rodar o schema completo `supabase/schema.sql` no SQL Editor + popular: `GET /api/seed?token=canabista`.
  5. Definir também `NEXT_PUBLIC_SITE_URL` com o domínio final (hoje cai no placeholder em sitemap/canonical/RSS).

## Já feito

Stories 48h · posts relacionados · compartilhar · barra de progresso de leitura · busca (`/buscar`) · RSS (`/feed.xml`) · **19 artigos reais** · age gate +18 · menu mobile (hambúrguer) · índice/TOC do artigo · newsletter inline na home · badge de tempo de leitura no card · `:focus-visible` (acessibilidade) · identidade real do Marcos · backups (tags `backup-*`).

## Fila (próximos — UMA melhoria por vez, sempre com build verificado)

1. `/public/og-default.svg` (1200×630, fundo escuro, logo "C" verde + "O CANABISTA") e `lib/site.ts` → `ogImage = "/og-default.svg"`.
2. JSON-LD **BreadcrumbList** na página de post.
3. Revisão **mobile** (Chrome 390×800) + micro-ajustes.
4. Incrementais: link "voltar ao topo"; `meta theme-color`; OG por post (campo `socialImage` já suportado); paginação na categoria se crescer.
5. **Conectar o Supabase de verdade** (pendência crítica acima) — destrava a persistência em produção.

## Restrições

Não comprar nada / gerar cobranças. Sem serviços pagos de geração (usar CSS/placeholders).

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

## ✅ PENDÊNCIA CRÍTICA — RESOLVIDA (2026-06-20)

Supabase **ligado e persistindo em produção**. A `SUPABASE_SERVICE_ROLE_KEY` foi
recriada **pela Vercel CLI** (o toggle "Sensitive" do painel salvava vazio — bug
contornado pela CLI). Diagnóstico: `GET /api/seed?token=canabista` → `hasKey:true`.

- **Persistência TOTAL**: `posts`, `team`, `comments`, `estampa_likes`, `stories`,
  `subscribers`, `messages` — todas no Supabase. `lib/store.ts`, `lib/stories.ts` e
  `app/(site)/actions.ts` usam Supabase quando configurado; senão, arquivo (dev).
- Schemas: `supabase/schema.sql` (posts/team) + `supabase/schema-extra.sql` (resto).
- `NEXT_PUBLIC_SITE_URL` = `https://o-canabista-blog.vercel.app` (sitemap/canonical/RSS ok).

### 🔐 Follow-up de segurança
A `service_role` key foi exposta no chat ao destravar a produção → **rotacionar**:
Supabase → Settings → API Keys → Roll/Regenerate; depois `vercel env rm/add`
`SUPABASE_SERVICE_ROLE_KEY` (Prod+Preview) + redeploy.

### ⏳ Pendência aberta
**Domínio final**: hoje só existe o `.vercel.app`. Quando plugar `ocanabista.com.br`
(ou `.info`): adicionar o domínio no projeto Vercel + atualizar `NEXT_PUBLIC_SITE_URL`
para ele + redeploy.

## Já feito

Stories 48h · posts relacionados · compartilhar · barra de progresso de leitura · busca (`/buscar`) · RSS (`/feed.xml`) · **20 artigos reais** (Terpenos incluído) · age gate +18 · menu mobile (hambúrguer) · índice/TOC do artigo · newsletter inline na home · badge de tempo de leitura no card · `:focus-visible` (acessibilidade) · identidade real do Marcos · backups (tags `backup-*`).

**2026-06-20:** Supabase ligado (persistência total) · `NEXT_PUBLIC_SITE_URL` setada · imagem OG dinâmica em `/og` (next/og, PNG real) · JSON-LD **BreadcrumbList** no post · botão **voltar-ao-topo** · `meta theme-color` · artigo **Terpenos** publicado.

## Fila (próximos — UMA melhoria por vez, sempre com build verificado)

1. **Rotacionar a `service_role`** (ver follow-up de segurança acima).
2. **Domínio final** + `NEXT_PUBLIC_SITE_URL` (ver pendência aberta acima).
3. Revisão **mobile** (Chrome 390×800) + micro-ajustes.
4. Incrementais: OG por post (campo `socialImage` já suportado); paginação na categoria se crescer.
5. Upload de arquivo (imagem/vídeo) para stories/estampas via **Supabase Storage** (hoje é por URL).

## Restrições

Não comprar nada / gerar cobranças. Sem serviços pagos de geração (usar CSS/placeholders).

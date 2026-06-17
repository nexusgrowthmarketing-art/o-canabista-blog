# O Canabista — Blog

Blog de cultura, cultivo e conhecimento canábico. **Next.js 15 (App Router) + TypeScript**, com painel de administração próprio e SEO técnico nativo.

## Rodar localmente

Pré-requisitos: **Node.js 18+** (recomendado 20+).

```bash
npm install      # instala as dependências
npm run dev      # sobe em http://localhost:3000
```

Outros comandos:

```bash
npm run build    # build de produção (valida o projeto inteiro)
npm start        # roda o build de produção localmente
```

## Estrutura

```
app/
├── (site)/          Site público (home, posts, categorias) + Navbar/Footer
├── admin/           Painel de gestão (/admin) — dashboard, posts, equipe
├── login/           Tela de acesso ao painel
├── sitemap.ts       /sitemap.xml (SEO, automático)
├── robots.ts        /robots.txt  (SEO, automático)
└── globals.css      Todo o design do site

components/          Peças visuais (Navbar, Hero, Card, Row, VideoEmbed, admin/…)
lib/
├── posts.ts         Leitura de conteúdo (consumido pelas páginas)
├── store.ts         Camada de dados (hoje: arquivos JSON em /content)
├── seed.ts          Conteúdo inicial
└── types.ts         Tipos (o "molde" de cada post)
content/             Dados: posts.json e team.json
middleware.ts        Protege o /admin
```

## Painel de administração

- Acesse **/admin** (redireciona para **/login** se não estiver logado).
- Senha de acesso: variável de ambiente `ADMIN_PASSWORD` (padrão de desenvolvimento: `canabista`).
- Cria/edita/exclui posts (com vídeo e campos de SEO) e gerencia a equipe (papéis Administrador/Editor/Autor).

> **Persistência:** hoje o conteúdo vive em arquivos JSON (`/content`). Isso salva 100% em
> desenvolvimento. Em produção (Vercel, sistema de arquivos somente-leitura) a gravação
> migra para um banco real (Supabase/Payload) — trocando apenas `lib/store.ts`.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste:

```
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com   # usado em SEO, sitemap, canonical, OG
ADMIN_PASSWORD=uma-senha-forte                 # acesso ao painel
```

## Fluxo de trabalho (time)

1. Crie uma branch a partir da `main`: `git checkout -b minha-alteracao`
2. Faça as mudanças e commit: `git commit -am "descrição"`
3. `git push` e abra um Pull Request no GitHub.
4. A Vercel gera um **preview** automático para a branch — revise antes de juntar na `main`.

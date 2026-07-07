# NarraPolítica AI - Regras para Agentes (OpenCode)

## Stack
- Next.js 16 (App Router, RSC, Server Actions)
- TypeScript
- Tailwind CSS v4
- Prisma ORM (SQLite, local dev.db)
- Shadcn/UI (com @base-ui/react)
- react-hook-form

## Estrutura
- `/src/app` - Rotas do Next.js App Router (páginas)
- `/src/components` - Componentes React (ui/ e layout/)
- `/src/lib` - Funções utilitárias
  - `/db/` - Server Actions (prisma)
  - `/generators/` - Gerador de roteiros baseado em templates
- `/src/data` - Dados estáticos (tipos de conteúdo, estilos)
- `/src/types` - Tipos TypeScript
- `/prisma/schema.prisma` - Schema do banco SQLite

## Regras
1. Nunca usar API externa obrigatória - o gerador é local por templates
2. Comunicação pública responsável: sem fake news, ataques pessoais, promessas impossíveis
3. Estilo visual: preto, branco, cinza - futurista, limpo, sério, institucional
4. Sem emojis em código, sem cores chamativas
5. Card components com efeito glassmorphism (classe .glass)
6. Layout responsivo com sidebar fixa de 280px
7. Server Components por padrão, "use client" apenas quando necessário
8. Server Actions em /lib/db para operações no banco

## Para evoluir (futuro)
- Integrar OpenAI, Gemini ou Ollama em /lib/generators
- Substituir templates locais por chamadas de API
- Adicionar autenticação
- Migrar de SQLite para PostgreSQL
- Adicionar testes

## Comandos
- `npm run dev` - Desenvolvimento
- `npm run build` - Build
- `npm run lint` - Lint
- `npx prisma migrate dev` - Migração do banco
- `npx prisma studio` - Visualizar dados

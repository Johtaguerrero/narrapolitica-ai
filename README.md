# NarraPolítica AI

Plataforma para assessores, comunicadores e políticos criarem roteiros, discursos, textos para Reels, legendas e ideias de postagens com base no perfil público do Instagram do político.

**Comunicação pública responsável, transparente e cidadã.**

## Stack

- **Next.js 16** (App Router, RSC, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **SQLite** (banco local via Prisma)
- **Prisma ORM**
- **Shadcn/UI** (componentes)
- **react-hook-form** (formulários)

## Funcionalidades

1. **Dashboard** - Visão geral com cards de acesso rápido e últimos roteiros
2. **Cadastro de Perfil Político** - Dados do político para personalização
3. **Análise de Instagram** - Diagnóstico simulado de posicionamento digital
4. **Criador de Roteiros** - Geração baseada em tipo, duração, estilo, tema e formato
5. **Caixa de Reels** - Kanban para gerenciar produção (Ideias → Roteirizado → Gravado → Editado → Publicado → Arquivado)
6. **Biblioteca de Estilos** - 10 estilos prontos de comunicação
7. **Discursos Salvos** - Busca e filtros por tema, tipo, estilo
8. **Calendário Editorial** - Planejamento semanal

## Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
# O arquivo .env já contém DATABASE_URL="file:./dev.db"
# Apenas execute a migração:
npx prisma migrate dev --name init

# 3. Iniciar desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
├── src/
│   ├── app/           # Páginas (Next.js App Router)
│   │   ├── dashboard/
│   │   ├── perfil/
│   │   ├── analise/
│   │   ├── roteiro/
│   │   ├── caixa-reels/
│   │   ├── biblioteca/
│   │   ├── discursos/
│   │   └── calendario/
│   ├── components/    # Componentes React
│   │   ├── ui/        # Shadcn/UI
│   │   └── layout/    # Sidebar
│   ├── lib/
│   │   ├── db/        # Server Actions (Prisma)
│   │   └── generators/# Gerador de roteiros (templates)
│   ├── data/          # Dados estáticos
│   └── types/         # Tipos TypeScript
├── prisma/
│   └── schema.prisma  # Schema do banco
└── README.md
```

## Modelos do Banco

- `PoliticalProfile` - Perfis de políticos
- `InstagramAnalysis` - Análises de Instagram
- `Script` - Roteiros gerados
- `ReelCard` - Cards do kanban
- `StylePreset` - Estilos de comunicação
- `EditorialCalendarItem` - Itens do calendário

## Evolução Futura

- Integração com OpenAI / Gemini / Ollama para geração avançada
- Autenticação e multiusuário
- Deploy com PostgreSQL
- API real do Instagram
- Exportação de roteiros em PDF

## Subir no GitHub

```bash
git remote add origin https://github.com/seu-usuario/narrapolitica-ai.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

## Licença

MIT

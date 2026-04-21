# Modelos C4 — Sistema de Gestão para Confeitaria

> Os diagramas abaixo utilizam sintaxe **Mermaid** (renderizável no GitHub, VS Code e ferramentas compatíveis).

---

## Nível 1 — Diagrama de Contexto do Sistema

Mostra o sistema como uma caixa preta e suas relações com usuários e sistemas externos.

```mermaid
C4Context
    title Sistema de Gestão para Confeitaria — Contexto

    Person(confeiteira, "Confeiteira / Administradora", "Usuária principal que gerencia pedidos, receitas e estoque via navegador web")

    System(confeitariaApp, "Sistema de Gestão para Confeitaria", "Aplicação web para gerenciar pedidos, receitas (fichas técnicas) e estoque de ingredientes de confeitarias artesanais")

    System_Ext(clerk, "Clerk", "Serviço de autenticação e gestão de identidade (Auth as a Service)")
    System_Ext(supabase, "Supabase / PostgreSQL", "Banco de dados relacional gerenciado na nuvem")
    System_Ext(vercel, "Vercel", "Plataforma de hospedagem e deploy para frontend (Next.js) e backend (FastAPI serverless)")

    Rel(confeiteira, confeitariaApp, "Acessa via navegador web (mobile e desktop)", "HTTPS")
    Rel(confeitariaApp, clerk, "Autentica usuários, valida JWTs, sincroniza perfis via webhook", "HTTPS / JWT")
    Rel(confeitariaApp, supabase, "Persiste e consulta dados (pedidos, receitas, estoque, usuários)", "PostgreSQL / TCP")
    Rel(confeitariaApp, vercel, "Hospedado e implantado automaticamente via CI/CD", "GitHub Actions")
```

---

## Nível 2 — Diagrama de Contêineres

Mostra os principais contêineres (processos / aplicações) que compõem o sistema.

```mermaid
C4Container
    title Sistema de Gestão para Confeitaria — Contêineres

    Person(confeiteira, "Confeiteira", "Acessa pelo celular ou navegador")

    System_Boundary(confeitariaApp, "Sistema de Gestão para Confeitaria") {
        Container(frontend, "Frontend Web", "Next.js 14 / TypeScript / Tailwind CSS", "Interface responsiva (mobile-first) para gestão de pedidos, receitas e estoque. Hospedada na Vercel.")
        Container(backend, "Backend API", "Python / FastAPI", "API RESTful com Clean Architecture. Expõe endpoints para pedidos, receitas, estoque e perfil. Hospedada na Vercel (serverless).")
        ContainerDb(db, "Banco de Dados", "PostgreSQL (Supabase)", "Armazena usuários, pedidos, receitas e estoque. Schema versionado via Alembic.")
    }

    System_Ext(clerk, "Clerk", "Auth as a Service — SSO, JWT, webhooks")

    Rel(confeiteira, frontend, "Usa", "HTTPS / Browser")
    Rel(frontend, backend, "Chama endpoints REST com JWT no header", "HTTPS / JSON")
    Rel(frontend, clerk, "Gerencia sessão e autenticação do usuário", "HTTPS / Clerk SDK")
    Rel(backend, db, "Lê e escreve dados via SQLAlchemy ORM", "PostgreSQL")
    Rel(backend, clerk, "Valida JWTs (JWKS) e processa webhooks de sincronização de usuário", "HTTPS")
```

---

## Nível 3 — Diagrama de Componentes (Backend)

Detalha os principais componentes internos da API FastAPI.

```mermaid
C4Component
    title Backend API — Componentes (Clean Architecture)

    Container_Boundary(backend, "Backend API — FastAPI") {

        Component(routers, "Routers (Presentation)", "FastAPI APIRouter", "Define endpoints HTTP: /receitas, /pedidos, /perfil, /webhooks, /health")
        Component(controllers, "Controllers (Presentation)", "Python Classes", "Orquestra a execução dos Use Cases a partir dos dados da requisição HTTP")
        Component(schemas, "Schemas (Presentation)", "Pydantic Models", "Valida e serializa dados de entrada (Request) e saída (Response)")

        Component(usecases, "Use Cases (Application)", "Python Classes", "Implementa regras de negócio: CriarPedido, EditarReceita, ListarPedidos, etc.")
        Component(gateways, "Gateway Interfaces (Application)", "Abstract Base Classes", "Contratos abstratos de repositório: RepositorioDePedido, RepositorioDeReceita, RepositorioDeUsuario")

        Component(entities, "Entities (Domain)", "Python Dataclasses", "Modelos de domínio puros: Pedido, Receita, User — com regras de negócio intrínsecas")

        Component(repositories, "Repositories (Infrastructure)", "SQLAlchemy Implementations", "Implementações concretas dos gateways: consultas SQL via ORM")
        Component(models, "ORM Models (Infrastructure)", "SQLAlchemy Models", "Mapeamento objeto-relacional para as tabelas do banco de dados")
        Component(mappers, "Mappers (Infrastructure)", "Python Functions", "Conversão entre entidades de domínio e modelos ORM (bidirecional)")
        Component(authMiddleware, "Auth Middleware (Infrastructure)", "FastAPI Depends", "Valida JWT do Clerk via JWKS e extrai user_id para as rotas protegidas")
        Component(logging, "Logging Middleware (Infrastructure)", "Python Middleware", "Gera request_id, registra logs estruturados em JSON com correlação de requisições")
    }

    ContainerDb(db, "PostgreSQL", "Supabase")
    System_Ext(clerk, "Clerk JWKS")

    Rel(routers, controllers, "Delega processamento")
    Rel(controllers, schemas, "Valida entrada e formata saída")
    Rel(controllers, usecases, "Executa caso de uso")
    Rel(usecases, gateways, "Depende de abstração (DIP)")
    Rel(usecases, entities, "Manipula entidades de domínio")
    Rel(repositories, gateways, "Implementa interface")
    Rel(repositories, models, "Consulta via ORM")
    Rel(repositories, mappers, "Converte entidade <-> ORM model")
    Rel(models, db, "Persiste dados")
    Rel(authMiddleware, clerk, "Valida JWT (JWKS endpoint)")
    Rel(routers, authMiddleware, "Injeta via FastAPI Depends")
    Rel(routers, logging, "Intercepta toda requisição")
```

---

## Nível 3 — Diagrama de Componentes (Frontend)

```mermaid
C4Component
    title Frontend Web — Componentes (Next.js App Router)

    Container_Boundary(frontend, "Frontend Web — Next.js 14") {
        Component(middleware, "Middleware de Auth", "Next.js Middleware / Clerk", "Protege rotas autenticadas, redireciona para login se sessão inválida")
        Component(pages, "Pages / App Router", "React Server Components + Client Components", "Telas: Dashboard, Pedidos, Receitas, Estoque, Perfil, Configurações")
        Component(components, "Componentes de UI", "React / Tailwind CSS", "Navbar, Sidebar, StatusBadge, DonutProgress, Cards, Formulários responsivos")
        Component(apiClient, "API Client", "Axios / Fetch", "Encapsula chamadas HTTP ao Backend FastAPI com JWT no header Authorization")
        Component(authProvider, "Auth Provider", "Clerk Next.js SDK", "Gerencia estado de sessão, token JWT e dados do perfil do usuário logado")
    }

    Container(backend, "Backend API", "FastAPI")
    System_Ext(clerk, "Clerk", "Auth as a Service")

    Rel(middleware, authProvider, "Verifica sessão ativa")
    Rel(pages, components, "Renderiza componentes")
    Rel(pages, apiClient, "Solicita dados ao backend")
    Rel(apiClient, backend, "Requisições REST com Bearer JWT", "HTTPS")
    Rel(authProvider, clerk, "Gerencia tokens e sessão", "HTTPS")
    Rel(middleware, clerk, "Valida sessão nas rotas protegidas", "HTTPS")
```

---

## Nível 4 — Diagrama de Código (Fluxo: Criar Pedido)

Sequência simplificada para o caso de uso de maior criticidade do negócio.

```mermaid
sequenceDiagram
    actor Confeiteira
    participant FE as Frontend (Next.js)
    participant API as Backend (FastAPI)
    participant Auth as Clerk JWKS
    participant DB as PostgreSQL

    Confeiteira->>FE: Preenche formulário "Novo Pedido" e clica em Criar
    FE->>FE: Obtém JWT da sessão Clerk
    FE->>API: POST /pedidos/ { cliente_nome, data_entrega, ... } + Bearer JWT
    API->>API: LoggingMiddleware — gera request_id, loga início
    API->>Auth: Valida assinatura do JWT (JWKS)
    Auth-->>API: user_id extraído
    API->>API: PedidoController.handle_criar_pedido(payload, user_id)
    API->>API: CriarPedido usecase — cria entidade Pedido(status=Pendente)
    API->>DB: INSERT INTO pedidos (cliente_nome, status='Pendente', user_id, ...)
    DB-->>API: pedido criado com id gerado
    API->>API: PedidoMapper — converte ORM model → entidade → PedidoResponse schema
    API->>API: LoggingMiddleware — loga fim com status 201 e request_id
    API-->>FE: 201 Created { id, cliente_nome, status: "Pendente", ... }
    FE-->>Confeiteira: Exibe confirmação e redireciona para detalhe do pedido
```

---

**Versão:** 1.0
**Data:** 2026-04-20
**Autor:** Equipe de Desenvolvimento

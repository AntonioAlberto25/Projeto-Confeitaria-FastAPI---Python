# Especificação Técnica — Sistema de Gestão para Confeitaria

**Versão:** 2.0
**Data:** 2026-04-20
**Status:** Aprovado

---

## 1. Visão Geral do Projeto

**Nome do Projeto:** Sistema de Gestão para Confeitaria
**Descrição:** Plataforma web mobile-first para gestão de receitas, pedidos e estoque de confeitarias artesanais, com autenticação integrada via Clerk e persistência em PostgreSQL (Supabase).
**Objetivo Principal:** API robusta e escalável suportando o fluxo ponta a ponta: ficha técnica de receita → pedido → baixa de estoque → painel de produção.

---

## 2. Arquitetura Técnica

### 2.1 Padrão Arquitetural

O backend segue **Clean Architecture** com separação estrita por camadas:

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (FastAPI Routers / Controllers)  │
│  Schemas Pydantic — validação e serialização HTTP    │
├─────────────────────────────────────────────────────┤
│  Application Layer (Use Cases)                       │
│  Interfaces de Gateway (contratos abstratos)         │
├─────────────────────────────────────────────────────┤
│  Domain Layer (Entidades e Regras de Negócio Core)   │
│  Sem dependências externas — python puro             │
├─────────────────────────────────────────────────────┤
│  Infrastructure Layer                                │
│  Repositórios SQLAlchemy, Mappers, Auth (Clerk)      │
│  Logging Middleware, Dependency Injection            │
└─────────────────────────────────────────────────────┘
```

**Princípio de Dependência:** camadas internas não dependem de camadas externas. Use cases dependem de interfaces (gateways), não de implementações concretas.

### 2.2 Estrutura de Diretórios

```text
Projeto-Confeitaria-FastAPI---Python/
├── .env                          # Variáveis de ambiente (nunca commitado)
├── .env.example                  # Template de variáveis de ambiente
├── docker-compose.yml            # Orquestração local (PostgreSQL + Backend + Frontend)
├── docs/                         # Documentação do projeto
│   ├── prd.md                    # Product Requirements Document
│   ├── spec_tech.md              # Especificação Técnica (este arquivo)
│   ├── spec_ui.md                # Especificação de Interface
│   ├── design_system.md          # Design System (tokens, componentes, diretrizes)
│   ├── problem_statement.md      # Declaração de Problema
│   ├── lean_canvas.md            # Lean Canvas
│   ├── persona.md                # Persona da usuária principal
│   ├── jornada_usuario.md        # Jornada do Usuário
│   └── modelos_c4.md             # Modelos de Arquitetura C4 (Mermaid)
├── infra/                        # Infraestrutura como Código (IaC)
│   ├── terraform/                # Configurações Terraform
│   └── docker/                   # Dockerfiles e configurações de container
├── apps/
│   ├── backend/
│   │   ├── Dockerfile            # Multi-stage build (Python 3.12 slim)
│   │   ├── requirements.txt      # Dependências Python
│   │   ├── alembic.ini           # Configuração de migrações
│   │   ├── migrations/           # Scripts de migração Alembic
│   │   ├── vercel.json           # Configuração de deploy serverless
│   │   └── src/
│   │       ├── main.py           # Entrypoint FastAPI + middlewares
│   │       ├── domain/entity/    # Entidades de domínio (Pedido, Receita, User)
│   │       ├── application/
│   │       │   ├── gateways/     # Interfaces abstratas de repositório
│   │       │   └── usecases/     # Casos de uso (pedido, receita, user)
│   │       ├── infrastructure/
│   │       │   ├── auth/         # Validação JWT Clerk
│   │       │   ├── gateway/      # Implementações concretas dos repositórios
│   │       │   ├── mappers/      # Conversores entidade <-> ORM model
│   │       │   ├── persistencia/ # Modelos SQLAlchemy + conexão ao banco
│   │       │   └── repositorios/ # Repositórios SQLAlchemy
│   │       ├── presentation/
│   │       │   ├── controllers/  # Orquestradores de casos de uso
│   │       │   ├── routes/       # FastAPI routers (pedidos, receitas, perfil, health)
│   │       │   └── schemas/      # Pydantic request/response schemas
│   │       └── test/             # Testes unitários, integração e aceite
│   └── frontend/
│       ├── Dockerfile            # Multi-stage build (Node.js LTS)
│       ├── package.json          # Dependências Node.js
│       └── src/
│           ├── app/              # Next.js App Router (páginas e layouts)
│           ├── components/       # Componentes reutilizáveis
│           ├── lib/              # Utilitários e cliente HTTP
│           └── middleware.ts     # Middleware de autenticação Clerk
└── .github/
    └── workflows/
        ├── deploy.yml            # Pipeline CI/CD principal
        └── build_manual.yaml     # Trigger manual de testes
```

---

## 3. Stack Tecnológico

### 3.1 Backend

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Python | 3.12 | Linguagem principal |
| FastAPI | 0.115+ | Framework web assíncrono |
| SQLAlchemy | 2.0+ | ORM para PostgreSQL |
| Alembic | 1.13+ | Migrações de banco de dados |
| Pydantic | 2.x | Validação de dados e schemas |
| python-jose | 3.3+ | Validação de JWTs (Clerk) |
| httpx | 0.27+ | Cliente HTTP assíncrono |
| svix | 1.34+ | Processamento de webhooks Clerk |
| uvicorn | 0.30+ | Servidor ASGI |
| pytest | 8.x | Framework de testes |
| pytest-cov | 5.x | Cobertura de testes |
| ruff | 0.x | Linting e formatação Python |

### 3.2 Frontend

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Next.js | 14.x | Framework React com SSR/SSG |
| TypeScript | 5.x | Tipagem estática |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Clerk Next.js SDK | 6.x | Autenticação no frontend |
| Axios | 1.x | Cliente HTTP |
| Framer Motion | 12.x | Animações de UI |
| Lucide React | 0.x | Biblioteca de ícones |

### 3.3 Infraestrutura

| Componente | Tecnologia | Ambiente |
|-----------|-----------|---------|
| Banco de dados | PostgreSQL 15 (Supabase) | Produção |
| Banco de dados (local) | PostgreSQL 15 Alpine (Docker) | Desenvolvimento |
| Deploy backend | Vercel (serverless) | Produção |
| Deploy frontend | Vercel | Produção |
| CI/CD | GitHub Actions | Automação |
| Containers | Docker + Docker Compose | Desenvolvimento local |
| IaC | Terraform | Provisionamento de infra |

---

## 4. Componentes de Domínio e Regras de Negócio

### 4.1 Entidade: Receita

**Campos:**
- `id` (UUID)
- `nome` (string, obrigatório, único por usuário)
- `descricao` (string, opcional)
- `tempo_preparo` (inteiro, em minutos)
- `rendimento` (inteiro, > 0, em porções)
- `preco_venda_sugerido` (Decimal, > 0)
- `usuario_id` (string — Clerk user_id)

**Regras de domínio:**
- `rendimento` deve ser maior que 0.
- A leitura de `rendimento` não pode alterar o estado da entidade (imutabilidade).

### 4.2 Entidade: Pedido

**Campos:**
- `id` (UUID)
- `cliente_nome` (string, obrigatório)
- `cliente_telefone` (string, opcional)
- `data_entrega` (date)
- `status` (`Pendente` | `Em Producao` | `Concluido` | `Cancelado`)
- `descricao` (string, opcional)
- `tipo_entrega` (string)
- `preco_total` (Decimal)
- `user_id` (string — Clerk user_id)
- `endereco_entrega` (string, opcional)

**Regras de domínio:**
- Pedido nasce com status `Pendente`.
- Transições permitidas: `Pendente → Em Producao → Concluido`.
- `Cancelado` permitido apenas para pedidos em estado não `Concluido`.
- Transições inválidas lançam exceção de domínio.

### 4.3 Entidade: User

**Campos:**
- `id` (UUID interno)
- `clerk_id` (string — identificador externo Clerk)
- `email` (string)
- `nome` (string)

---

## 5. Casos de Uso (Application Layer)

### 5.1 Receitas
- `CriarReceita` — persiste nova receita vinculada ao usuário autenticado
- `EditarReceita` — atualiza campos de receita existente
- `ExcluirReceita` — remove receita pelo ID
- `ListarReceitas` — lista receitas do usuário com suporte a filtros
- `BuscarReceitaPorId` — retorna detalhes de uma receita específica
- `BuscarReceitaPorNome` — busca receitas por nome parcial

### 5.2 Pedidos
- `CriarPedido` — cria pedido com status inicial `Pendente`
- `EditarPedido` — atualiza dados do pedido
- `ExcluirPedido` — remove pedido pelo ID
- `ListarPedidos` — lista pedidos do usuário
- `BuscarPedidoPorId` — retorna detalhes de pedido específico
- `BuscarPedidoPorNomeCliente` — busca pedidos por nome do cliente

### 5.3 Usuários
- `RegistrarUsuario` — sincroniza novo usuário do webhook Clerk
- `BuscarUsuarioPorId` — consulta usuário pelo ID interno ou clerk_id

---

## 6. Contratos de API (Endpoints)

| Método | Endpoint | Autenticação | Descrição |
|--------|---------|-------------|-----------|
| GET | `/health` | Não | Status do serviço |
| GET | `/debug` | Não | Diagnóstico de variáveis de ambiente |
| POST | `/receitas` | JWT Clerk | Criar receita |
| GET | `/receitas` | JWT Clerk | Listar receitas do usuário |
| GET | `/receitas/{id}` | JWT Clerk | Detalhar receita |
| PUT | `/receitas/{id}` | JWT Clerk | Atualizar receita |
| DELETE | `/receitas/{id}` | JWT Clerk | Excluir receita |
| POST | `/pedidos/` | JWT Clerk | Criar pedido |
| GET | `/pedidos/` | JWT Clerk | Listar pedidos do usuário |
| GET | `/pedidos/{id}` | JWT Clerk | Detalhar pedido |
| PUT | `/pedidos/{id}` | JWT Clerk | Atualizar pedido |
| DELETE | `/pedidos/{id}` | JWT Clerk | Excluir pedido |
| GET | `/perfil/me` | JWT Clerk | Perfil do usuário autenticado |
| POST | `/perfil/sincronizar` | Não | Sincronizar perfil via webhook |
| POST | `/webhooks` | Svix | Webhooks do Clerk |

**Documentação interativa:** disponível em `/docs` (Swagger UI) e `/redoc`.

---

## 7. Observabilidade e Rastreabilidade (RNF-04)

### 7.1 Logging Estruturado

O sistema implementa middleware de logging no FastAPI com as seguintes características:

- **Formato:** JSON estruturado (machine-readable)
- **request_id:** UUID único por requisição, incluído em todos os logs da mesma chamada
- **Campos obrigatórios em todo log:**

```json
{
  "timestamp": "2026-04-20T10:30:00.123Z",
  "level": "INFO",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "path": "/pedidos/",
  "status_code": 201,
  "duration_ms": 45.2,
  "service": "confeitaria-api"
}
```

- **Eventos críticos registrados:** criação/alteração de pedidos, erros de autenticação, falhas de banco, webhooks recebidos.
- **Níveis de log:** DEBUG (dev), INFO (produção), WARNING (alertas), ERROR (falhas).

### 7.2 Health Check

- **Endpoint:** `GET /health`
- **Resposta:** `{ "status": "ok", "service": "confeitaria-api", "version": "0.1.0" }`
- **Usado por:** Docker health check, CI/CD pipeline, monitoramento externo.

---

## 8. Segurança (RNF-02)

### 8.1 Autenticação

- JWT emitido pelo Clerk, validado via **JWKS** (JSON Web Key Set) público.
- Cada requisição protegida injeta via `FastAPI Depends` o `user_id` extraído do token.
- Tokens expirados retornam `401 Unauthorized`.

### 8.2 Proteção de Dados

- **Em trânsito:** TLS 1.2+ obrigatório (HTTPS).
- **Em repouso:** senhas nunca armazenadas no sistema (gerenciadas pelo Clerk).
- **SQL Injection:** prevenida pelo uso de ORM parametrizado (SQLAlchemy).
- **CORS:** configurado com origens autorizadas no middleware FastAPI.

### 8.3 Webhooks

- Assinatura Svix verificada no endpoint `/webhooks` antes de processar eventos.

---

## 9. Persistência (RNF-07)

### 9.1 Banco de Dados Relacional

- **Tecnologia:** PostgreSQL 15
- **Hospedagem produção:** Supabase (managed PostgreSQL)
- **Hospedagem desenvolvimento:** Docker (PostgreSQL 15 Alpine)
- **ORM:** SQLAlchemy 2.0 (estilo declarativo)
- **Migrações:** Alembic — schema versionado com rollback seguro

### 9.2 Modelos de Dados

**Tabela `users`:** id, clerk_id, email, nome, created_at
**Tabela `receitas`:** id, nome, descricao, tempo_preparo, rendimento, preco_venda_sugerido, usuario_id, created_at, updated_at
**Tabela `pedidos`:** id, cliente_nome, cliente_telefone, data_entrega, status, descricao, tipo_entrega, preco_total, user_id, endereco_entrega, created_at, updated_at

### 9.3 Estratégia de Backup

- Supabase realiza backups automáticos diários (plano gratuito: 7 dias de retenção).
- Migrações Alembic permitem recriação do schema em qualquer ambiente.

---

## 10. Portabilidade e Implantação (RNF-06)

### 10.1 Containerização

- **Padrão:** OCI (Open Container Initiative) — Docker.
- **Backend Dockerfile:** multi-stage build (deps → runtime), usuário não-root `appuser`, Python 3.12 slim.
- **Frontend Dockerfile:** multi-stage build (deps → build → runtime), usuário não-root `nextjs`, Next.js standalone output.
- **Docker Compose:** orquestra PostgreSQL + Backend + Frontend para desenvolvimento local.

### 10.2 Infraestrutura como Código (IaC)

- Configurações de infraestrutura versionadas na pasta `infra/terraform/`.
- Variáveis de ambiente gerenciadas como segredos no GitHub Actions e na Vercel.
- **Nunca** hardcodar credenciais ou URLs de banco no código.

### 10.3 CI/CD Pipeline (GitHub Actions)

```yaml
# Fluxo do pipeline em deploy.yml:
Trigger: push na branch main
  ↓
Quality Gate:
  - Lint frontend (ESLint)
  - Lint backend (Ruff)
  - Testes unitários + integração (pytest, cobertura mínima 70%)
  - Upload de relatório de cobertura
  ↓
Deploy Backend → Vercel (serverless FastAPI)
Deploy Frontend → Vercel (Next.js)
```

---

## 11. Manutenibilidade e Testabilidade (RNF-05)

### 11.1 Estratégia de Testes

| Tipo | Cobertura | Ferramentas | Localização |
|------|-----------|------------|------------|
| **Unitários — Domínio** | Entidades, regras de negócio | pytest | `test/pedido/`, `test/receita/`, `test/user/` |
| **Unitários — Use Cases** | Fluxos de aplicação com mocks | pytest + unittest.mock | `test/pedido/test_UseCasePedido.py` etc. |
| **Unitários — Mappers** | Conversão entidade ↔ ORM | pytest | `test/*/test_*Mapper.py` |
| **Integração — Presentation** | Endpoints HTTP ponta a ponta | pytest + FastAPI TestClient | `test/test_Presentation.py` |
| **Integração — Repositórios** | Consultas ao banco (mock de DB) | pytest | `test/infrastructure/test_Repositories.py` |
| **Aceite** | Fluxos completos de negócio | pytest + TestClient | `test/test_acceptance.py` |

**Cobertura mínima:** 70% do código backend (verificada em CI com `pytest-cov`).

### 11.2 Governança de Código (RNF-08)

- **Linting Python:** Ruff (substitui flake8 + isort + black)
- **Linting TypeScript:** ESLint com configuração Next.js
- **Formatação:** Prettier (frontend)
- **Pre-commit hooks:** configuráveis via `.pre-commit-config.yaml`
- **Isolamento de dependências:** `venv` Python, `node_modules` com package-lock.json

---

## 12. Padrões de Integração Frontend ↔ Backend

### 12.1 Autenticação

1. Next.js gerencia sessão via Clerk SDK.
2. Cliente obtém JWT da sessão atual via `useAuth().getToken()`.
3. JWT enviado no header `Authorization: Bearer <token>` em todas as requisições protegidas.
4. FastAPI valida JWT via JWKS e injeta `user_id` como dependência.

### 12.2 Fetching de Dados

- **React Server Components:** para páginas de listagem (pré-renderizadas no servidor Next.js).
- **Client Components + Axios:** para mutações e interações em tempo real.
- **Tipagem ponta a ponta:** schemas OpenAPI do FastAPI usados para gerar types TypeScript.

---

## 13. Roadmap Técnico

### Entregas Implementadas
- [x] CRUD de receitas completo (domínio, use cases, API, frontend)
- [x] CRUD de pedidos com transição de status
- [x] Autenticação Clerk integrada (frontend + backend)
- [x] Sincronização de usuário via webhook
- [x] Logging estruturado com request_id
- [x] Testes unitários (domínio, use cases, mappers)
- [x] Testes de integração (presentation, repositórios)
- [x] CI/CD com GitHub Actions
- [x] Docker e Docker Compose

### Backlog
- [ ] Testes de aceite ponta a ponta
- [ ] Painel de produção (dia/semana)
- [ ] Gestão de estoque com baixa automática
- [ ] Notificações de estoque crítico
- [ ] Paginação e filtros avançados

---

## 14. Referências

- [PRD](prd.md) — Requisitos funcionais e não funcionais
- [Modelos C4](modelos_c4.md) — Diagramas de arquitetura
- [Design System](design_system.md) — Padrões de UI
- [OpenAPI Docs](http://localhost:9090/docs) — Documentação interativa da API (ambiente local)

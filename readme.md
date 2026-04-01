# 🎂 Sistema de Gestão para Confeitaria (CMS)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

Uma plataforma especializada para confeitarias artesanais gerenciarem receitas, pedidos de produção e movimentações de estoque de forma eficiente.

---

## 🚀 Visão Geral

O **Sistema de Gestão para Confeitaria** foi criado para eliminar controles manuais (como cadernos ou planilhas simples) para pequenas confeitarias. Ele centraliza dados de clientes, fichas técnicas de receitas e níveis de estoque em tempo real.

### Principais Funcionalidades
- **Gestão de Receitas:** Fichas técnicas detalhadas com quantidades exatas de ingredientes e rendimento esperado.
- **Rastreamento de Pedidos:** Gerenciamento do ciclo de vida do pedido, de *Pendente* a *Concluído*.
- **Controle de Estoque:** Dedução de estoque automática ou sugerida baseada nos requisitos da receita durante a produção.
- **Autenticação:** Gerenciamento de acesso seguro via **Clerk**.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.x)
- **Frontend:** [Next.js](https://nextjs.org/) (TypeScript)
- **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Autenticação:** [Clerk](https://clerk.com/)
- **Infraestrutura:** [Docker Compose](https://docs.docker.com/compose/)
- **CI/CD:** GitHub Actions & Integração nativa com Vercel

---

## 📦 Estrutura do Projeto

Este repositório está organizado como um **monorepo**:

```text
.
├── apps/
│   ├── frontend/        # Aplicação Next.js
│   └── backend/         # Aplicação FastAPI (Arquitetura Limpa)
├── docs/                # Documentação do projeto (PRD, Spec Tech, UI)
├── infra/               # Scripts de infraestrutura
├── docker-compose.yml   # Configuração de múltiplos contêineres local
└── package.json         # Gerenciamento de workspaces
```

---

## 🛠️ Primeiros Passos

### Pré-requisitos
- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js](https://nodejs.org/) (LTS recomendada)
- [Python 3.11+](https://www.python.org/downloads/)

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/AntonioAlberto25/Projeto-Confeitaria-FastAPI---Python.git
   cd Projeto-Confeitaria-FastAPI---Python
   ```

2. **Configure as Variáveis de Ambiente:**
   Copie o arquivo de exemplo e preencha com suas chaves (Clerk, Supabase, etc.):
   ```bash
   cp .env.example .env
   ```

3. **Inicie com o Docker Compose:**
   ```bash
   docker-compose up --build
   ```

As aplicações estarão disponíveis em:
- **Frontend:** `http://localhost:3000`
- **Backend:** `http://localhost:9090` (Documentação da API em `/docs`)

---

## 📖 Documentação

Documentos detalhados podem ser encontrados na pasta `/docs`:
- [Requisitos de Produto (PRD)](./docs/prd.md)
- [Especificação Técnica](./docs/spech_tech.md)
- [Especificação de UI/UX](./docs/spech_ui.md)

---

## 🤝 Contribuição

1. Crie uma branch descritiva: `git checkout -b feature/nome-da-sua-feature`
2. Faça o commit das suas alterações: `git commit -m "Adicionar nova funcionalidade"`
3. Envie para a branch: `git push origin feature/nome-da-sua-feature`
4. Abra um Pull Request.

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações (se aplicável).

---

Desenvolvido com ❤️ pela equipe do **Grupo 7**.

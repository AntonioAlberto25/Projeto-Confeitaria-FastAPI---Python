# Product Requirements Document (PRD) - Sistema de Gestão para Confeitaria

## 1. Visão Geral do Produto
O Sistema de Gestão para Confeitaria é uma aplicação web centralizada criada para ajudar confeitarias artesanais de pequeno porte a organizarem seus fluxos operacionais de forma eficiente. A ferramenta eliminará a necessidade de controles manuais (cadernos e planilhas simples), fornecendo uma plataforma única para gerenciamento de pedidos, controle de receitas e gestão de estoque básico de ingredientes.

## 2. Público-Alvo e Persona
**A Usuária Principal: A Confeiteira Administradora**
* **Perfil:** Profissional que gerencia sozinha (ou com equipe muito reduzida) todo o ciclo de vida do negócio.
* **Dores:** Perda de tempo procurando informações descentralizadas, dificuldades para rastrear o andamento de pedidos, falta de ingredientes no meio de uma receita por falha no controle de estoque, e dificuldade em precificar ou padronizar receitas.
* **Necessidades:** Um sistema intuitivo, rápido e fácil de usar (com baixo atrito), focado na praticidade do dia a dia, acessível de qualquer dispositivo.

## 3. Objetivos do Produto
1. **Centralização:** Consolidar informações de clientes, pedidos, receitas e estoque num único local.
2. **Organização:** Melhorar o fluxo de planejamento e produção diária da confeitaria.
3. **Rastreabilidade:** Evitar esquecimentos de pedidos e garantir a disponibilidade de insumos.
4. **Produtividade:** Reduzir o tempo gasto em gestão administrativa, liberando a confeiteira para focar na produção artesanal.

## 4. Requisitos Funcionais (Core Features)

### 4.1. Autenticação e Gestão de Usuários (Integração Clerk)
* O sistema deve permitir o cadastro e login de usuários (Confeiteiros/Administradores) de forma segura utilizando o provedor Clerk.
* Recuperação de senha e gestão de perfil de usuário.
* O cadastro de usuário faz parte do escopo da v1 (via auto-cadastro habilitado no Clerk ou convite administrativo, conforme configuração do tenant).

### 4.2. Gestão de Receitas e Fichas Técnicas
* **Criar Receita:** Nome, descrição, tempo de preparo, rendimento (em porções) e preço de venda sugerido.
* **Ingredientes da Receita:** Vincular ingredientes necessários e suas respectivas quantidades exatas para o rendimento informado.
* **Visualizar, Editar e Excluir** receitas cadastradas.

### 4.3. Gestão de Pedidos
* **Registro de Pedido:** Cadastrar novo pedido informando cliente, data de entrega, status (Pendente, Em Produção, Concluído, Cancelado), e as receitas solicitadas.
* **Painel de Produção:** Visão resumida dos pedidos do dia/semana para facilitar a organização da produção.
* **Regra de Status:** Todo pedido deve ser criado com status inicial **Pendente**. Transições permitidas: Pendente -> Em Produção -> Concluído, com opção de Cancelado a partir de estados não concluídos.

### 4.4. Gestão de Estoque Básico (Integração Supabase)
* **Cadastro de Ingredientes:** Cadastrar insumos básicos com nome, unidade de medida (kg, g, l, ml, unidades) e quantidade em estoque.
* **Baixa Automática/Sugerida:** Ao marcar um pedido como "Em Produção" ou "Concluído", o sistema deve abater (ou sugerir o abatimento) dos ingredientes utilizados no estoque, com base na ficha técnica da receita.

## 5. Requisitos Não Funcionais

### 5.1. Arquitetura e Tecnologias Aplicadas
* **Backend:** API desenvolvida em Python utilizando o framework **FastAPI**.
* **Frontend:** Framework web moderno flexível e responsivo (a definir, suportando hospedagem estática ou serverless).
* **Banco de Dados:** **Supabase** (PostgreSQL na nuvem) para persistência e gestão dos dados estruturados.
* **Autenticação:** **Clerk** (Autenticação como serviço - Auth as a Service).

### 5.2. Deploy, Integração e Entrega Contínua (CI/CD)
* **Hospedagem Frontend/Backend:** Deploy automatizado na plataforma **Vercel**.
* **Pipeline de CI/CD:** GitHub Actions (ou integração nativa da Vercel) responsável por rodar testes (pytest) e validar builds antes de aplicar mudanças em produção.

### 5.3. Usabilidade
* **Acessibilidade Móvel:** Sendo a confeiteira uma profissional que passa grande parte do tempo na cozinha (longe de um desktop), o sistema (especialmente o frontend) deve ser totalmente responsivo, funcionando perfeitamente em telas de smartphones (Mobile-First approach).

## 6. Métricas de Sucesso
* Criação bem-sucedida do fluxo ponta a ponta (cadastro de insumo -> montagem de receita -> pedido do cliente -> baixa de estoque correspondente).
* Cobertura de testes unitários no backend (mínimo de 80%).
* Tempo de resposta da API (FastAPI) inferior a 200ms para a maioria das requisições.

## 7. Fora de Escopo (Fase Inicial)
* Sistema financeiro completo (emissão de NF, fluxo de caixa avançado).
* Loja virtual (E-commerce) B2C permitindo que o cliente final faça compras diretamente pelo sistema sem interação com a confeitaria.
* Gestão complexa de rotas de entrega.

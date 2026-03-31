# Especificação Técnica - Sistema de Gestão para Confeitaria

## 1. Visão Geral do Projeto

**Nome do Projeto:** Sistema de Gestão para Confeitaria  
**Descrição:** Plataforma para gestão de receitas, pedidos e estoque básico de ingredientes para confeitarias artesanais, com autenticação integrada.  
**Objetivo Principal:** Fornecer uma API robusta e escalável para suportar o fluxo ponta a ponta: cadastro de insumo -> ficha técnica de receita -> pedido -> baixa de estoque.

---

## 2. Arquitetura Técnica

### 2.1 Padrão Arquitetural

O projeto segue **Clean Architecture**, com separação por camadas:

```
Presentation Layer (FastAPI Routers/Controllers)
        
Application Layer (Use Cases)
        
Domain Layer (Entities e Regras de Negócio)
        
Infrastructure Layer (Repositories/Gateways)
```

### 2.2 Estrutura de Diretórios (estado atual)

```
Projeto-Confeitaria-Python/

 main.py
 readme.md
 docs/
    prd.md
    spech_tech.md
    spech_ui.md

 src/
     application/
        gateways/
           repositorioDeReceita.py
        usecases/
            receita/
                criarReceita.py
     domain/
        entity/
            receita/
                receita.py
     test/
         receita/
             test_Receita.py
             test_UseCaseReceita.py
```

### 2.3 Estrutura-alvo (incremental)

Adicionar módulos para cobrir o PRD:
- `domain/entity/pedido/`
- `domain/entity/ingrediente/`
- `application/usecases/pedido/`
- `application/usecases/ingrediente/`
- `application/usecases/estoque/` (baixa automática/sugerida)
- `application/gateways/` para pedidos, ingredientes e movimentos de estoque
- `presentation/routes/` para receitas, pedidos, ingredientes e produção

---

## 3. Componentes de Domínio e Regras de Negócio

### 3.1 Receita

A entidade `Receita` representa a ficha técnica de produção.

Campos mínimos:
- nome
- descricao
- tempo_preparo
- rendimento (porções)
- preco_venda_sugerido
- ingredientes da receita (ingrediente, unidade, quantidade)
- usuario_id

Regras:
- `rendimento` deve ser maior que 0.
- Leitura de `rendimento` **não pode** alterar estado da entidade.
- Receita não deve ser salva sem ao menos um ingrediente vinculado.

### 3.2 Pedido

Campos mínimos:
- cliente_nome
- cliente_telefone
- data_entrega
- status (`Pendente`, `Em Producao`, `Concluido`, `Cancelado`)
- itens (receita_id, quantidade)
- observacoes

Regras:
- Todo pedido nasce com status `Pendente`.
- Transições permitidas: `Pendente -> Em Producao -> Concluido`.
- `Cancelado` permitido apenas para pedidos não concluídos.

### 3.3 Ingrediente e Estoque

Campos mínimos:
- nome
- unidade_medida (`kg`, `g`, `l`, `ml`, `un`)
- quantidade_estoque
- estoque_minimo

Regras:
- Quantidade em estoque não pode ser negativa.
- Ao alterar pedido para `Em Producao` ou `Concluido`, calcular consumo com base na ficha técnica e aplicar baixa automática ou sugerida.
- Registrar movimentação de estoque para auditoria (entrada, saída, ajuste).

---

## 4. Casos de Uso (Application Layer)

### 4.1 Receitas
- criar_receita
- editar_receita
- excluir_receita
- listar_receitas
- detalhar_receita

### 4.2 Pedidos
- criar_pedido
- editar_pedido
- listar_pedidos
- detalhar_pedido
- alterar_status_pedido
- cancelar_pedido

### 4.3 Estoque e Ingredientes
- criar_ingrediente
- editar_ingrediente
- listar_ingredientes
- ajustar_estoque
- calcular_consumo_por_pedido
- aplicar_baixa_estoque_por_status

### 4.4 Produção
- listar_painel_producao_dia
- listar_painel_producao_semana

---

## 5. Contratos de Gateway (Interfaces)

Interfaces abstratas recomendadas:
- `RepositorioDeReceita`
- `RepositorioDePedido`
- `RepositorioDeIngrediente`
- `RepositorioDeMovimentoEstoque`

Responsabilidades:
- Persistência e consulta de dados.
- Operações transacionais para mudança de status e baixa de estoque.
- Isolamento da infraestrutura (Supabase/PostgreSQL) da regra de negócio.

---

## 6. Fluxos Técnicos Críticos

### 6.1 Criação de Receita

```
POST /receitas
  -> validar payload
  -> criar entidade Receita
  -> persistir receita + itens da ficha técnica
  -> retornar 201
```

### 6.2 Criação de Pedido

```
POST /pedidos
  -> validar cliente e itens
  -> criar pedido com status Pendente
  -> persistir pedido
  -> retornar 201
```

### 6.3 Alteração de Status com Baixa de Estoque

```
PATCH /pedidos/{id}/status
  -> validar transição de status
  -> se novo status em (Em Producao, Concluido):
       calcular consumo por receita x quantidade
       aplicar baixa automática ou gerar sugestão de baixa
       registrar movimentos de estoque
  -> persistir novo status
  -> retornar 200
```

---

## 7. Tecnologias e Arquitetura de Integração

### 7.1 Stack Tecnológico
- **Frontend:** Next.js (React)
- **Backend:** FastAPI (Python 3.x)
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticação:** Clerk
- **Testes:** pytest (Backend) / Jest ou Vitest (Frontend)
- **Deploy:** Vercel
- **CI/CD:** GitHub Actions (ou integração nativa da Vercel)

### 7.2 Padrões de Integração Next.js x FastAPI

A comunicação entre a interface (Next.js) e a API (FastAPI) seguirá os seguintes padrões:

1. **Autenticação e Sessão (Clerk):** 
   - O Next.js gerencia o estado de autenticação utilizando os fluxos e componentes base do Clerk.
   - O cliente (frontend) obtém um token JWT de sessão atual e o envia via cabeçalho HTTP (`Authorization: Bearer <token>`) em todas as requisições protegidas direcionadas ao backend.
   - O FastAPI, através de uma dependência (Dependency Injection), valida criptograficamente a assinatura deste JWT (via JWKS público do Clerk), extraindo de forma segura metadados como `user_id`.

2. **CORS (Cross-Origin Resource Sharing):**
   - O backend FastAPI define as políticas de `CORSMiddleware` restringindo ou autorizando origens ativas (ex: `localhost:3000` em desenvolvimento e domínio customizado no Vercel). Isso viabiliza interações seguras client-side.

3. **Estratégia de Fetching e Estado (Next.js App Router):**
   - **React Server Components (RSC):** Utilizados para páginas de visualização ou dashboards (ex: painéis de pedidos pendentes). O servidor Next.js faz a requisição diretamente ao FastAPI, pré-renderizando resultados e ocultando possíveis complexidades do cliente.
   - **Client Components & Data Mutation:** Em interfaces muito interativas (como ajustar itens de uma receita dinamicamente ou manipular tabelas), os dados serão trazidos/atualizados preferencialmente invocando a API FastAPI através de bibliotecas de gerenciamento de estado server-state (como TanStack React Query SWR), para lidar eficientemente com cache no navegador, refetching em foco e estados de loading.
   - **Server Actions:** Podem atuar como um BFF leve (Backend For Frontend), recebendo submissões de formulário no lado servidor (Next.js) e compondo a chamada final para o FastAPI, encapsulando segredos se aplicável.

4. **Tipagem Estática Ponto a Ponto (Contratos OpenAPI):**
   - O frontend de Next.js com TypeScript consumirá o schema OpenAPI gerado automaticamente pelo FastAPI (em `/openapi.json`) para derivar os tipos (interfaces/types do TypeScript) via geradores (ex: `openapi-typescript` ou orval). Isso garante que mudanças em DTOs/Schemas no backend imediatamente apontem erros de linting em tempo de build no frontend caso ocorram quebras de contrato.

---

## 8. Requisitos Não Funcionais Técnicos

- Tempo de resposta alvo: < 200ms para a maioria das requisições.
- Cobertura mínima de testes unitários no backend: 80%.
- API documentada via OpenAPI/Swagger.
- Logs estruturados para rastreabilidade de erros e movimentações críticas.
- Arquitetura mobile-first no frontend consumindo endpoints enxutos.

---

## 9. Estratégia de Testes

### 9.1 Domínio
- Validar regras de receita, pedido e estoque.
- Garantir que `rendimento` não sofre mutação em leitura.
- Validar bloqueio de transições de status inválidas.

### 9.2 Use Cases
- Cenários felizes e de erro para criação/edição/exclusão.
- Cenários de baixa automática/sugerida de estoque.
- Cenários de concorrência simples em alteração de status.

### 9.3 Integração
- Integração FastAPI + repositórios.
- Fluxo ponta a ponta: ingrediente -> receita -> pedido -> baixa.

---

## 10. Roadmap Técnico

### 10.1 Entregas de Curto Prazo
- [ ] CRUD de receitas completo.
- [ ] CRUD de ingredientes e listagem de estoque.
- [ ] CRUD de pedidos com transição de status válida.
- [ ] Baixa automática/sugerida de estoque por status de pedido.

### 10.2 Entregas de Médio Prazo
- [ ] Painel de produção (dia/semana).
- [ ] Histórico de movimentação de estoque.
- [ ] Paginação e filtros avançados.

### 10.3 Qualidade e Operação
- [ ] CI/CD com testes automatizados.
- [ ] Monitoramento e logging estruturado.
- [ ] Hardening de segurança na integração com Clerk.

---

## 11. Versão do Documento

**Versão:** 1.1  
**Última Atualização:** 2026-03-25  
**Autor:** Equipe de Desenvolvimento

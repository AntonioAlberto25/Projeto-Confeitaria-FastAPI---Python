# Product Requirements Document (PRD) — Sistema de Gestão para Confeitaria

**Versão:** 2.0
**Data:** 2026-04-20
**Status:** Aprovado
**Autor:** Equipe de Desenvolvimento

---

## 1. Visão Geral do Produto

O **Sistema de Gestão para Confeitaria** é uma aplicação web mobile-first criada para confeitarias artesanais de pequeno porte. A ferramenta centraliza o gerenciamento de pedidos e receitas (fichas técnicas), eliminando controles manuais (cadernos, planilhas e mensagens) e reduzindo erros operacionais.

**Proposta de valor central:** Da receita ao pedido entregue — tudo em um só lugar, acessível do celular, em tempo real.

---

## 2. Público-Alvo e Persona

**Persona Principal: Ana Paula — Confeiteira Autônoma**

| Atributo | Detalhe |
|---------|---------|
| Perfil | Confeiteira artesanal autônoma, gerencia sozinha ou com 1-2 colaboradores |
| Dispositivo principal | Smartphone Android (uso durante a produção na cozinha) |
| Dores críticas | Pedidos esquecidos, falta de ingrediente durante a produção, dificuldade de precificar |
| Necessidades | Sistema intuitivo, rápido, mobile-first, com baixo atrito e sem necessidade de treinamento |
| Meta de sucesso | Registrar um pedido em < 2 minutos usando apenas o celular |

> Documento completo: [persona.md](persona.md)

---

## 3. Objetivos do Produto

| # | Objetivo | Métrica de Sucesso |
|---|----------|-------------------|
| O1 | **Centralização** — consolidar pedidos e receitas em um único sistema | 100% dos pedidos registrados no sistema (zero cadernos paralelos) |
| O2 | **Rastreabilidade** — eliminar pedidos esquecidos | Zero pedidos sem status atualizado |
| O3 | **Eficiência operacional** — reduzir tempo de gestão administrativa | Redução de 50% no tempo gasto em controles manuais ao 30º dia |
| O4 | **Precificação assertiva** — custo real calculado automaticamente | 100% das receitas com ficha técnica e custo calculado |
| O5 | **Escalabilidade pessoal** — permitir delegar tarefas com sistema estruturado | Pelo menos 1 colaborador adicional consegue operar o sistema sem treinamento |

---

## 4. Requisitos Funcionais

### 4.1. Autenticação e Gestão de Usuários

**RF-01** — O sistema deve permitir cadastro e login de usuários via provedor Clerk (e-mail/senha e OAuth).
**RF-02** — O sistema deve suportar recuperação de senha via Clerk.
**RF-03** — O perfil do usuário deve ser sincronizado automaticamente via webhook do Clerk.
**RF-04** — O sistema deve implementar controle de acesso por perfil (RBAC): Administrador e Colaborador.
**RF-05** — Toda requisição autenticada deve validar o JWT emitido pelo Clerk via JWKS.

### 4.2. Gestão de Receitas e Fichas Técnicas

**RF-06** — O sistema deve permitir criar uma receita com: nome, descrição, tempo de preparo, rendimento (porções) e preço de venda sugerido.
**RF-07** — Uma receita deve suportar vincular ingredientes com nome, unidade de medida e quantidade exata.
**RF-08** — O sistema deve calcular o custo estimado da receita com base nos ingredientes e quantidades cadastradas.
**RF-09** — O sistema deve permitir visualizar, editar e excluir receitas cadastradas.
**RF-10** — A listagem de receitas deve suportar busca por nome e filtros por rendimento e faixa de preço.

**Regras de domínio:**
- `rendimento` deve ser maior que 0.
- A leitura de `rendimento` não pode alterar o estado da entidade.

### 4.3. Gestão de Pedidos

**RF-11** — O sistema deve permitir registrar um pedido com: cliente (nome, telefone), data de entrega, receitas selecionadas (com quantidade), tipo de entrega, endereço de entrega e observações.
**RF-12** — Todo pedido deve ser criado com status inicial **Pendente**.
**RF-13** — O sistema deve permitir transições de status: `Pendente → Em Produção → Concluído`. O status `Cancelado` é permitido em qualquer estado exceto `Concluído`.
**RF-14** — O sistema deve impedir transições de status inválidas (ex: `Pendente → Concluído` sem passar por `Em Produção`).
**RF-16** — A listagem de pedidos deve suportar busca por nome do cliente e filtros por status e data de entrega.
**RF-16.1** — Controle de rendimento automático: Ao registrar um pedido, a quantidade solicitada deve consumir automaticamente o rendimento da receita.
**RF-16.2** — Estorno de rendimento: Ao cancelar, deletar ou reduzir a quantidade de um pedido, o rendimento deve ser restaurado proporcionalmente na receita vinculada.


### 4.5. Perfil do Usuário

**RF-21** — O usuário deve poder visualizar e editar seu perfil (nome, e-mail, telefone).
**RF-22** — O sistema deve oferecer opção de logout em qualquer tela.

---

## 5. Requisitos Não Funcionais

### 5.1. Acessibilidade e Portabilidade (RNF-01)
- Acessível exclusivamente via navegadores web modernos (Chrome 90+, Safari 14+, Firefox 88+).
- Compatível com HTML5, CSS3 e ECMAScript 2020+.
- Layout responsivo: mobile-first, suporte a telas de 320px a 1920px.
- Conformidade com WCAG 2.1 nível AA (contraste mínimo 4.5:1).

### 5.2. Segurança (RNF-02)
- Autenticação e autorização via Clerk (OAuth 2.0 / OIDC).
- Controle de acesso por perfis (RBAC).
- Validação criptográfica de JWTs via JWKS público do Clerk.
- Dados em trânsito protegidos por TLS 1.2+ (HTTPS obrigatório).
- Senhas nunca armazenadas no sistema (gerenciadas pelo Clerk).
- Proteção contra CSRF, XSS e SQL Injection (via ORM parametrizado).

### 5.3. Interoperabilidade (RNF-03)
- Funcionalidades expostas exclusivamente via API RESTful (HTTP/HTTPS).
- Contratos documentados via OpenAPI 3.0 (Swagger UI em `/docs`).
- Respostas no formato JSON com Content-Type `application/json`.
- CORS configurado para origens autorizadas.

### 5.4. Observabilidade e Rastreabilidade (RNF-04)
- Logs estruturados em formato JSON com campos: `timestamp`, `level`, `request_id`, `method`, `path`, `status_code`, `duration_ms`.
- Cada requisição recebe um `request_id` único (UUID) para correlação.
- Registro de todos os eventos críticos: criação/alteração de pedidos, erros de autenticação.
- Endpoint `/health` para verificação de disponibilidade do serviço.

### 5.5. Manutenibilidade e Testabilidade (RNF-05)
- Testes automatizados de unidade cobrindo entidades de domínio e use cases.
- Testes de integração cobrindo endpoints REST ponta a ponta.
- Testes de aceite validando os fluxos de negócio completos.
- Cobertura mínima: 70% do código backend.
- Framework de testes: pytest com pytest-cov.

### 5.6. Portabilidade e Implantação (RNF-06)
- Empacotamento em contêineres padrão OCI (Docker).
- Orquestração local via Docker Compose.
- Infraestrutura descrita como código (IaC) na pasta `infra/`.
- Deploy automatizado via CI/CD (GitHub Actions → Vercel).
- Variáveis de ambiente externalizadas (nunca hardcoded).

### 5.7. Persistência (RNF-07)
- Banco de dados relacional PostgreSQL (Supabase) para dados estruturados.
- Schema versionado via migrações Alembic.
- Dados sensíveis nunca armazenados em texto plano.

### 5.8. Governança de Código e Configuração (RNF-08)
- Versionamento via Git (GitHub), com branch principal protegida.
- Dependências isoladas (venv Python / node_modules).
- Configurações externalizadas via variáveis de ambiente (`.env`).
- Template de configuração disponível em `.env.example`.
- Linting automatizado: Ruff (Python) e ESLint (TypeScript).

---

## 6. Fluxos de Negócio Críticos

### Fluxo Primário — Gestão de Pedido (RF-11 a RF-16, RF-19)

```
1. Confeiteira cadastra receita com ficha técnica de ingredientes (RF-06 a RF-08)
2. Confeiteira cria novo pedido vinculando receitas e definindo data de entrega (RF-11, RF-12)
3. Sistema gera pedido com status "Pendente" automaticamente (RF-12)
4. Confeiteira atualiza status para "Em Produção" (RF-13)
5. Confeiteira marca pedido como "Concluído" após entrega (RF-13)
6. Histórico do pedido fica acessível para consulta
```


---

## 7. Métricas de Sucesso do Produto

| Métrica | Meta | Como Medir |
|---------|------|-----------|
| Tempo para criar primeiro pedido | < 2 minutos | Teste de usabilidade |
| Cobertura de testes backend | ≥ 70% | pytest-cov |
| Tempo de resposta da API | < 200ms (P95) | Logs de performance |
| Taxa de conclusão do fluxo ponta a ponta | > 70% na 1ª semana | Analytics de uso |
| Uptime do sistema | > 99% | Health check monitoring |

---

## 8. Fora de Escopo (v1.0)

- Sistema financeiro completo (emissão de NF, fluxo de caixa avançado).
- E-commerce B2C (loja virtual para cliente final).
- Gestão de rotas de entrega.
- App nativo (iOS/Android) — apenas web responsivo.
- Múltiplos tenants / gestão de várias confeitarias em uma conta.

---

## 9. Dependências e Riscos

| Dependência | Risco | Mitigação |
|-------------|-------|-----------|
| Clerk (Auth) | Instabilidade do serviço externo | Fallback de autenticação; monitoramento ativo |
| Supabase (DB) | Limite do plano gratuito | Monitoramento de uso; plano de upgrade definido |
| Vercel (Deploy) | Cold starts em serverless | Health check; timeout configurado |

---

## 10. Referências

- [Lean Canvas](lean_canvas.md)
- [Persona](persona.md)
- [Jornada do Usuário](jornada_usuario.md)
- [Especificação Técnica](spec_tech.md)
- [Especificação de UI](spec_ui.md)
- [Design System](design_system.md)
- [Modelos C4](modelos_c4.md)

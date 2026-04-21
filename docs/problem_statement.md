# Declaração de Problema — Sistema de Gestão para Confeitaria

**Versão:** 2.0
**Data:** 2026-04-20

---

## 1. Contexto

Confeitarias artesanais de pequeno porte representam um segmento crescente de micro-empreendedoras no Brasil. A maioria opera de forma autônoma ou com poucos colaboradores, gerenciando simultaneamente a produção artesanal, o atendimento ao cliente, o controle de ingredientes e a logística de entrega.

A informalidade nos processos é a norma: pedidos são anotados em cadernos ou recebidos por mensagens de texto, receitas ficam em folhas avulsas ou na memória da confeiteira, e o estoque de ingredientes é gerenciado intuitivamente, sem controle sistemático.

---

## 2. Problema

### 2.1 Problema Principal

Confeitarias artesanais de pequeno porte realizam o controle de **pedidos, receitas e estoque de ingredientes de forma manual e descentralizada** — utilizando cadernos físicos, planilhas simples, mensagens no WhatsApp e memória pessoal. Esse processo fragmentado gera:

- **Pedidos perdidos ou duplicados:** informações espalhadas em vários meios sem rastreamento centralizado.
- **Falta de ingredientes na hora da produção:** sem controle de estoque, a confeiteira descobre a falta de insumos somente durante a execução da receita.
- **Dificuldade de precificação:** sem ficha técnica precisa, o preço de venda é estimado sem base no custo real, comprometendo a margem de lucro.
- **Baixa rastreabilidade de pedidos:** difícil saber em que etapa está cada pedido (pendente, em produção, concluído ou cancelado).
- **Sobrecarga operacional:** tempo excessivo gasto em controles manuais que poderiam ser automatizados.

### 2.2 Impacto no Negócio

| Problema | Impacto Direto |
|---------|---------------|
| Pedidos esquecidos | Perda de clientes, dano à reputação |
| Falta de ingrediente durante produção | Parada de produção, atraso na entrega |
| Precificação imprecisa | Margens de lucro negativas sem percepção |
| Sem painel de produção | Dificuldade em escalar para mais pedidos sem perder qualidade |
| Controle manual | Impossibilidade de delegar tarefas a colaboradores |

---

## 3. Público-Alvo

### 3.1 Perfil Principal

**Confeiteiras artesanais autônomas** que:
- Gerenciam sozinhas ou com 1-2 colaboradores todo o ciclo de produção e venda.
- Acumulam múltiplas funções: atendimento ao cliente, produção, compras, controle financeiro e logística.
- Possuem baixa disponibilidade para gestão administrativa (maior parte do tempo na cozinha).
- Acessam informações principalmente pelo celular.
- Dependem de métodos manuais por falta de ferramenta adequada ao seu contexto.

### 3.2 Características Específicas

- **Volume:** 15-50 pedidos/mês (picos em datas comemorativas).
- **Ticket médio:** R$ 80 – R$ 400 por pedido.
- **Tecnologia:** usuárias moderadas de smartphone; resistentes a ferramentas complexas.
- **Necessidade chave:** sistema que funcione "na primeira vez" sem manual de uso.

> Documento completo da persona: [persona.md](persona.md)
> Jornada do usuário: [jornada_usuario.md](jornada_usuario.md)

---

## 4. Objetivo da Solução

Desenvolver um **sistema de gestão web mobile-first** para confeitarias artesanais que permita:

1. **Autenticação segura** — acesso individualizado e protegido ao sistema.
2. **Gestão de pedidos** — registro, acompanhamento e atualização de status em tempo real.
3. **Fichas técnicas de receitas** — cadastro completo com ingredientes, quantidades e custo calculado.
4. **Controle de estoque** — monitoramento de ingredientes com alertas de nível mínimo e baixa automática vinculada à produção.
5. **Painel de produção** — visão consolidada dos pedidos do dia e da semana.

**Critério de sucesso:** A confeiteira consegue registrar um novo pedido em menos de 2 minutos, do celular, sem treinamento formal.

---

## 5. Solução Proposta

| Componente | Tecnologia | Justificativa |
|-----------|-----------|--------------|
| Frontend Web | Next.js 14 + TypeScript + Tailwind CSS | Mobile-first, componentização eficiente, SSR para performance |
| Backend API | FastAPI (Python 3.12) + Clean Architecture | Alta performance, documentação OpenAPI automática, arquitetura testável |
| Banco de Dados | PostgreSQL via Supabase | Relacional gerenciado, free tier robusto, sem necessidade de infraestrutura própria |
| Autenticação | Clerk | Auth as a Service especializado, elimina complexidade de gestão de senhas e sessões |
| Hospedagem | Vercel | Deploy automático, CDN global, free tier adequado para MVP |
| CI/CD | GitHub Actions | Integração nativa com repositório, automação de testes e deploy |
| Containers | Docker + Docker Compose | Portabilidade e reprodutibilidade do ambiente de desenvolvimento |

---

## 6. Hipóteses Críticas

| Hipótese | Risco se falsa |
|---------|---------------|
| Confeiteiras adotam ferramenta digital se for simples o suficiente | Baixa adoção; produto não resolve o problema |
| O celular é o dispositivo primário de acesso durante a produção | Mobile-first perde relevância |
| A baixa automática de estoque é percebida como valor (não como complexidade) | Feature ignorada; usuária mantém controle manual paralelo |
| O preço do plano free das plataformas suporta o crescimento inicial | Custos operacionais inviabilizam o MVP |

---

## 7. Restrições e Premissas

**Restrições:**
- Orçamento limitado: uso de plataformas com free tier.
- Equipe reduzida: solução deve ser simples de manter.
- Sem app nativo: apenas web responsivo na v1.

**Premissas:**
- A confeiteira tem acesso a smartphone com internet (4G ou Wi-Fi).
- O fluxo de negócio é suficientemente padronizado para caber nos modelos de domínio definidos.
- A integração com Clerk e Supabase permanece estável durante o MVP.

---

## 8. Fora do Escopo

- Sistema financeiro completo (NF, fluxo de caixa).
- E-commerce B2C (pedido feito pelo cliente final diretamente).
- Gestão de rotas de entrega.
- App nativo iOS/Android.
- Multi-tenant (múltiplas confeitarias em uma mesma conta).

---

## 9. Referências

- [Lean Canvas](lean_canvas.md)
- [Persona](persona.md)
- [Jornada do Usuário](jornada_usuario.md)
- [PRD Completo](prd.md)

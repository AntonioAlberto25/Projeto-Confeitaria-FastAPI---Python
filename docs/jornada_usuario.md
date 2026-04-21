# Jornada do Usuário — Sistema de Gestão para Confeitaria

**Persona:** Ana Paula, Confeiteira Autônoma
**Objetivo:** Registrar uma nova receita e vinculá-la a um pedido, acompanhando o ciclo completo até a entrega.

---

## Fluxo 1 — Primeiro Acesso e Cadastro

| Etapa | Ação do Usuário | Ponto de Contato | Pensamento / Emoção | Oportunidade de Melhoria |
|-------|----------------|-----------------|--------------------|-----------------------------|
| 1. Descoberta | Ana recebe indicação de uma amiga confeiteira | Mensagem no WhatsApp | "Parece interessante, vou dar uma olhada" 😐 | Ter página de apresentação clara e rápida |
| 2. Acesso inicial | Acessa o link pelo celular | Landing page | "Vou tentar cadastrar, espero que seja simples" 🤞 | Onboarding visual em 3 passos |
| 3. Cadastro | Clica em "Criar conta", preenche e-mail e senha via Clerk | Tela de cadastro (Clerk) | "Ok, rápido. Gostei" 😌 | Nenhuma (Clerk já é fluido) |
| 4. Primeiro acesso | Entra no Dashboard e vê a tela vazia | Dashboard | "E agora? Por onde começo?" 😕 | Tooltip de boas-vindas / checklist de configuração inicial |
| 5. Orientação | Segue o checklist: "Cadastre sua primeira receita" | Sidebar / Onboarding | "Ah, ok, faz sentido começar pelas receitas" 😊 | Checklist gamificado com progresso visual |

---

## Fluxo 2 — Cadastro de Receita (Ficha Técnica)

| Etapa | Ação do Usuário | Ponto de Contato | Pensamento / Emoção | Oportunidade de Melhoria |
|-------|----------------|-----------------|--------------------|-----------------------------|
| 1. Navegar | Clica em "Receitas" no menu lateral | Sidebar | "Aqui deve ser o lugar certo" 🙂 | Menu com ícones intuitivos |
| 2. Nova receita | Clica em "Nova Receita" | Listagem de receitas | "Vou cadastrar meu Bolo de Chocolate" 😊 | Botão sempre visível no canto |
| 3. Preenchimento | Preenche nome, descrição, tempo de preparo, rendimento e preço sugerido | Formulário de receita | "Fácil, campos bem explicados" 😌 | Labels com exemplos no placeholder |
| 4. Ingredientes | Adiciona ingredientes com nome, unidade e quantidade | Tabela de ingredientes | "Isso é exatamente o que eu precisava! Tenho tudo documentado aqui" 🤩 | Autocomplete de ingredientes já cadastrados |
| 5. Salvar | Clica em "Salvar Receita" | Botão de ação | "Pronto! Fácil demais" 😄 | Toast de confirmação com link para criar pedido |
| 6. Visualizar | Vê a receita criada na listagem | Listagem de receitas | "Ficou organizado, adorei" 😍 | — |

**Emoção dominante:** Satisfação. O cadastro de receita é o "momento aha" do produto.

---

## Fluxo 3 — Registro de Pedido

| Etapa | Ação do Usuário | Ponto de Contato | Pensamento / Emoção | Oportunidade de Melhoria |
|-------|----------------|-----------------|--------------------|-----------------------------|
| 1. Receber pedido | Recebe mensagem no WhatsApp de cliente pedindo bolo | Externo (WhatsApp) | "Preciso registrar isso antes de esquecer" 😬 | — |
| 2. Abrir sistema | Abre o app pelo atalho na tela inicial do celular | Home screen | "Vou cadastrar agora mesmo" 🏃 | PWA com atalho na tela inicial |
| 3. Novo pedido | Clica em "Novo Pedido" no Dashboard | Dashboard | "Botão sempre visível, ótimo" 😌 | — |
| 4. Dados do cliente | Preenche nome e telefone do cliente | Formulário | "Rápido" ✅ | Busca de clientes já cadastrados |
| 5. Data de entrega | Seleciona a data no calendário | Datepicker | "Quero ver se tem conflito de produção" 🤔 | Indicação visual de datas já ocupadas |
| 6. Receitas | Seleciona o "Bolo de Chocolate" e a quantidade | Seletor de receitas | "Ele calcula o preço automaticamente!" 🤩 | Cálculo automático de custo e margem |
| 7. Observações | Adiciona "Escrever 'Parabéns João' na cobertura" | Campo de texto | "Não vou esquecer esse detalhe" 😌 | — |
| 8. Confirmar | Clica em "Criar Pedido" | Botão | "Registrado! Posso voltar para a cozinha" 😊 | — |

---

## Fluxo 4 — Produção e Baixa de Estoque

| Etapa | Ação do Usuário | Ponto de Contato | Pensamento / Emoção | Oportunidade de Melhoria |
|-------|----------------|-----------------|--------------------|-----------------------------|
| 1. Verificar dia | Abre Dashboard às 6h e vê pedidos do dia | Dashboard | "Hoje tenho 2 pedidos, preciso checar ingredientes" 🧐 | Alertas de ingredientes insuficientes destacados |
| 2. Checar estoque | Sistema mostra alerta: "Manteiga abaixo do mínimo" | Dashboard / Painel | "Menos mal que alertou antes de eu começar" 😮‍💨 | Notificação push no celular |
| 3. Comprar | Anota no celular e vai ao mercado | — | — | Lista de compras gerada pelo sistema |
| 4. Atualizar estoque | Atualiza estoque de manteiga no sistema | Tela de estoque | "Pronto, atualizado" ✅ | — |
| 5. Iniciar produção | Muda status do pedido para "Em Produção" | Detalhe do pedido | "O sistema pede para confirmar a baixa de estoque, faz sentido" 🤔 | Modal de confirmação claro |
| 6. Confirmar baixa | Confirma o consumo dos ingredientes da receita | Modal de confirmação | "Estoque atualizado automaticamente. Incrível!" 🤩 | — |
| 7. Concluir | Marca pedido como "Concluído" após entrega | Detalhe do pedido | "Fim do ciclo. Organizadíssimo" 😄 | Histórico de pedidos concluídos acessível |

---

## Mapa de Emoções (Curva de Experiência)

```
Emoção Positiva ↑

         [Cadastra receita]     [Baixa automática]
              ★★★★★                   ★★★★★
                    [Pedido criado]
                         ★★★★
[Primeiro acesso]                          [Produção concluída]
       ★★★                                      ★★★★★
[Tela vazia inicial]
       ★★ ← ponto de abandono se não houver onboarding

Emoção Negativa ↓
───────────────────────────────────────────────────────► Tempo
  Cadastro    Receita    Pedido    Produção    Entrega
```

---

## Pontos de Abandono Críticos

| Ponto de Risco | Causa | Mitigação |
|---------------|-------|-----------|
| Após primeiro login | Tela vazia, sem saber por onde começar | Onboarding com checklist e guia rápido |
| Cadastro de receita | Formulário muito longo ou campo confuso | Formulário em etapas com progresso visual |
| Seleção de ingredientes | Sem autocomplete, tem que digitar tudo | Autocomplete com base no histórico do usuário |
| Conflito de data de entrega | Não visualiza produção já agendada | Calendário de produção com indicação visual de carga |

---

## Métricas de Experiência Associadas

| KPI de UX | Meta |
|-----------|------|
| Tempo para criar primeira receita | < 3 minutos |
| Tempo para criar primeiro pedido | < 2 minutos |
| Taxa de conclusão do fluxo ponta a ponta | > 70% na primeira semana |
| Taxa de abandono no onboarding | < 20% |
| NPS (Net Promoter Score) ao 30º dia | ≥ 50 |

---

**Versão:** 1.0
**Data:** 2026-04-20
**Autor:** Equipe de Desenvolvimento

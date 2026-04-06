# Especificação de UI

## Interfaces gráficas

Interfaces previstas para cobrir o PRD:
- INT-01 - Login
- INT-02 - Recuperação de senha
- INT-03 - Dashboard e painel de produção
- INT-04 - Listagem de pedidos
- INT-05 - Criação e edição de pedido
- INT-06 - Detalhes do pedido
- INT-07 - Listagem de receitas
- INT-08 - Criação e edição de receita (ficha técnica)
- INT-09 - Listagem de ingredientes (estoque)
- INT-10 - Criação e edição de ingrediente
- INT-11 - Perfil do usuário

### INT-01 - Login

- **Tipo de contêiner:** Página de autenticação
- **Campos:** E-mail, Senha, Manter conectado
- **Botões:** Entrar
- **Links:** Esqueci minha senha, Criar conta
- **Considerações:** Integração com Clerk; mensagens claras para falha de autenticação; foco em acesso rápido no celular.

### INT-02 - Recuperação de senha

- **Tipo de contêiner:** Página de formulário simples
- **Campos:** E-mail
- **Botões:** Enviar link de recuperação, Voltar ao login
- **Links:** Login
- **Considerações:** Seguir fluxo padrão do Clerk; feedback de sucesso sem expor se o e-mail existe na base.

### INT-03 - Dashboard e painel de produção

- **Tipo de contêiner:** Página com cards, lista e agenda de produção
- **Campos:** Filtro de período (Hoje, Semana), Filtro de status
- **Botões:** Novo pedido, Nova receita, Ver estoque
- **Links:** Pedidos, Receitas, Estoque, Perfil
- **Considerações:** Exibir KPIs de pedidos do dia, pedidos em produção, pedidos pendentes e alertas de ingredientes baixos; priorizar leitura rápida e uso mobile.

### INT-04 - Listagem de pedidos

- **Tipo de contêiner:** Tabela responsiva com filtros
- **Campos:** Busca por cliente/ID, Data de entrega (intervalo), Status (Pendente, Em Produção, Concluído, Cancelado)
- **Botões:** Novo pedido, Exportar (opcional), Alterar status (ação rápida por linha)
- **Links:** ID do pedido (detalhes), Nome do cliente (detalhes do pedido)
- **Considerações:** Badges de status com contraste; ordenação por data de entrega; atualização sem recarregar a página inteira.

### INT-05 - Criação e edição de pedido

- **Tipo de contêiner:** Formulário em etapas (cliente, itens, resumo)
- **Campos:** Cliente (nome, telefone), Data de entrega, Status inicial fixo (Pendente), Receita(s) selecionada(s), Quantidade por receita, Observações
- **Botões:** Adicionar receita, Remover item, Salvar rascunho, Finalizar pedido, Cancelar
- **Links:** Criar cliente rápido (modal)
- **Considerações:** Cálculo automático de totais e consumo previsto; fluxo com poucos cliques; validação de campos obrigatórios antes de finalizar; respeitar transições de status (Pendente -> Em Produção -> Concluído, com Cancelado em estados não concluídos).

### INT-06 - Detalhes do pedido

- **Tipo de contêiner:** Página de detalhes com seções
- **Campos:** ID, Cliente, Data de entrega, Status, Itens (receitas), Observações, Resumo de consumo de ingredientes
- **Botões:** Editar pedido, Marcar como Em Produção, Marcar como Concluído, Cancelar pedido
- **Links:** Voltar para pedidos, Receita vinculada
- **Considerações:** Ao mudar para Em Produção ou Concluído, disparar baixa automática/sugerida de estoque conforme ficha técnica.

### INT-07 - Listagem de receitas

- **Tipo de contêiner:** Tabela de receitas com ações
- **Campos:** Busca por nome, Filtro por rendimento, Filtro por faixa de preço sugerido
- **Botões:** Nova receita, Editar, Excluir
- **Links:** Nome da receita (detalhes/edição)
- **Considerações:** Colunas mínimas: Nome, Tempo de preparo, Rendimento, Preço sugerido; destacar receitas sem ficha técnica completa.

### INT-08 - Criação e edição de receita (ficha técnica)

- **Tipo de contêiner:** Formulário estruturado com tabela de ingredientes
- **Campos:** Nome da receita, Descrição, Tempo de preparo, Rendimento, Preço de venda sugerido, Ingredientes (nome, unidade, quantidade)
- **Botões:** Adicionar ingrediente, Remover ingrediente, Salvar receita, Cancelar, Excluir receita
- **Links:** Ir para estoque de ingredientes
- **Considerações:** Validação para impedir salvar sem ingredientes; cálculo opcional de custo estimado; unidades padronizadas (kg, g, l, ml, un).

### INT-09 - Listagem de ingredientes (estoque)

- **Tipo de contêiner:** Tabela com indicadores de nível
- **Campos:** Busca por ingrediente, Filtro por unidade, Filtro por nível (normal, baixo, crítico)
- **Botões:** Novo ingrediente, Ajustar estoque, Editar, Excluir
- **Links:** Nome do ingrediente (detalhes)
- **Considerações:** Exibir quantidade atual, unidade e alerta visual de nível baixo; preparada para uso com Supabase.

### INT-10 - Criação e edição de ingrediente

- **Tipo de contêiner:** Formulário simples
- **Campos:** Nome do ingrediente, Unidade de medida, Quantidade em estoque, Estoque mínimo
- **Botões:** Salvar, Cancelar, Excluir
- **Links:** Voltar para estoque
- **Considerações:** Impedir quantidade negativa; máscara e validação numérica de acordo com unidade.

### INT-11 - Perfil do usuário

- **Tipo de contêiner:** Página de perfil
- **Campos:** Nome, E-mail, Telefone (opcional), Preferências de notificação
- **Botões:** Salvar alterações, Sair
- **Links:** Alterar senha
- **Considerações:** Dados de conta sincronizados com Clerk; sessão segura e opção de logout em qualquer tela.

---

## Fluxo de Navegação

Fluxo principal:
1. Usuário acessa INT-01 (Login).
2. Caso necessário, vai para INT-02 (Recuperação de senha) e retorna ao login.
3. Após autenticação, entra em INT-03 (Dashboard e painel de produção).
4. Pelo menu principal:
   - Pedidos -> INT-04 -> INT-05 -> INT-06
   - Receitas -> INT-07 -> INT-08
   - Estoque -> INT-09 -> INT-10
   - Perfil -> INT-11

Fluxo de produção e estoque:
1. Receita é cadastrada em INT-08 com ficha técnica completa.
2. Pedido é criado em INT-05 usando uma ou mais receitas.
3. No detalhe do pedido (INT-06), ao marcar como Em Produção ou Concluído:
   - Sistema calcula consumo com base na ficha técnica.
   - Sistema realiza baixa automática ou solicita confirmação de baixa sugerida.
4. Estoque atualizado pode ser conferido em INT-09, com alertas de ingredientes críticos.

Fluxo mobile-first:
1. Barra de navegação inferior com atalhos: Dashboard, Pedidos, Receitas, Estoque.
2. Ações principais fixas no rodapé: Novo pedido e Nova receita.
3. Tabelas viram cards em telas pequenas para manter legibilidade.

---

## Diretrizes para IA

Padrão de implementação:
- Manter consistência com o padrão de UI já existente em spech_ui.md, evoluindo para cobrir integralmente o PRD.
- Cada INT deve ser tratado como tela de rota ou estado principal de tela.
- Campos, botões e links listados são obrigatórios para a primeira versão funcional, exceto quando o item estiver explicitamente marcado como opcional.

Boas práticas de UX:
- Priorizar baixo atrito: poucos passos, labels claros, feedback imediato.
- Implementar validação em tempo real para formulários de receita, pedido e estoque.
- Garantir responsividade real (mobile-first), com componentes tocáveis e contraste adequado.
- Destacar ações destrutivas (excluir/cancelar) com confirmação explícita.

Diretrizes visuais para layout dinâmico, agradável e fácil de usar:
- Criar hierarquia visual forte com cards de resumo, badges de status e blocos por contexto.
- Usar espaçamento generoso, tipografia legível e área de toque adequada para celular.
- Aplicar cores semânticas para status de pedido e nível de estoque.
- Exibir animações curtas e úteis (entrada de cards, atualização de status, confirmação de ação), sem excesso.

Prompt sugerido para geração de layout por IA:
"Crie uma interface web mobile-first para um sistema de gestão de confeitaria artesanal, com foco em rapidez operacional e clareza visual. Estruture as telas de Login, Dashboard de Produção, Pedidos, Receitas (com ficha técnica) e Estoque de Ingredientes. Use layout dinâmico com cards, tabelas responsivas que viram cards no mobile, navegação simples e ações principais sempre visíveis. Garanta contraste alto, tipografia legível, estados de erro/sucesso claros, validação em tempo real e fluxo com poucos cliques. Estilo visual acolhedor e profissional, com aparência moderna, agradável aos olhos e fácil de usar durante rotina de cozinha."
# Lean Canvas — Sistema de Gestão para Confeitaria

| # | Bloco | Conteúdo |
|---|-------|----------|
| 1 | **Problema** | Confeiteiras artesanais gerenciam pedidos e receitas de forma manual (cadernos, planilhas, mensagens), o que gera desorganização, atrasos em entregas e dificuldade de rastrear o andamento da produção. **Alternativas existentes:** planilhas Excel, cadernos físicos, anotações em WhatsApp. |
| 2 | **Segmento de Clientes** | **Cliente principal:** Confeiteiras artesanais autônomas ou micro-empreendedoras que gerenciam sozinhas (ou com 1-2 colaboradores) o ciclo completo de produção e venda. **Early adopters:** Confeiteiras que já usam celular para anotar pedidos e sentem dor concreta com a falta de organização. |
| 3 | **Proposta de Valor Única** | Um sistema de gestão simples, rápido e mobile-first que centraliza pedidos e receitas (fichas técnicas) em um único lugar — eliminando cadernos, planilhas e retrabalho. **Tagline:** "Da receita ao pedido entregue, tudo em um só lugar." |
| 4 | **Solução** | (1) Cadastro e acompanhamento de pedidos com status (Pendente → Em Produção → Concluído). (2) Fichas técnicas de receitas com ingredientes e quantidades. (3) Painel de produção diário/semanal acessível do celular. |
| 5 | **Canais** | Acesso via navegador web (qualquer dispositivo). Captação inicial via indicação direta entre confeiteiras e redes sociais (Instagram, grupos de WhatsApp de confeitaria). |
| 6 | **Fontes de Receita** | MVP gratuito (fase de validação). Modelo futuro: assinatura mensal (SaaS) com planos por volume de pedidos ou usuários adicionais. |
| 7 | **Estrutura de Custos** | Hospedagem Vercel (gratuito no plano hobby/inicial). Banco de dados Supabase (gratuito na camada free). Serviço de autenticação Clerk (gratuito até 10.000 MAU). Custo de desenvolvimento (equipe). |
| 8 | **Métricas-Chave** | Pedidos registrados por semana por usuário ativo. Receitas cadastradas com ficha técnica completa. Taxa de conclusão do fluxo ponta a ponta (receita → pedido). Retenção de usuários ativas no 30º dia. |
| 9 | **Vantagem Injusta** | Foco exclusivo na dor operacional da confeitaria artesanal: fluxos desenhados para quem trabalha na cozinha, com as mãos sujas, em um celular. Não é um ERP genérico adaptado — é uma ferramenta feita para esse contexto específico. |

---

## Hipóteses Críticas a Validar

| Hipótese | Como validar |
|----------|-------------|
| Confeiteiras sentem dor suficiente para mudar de planilha/caderno | Entrevistas qualitativas com 5-10 confeiteiras antes do MVP |
| O fluxo mobile-first é suficientemente simples para adoção sem treinamento | Teste de usabilidade com protótipo (< 5 minutos para criar primeiro pedido) |
| Modelo freemium converte para pago após 30 dias | Medir taxa de upgrade após período de gratuidade |

---

**Versão:** 1.0
**Data:** 2026-04-20
**Autor:** Equipe de Desenvolvimento

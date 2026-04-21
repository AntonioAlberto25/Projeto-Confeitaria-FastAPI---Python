# Design System — Sistema de Gestão para Confeitaria

## 1. Visão Geral

O Design System do Sistema de Gestão para Confeitaria define os padrões visuais, componentes e diretrizes de interação utilizados no frontend (Next.js + Tailwind CSS). O objetivo é garantir consistência visual, acessibilidade e velocidade de desenvolvimento.

**Princípios:**
- **Mobile-first:** Toda decisão de UI começa pelo celular (320px+) e escala para desktop.
- **Baixo atrito:** Ações frequentes exigem o mínimo de cliques possível.
- **Clareza:** Hierarquia visual clara com feedback imediato em ações críticas.
- **Acessibilidade:** Contraste mínimo WCAG AA (4.5:1 para texto normal).

---

## 2. Paleta de Cores

### 2.1 Cores Primárias

| Token | Valor Hex | Uso |
|-------|-----------|-----|
| `primary-50` | `#FFF5F7` | Fundos sutis |
| `primary-100` | `#FFE0E8` | Hover states suaves |
| `primary-500` | `#E91E63` | Cor de marca principal (rosa confeitaria) |
| `primary-600` | `#C2185B` | Botões primários (hover) |
| `primary-700` | `#880E4F` | Botões primários (active/pressed) |

### 2.2 Cores Neutras

| Token | Valor Hex | Uso |
|-------|-----------|-----|
| `neutral-50` | `#FAFAFA` | Fundo da página |
| `neutral-100` | `#F5F5F5` | Fundo de cards |
| `neutral-200` | `#EEEEEE` | Bordas sutis |
| `neutral-500` | `#9E9E9E` | Texto secundário / placeholders |
| `neutral-700` | `#616161` | Texto de suporte |
| `neutral-900` | `#212121` | Texto principal |

### 2.3 Cores Semânticas (Status de Pedido)

| Status | Token | Valor Hex | Uso |
|--------|-------|-----------|-----|
| Pendente | `status-pending` | `#FF9800` | Badge laranja |
| Em Produção | `status-production` | `#2196F3` | Badge azul |
| Concluído | `status-done` | `#4CAF50` | Badge verde |
| Cancelado | `status-cancelled` | `#9E9E9E` | Badge cinza |

### 2.4 Cores de Feedback

| Token | Valor Hex | Uso |
|-------|-----------|-----|
| `feedback-success` | `#4CAF50` | Confirmações, toasts de sucesso |
| `feedback-warning` | `#FF9800` | Alertas de estoque baixo |
| `feedback-error` | `#F44336` | Erros de formulário, ações destrutivas |
| `feedback-info` | `#2196F3` | Informativos neutros |

---

## 3. Tipografia

**Fonte principal:** Inter (Google Fonts)

| Escala | Tamanho | Peso | Line-height | Uso |
|--------|---------|------|-------------|-----|
| `text-xs` | 12px | 400 | 1.5 | Labels, badges, metadados |
| `text-sm` | 14px | 400 | 1.5 | Texto de suporte, labels de formulário |
| `text-base` | 16px | 400 | 1.6 | Corpo de texto principal |
| `text-lg` | 18px | 600 | 1.4 | Subtítulos de seção |
| `text-xl` | 20px | 700 | 1.3 | Títulos de card |
| `text-2xl` | 24px | 700 | 1.2 | Títulos de página |
| `text-3xl` | 30px | 800 | 1.1 | Cabeçalho principal (hero) |

---

## 4. Espaçamento

Sistema baseado em múltiplos de 4px (escala Tailwind padrão):

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `spacing-1` | 4px | Micro espaçamentos |
| `spacing-2` | 8px | Padding interno de badges |
| `spacing-3` | 12px | Gap entre ícone e label |
| `spacing-4` | 16px | Padding interno de cards (mobile) |
| `spacing-6` | 24px | Padding interno de cards (desktop) |
| `spacing-8` | 32px | Espaço entre seções |
| `spacing-12` | 48px | Espaço entre blocos de layout |

---

## 5. Componentes

### 5.1 Botões

| Variante | Tailwind Classes | Uso |
|---------|-----------------|-----|
| **Primary** | `bg-pink-600 text-white hover:bg-pink-700 rounded-lg px-4 py-2 font-semibold` | Ação principal da tela (ex: Salvar, Criar Pedido) |
| **Secondary** | `border border-pink-600 text-pink-600 hover:bg-pink-50 rounded-lg px-4 py-2` | Ação secundária (ex: Cancelar, Voltar) |
| **Danger** | `bg-red-600 text-white hover:bg-red-700 rounded-lg px-4 py-2` | Ações destrutivas (ex: Excluir) |
| **Ghost** | `text-neutral-600 hover:bg-neutral-100 rounded-lg px-4 py-2` | Ações terciárias, navegação |

**Regras:**
- Máximo 1 botão Primary por tela/modal.
- Botões de ação destrutiva sempre exigem confirmação explícita (modal).
- Tamanho mínimo de área de toque: 44×44px (mobile).

### 5.2 Badges de Status

```tsx
// StatusBadge component
const variants = {
  "Pendente": "bg-orange-100 text-orange-700",
  "Em Producao": "bg-blue-100 text-blue-700",
  "Concluido": "bg-green-100 text-green-700",
  "Cancelado": "bg-neutral-100 text-neutral-600",
}
// Uso: <StatusBadge status="Pendente" />
```

### 5.3 Cards

- **Padding:** `p-4` (mobile), `p-6` (desktop)
- **Border radius:** `rounded-xl`
- **Sombra:** `shadow-sm` (repouso), `shadow-md` (hover)
- **Borda:** `border border-neutral-200`
- **Background:** `bg-white`

### 5.4 Inputs de Formulário

| Estado | Tailwind Classes |
|--------|-----------------|
| Default | `border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent` |
| Error | `border border-red-500 focus:ring-red-500` |
| Disabled | `bg-neutral-100 text-neutral-400 cursor-not-allowed` |

- Label sempre acima do input (nunca placeholder substitui label).
- Mensagem de erro abaixo do input em `text-red-600 text-xs`.

### 5.5 Tabelas Responsivas

- Desktop: tabela completa com colunas.
- Mobile (< 640px): tabela colapsa em cards empilhados.
- Cada linha/card deve ter a ação principal acessível sem scroll horizontal.

### 5.6 Toast / Notificações

| Tipo | Cor | Ícone | Duração |
|------|-----|-------|---------|
| Sucesso | Verde | CheckCircle | 3s |
| Erro | Vermelho | XCircle | 5s (com fechar manual) |
| Aviso | Laranja | AlertTriangle | 4s |
| Info | Azul | Info | 3s |

- Posição: canto superior direito (desktop), topo centralizado (mobile).

---

## 6. Layout e Grid

### 6.1 Breakpoints (Tailwind padrão)

| Token | Largura | Uso |
|-------|---------|-----|
| `sm` | 640px | Tablet pequeno |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop largo |

### 6.2 Layout Principal

- **Mobile:** Layout de coluna única. Sidebar vira menu hamburguer / bottom navigation.
- **Desktop:** Sidebar fixa à esquerda (240px) + área de conteúdo principal.

### 6.3 Navegação

- **Desktop:** Sidebar vertical com ícone + label.
- **Mobile:** Bottom Navigation Bar com 4 ícones: Dashboard, Pedidos, Receitas, Estoque.
- Item ativo: destaque com `text-pink-600` e `bg-pink-50`.

---

## 7. Iconografia

**Biblioteca:** Lucide React (já instalada no projeto)

| Contexto | Ícone |
|---------|-------|
| Dashboard | `LayoutDashboard` |
| Pedidos | `ClipboardList` |
| Receitas | `BookOpen` |
| Estoque | `Package` |
| Perfil | `User` |
| Configurações | `Settings` |
| Adicionar | `Plus` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Buscar | `Search` |
| Alertas | `AlertTriangle` |
| Sucesso | `CheckCircle` |
| Erro | `XCircle` |

---

## 8. Estados de Interface

Todo componente interativo deve implementar todos os estados abaixo:

| Estado | Descrição |
|--------|-----------|
| **Default** | Estado padrão em repouso |
| **Hover** | Cursor sobre o elemento (desktop) |
| **Active/Pressed** | Durante o clique / toque |
| **Focus** | Navegação por teclado (anel de foco visível) |
| **Disabled** | Elemento não interativo |
| **Loading** | Operação em andamento (spinner + texto "Carregando...") |
| **Empty** | Lista ou seção sem dados ("Nenhum pedido encontrado") |
| **Error** | Falha de carregamento ou validação |

---

## 9. Acessibilidade

- Contraste mínimo WCAG AA para texto normal (4.5:1).
- Todo ícone funcional deve ter `aria-label` ou texto alternativo.
- Modais devem capturar o foco (focus trap) e fechar com ESC.
- Formulários devem ter `label` associado via `htmlFor` / `id`.
- Campos obrigatórios marcados com `aria-required="true"`.

---

## 10. Animações e Transições

- Transições de estado: `transition-all duration-150 ease-in-out`.
- Entrada de cards/modais: fade-in de 200ms (Framer Motion já instalado).
- Sem animações em loop ou que distraiam durante operações críticas.
- Respeitar `prefers-reduced-motion` para usuários com preferência de acessibilidade.

---

**Versão:** 1.0
**Data:** 2026-04-20
**Autor:** Equipe de Desenvolvimento

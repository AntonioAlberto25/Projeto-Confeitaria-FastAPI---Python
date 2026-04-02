# Guia de Integração: Next.js + FastAPI + Clerk

Seguindo a [Especificação Técnica](file:///c:/Users/Dell/OneDrive/Documentos/git_test/Projeto-Confeitaria-FastAPI---Python/docs/spech_tech.md), a integração entre o frontend e o backend é baseada em **JWT (Json Web Tokens)** e **Sincronização via Webhooks**.

## 1. Fluxo de Autenticação (Frontend -> Backend)

O Next.js gerencia o estado da sessão. Para qualquer chamada ao backend que exija autenticação, o token deve ser recuperado e enviado no Header.

### No Frontend (Next.js)

Utilizamos `useAuth` do `@clerk/nextjs` para obter o método `getToken()`.

```typescript
// Exemplo em src/lib/api.ts
import { useAuth } from '@clerk/nextjs';

export const useApi = () => {
  const { getToken } = useAuth();

  const callBackend = async () => {
    const token = await getToken(); // Obtém o JWT assinado pelo Clerk
    const response = await fetch('http://localhost:8000/receitas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  };

  return { callBackend };
};
```

### No Backend (FastAPI)

O backend valida a assinatura do token usando o **JWKS (JSON Web Key Set)** público do Clerk. Isso garante que o token é legítimo sem precisar de uma chamada de rede para o Clerk em cada requisição.

A dependência `get_current_user_id` em [clerk.py](file:///c:/Users/Dell/OneDrive/Documentos/git_test/Projeto-Confeitaria-FastAPI---Python/apps/backend/src/infrastructure/auth/clerk.py) realiza:
1. Extração do `kid` (Key ID) do header do token.
2. Localização da chave pública correspondente no cache do JWKS.
3. Validação criptográfica (Assinatura, Issuer e Expiração).
4. Extração do `sub` (ID único do usuário no Clerk).

```python
# Exemplo de uso em rotas
@router.post("/")
async def criar_receita(
    payload: ReceitaCreate, 
    user_id: str = Depends(get_current_user_id) # Injeção de Segurança
):
    # user_id aqui é o ID verificado do Clerk
    return controller.handle_criar_receita(payload, user_id)
```

---

## 2. Sincronização de Dados (Webhooks)

Para manter uma cópia local dos usuários (necessária para chaves estrangeiras em Pedidos/Receitas), utilizamos Webhooks.

1. **Clerk Dashboard:** Configure um endpoint para `https://seu-api.com/webhooks/clerk`.
2. **Backend:** O router em [webhooks.py](file:///c:/Users/Dell/OneDrive/Documentos/git_test/Projeto-Confeitaria-FastAPI---Python/apps/backend/src/presentation/routes/webhooks.py) valida a assinatura do `svix` para garantir que o evento veio do Clerk.
3. **Persistência:** Eventos `user.created` e `user.updated` disparam a criação/atualização no banco de dados local através do `UserController`.

### Requisitos de Ambiente (Backend)
Certifique-se de que o `.env` do backend contenha:
- `CLERK_JWKS_URL`: URL do endpoint `.well-known/jwks.json` da sua instância Clerk.
- `CLERK_ISSUER`: URL da sua instância Clerk (ex: `https://clerk.your-app.com`).
- `CLERK_WEBHOOK_SECRET`: Segredo fornecido no dashboard do Clerk para webhooks.

---

## 3. Segurança (Hardening)

- **CORS:** O backend deve permitir apenas a origem do seu frontend (Vercel ou localhost:3000).
- **Middleware:** O Next.js (`middleware.ts`) bloqueia o acesso a páginas internas antes mesmo de chegar ao backend.
- **JWT Claims:** O backend ignora o `aud` (audience) por padrão em ambientes de dev, mas pode ser configurado para validar se o destino do token é realmente a API.

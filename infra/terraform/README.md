# Infraestrutura como Código (IaC) — Terraform

Este diretório contém as configurações Terraform para provisionar a infraestrutura do Sistema de Gestão para Confeitaria na Vercel.

## Recursos Provisionados

- **Projeto Backend** (`confeitaria-backend`) — FastAPI serverless na Vercel
- **Projeto Frontend** (`confeitaria-frontend`) — Next.js na Vercel
- **Variáveis de ambiente** — injetadas de forma segura via Terraform (nunca hardcoded)

## Pré-requisitos

- [Terraform](https://terraform.io) >= 1.5.0
- Token de API da Vercel (`Settings > Tokens`)
- Credenciais do Supabase e Clerk configuradas

## Como Usar

```bash
# 1. Clone o repositório e entre no diretório de infra
cd infra/terraform

# 2. Copie o arquivo de variáveis de exemplo
cp variables.tfvars.example terraform.tfvars

# 3. Edite terraform.tfvars com os valores reais (nunca commite este arquivo)
nano terraform.tfvars

# 4. Inicialize o Terraform
terraform init

# 5. Visualize o plano de execução
terraform plan -var-file="terraform.tfvars"

# 6. Aplique as mudanças
terraform apply -var-file="terraform.tfvars"
```

## Variáveis Necessárias

| Variável | Descrição | Sensível |
|---------|-----------|---------|
| `vercel_api_token` | Token de API da Vercel | Sim |
| `vercel_team_id` | ID do time na Vercel (opcional) | Não |
| `database_url` | URL de conexão PostgreSQL (Supabase) | Sim |
| `clerk_secret_key` | Chave secreta do Clerk | Sim |
| `clerk_webhook_secret` | Secret para webhooks do Clerk | Sim |
| `next_public_clerk_publishable_key` | Chave pública do Clerk (frontend) | Não |
| `next_public_api_url` | URL da API backend | Não |

## Segurança

- `terraform.tfvars` está no `.gitignore` — nunca commite credenciais.
- Em produção, use GitHub Actions Secrets para injetar variáveis no pipeline.
- Estado remoto deve ser configurado em storage seguro (ex: S3 com criptografia).

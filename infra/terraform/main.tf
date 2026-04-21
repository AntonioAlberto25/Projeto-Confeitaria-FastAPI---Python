terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
  }

  # Estado remoto — ajuste o bucket para seu ambiente
  # backend "s3" {
  #   bucket = "confeitaria-terraform-state"
  #   key    = "infra/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# ─── Provider Vercel ────────────────────────────────────────────────────────────
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

# ─── Variáveis ──────────────────────────────────────────────────────────────────
variable "vercel_api_token" {
  description = "Token de API da Vercel"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "ID do time na Vercel (opcional)"
  type        = string
  default     = ""
}

variable "database_url" {
  description = "URL de conexão com o PostgreSQL (Supabase)"
  type        = string
  sensitive   = true
}

variable "clerk_secret_key" {
  description = "Chave secreta do Clerk (backend)"
  type        = string
  sensitive   = true
}

variable "clerk_webhook_secret" {
  description = "Secret para validação de webhooks do Clerk"
  type        = string
  sensitive   = true
}

variable "next_public_clerk_publishable_key" {
  description = "Chave pública do Clerk para o frontend"
  type        = string
}

variable "next_public_api_url" {
  description = "URL pública da API backend (Vercel)"
  type        = string
}

# ─── Projeto Backend (FastAPI) na Vercel ────────────────────────────────────────
resource "vercel_project" "backend" {
  name      = "confeitaria-backend"
  framework = "other"

  git_repository = {
    type = "github"
    repo = "seu-usuario/Projeto-Confeitaria-FastAPI---Python"
  }

  root_directory = "apps/backend"

  environment = [
    {
      key    = "DATABASE_URL"
      value  = var.database_url
      target = ["production", "preview"]
    },
    {
      key    = "CLERK_SECRET_KEY"
      value  = var.clerk_secret_key
      target = ["production", "preview"]
    },
    {
      key    = "CLERK_WEBHOOK_SECRET"
      value  = var.clerk_webhook_secret
      target = ["production", "preview"]
    },
  ]
}

# ─── Projeto Frontend (Next.js) na Vercel ───────────────────────────────────────
resource "vercel_project" "frontend" {
  name      = "confeitaria-frontend"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "seu-usuario/Projeto-Confeitaria-FastAPI---Python"
  }

  root_directory = "apps/frontend"

  environment = [
    {
      key    = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
      value  = var.next_public_clerk_publishable_key
      target = ["production", "preview"]
    },
    {
      key    = "NEXT_PUBLIC_API_URL"
      value  = var.next_public_api_url
      target = ["production", "preview"]
    },
  ]
}

# ─── Outputs ────────────────────────────────────────────────────────────────────
output "backend_project_id" {
  description = "ID do projeto backend na Vercel"
  value       = vercel_project.backend.id
}

output "frontend_project_id" {
  description = "ID do projeto frontend na Vercel"
  value       = vercel_project.frontend.id
}

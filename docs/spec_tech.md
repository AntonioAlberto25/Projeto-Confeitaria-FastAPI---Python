# Especificação Técnica - Projeto Confeitaria FastAPI

## 1. Visão Geral do Projeto

**Nome do Projeto:** Projeto Confeitaria FastAPI - Python  
**Descrição:** Sistema de gerenciamento de receitas para uma confeitaria, desenvolvido em Python utilizando FastAPI como framework web.  
**Objetivo Principal:** Fornecer uma API robusta e escalável para criar, editar e excluir receitas, com suporte a múltiplos usuários.

---

## 2. Arquitetura Técnica

### 2.1 Padrão Arquitetural
O projeto segue o padrão de **Clean Architecture** com separação clara de responsabilidades em camadas:

```
Presentation Layer (Controllers/Routes)
        ↓
Application Layer (Use Cases)
        ↓
Domain Layer (Business Logic/Entities)
        ↓
Infrastructure Layer (Repositories/Gateways)
```

### 2.2 Estrutura de Diretórios

```
Projeto-Confeitaria-FastAPI---Python/
│
├── main.py                          # Entrada principal da aplicação FastAPI
├── readme.md                        # Documentação de colaboração Git
├── spec_tech.md                     # Este documento
│
└── src/
    │
    ├── domain/                      # Camada de Domínio
    │   └── entity/
    │       └── receita/
    │           └── receita.py       # Entidade principal: Receita
    │
    ├── application/                 # Camada de Aplicação
    │   ├── gateways/
    │   │   ├── repositorioDeReceita.py  # Interface abstrata do repositório
    │   │   └── __pycache__/
    │   │
    │   └── usecases/
    │       └── receita/
    │           ├── criarReceita.py  # Use case para criar receitas
    │           └── __pycache__/
    │
    └── test/                        # Camada de Testes
        └── receita/
            ├── test_Receita.py      # Testes da entidade Receita
            ├── test_UseCaseReceita.py  # Testes dos use cases
            └── __pycache__/
```

---

## 3. Componentes Principais

### 3.1 Entidade: Receita (`src/domain/entity/receita/receita.py`)

A classe `Receita` representa uma receita de confeitaria com os seguintes atributos:

| Atributo | Tipo | Descrição | Regras de Validação |
|----------|------|-----------|-------------------|
| `nome` | `str` | Nome da receita | Obrigatório, não pode ser vazio |
| `preco` | `float` | Preço da receita | Opcional, deve ser maior que 0 se informado |
| `descricao` | `str` | Descrição detalhada | Opcional |
| `dataCriacao` | `datetime` | Data de criação | Automaticamente atribuída |
| `rendimento` | `int` | Quantidade de porções | Deve ser maior que 0, decresce a cada acesso |
| `idUsuario` | `int` | ID do usuário proprietário | Obrigatório, não pode ser null ou 0 |

#### Propriedades e Métodos
- **Properties com `@property` e `@setter`:** Encapsulamento dos atributos privados
- **Validações:** Implementadas nos setters para garantir integridade dos dados
- **Rendimento:** Comportamento especial - cada leitura decrementa o valor em 1

### 3.2 Use Case: CriarReceita (`src/application/usecases/receita/criarReceita.py`)

Responsável pela lógica de negócio para criação de receitas.

**Responsabilidades:**
- Receber instância de `Receita`
- Delegar persistência ao repositório
- Retornar a receita criada

**Dependências:**
- Implementação de `RepositorioDeReceita`

### 3.3 Gateway: RepositorioDeReceita (`src/application/gateways/repositorioDeReceita.py`)

Interface abstrata que define o contrato para operações de dados com receitas.

**Métodos Abstratos:**
- `criar_receita(receita: Receita) -> Receita`
- `editar_receita(receita: Receita) -> Receita`
- `excluir_receita(receita: Receita) -> None` (assíncrono)

---

## 4. Fluxo de Dados

### 4.1 Fluxo de Criação de Receita

```
HTTP Request (POST /receita)
        ↓
Controller/Route
        ↓
CriarReceita (Use Case)
        ↓
RepositorioDeReceita (Gateway)
        ↓
Database/Storage
        ↓
HTTP Response (201 Created)
```

---

## 5. Tecnologias Utilizadas

### Framework Web
- **FastAPI** - Framework web moderno e rápido para construir APIs em Python

### Linguagem
- **Python 3.x** - Linguagem de programação principal

### Testing
- **pytest** - Framework para escrita e execução de testes unitários

### Padrões
- **Clean Architecture** - Separação de responsabilidades
- **Dependency Injection** - Injeção de dependências via construtor
- **Abstract Base Classes (ABC)** - Interfaces abstratas para contracts

---

## 6. Testes

### 6.1 Estrutura de Testes

Os testes estão organizados em `src/test/receita/`:

#### test_Receita.py
Testes da entidade `Receita`:
- `test_preco_invalido()` - Valida exceção quando preço é inválido (≤ 0)
- `test_rendimento_valido()` - Valida comportamento de decremento do rendimento
- `test_cpf_usuario()` - Valida atribuição de ID do usuário

#### test_UseCaseReceita.py
Testes dos use cases de receita

### 6.2 Executar Testes

```bash
# Executar todos os testes
pytest

# Executar testes de um arquivo específico
pytest src/test/receita/test_Receita.py

# Executar com modo verbose
pytest -v

# Executar com cobertura de código
pytest --cov=src
```

---

## 7. Padrões de Código

### 7.1 Convenções de Nomenclatura
- **Classes:** PascalCase (ex: `Receita`, `CriarReceita`)
- **Métodos e funções:** snake_case (ex: `criar_receita`)
- **Atributos privados:** Prefixo duplo underscore (ex: `__nome`)
- **Constantes:** UPPER_CASE

### 7.2 Encapsulamento
Todos os atributos da entidade `Receita` são privados, acessados através de properties com getters e setters.

### 7.3 Validação de Dados
- Validações ocorrem nos setters das properties
- Exceções apropriadas são lançadas (`ValueError`, custom exceptions)
- Mensagens de erro descritivas

### 7.4 Type Hints
- Type hints em todos os métodos e properties
- Melhora legibilidade e suporta ferramentas de análise estática

---

## 8. Fluxo de Desenvolvimento

### 8.1 Branching Strategy
- **main:** Branch principal com código estável
- **feature/*:** Branches para novas funcionalidades (ex: `feature/minha-tarefa`)

### 8.2 Processo de Colaboração
1. Criar branch secundária: `git checkout -b "feature/minha-tarefa"`
2. Implementar mudanças
3. Adicionar ao index: `git add .`
4. Fazer commit: `git commit -m "DESCRICAO"`
5. Fazer push: `git push -u origin "feature/minha-tarefa"`
6. Criar Pull Request (quando pronto para merge)
7. Atualizar main: `git checkout main && git pull origin main`

---

## 9. Execução da Aplicação

### 9.1 Iniciar Servidor FastAPI

```bash
# Iniciar servidor de desenvolvimento
uvicorn main:app --reload

# Acessar documentação interativa
http://localhost:8000/docs

# Swagger UI
http://localhost:8000/redoc
```

### 9.2 Requisitos

Arquivo `requirements.txt` (deve ser criado):
```
fastapi==0.104.1
uvicorn==0.24.0
pytest==7.4.3
pytest-asyncio==0.21.1
```

---

## 10. Próximos Passos e Melhorias

### 10.1 Funcionalidades a Implementar
- [ ] Endpoints REST completos para CRUD de Receita
- [ ] Implementação concreta do repositório (BD: PostgreSQL, MongoDB, etc)
- [ ] Autenticação e autorização
- [ ] Paginação de resultados
- [ ] Filtros avançados

### 10.2 Melhorias Técnicas
- [ ] Adicionar logging estruturado
- [ ] Implementar tratamento global de exceções
- [ ] Adicionar validação com Pydantic models
- [ ] Aumentar cobertura de testes (target: 80%+)
- [ ] Implementar CI/CD (GitHub Actions)
- [ ] Dockerização da aplicação
- [ ] Documentação de API com OpenAPI

### 10.3 Padrões a Implementar
- [ ] Provider/Factory creational patterns para instanciação de repositories
- [ ] DTOs (Data Transfer Objects) para serialização/desserialização
- [ ] Value Objects para tipos complexos

---

## 11. Contato e Referências

**Repositório:** https://github.com/AntonioAlberto25/Projeto-Confeitaria-FastAPI---Python.git

---

**Versão do Documento:** 1.0  
**Última Atualização:** 2026-03-24  
**Autor:** Equipe de Desenvolvimento

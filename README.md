# Toolsmith

> Backend toolbox engine : centralize, execute and audit your internal developer tools.

Toolsmith is a multi-tenant SaaS platform that lets companies register, run, and audit internal operational tools (scripts, webhooks) from a single place ,without SSH access, without scattered repos, without losing track of who did what.

---

## The Problem

In most backend teams, internal tools are a mess:

- Scripts scattered across 5 different repos
- No one knows which version is up to date
- A dev runs a script in prod and no one knows about it
- Zero audit trail ; who ran what, when, with which params?
- Permissions? Managed manually, if at all

**Toolsmith solves exactly that.**

---

## Features

- **Multi-tenancy** : Each company has its own isolated workspace
- **Tool Registry** : Register webhook or script tools with typed parameters
- **Execution Engine** : Run tools with params, get results back
- **Audit Log** : Every execution is logged (who, when, params, output, status)
- **RBAC** : Admin / Developer / Operator roles
- **Background Jobs** : Async execution with BullMQ + Redis (retry, backoff)
- **User Management** : Admins invite team members, no public registration

---

## How It Works

```
1. Jumia (example) creates a Tenant account → POST /tenants/register
2. Sylvère (admin) logs in        → POST /auth/login → JWT
3. Sylvère invites his team       → POST /users/invite (admin only)
4. Sylvère registers a tool       → POST /tools
5. Hery (operator) runs the tool  → POST /executions
6. Full audit trail saved         → GET  /executions
```

### Tool Types

Type      | How it works                                          
--------- | -----------------------------------------------------
`webhook` | Toolsmith calls the company's API endpoint           
`script`  | Toolsmith executes a JS script in an isolated process

---

## Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| Framework    | NestJS                                |
| Database     | PostgreSQL + TypeORM                  |
| Queue        | BullMQ + Redis                        |
| Auth         | JWT + Passport                        |
| Architecture | Modular Monolith + Clean Architecture |

---

## Architecture

```
src/
├── modules/
│   ├── tools/           # Tool registry
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── interface/
│   ├── executions/      # Execution engine + audit log
│   ├── tenants/         # Company accounts
│   └── users/           # Auth + team management
└── shared/              # Guards, decorators, exceptions
```

Each module follows **Clean Architecture**:

- `domain/` — business logic,
- `application/` — use cases
- `infrastructure/` — TypeORM, BullMQ, external runners
- `interface/` — HTTP controllers, DTOs

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### Installation

```bash
git clone https://github.com/ANDRIANALISOA-sylvere/Toolsmith
cd Toolsmith
npm install
```

### Environment

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=toolsmith

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key
```

### Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## API

### Auth

```bash
# Create company account
POST /tenants/register
{
  "tenantName": "Jumia Madagascar",
  "slug": "jumia",
  "adminName": "Sylvère",
  "adminEmail": "sylvere@jumia.com",
  "adminPassword": "password123"
}

# Login
POST /auth/login
{ "email": "sylvere@jumia.com", "password": "password123" }
# → { "accessToken": "eyJ..." }
```

### Users (Admin only)

```bash
# Invite a team member
POST /users/invite
Authorization: Bearer <token>
{ "email": "hery@jumia.com", "name": "Hery", "role": "operator" }
```

### Tools

```bash
# Register a webhook tool
POST /tools
Authorization: Bearer <token>
{
  "name": "unlock-order",
  "description": "Unblocks a stuck order",
  "type": "webhook",
  "webhookUrl": "https://api.jumia.com/internal/unlock",
  "webhookMethod": "POST",
  "params": [
    { "name": "orderId", "type": "string", "required": true }
  ]
}

# List all tools
GET /tools
Authorization: Bearer <token>
```

### Executions

```bash
# Run a tool
POST /executions
Authorization: Bearer <token>
{ "toolId": "<uuid>", "params": { "orderId": "12345" } }

# Get execution history
GET /executions
Authorization: Bearer <token>

# Get one execution (check status)
GET /executions/:id
Authorization: Bearer <token>
```

---

## Concepts Applied

This project was built as a learning ground for production-grade backend architecture:

- **Clean Architecture** : domain, application, infrastructure, interface layers
- **Hexagonal Architecture** : ports & adapters
- **Modular Monolith** : independent modules, single deployable unit
- **Domain-Driven Design** : rich domain models, domain exceptions
- **RBAC** : role-based access control with JWT
- **Multi-tenancy** : full data isolation per tenant
- **Background Jobs** : BullMQ with retry & exponential backoff
- **Dependency Injection** : abstractions over implementations

---

<!-- 
## Roadmap
 
- [ ] Email notifications on execution failure
- [ ] Cron job scheduler
- [ ] WebSocket live logs
- [ ] CLI: `toolsmith run <tool-name> --params`
- [ ] Dashboard frontend (React)
-->
 
---

## Author

**Joséphin Sylvère Andrianalisoa** — [@ANDRIANALISOA-sylvere](https://github.com/ANDRIANALISOA-sylvere)

> Built to master Clean Architecture, Hexagonal Design, and multi-tenant SaaS patterns.

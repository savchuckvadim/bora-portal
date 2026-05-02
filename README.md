# Bora Portal (Next + Nest + Matrix)

Monorepo with:

- `apps/web`: Next.js portal UI with integrated Matrix messenger page.
- `apps/api`: NestJS backend (users/posts CRUD, OIDC auth, Matrix provisioning, notifications).
- `infra/docker`: local `docker compose` for PostgreSQL, Matrix Synapse, Keycloak.

## Quick start

1. Copy env templates:
   - `.env.example` -> `.env`
   - `apps/api/.env.example` -> `apps/api/.env`
   - `apps/web/.env.local.example` -> `apps/web/.env.local`
2. Install dependencies:
   - `pnpm install`
3. Start infra:
   - `docker compose -f infra/docker/docker-compose.yml --env-file .env up -d`
4. Start apps:
   - API: `pnpm -C apps/api dev`
   - Web: `pnpm -C apps/web dev`

## Main API endpoints

- `POST /api/users`, `GET /api/users`, `PATCH /api/users/:id`, `DELETE /api/users/:id`
- `POST /api/posts`, `GET /api/posts`, `GET /api/posts/:id`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`
- `POST /api/matrix/rooms`, `GET /api/matrix/rooms`
- `POST /api/matrix/session/me`
- `POST /api/notifications/post-created`

Swagger: `http://localhost:4000/api/docs`

# Bora Portal — кратко

Монорепозиторий: **портал** (Next.js UI + NestJS API), **IAM** (Keycloak OIDC), **чат** (self-hosted Matrix Synapse), уведомления в Matrix из домена портала.

| Часть | Назначение |
|--------|------------|
| `apps/web` | UI: пользователи/посты, вход через Keycloak, страница мессенджера (Matrix SDK) |
| `apps/api` | REST API, JWT-валидация Keycloak, CRUD, Matrix provisioning, уведомления |
| `infra/docker` | PostgreSQL (app / matrix / keycloak), Synapse, Keycloak |
| `docs/auth-api-matrix-guide.md` | Подробно: auth, централизованный API-клиент, Matrix и звонки |

---

## Требования

- **Node.js** (LTS) и **pnpm**
- **Docker** + **Docker Compose**

---

## Как запустить локально

### 1. Переменные окружения

Скопируй шаблоны в рабочие файлы:

- корень: `.env.example` → `.env`
- API: `apps/api/.env.example` → `apps/api/.env`
- Web: `apps/web/.env.local.example` → `apps/web/.env.local`

В `apps/api/.env` обязательно задай:

- **`MATRIX_ADMIN_ACCESS_TOKEN`** — токен админа Synapse (без него provisioning/комнаты не заработают).
- Остальное по умолчанию совпадает с compose (Postgres `localhost:5432`, Keycloak issuer и т.д.).

### 2. Зависимости

Из корня репозитория:

```bash
pnpm install
```

### 3. Инфраструктура (БД, Matrix, Keycloak)

```bash
docker compose -f infra/docker/docker-compose.yml --env-file .env up -d
```

Порты по умолчанию:

| Сервис | URL / порт |
|--------|------------|
| PostgreSQL (портал) | `localhost:5432` |
| PostgreSQL (Matrix) | `localhost:5433` |
| PostgreSQL (Keycloak) | `localhost:5434` |
| Synapse | `http://localhost:8008` |
| Keycloak | `http://localhost:8080` |

### 4. Приложения

В двух терминалах из корня:

```bash
pnpm -C apps/api dev
pnpm -C apps/web dev
```

| Приложение | URL |
|------------|-----|
| Web | `http://localhost:3000` |
| API | `http://localhost:4000/api` |
| Swagger | `http://localhost:4000/api/docs` |

### 5. Как пользоваться (минимальный сценарий)

1. Открой **Web** → редирект на `/login` → **Continue** → вход в Keycloak (realm `bora`, пользователи из импорта realm; при необходимости создай пользователя в админке Keycloak).
2. После callback создаётся сессия (cookie), вызывается синхронизация пользователя с API.
3. Разделы **Users** / **Posts** — CRUD через API (нужен валидный JWT).
4. **Messenger** — сессия Matrix выдаётся с бэка (`POST /api/matrix/session/me`); в UI подключается Matrix-клиент.

Подробности по токенам, BFF и Matrix см. [auth-api-matrix-guide.md](./auth-api-matrix-guide.md).

---

## Полезные команды

```bash
pnpm -r build          # сборка пакетов/приложений
pnpm -C apps/api test  # unit-тесты API
pnpm -C apps/web build # production-сборка фронта
```

---

## Что дальше по плану (приоритетно)

1. **`packages/api-client`** — добавить сгенерированный `schema`, поправить URL OpenAPI на Nest (`/api/docs-json`), убрать legacy refresh (`/crm/...`) и привести middleware к Keycloak (см. гайд).
2. **`apps/web/src/modules/shared/api`** — единый `NEXT_PUBLIC_API_BASE_URL`, стратегия cookie vs bearer для RSC/клиента, один вход в API без разрозненного `fetch`.
3. **OIDC** — PKCE, refresh сессии на стороне Next (BFF), не хранить refresh в `localStorage`.
4. **Matrix** — стабильный bootstrap: срок жизни matrix-токена, при необходимости re-issue с API; для **звонков** — TURN/STUN в Synapse и проверка WebRTC.
5. **E2E** — Playwright: логин → CRUD → messenger → уведомление в комнату (после стабилизации auth и api-client).

Если нужно одно «входное» место в документации — начинай с этого файла, детали — в [auth-api-matrix-guide.md](./auth-api-matrix-guide.md).

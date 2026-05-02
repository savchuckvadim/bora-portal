# Auth, API Client, Matrix Guide

## 1. Current state and key problems

The package `packages/api-client` is currently not production-ready for the new Nest + Keycloak architecture.

### Critical issues

1. Schema is missing:
   - `src/client/client.ts` imports `../schema/schema`
   - `src/index.ts` exports `./schema/schema`
   - but `src/schema/schema.ts` does not exist
   - package build fails

2. OpenAPI generation points to wrong URL:
   - now: `http://localhost:3000/docs-json`
   - must target Nest Swagger JSON: `http://localhost:4000/api/docs-json`

3. Refresh logic is legacy and incompatible with Keycloak:
   - current refresh helper assumes custom endpoints (`/crm/auth/refresh`, `/lk/auth/refresh`)
   - in OIDC/Keycloak flow refresh should be done via Keycloak token endpoint (BFF) or server-side session renewal

4. API base URL mismatch in web:
   - web shared client uses `NEXT_PUBLIC_API_URL`
   - project env uses `NEXT_PUBLIC_API_BASE_URL`

5. Auth modes (`CRM`/`SITE`) are domain leftovers:
   - for new stack we need provider-aware config (`keycloak`) and clear auth strategy (`cookie-bff` vs `bearer`)

## 2. Recommended auth architecture (Next + Nest + Keycloak + Matrix)

## 2.1 Core principles

- Keep portal OIDC tokens away from localStorage.
- Use HttpOnly secure session cookies for portal auth.
- Let Next (BFF layer) and Nest cooperate for authenticated API calls.
- Keep Matrix token separate from portal access token.

## 2.2 Suggested flow

1. User opens web app.
2. If no session, Next redirects to Keycloak Authorization Endpoint (PKCE).
3. Keycloak callback handled by Next route.
4. Next exchanges code for tokens and stores session in HttpOnly cookies (or encrypted server session).
5. Next uses portal access token to call Nest API.
6. Nest validates JWT via Keycloak JWKS.
7. On first login, Nest upserts user and ensures Matrix provisioning.
8. Web requests `/api/matrix/session/me` (authorized).
9. Nest issues Matrix session payload (`matrix user id + matrix access token`) for Matrix SDK bootstrap.

## 2.3 Token ownership

- Portal tokens: owned by Next auth layer (cookie/session).
- Matrix access token: issued by backend matrix session endpoint and stored in memory in chat module (avoid persistent localStorage unless explicitly required).
- Refresh:
  - portal: refresh in Next auth/BFF
  - matrix: refresh/re-login via backend `matrix/session` endpoint as needed

## 3. How centralized API client should behave

Target folder: `apps/web/src/modules/shared/api`

Centralized client responsibilities:

1. Single typed client factory (`openapi-fetch` based).
2. Attach auth automatically:
   - in browser routes: cookie strategy (`credentials: include`)
   - in server components/actions: bearer strategy with token from server cookie/session
3. Standard error handling:
   - parse API error body
   - throw typed `ApiClientError`
4. Retry policy:
   - one retry on 401 only via BFF refresh endpoint
   - no blind infinite retries
5. Observability:
   - request id propagation (`x-request-id`)
   - clear logs for auth failures

Recommended split:

- `apps/web/src/modules/shared/api/client.ts` (factory)
- `apps/web/src/modules/shared/api/auth.ts` (token/session accessors)
- `apps/web/src/modules/shared/api/errors.ts` (error normalization)
- `apps/web/src/modules/shared/api/index.ts` (public exports)

## 4. What to fix in `packages/api-client/src`

## 4.1 Mandatory fixes (first)

1. Add schema output directory and generated file:
   - `src/schema/schema.ts`
2. Fix generation script URL:
   - from `http://localhost:3000/docs-json`
   - to `http://localhost:4000/api/docs-json`
3. Remove legacy CRM/SITE refresh assumptions:
   - replace `/crm/auth/refresh` and `/lk/auth/refresh` with pluggable refresh strategy
4. Replace `ApiAuthType` with clearer options:
   - `ApiProvider = "keycloak"`
   - `ApiAuthStrategy = "cookie" | "bearer"`
5. Export stable typed client entry:
   - `createApiClient(config)`
   - `withApiAuthMiddleware(...)`

## 4.2 Keycloak-compatible middleware contract

The middleware should accept injectable auth hooks instead of hardcoded storage paths:

- `getAccessToken(): string | null | Promise<string | null>`
- `refreshSession(): Promise<boolean>`
- `onAuthFailure(): void | Promise<void>`

Behavior:

- On request: attach `Authorization` only for bearer mode.
- On 401:
  - call `refreshSession()`
  - if success: retry once
  - if fail: call `onAuthFailure()` and throw auth error

## 4.3 Browser/server compatibility

- Do not depend on `localStorage` in shared package by default.
- Keep storage adapter optional and browser-only.
- Support server runtime for Next server components/actions.

## 5. API generation workflow

1. Start backend: Nest should expose `http://localhost:4000/api/docs-json`.
2. Run generation:
   - `pnpm -C packages/api-client generate`
3. Validate package build:
   - `pnpm -C packages/api-client build`
4. Use generated types in web shared API module.

## 6. How frontend should access backend data

Recommended:

- Browser pages/components -> call web BFF routes or direct API with cookie strategy.
- Server components/actions -> read session token server-side and call API with bearer.
- All calls go through centralized API module; no scattered `fetch` usage for domain endpoints.

## 7. Matrix chat and calls from frontend

## 7.1 Chat

1. Portal user is authenticated (Keycloak).
2. Web requests matrix session from backend.
3. Create Matrix client (`matrix-js-sdk`) with:
   - `baseUrl`
   - `userId`
   - `accessToken`
4. Start sync and render:
   - room list
   - timeline
   - send message
   - unread state

## 7.2 Calls

For Matrix calls, ensure homeserver and client support WebRTC requirements:

- TURN/STUN configured in Synapse (`turn_uris`, `turn_shared_secret`, `turn_user_lifetime`)
- Call signaling via Matrix events
- Media transport via WebRTC

Frontend requirements:

- initialize call handling in Matrix SDK
- device permissions (mic/camera)
- call lifecycle UI states (ringing/connecting/connected/ended/failed)
- fallback error UX for blocked devices or TURN misconfiguration

## 8. Security checklist

- Use `httpOnly`, `secure`, `sameSite=lax` cookies for portal session.
- Never store Keycloak refresh token in localStorage.
- Limit Matrix token lifetime if possible; re-issue from backend when needed.
- Add logout flow that clears portal session and invalidates matrix session if required.
- Enforce role checks on Nest endpoints (not only in UI).

## 9. Practical implementation order

1. Fix `api-client` generation + build.
2. Refactor auth middleware to Keycloak-compatible abstraction.
3. Update web centralized API module to use new client contract.
4. Add integration tests for:
   - 401 -> refresh -> retry
   - refresh fail -> auth failure path
5. Finalize Matrix chat bootstrap from backend matrix session endpoint.
6. Add call support only after TURN is validated in local infra.

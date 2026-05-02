export const appConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api",
  keycloakIssuer:
    process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ?? "http://localhost:8080/realms/bora",
  keycloakClientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "portal-web",
  matrixBaseUrl: process.env.NEXT_PUBLIC_MATRIX_BASE_URL ?? "http://localhost:8008",
};

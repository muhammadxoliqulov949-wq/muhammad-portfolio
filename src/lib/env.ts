const DEVELOPMENT_AUTH_SECRET = "portfolio-local-development-secret-do-not-deploy";
const MIN_AUTH_SECRET_LENGTH = 32;

/**
 * Server-only authentication configuration.
 *
 * Production is deliberately fail-closed: a missing, short, or known
 * development value must stop authentication instead of silently weakening it.
 * Local development may omit AUTH_SECRET and receives an explicit dev-only key.
 */
export function getAuthSecret(): Uint8Array {
  const configured = process.env.AUTH_SECRET?.trim();

  if (process.env.NODE_ENV === "production") {
    if (!configured) {
      throw new Error("AUTH_SECRET is required in production");
    }
    if (configured.length < MIN_AUTH_SECRET_LENGTH) {
      throw new Error(`AUTH_SECRET must contain at least ${MIN_AUTH_SECRET_LENGTH} characters in production`);
    }
    if (configured === DEVELOPMENT_AUTH_SECRET || configured === "dev-secret-change-this-in-production-please") {
      throw new Error("AUTH_SECRET must not use a known development value in production");
    }
  }

  const value = configured || DEVELOPMENT_AUTH_SECRET;
  return new TextEncoder().encode(value);
}

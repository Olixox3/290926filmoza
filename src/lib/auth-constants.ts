/** Canonical production origin — the only Google OAuth redirect Google Cloud allows. */
export const PRODUCTION_URL = "https://filmoza.vercel.app";
export const GOOGLE_CALLBACK_PATH = "/api/auth/callback/google";
export const GOOGLE_CALLBACK_URL = `${PRODUCTION_URL}${GOOGLE_CALLBACK_PATH}`;

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export function shouldForceProductionGoogleRedirect() {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXTAUTH_URL === PRODUCTION_URL ||
    process.env.AUTH_URL === PRODUCTION_URL
  );
}

/**
 * Kill Grok / Vercel preview OAuth proxies so Auth.js never emits
 * `/api/auth/oauth2/callback/grok-google` or a preview host as redirect_uri.
 *
 * Call this at module load, before `NextAuth()`.
 */
export function applyProductionAuthUrl() {
  delete process.env.AUTH_REDIRECT_PROXY_URL;
  process.env.AUTH_TRUST_HOST = "true";

  const fromEnv = process.env.NEXTAUTH_URL?.trim() || process.env.AUTH_URL?.trim();
  if (fromEnv) {
    process.env.AUTH_URL = fromEnv;
    process.env.NEXTAUTH_URL = fromEnv;
    return;
  }
  if (process.env.VERCEL_ENV === "production") {
    process.env.AUTH_URL = PRODUCTION_URL;
    process.env.NEXTAUTH_URL = PRODUCTION_URL;
  }
}

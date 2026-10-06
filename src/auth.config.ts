import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import {
  GOOGLE_CALLBACK_URL,
  PRODUCTION_URL,
  applyProductionAuthUrl,
  shouldForceProductionGoogleRedirect,
} from "@/lib/auth-constants";

applyProductionAuthUrl();

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
const forceGoogleCallback = shouldForceProductionGoogleRedirect();

export const authConfig = {
  trustHost: true,
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "filmoza-preview-secret" : undefined),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          ...(forceGoogleCallback ? { redirect_uri: GOOGLE_CALLBACK_URL } : {}),
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role === "admin" ? "admin" : "user";
      }
      if (!token.role) token.role = "user";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.email = String(token.email ?? session.user.email ?? "");
        session.user.role = token.role === "admin" ? "admin" : "user";
      }
      return session;
    },
    authorized({ auth, request }) {
      if (request.nextUrl.pathname.startsWith("/admin")) return Boolean(auth);
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const next = new URL(url);
        if (next.origin === baseUrl || next.origin === PRODUCTION_URL) return url;
      } catch {
        /* ignore */
      }
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const PRODUCTION_URL = "https://filmoza.vercel.app";

/** Kill grok/preview OAuth proxies so Google sees the production callback only. */
delete process.env.AUTH_REDIRECT_PROXY_URL;
process.env.AUTH_TRUST_HOST = "true";

if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
  process.env.AUTH_URL = process.env.NEXTAUTH_URL || process.env.AUTH_URL || PRODUCTION_URL;
  process.env.NEXTAUTH_URL = process.env.AUTH_URL;
}

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

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
  session: { strategy: "jwt" },
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "missing",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "missing",
            allowDangerousEmailAccountLinking: true,
          }),
        ]),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role === "admin" ? "admin" : "user";
      }
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
  },
} satisfies NextAuthConfig;

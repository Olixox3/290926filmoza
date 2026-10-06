import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { FilmozaAdapter } from "@/lib/auth-adapter";
import { applyProductionAuthUrl } from "@/lib/auth-constants";
import { ensureDbReady, query } from "@/lib/db";

applyProductionAuthUrl();

/**
 * Auth.js v5 (NextAuth) for Filmoza.
 *
 * - trustHost: true
 * - NEXTAUTH_URL / AUTH_URL → https://filmoza.vercel.app on production
 * - Google callback is ONLY /api/auth/callback/google (never grok-google, never :8080)
 * - JWT session exposes user.id, user.email, user.role
 * - Email + password via Credentials + bcryptjs
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: FilmozaAdapter(),
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "credentials",
      name: "E-mail i hasło",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;
        await ensureDbReady();
        const rows = await query<{
          id: string;
          name: string | null;
          email: string | null;
          image: string | null;
          role: string | null;
          password: string | null;
        }>("select id, name, email, image, role, password from users where lower(email) = $1", [email]);
        const user = rows[0];
        if (!user?.password) return null;
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role === "admin" ? "admin" : "user",
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role === "admin" ? "admin" : "user";
      }

      const id = String(token.id ?? token.sub ?? "");
      if (!id) return token;

      try {
        await ensureDbReady();
        const rows = await query<{
          role: string | null;
          email: string | null;
          name: string | null;
          image: string | null;
        }>("select role, email, name, image from users where id = $1", [id]);
        const row = rows[0];
        if (row) {
          token.id = id;
          token.role = row.role === "admin" ? "admin" : "user";
          if (row.email) token.email = row.email;
          if (row.name) token.name = row.name;
          if (row.image) token.picture = row.image;
        }
      } catch {
        if (!token.role) token.role = "user";
      }
      return token;
    },
  },
});

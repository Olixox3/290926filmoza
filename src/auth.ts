import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { FilmozaAdapter } from "@/lib/auth-adapter";
import { ensureDbReady, query } from "@/lib/db";

/**
 * Auth.js (NextAuth v5) for Filmoza.
 *
 * - trustHost: true so Vercel / reverse proxies don't break CSRF
 * - NEXTAUTH_URL / AUTH_URL on production = https://filmoza.vercel.app
 * - Google callback is /api/auth/callback/google (matches Google Cloud Console)
 * - No grok-google proxy, no :8080 redirect_uri
 * - JWT session exposes user.id, user.email, user.role
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
});

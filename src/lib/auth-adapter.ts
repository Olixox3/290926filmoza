import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import { countAdmins, ensureDbReady, newId, query } from "@/lib/db";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string | null;
  email_verified: Date | string | null;
  password?: string | null;
};

function mapUser(row: UserRow | undefined): AdapterUser | null {
  if (!row) return null;
  const emailVerified =
    row.email_verified == null
      ? null
      : row.email_verified instanceof Date
        ? row.email_verified
        : new Date(row.email_verified);
  return {
    id: String(row.id),
    name: row.name,
    email: row.email ?? "",
    image: row.image,
    emailVerified,
    role: row.role === "admin" ? "admin" : "user",
  } as AdapterUser & { role: "admin" | "user" };
}

/** Auth.js adapter mapped onto snake_case Filmoza / Supabase tables. */
export function FilmozaAdapter(): Adapter {
  return {
    async createUser(user) {
      await ensureDbReady();
      const id = user.id || newId();
      const role = (await countAdmins()) === 0 ? "admin" : "user";
      await query(
        `insert into users (id, name, email, image, role, email_verified)
         values ($1,$2,$3,$4,$5,$6)`,
        [id, user.name ?? null, user.email ?? null, user.image ?? null, role, user.emailVerified ?? null],
      );
      return mapUser({
        id,
        name: user.name ?? null,
        email: user.email ?? null,
        image: user.image ?? null,
        role,
        email_verified: user.emailVerified ?? null,
      })!;
    },

    async getUser(id) {
      await ensureDbReady();
      const rows = await query<UserRow>("select * from users where id = $1", [id]);
      return mapUser(rows[0]);
    },

    async getUserByEmail(email) {
      await ensureDbReady();
      const rows = await query<UserRow>("select * from users where lower(email) = lower($1)", [email]);
      return mapUser(rows[0]);
    },

    async getUserByAccount({ provider, providerAccountId }) {
      await ensureDbReady();
      const rows = await query<UserRow>(
        `select u.* from users u
         join accounts a on a.user_id = u.id
         where a.provider = $1 and a.provider_account_id = $2`,
        [provider, providerAccountId],
      );
      return mapUser(rows[0]);
    },

    async updateUser(user) {
      await ensureDbReady();
      const current = await query<UserRow>("select * from users where id = $1", [user.id]);
      const row = current[0];
      if (!row) throw new Error("User not found");
      const name = user.name ?? row.name;
      const email = user.email ?? row.email;
      const image = user.image ?? row.image;
      const emailVerified = user.emailVerified ?? row.email_verified;
      await query(
        `update users set name = $2, email = $3, image = $4, email_verified = $5 where id = $1`,
        [user.id, name, email, image, emailVerified],
      );
      return mapUser({ ...row, name, email, image, email_verified: emailVerified })!;
    },

    async deleteUser(userId) {
      await ensureDbReady();
      await query("delete from users where id = $1", [userId]);
    },

    async linkAccount(account) {
      await ensureDbReady();
      await query(
        `insert into accounts (
           id, user_id, type, provider, provider_account_id,
           refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         on conflict (provider, provider_account_id) do update set
           user_id = excluded.user_id,
           refresh_token = excluded.refresh_token,
           access_token = excluded.access_token,
           expires_at = excluded.expires_at,
           token_type = excluded.token_type,
           scope = excluded.scope,
           id_token = excluded.id_token,
           session_state = excluded.session_state`,
        [
          newId(),
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token ?? null,
          account.access_token ?? null,
          account.expires_at ?? null,
          account.token_type ?? null,
          account.scope ?? null,
          account.id_token ?? null,
          account.session_state ?? null,
        ],
      );
      return account as AdapterAccount;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await ensureDbReady();
      await query("delete from accounts where provider = $1 and provider_account_id = $2", [
        provider,
        providerAccountId,
      ]);
    },

    async createSession(session) {
      await ensureDbReady();
      const id = newId();
      await query(
        `insert into sessions (id, session_token, user_id, expires) values ($1,$2,$3,$4)`,
        [id, session.sessionToken, session.userId, session.expires],
      );
      return session as AdapterSession;
    },

    async getSessionAndUser(sessionToken) {
      await ensureDbReady();
      const sessions = await query<{
        session_token: string;
        user_id: string;
        expires: Date | string;
      }>("select session_token, user_id, expires from sessions where session_token = $1", [sessionToken]);
      const session = sessions[0];
      if (!session) return null;
      const users = await query<UserRow>("select * from users where id = $1", [session.user_id]);
      const user = mapUser(users[0]);
      if (!user) return null;
      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id,
          expires: session.expires instanceof Date ? session.expires : new Date(session.expires),
        },
        user,
      };
    },

    async updateSession(session) {
      await ensureDbReady();
      const current = await query<{
        session_token: string;
        user_id: string;
        expires: Date | string;
      }>("select session_token, user_id, expires from sessions where session_token = $1", [session.sessionToken]);
      const row = current[0];
      if (!row) return null;
      const expires = session.expires ?? row.expires;
      const userId = session.userId ?? row.user_id;
      await query("update sessions set expires = $2, user_id = $3 where session_token = $1", [
        session.sessionToken,
        expires,
        userId,
      ]);
      return {
        sessionToken: session.sessionToken,
        userId,
        expires: expires instanceof Date ? expires : new Date(expires),
      };
    },

    async deleteSession(sessionToken) {
      await ensureDbReady();
      await query("delete from sessions where session_token = $1", [sessionToken]);
    },

    async createVerificationToken(token) {
      await ensureDbReady();
      await query(
        `insert into verification_tokens (identifier, token, expires) values ($1,$2,$3)
         on conflict (identifier, token) do update set expires = excluded.expires`,
        [token.identifier, token.token, token.expires],
      );
      return token as VerificationToken;
    },

    async useVerificationToken({ identifier, token }) {
      await ensureDbReady();
      const rows = await query<{ identifier: string; token: string; expires: Date | string }>(
        "select identifier, token, expires from verification_tokens where identifier = $1 and token = $2",
        [identifier, token],
      );
      const row = rows[0];
      if (!row) return null;
      await query("delete from verification_tokens where identifier = $1 and token = $2", [identifier, token]);
      return {
        identifier: row.identifier,
        token: row.token,
        expires: row.expires instanceof Date ? row.expires : new Date(row.expires),
      };
    },
  };
}

import { randomUUID } from "node:crypto";

export type SqlRow = Record<string, unknown>;

type QueryFn = <T = SqlRow>(text: string, params?: unknown[]) => Promise<T[]>;

const globalRef = globalThis as typeof globalThis & {
  __filmozaQuery__?: QueryFn;
  __filmozaReady__?: Promise<void>;
  __pgliteInstance__?: Promise<import("@electric-sql/pglite").PGlite>;
};

const databaseUrl = process.env.DATABASE_URL?.trim() || undefined;

function wrapPgTypes(pg: typeof import("pg")) {
  pg.types.setTypeParser(20, (v) => Number(v));
  pg.types.setTypeParser(1082, (v) => v);
}

async function createQuery(): Promise<QueryFn> {
  if (databaseUrl) {
    const pg = await import("pg");
    wrapPgTypes(pg);
    const pool = new pg.Pool({ connectionString: databaseUrl, max: 8 });
    return async <T = SqlRow>(text: string, params: unknown[] = []) => {
      const res = await pool.query(text, params);
      return res.rows as T[];
    };
  }

  globalRef.__pgliteInstance__ ??= (async () => {
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite();
    await pg.waitReady;
    return pg;
  })();
  const pglite = await globalRef.__pgliteInstance__;
  return async <T = SqlRow>(text: string, params: unknown[] = []) => {
    const res = await pglite.query<T>(text, params);
    return res.rows;
  };
}

export async function query<T = SqlRow>(text: string, params: unknown[] = []): Promise<T[]> {
  globalRef.__filmozaQuery__ ??= await createQuery();
  return globalRef.__filmozaQuery__<T>(text, params);
}

export async function ensureDbReady(): Promise<void> {
  globalRef.__filmozaReady__ ??= (async () => {
    await query("select 1 as ok");
    await applySchema();
  })().catch((err) => {
    globalRef.__filmozaReady__ = undefined;
    throw err;
  });
  return globalRef.__filmozaReady__;
}

async function applySchema() {
  await query(`
    create table if not exists users (
      id text primary key,
      name text,
      email text unique,
      password text,
      image text,
      role text not null default 'user',
      email_verified timestamptz
    )
  `);
  await query(`alter table users add column if not exists password text`);
  await query(`alter table users add column if not exists role text`);
  await query(`alter table users add column if not exists image text`);
  await query(`alter table users add column if not exists email_verified timestamptz`);
  await query(`update users set role = 'user' where role is null`);

  await query(`
    create table if not exists accounts (
      id text primary key,
      user_id text not null references users(id) on delete cascade,
      type text not null,
      provider text not null,
      provider_account_id text not null,
      refresh_token text,
      access_token text,
      expires_at bigint,
      token_type text,
      scope text,
      id_token text,
      session_state text,
      unique (provider, provider_account_id)
    )
  `);
  await query(`alter table accounts add column if not exists expires_at bigint`);
  await query(`alter table accounts add column if not exists token_type text`);
  await query(`alter table accounts add column if not exists scope text`);
  await query(`alter table accounts add column if not exists id_token text`);
  await query(`alter table accounts add column if not exists session_state text`);

  await query(`
    create table if not exists sessions (
      id text primary key,
      session_token text not null unique,
      user_id text not null references users(id) on delete cascade,
      expires timestamptz not null
    )
  `);

  await query(`
    create table if not exists verification_tokens (
      identifier text not null,
      token text not null,
      expires timestamptz not null,
      primary key (identifier, token)
    )
  `);

  await query(`
    create table if not exists media (
      id serial primary key,
      title text not null,
      slug text not null unique,
      type text not null check (type in ('movie', 'series')),
      description text,
      poster_url text,
      backdrop_url text,
      video_url text,
      release_year int,
      genre text
    )
  `);

  await query(`
    create table if not exists episodes (
      id serial primary key,
      media_id int not null references media(id) on delete cascade,
      season_number int not null default 1,
      episode_number int not null,
      title text not null,
      video_url text,
      thumbnail_url text,
      unique (media_id, season_number, episode_number)
    )
  `);

  await query(`
    create table if not exists favorites (
      user_id text not null,
      media_id int not null references media(id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (user_id, media_id)
    )
  `);

  await query(`
    create table if not exists watch_progress (
      user_id text not null,
      media_id int not null references media(id) on delete cascade,
      episode_id int references episodes(id) on delete cascade,
      position_seconds int not null default 0,
      duration_seconds int not null default 0,
      updated_at timestamptz not null default now(),
      unique (user_id, media_id)
    )
  `);

  const count = await query<{ n: number }>("select count(*)::int as n from media");
  if ((count[0]?.n ?? 0) === 0) {
    await seedCatalog();
  }
  await query(`update media set description = replace(description, 'Zrozpaczka', 'Zrozpaczona') where description like '%Zrozpaczka%'`);
}

async function seedCatalog() {
  const rows: Array<[string, string, string, string, string | null, string | null, string | null, number, string]> = [
    [
      "Big Buck Bunny",
      "big-buck-bunny",
      "movie",
      "Otwarty film Fundacji Blendera. Ogromny, łagodny królik mieszka na łące — aż trójka złośliwych gryzoni psuje mu poranek.",
      "/posters/big-buck-bunny.jpg",
      "/backdrops/big-buck-bunny.jpg",
      "/videos/big-buck-bunny.mp4",
      2008,
      "Animacja",
    ],
    [
      "Sintel",
      "sintel",
      "movie",
      "Dziewczyna imieniem Sintel wędruje przez mroźny świat, by odnaleźć rannego smoka, którego kiedyś uratowała.",
      "/posters/sintel.jpg",
      "/backdrops/sintel.jpg",
      "/videos/sintel.mp4",
      2010,
      "Animacja",
    ],
    [
      "Elephants Dream",
      "elephants-dream",
      "movie",
      "Pierwszy otwarty film Blendera. Emo i Probo błądzą po surrealistycznej machinie ze stali i kabli.",
      "/posters/elephants-dream.jpg",
      "/backdrops/cinema.jpg",
      "/videos/elephants-dream.mp4",
      2006,
      "Animacja",
    ],
    [
      "Cosmos Laundromat",
      "cosmos-laundromat",
      "movie",
      "Zrozpaczona owca na bezludnej planecie dostaje od tajemniczego sprzedawcy ofertę, której nie sposób odrzucić.",
      "/posters/cosmos-laundromat.jpg",
      "/backdrops/cinema.jpg",
      "/videos/cosmos-laundromat.mp4",
      2015,
      "Animacja",
    ],
    [
      "Noc żywych trupów",
      "noc-zywych-trupow",
      "movie",
      "Grupa nieznajomych zamyka się w farmie, gdy umarli zaczynają chodzić. Klasyczny horror George’a A. Romero.",
      "/posters/night-of-the-living-dead.jpg",
      "/backdrops/cinema.jpg",
      "/videos/night-of-the-living-dead.mp4",
      1968,
      "Horror",
    ],
    [
      "Nosferatu",
      "nosferatu",
      "movie",
      "Hutter jedzie w Karpaty, by sprzedać dom tajemniczemu hrabiemu Orlokowi. Ekspresjonistyczny wampiryczny niemowa Murnaua.",
      "/posters/nosferatu.jpg",
      "/backdrops/nosferatu.jpg",
      "/videos/nosferatu.mp4",
      1922,
      "Horror",
    ],
    [
      "Metropolis",
      "metropolis",
      "movie",
      "Futurystyczne miasto, robot i rewolucja. Niemy epos Fritza Langa — kanon science fiction.",
      "/posters/metropolis.jpg",
      "/backdrops/cinema.jpg",
      "/videos/metropolis.mp4",
      1927,
      "Sci-Fi",
    ],
    [
      "Generał",
      "general",
      "movie",
      "Buster Keaton goni skradzioną lokomotywę. Jeden z najdoskonalszych filmów niemych kina slapstickowego.",
      "/posters/the-general.jpg",
      "/backdrops/cinema.jpg",
      "/videos/the-general.mp4",
      1926,
      "Komedia",
    ],
    [
      "Caminandes",
      "caminandes",
      "series",
      "Krótka seria Blendera o lamie, która nie umie przejść przez ogrodzenie. Ciepła, gagowa animacja.",
      "/posters/caminandes.jpg",
      "/backdrops/cinema.jpg",
      null,
      2013,
      "Animacja",
    ],
  ];

  for (const row of rows) {
    await query(
      `insert into media (title, slug, type, description, poster_url, backdrop_url, video_url, release_year, genre)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (slug) do nothing`,
      row,
    );
  }

  const series = await query<{ id: number }>("select id from media where slug = 'caminandes'");
  if (series[0]) {
    await query(
      `insert into episodes (media_id, season_number, episode_number, title, video_url, thumbnail_url)
       values ($1, 1, 1, 'Llama Drama', '/videos/caminandes.mp4', '/posters/caminandes.jpg')
       on conflict do nothing`,
      [series[0].id],
    );
  }
}

export function newId() {
  return randomUUID();
}

export async function countAdmins() {
  const rows = await query<{ n: number }>("select count(*)::int as n from users where role = 'admin'");
  return rows[0]?.n ?? 0;
}

-- Auth.js + Filmoza media schema (snake_case) for Supabase PostgreSQL.
-- Safe to run on an empty project; uses IF NOT EXISTS.

create table if not exists users (
  id text primary key,
  name text,
  email text unique,
  password text,
  image text,
  role text not null default 'user',
  email_verified timestamptz
);

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
);

create table if not exists sessions (
  id text primary key,
  session_token text not null unique,
  user_id text not null references users(id) on delete cascade,
  expires timestamptz not null
);

create table if not exists verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

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
);

create table if not exists episodes (
  id serial primary key,
  media_id int not null references media(id) on delete cascade,
  season_number int not null default 1,
  episode_number int not null,
  title text not null,
  video_url text,
  thumbnail_url text,
  unique (media_id, season_number, episode_number)
);

create table if not exists favorites (
  user_id text not null,
  media_id int not null references media(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, media_id)
);

-- Profile extras: role already exists; persist when the auth user is verified.
-- Better Auth keeps identity in "user" (text ids). App roles live here.
alter table profiles add column if not exists email_verified timestamptz;

create index if not exists profiles_role_idx on profiles (role);

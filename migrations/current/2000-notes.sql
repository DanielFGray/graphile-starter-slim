create table app_public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  title text not null,
  body text,
  tags citext[] not null default '{}',
  search tsvector not null generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(array_to_tsvector(tags), 'B') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on app_public.notes (user_id);
create index on app_public.notes using gin (tags);
create index on app_public.notes using gist (search);
alter table app_public.notes enable row level security;
grant
  select,
  insert (title, body, tags),
  update (title, body, tags),
  delete
on app_public.notes to :DATABASE_VISITOR;
create policy insert_own on app_public.notes
  for insert with check (user_id = app_public.current_user_id());
create policy select_own on app_public.notes
  for select using (user_id = app_public.current_user_id());
create policy update_own on app_public.notes
  for update using (user_id = app_public.current_user_id());
create policy delete_own on app_public.notes
  for delete using (user_id = app_public.current_user_id());

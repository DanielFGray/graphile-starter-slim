create type app_public.task_status as enum(
  'pending',
  'started',
  'completed',
  'abandoned'
);

create table app_public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  title text not null,
  description text,
  tags citext[] not null default '{}',
  search tsvector not null generated always as (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(array_to_tsvector(tags), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on app_public.tasks (user_id);
create index on app_public.tasks using gin (tags);
create index on app_public.tasks using gist (search);
alter table app_public.tasks enable row level security;
grant
  select,
  insert (title, description, tags),
  update (title, description, tags),
  delete
on app_public.tasks to :DATABASE_VISITOR;
create policy insert_own on app_public.tasks
  for insert with check (user_id = app_public.current_user_id());
create policy select_own on app_public.tasks
  for select using (user_id = app_public.current_user_id());
create policy update_own on app_public.tasks
  for update using (user_id = app_public.current_user_id());
create policy delete_own on app_public.tasks
  for delete using (user_id = app_public.current_user_id());

create table app_public.tasks_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default app_public.current_user_id() references app_public.users on delete cascade,
  task_id uuid not null references app_public.tasks,
  status app_public.task_status not null default 'pending'::app_public.task_status,
  updated_at timestamptz not null default now()
);
comment on table app_public.tasks_steps is E'@omit';
create index on app_public.tasks_steps (id);
create index on app_public.tasks_steps (user_id);
create index on app_public.tasks_steps (task_id);
create index on app_public.tasks_steps (status);
alter table app_public.tasks_steps enable row level security;
grant
  select,
  insert (task_id, status),
  update (status),
  delete
on app_public.tasks_steps to :DATABASE_VISITOR;
create policy insert_own on app_public.tasks_steps
  for insert with check (user_id = app_public.current_user_id());
create policy select_own on app_public.tasks_steps
  for select using (user_id = app_public.current_user_id());
create policy update_own on app_public.tasks_steps
  for update using (user_id = app_public.current_user_id());
create policy delete_own on app_public.tasks_steps
  for delete using (user_id = app_public.current_user_id());
create trigger _100_timestamps
  before insert or update on app_public.tasks_steps
  for each row
  execute procedure app_private.tg__timestamps();

create function app_public.tasks_status(t app_public.tasks) returns app_public.task_status as $$
  select status
  from app_public.tasks_steps
  where task_id = t.id
  order by updated_at desc
  limit 1;
$$ language sql stable;
grant execute on function app_public.tasks_status(app_public.tasks) to :DATABASE_VISITOR;

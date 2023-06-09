create domain app_public.tag as citext check (length(value) between 1 and 64);
create type app_public.vote_type as enum ('down', 'up');

create table app_public.posts (
  post_id text primary key not null generated always as (id_encode(int_id)) stored,
  int_id int generated always as identity (start 1000),
  user_id uuid not null references app_public.users,
  title text not null check (length(title) between 1 and 140),
  body text not null check (length(body) between 1 and 2000),
  tags app_public.tag[] not null check (array_length(tags, 1) between 1 and 5),
  search tsvector not null generated always as (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(body, '')), 'B')
    ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on app_public.posts (user_id);
create index on app_public.posts using gin (tags);
create index on app_public.posts (created_at desc);

alter table app_public.posts enable row level security;

grant
  select,
  insert (title, body, tags),
  update (title, body, tags),
  delete
  on app_public.posts to :DATABASE_VISITOR;

create policy select_all on app_public.posts
  for select using (true);

create policy insert_own on app_public.posts
  for insert with check (user_id = app_public.current_user_id());

create policy update_own on app_public.posts
  for update using (user_id = app_public.current_user_id());

create policy delete_own on app_public.posts
  for delete using (user_id = app_public.current_user_id());

create trigger _100_timestamps
  before insert or update
  on app_public.posts
  for each row
execute procedure app_private.tg__timestamps();

create table app_public.posts_votes (
  post_id text not null references app_public.posts on delete cascade,
  user_id uuid not null references app_public.users,
  vote app_public.vote_type not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

comment on table app_public.posts_votes is E'@omit';

create index on app_public.posts_votes (user_id);
create index on app_public.posts_votes (post_id);

alter table app_public.posts_votes enable row level security;


grant
  select,
  insert (vote),
  update (vote),
  delete
  on app_public.posts_votes to :DATABASE_VISITOR;

create policy select_all on app_public.posts_votes
  for select using (true);

create policy insert_own on app_public.posts_votes
  for insert with check (user_id = app_public.current_user_id());

create policy update_own on app_public.posts_votes
   for update using (user_id = app_public.current_user_id());

create policy delete_own on app_public.posts_votes
  for delete using (user_id = app_public.current_user_id());

create table app_public.comments (
  comment_id uuid primary key default gen_random_uuid(),
  post_id text not null references app_public.posts on delete cascade,
  user_id uuid references app_public.users on delete set null,
  parent_id uuid references app_public.comments on delete cascade,
  body text not null,
  search tsvector not null generated always as (to_tsvector('english', body)) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index on app_public.comments (post_id);
create index on app_public.comments (user_id);
create index on app_public.comments (parent_id);
create index on app_public.comments (created_at desc);

alter table app_public.comments enable row level security;

grant
  select,
  insert (body, parent_id),
  update (body),
  delete
  on app_public.comments to :DATABASE_VISITOR;

create policy select_all on app_public.comments
  for select using (true);

create policy insert_own on app_public.comments
  for insert with check (user_id = app_public.current_user_id());

create policy update_own on app_public.comments
  for update using (user_id = app_public.current_user_id());

create policy delete_own on app_public.comments
  for delete using (user_id = app_public.current_user_id());

create trigger _100_timestamps
  before insert or update
  on app_public.comments
  for each row
execute procedure app_private.tg__timestamps();

create table app_public.comments_votes (
  comment_id uuid not null references app_public.comments on delete cascade,
  user_id uuid not null references app_public.users,
  vote app_public.vote_type not null,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

comment on table app_public.comments_votes is E'@omit';

create index on app_public.comments_votes (user_id);
create index on app_public.comments_votes (comment_id);

alter table app_public.comments_votes enable row level security;

grant
  select,
  insert (vote),
  update (vote),
  delete
  on app_public.comments_votes to :DATABASE_VISITOR;

create policy select_all on app_public.comments_votes
  for select using (true);
create policy insert_own on app_public.comments_votes
  for insert with check (user_id = app_public.current_user_id());
create policy update_own on app_public.comments_votes
  for update using (user_id = app_public.current_user_id());
create policy delete_own on app_public.comments_votes
  for delete using (user_id = app_public.current_user_id());

create or replace function app_public.posts_current_user_voted(
  post app_public.posts
) returns app_public.vote_type as $$
  select
    vote
  from
    app_public.posts_votes v
  where
    v.post_id = post.post_id
    and v.user_id = app_public.current_user_id()
$$ language sql stable security definer;

grant execute on function app_public.posts_current_user_voted(app_public.posts) to :DATABASE_VISITOR;

create view app_public.top_tags as
  select
    unnest(tags) as tag,
    count(*) as count
  from
    app_public.posts
  group by
    tag
  order by
    count desc;

grant select on app_public.top_tags to :DATABASE_VISITOR;

comment on view app_public.top_tags is E'@omit order';

create or replace function app_public.posts_score(
  post app_public.posts
) returns int as $$
select
  coalesce(sum(
     case vote
       when 'up' then 1
       when 'down' then -1
       end
   ), 0) as score
from
  app_public.posts_votes v
where
  v.post_id = post.post_id
$$ language sql stable;

grant execute on function app_public.posts_score(app_public.posts) to :DATABASE_VISITOR;

create or replace function app_public.posts_popularity(
  post app_public.posts
) returns float as $$
  -- https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
  select (app_public.posts_score(post) - 1) / pow((extract(epoch from (now() - post.created_at)) / 3600) + 2, 1.8)
$$ language sql stable;

grant execute on function app_public.posts_popularity(app_public.posts) to :DATABASE_VISITOR;

create or replace function app_public.comments_current_user_voted(
  comment app_public.comments
) returns app_public.vote_type as $$
  select
    vote
  from
    app_public.comments_votes v
  where
    v.comment_id = comment.comment_id
    and v.user_id = app_public.current_user_id()
$$ language sql stable security definer;

grant execute on function app_public.comments_current_user_voted(app_public.comments) to :DATABASE_VISITOR;

create or replace function app_public.comments_score(
  comment app_public.comments
) returns int as $$
  select
    coalesce(sum(
       case vote
         when 'up' then 1
         when 'down' then -1
         end
     ), 0) as score
  from
    app_public.comments_votes v
  where
    v.comment_id = comment.comment_id
$$ language sql stable;

grant execute on function app_public.comments_score(app_public.comments) to :DATABASE_VISITOR;

create or replace function app_public.comments_popularity(
  comment app_public.comments
) returns float as $$
  -- https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
  select (app_public.comments_score(comment) - 1) / pow((extract(epoch from (now() - comment.created_at)) / 3600) + 2, 1.8)
$$ language sql stable;

grant execute on function app_public.comments_popularity(app_public.comments) to :DATABASE_VISITOR;

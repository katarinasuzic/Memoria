-- Memoria initial schema: profiles + library_items with RLS and signup trigger.

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Library items (a user's tracked books / movies / shows)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'media_type') then
    create type public.media_type as enum ('book', 'movie', 'show');
  end if;
end $$;

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_type public.media_type not null,
  source text,                       -- 'openlibrary' | 'tmdb' | 'tvmaze'
  external_id text not null,
  title text not null,
  subtitle text,
  cover_url text,
  status text not null,
  rating numeric(4, 1),              -- 1-5 for books, 1-10 for movies/shows; null = no rating
  review text,
  review_type text,                  -- 'Quick Thought' | 'Full Review' | 'Spoiler Review'
  spoiler boolean not null default false,
  is_favorite boolean not null default false,
  progress_current integer,
  progress_total integer,
  genres text[],
  started_at date,
  finished_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, media_type, external_id)
);

create index if not exists library_items_user_idx on public.library_items (user_id);
create index if not exists library_items_user_type_idx on public.library_items (user_id, media_type);

alter table public.library_items enable row level security;

create policy "Users can view their own library"
  on public.library_items for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own library"
  on public.library_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own library"
  on public.library_items for update
  using (auth.uid() = user_id);

create policy "Users can delete from their own library"
  on public.library_items for delete
  using (auth.uid() = user_id);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger library_items_set_updated_at
  before update on public.library_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    split_part(new.email, '@', 1),
    split_part(new.email, '@', 1)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

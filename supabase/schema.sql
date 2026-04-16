-- ═══════════════════════════════════════════════════════════════════════════════
-- ESP32 Dev Manager — Supabase Schema Migration
-- Run this in Supabase SQL Editor to set up the database
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Kits ─────────────────────────────────────────────────────────────────────
create table if not exists public.kits (
    id         uuid primary key default uuid_generate_v4(),
    sku        text unique not null,
    name       text not null,
    tier       text not null check (tier in ('basic', 'super', 'ultimate')),
    board      text not null,
    description text not null default '',
    tutorial_url text not null default '',
    download_url text not null default '',
    project_count integer not null default 0,
    component_count integer not null default 0,
    image_url  text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- ── Projects ─────────────────────────────────────────────────────────────────
create table if not exists public.projects (
    id                   uuid primary key default uuid_generate_v4(),
    sketch_id            text unique not null,
    name                 text not null,
    full_name            text not null,
    category             text not null,
    difficulty           integer not null check (difficulty between 1 and 5),
    description          text not null default '',
    concepts             text[] not null default '{}',
    components           jsonb not null default '[]',
    pins_used            jsonb not null default '[]',
    libraries            text[] not null default '{}',
    prerequisites        text[] not null default '{}',
    arduino_path         text not null,
    python_path          text,
    time_estimate        integer not null default 30,
    learning_objectives  text[] not null default '{}',
    kit_tier             text not null check (kit_tier in ('basic', 'super', 'ultimate')),
    tags                 text[] not null default '{}',
    language             text not null check (language in ('arduino', 'python', 'both')),
    arduino_storage_path text,
    python_storage_path  text,
    created_at           timestamptz not null default now(),
    updated_at           timestamptz not null default now()
);

create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_difficulty on public.projects(difficulty);
create index if not exists idx_projects_kit_tier on public.projects(kit_tier);
create index if not exists idx_projects_tags on public.projects using gin(tags);

-- ── Categories ───────────────────────────────────────────────────────────────
create table if not exists public.categories (
    id            text primary key,
    name          text not null,
    description   text not null default '',
    icon          text not null default '📦',
    color         text not null default '#3b82f6',
    project_count integer not null default 0,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- ── Learning Paths ───────────────────────────────────────────────────────────
create table if not exists public.learning_paths (
    id              text primary key,
    name            text not null,
    description     text not null default '',
    icon            text not null default 'Zap',
    color           text not null default '#3b82f6',
    categories      text[] not null default '{}',
    projects        text[] not null default '{}',
    estimated_hours integer not null default 1,
    difficulty      integer not null check (difficulty between 1 and 5),
    skills          text[] not null default '{}',
    prerequisites   text[] not null default '{}',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- ── Profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
    id              uuid primary key references auth.users(id) on delete cascade,
    display_name    text,
    avatar_url      text,
    bio             text not null default '',
    job_title       text not null default '',
    company         text not null default '',
    location        text not null default '',
    website         text not null default '',
    github_username text not null default '',
    phone           text not null default '',
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, display_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ── Sync Logs ────────────────────────────────────────────────────────────────
create table if not exists public.sync_logs (
    id              uuid primary key default uuid_generate_v4(),
    type            text not null default 'seed' check (type in ('seed', 'files')),
    status          text not null default 'pending' check (status in ('pending', 'started', 'completed', 'failed')),
    started_at      timestamptz not null default now(),
    completed_at    timestamptz,
    items_processed integer not null default 0,
    error_message   text,
    metadata        jsonb
);

create index if not exists idx_sync_logs_started_at on public.sync_logs(started_at desc);

-- ── Kit Normalizations (used by Admin Kit Scanner) ────────────────────────────
create table if not exists public.kit_normalizations (
    sku             text primary key,
    normalized_at   timestamptz not null default now()
);

-- ── User Progress ─────────────────────────────────────────────────────────────
create table if not exists public.user_progress (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    project_id      text not null,
    status          text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
    checkpoint      integer not null default 0,
    xp_awarded      boolean not null default false,
    started_at      timestamptz,
    completed_at    timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    unique (user_id, project_id)
);

-- ── User XP ──────────────────────────────────────────────────────────────────
create table if not exists public.user_xp (
    user_id             uuid primary key references auth.users(id) on delete cascade,
    total_xp            integer not null default 0,
    projects_completed  integer not null default 0,
    updated_at          timestamptz not null default now()
);

-- ── Auto-update timestamps ───────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger kits_updated_at
    before update on public.kits
    for each row execute function update_updated_at();

create or replace trigger projects_updated_at
    before update on public.projects
    for each row execute function update_updated_at();

create or replace trigger categories_updated_at
    before update on public.categories
    for each row execute function update_updated_at();

create or replace trigger learning_paths_updated_at
    before update on public.learning_paths
    for each row execute function update_updated_at();

create or replace trigger profiles_updated_at
    before update on public.profiles
    for each row execute function update_updated_at();

-- ── Storage Buckets (run via Supabase dashboard or API) ──────────────────────
-- insert into storage.buckets (id, name, public) values
--   ('code-files', 'code-files', true),
--   ('datasheets', 'datasheets', true);

-- ── RLS Policies ─────────────────────────────────────────────────────────────
-- Public read access for all tables
alter table public.kits enable row level security;
alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.learning_paths enable row level security;
alter table public.sync_logs enable row level security;

alter table public.profiles enable row level security;

create policy "Public read access" on public.profiles
    for select using (true);

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
    for insert with check (auth.uid() = id);

create policy "Public read access" on public.kits
    for select using (true);

create policy "Public read access" on public.projects
    for select using (true);

create policy "Public read access" on public.categories
    for select using (true);

create policy "Public read access" on public.learning_paths
    for select using (true);

create policy "Authenticated read for sync logs" on public.sync_logs
    for select using (auth.role() = 'authenticated');

-- Write access for authenticated users (admin)
create policy "Admin write access" on public.kits
    for all using (auth.role() = 'authenticated');

create policy "Admin write access" on public.projects
    for all using (auth.role() = 'authenticated');

create policy "Admin write access" on public.categories
    for all using (auth.role() = 'authenticated');

create policy "Admin write access" on public.learning_paths
    for all using (auth.role() = 'authenticated');

create policy "Admin write access" on public.sync_logs
    for all using (auth.role() = 'authenticated');

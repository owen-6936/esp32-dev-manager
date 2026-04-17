-- Migration: Add analytics and feedback tables
-- Run this in your Supabase SQL Editor to enable cloud analytics

-- ─── Page Views ──────────────────────────────────────────────────────────────

create table if not exists public.page_views (
  id          uuid primary key default gen_random_uuid(),
  path        text not null,
  session_id  uuid not null,
  referrer    text,
  created_at  timestamptz not null default now()
);

-- Index for fast time-range queries in the admin dashboard
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

-- Allow anonymous inserts (page views don't require auth)
alter table public.page_views enable row level security;
create policy "Anyone can insert page views"
  on public.page_views for insert with check (true);
create policy "Only admins can read page views"
  on public.page_views for select using (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

-- ─── Feedback ────────────────────────────────────────────────────────────────

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('bug', 'feature', 'general')),
  subject    text not null,
  message    text not null,
  email      text,
  user_id    uuid references auth.users(id) on delete set null,
  status     text not null default 'open' check (status in ('open', 'triaged', 'resolved')),
  created_at timestamptz not null default now()
);

create index if not exists feedback_status_idx on public.feedback (status);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

-- Anyone can submit feedback; only admins can read / update it
alter table public.feedback enable row level security;
create policy "Anyone can submit feedback"
  on public.feedback for insert with check (true);
create policy "Users can read their own feedback"
  on public.feedback for select using (
    auth.uid() = user_id
    or auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );
create policy "Only admins can update feedback"
  on public.feedback for update using (
    auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

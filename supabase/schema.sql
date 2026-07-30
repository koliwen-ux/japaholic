-- Run this once in the Supabase Dashboard SQL Editor for a fresh project.
-- Covers the five data domains that currently have add/edit/delete UI in the app.
-- RLS is intentionally left off: the app only ever talks to these tables from
-- server-side code using the service_role key, never from the browser.

create table content_items (
  id text primary key,
  type text not null check (type in ('article','youtube','sns')),
  title text not null,
  url text not null default '',
  publish_date date,
  status text not null check (status in ('draft','scheduled','published')),
  location_id text not null,
  created_at timestamptz not null default now()
);

create table content_proposals (
  id text primary key,
  type text not null check (type in ('article','youtube','sns')),
  prefecture_id text not null,
  related_prefecture_ids text[] not null default '{}',
  title text not null,
  summary text not null default '',
  outline text[] not null default '{}',
  keywords_primary text[] not null default '{}',
  keywords_secondary text[] not null default '{}',
  title_alternatives text[] not null default '{}',
  format text,
  status text not null check (status in ('candidate','selected','discarded')),
  created_at timestamptz not null default now()
);

create table coverage_plans (
  id text primary key,
  prefecture_id text not null,
  spot text not null,
  date date,
  time text not null default '',
  address text not null default '',
  reference_url text,
  notes text not null default '',
  status text not null check (status in ('planned','confirmed','completed')),
  created_at timestamptz not null default now()
);

create table coverage_checklist_items (
  id text primary key,
  plan_id text not null references coverage_plans(id) on delete cascade,
  label text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table itinerary_stops (
  id text primary key,
  day integer not null,
  position integer not null default 0,
  spot_name text not null,
  note text not null default '',
  location_id text not null,
  transport text,
  content_focus text,
  created_at timestamptz not null default now()
);

create table budget_items (
  id text primary key,
  category text not null,
  amount integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index coverage_checklist_items_plan_id_idx on coverage_checklist_items(plan_id);
create index itinerary_stops_day_position_idx on itinerary_stops(day, position);

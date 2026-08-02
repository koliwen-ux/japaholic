-- Run this once in the Supabase Dashboard SQL Editor for a fresh project.
-- Reflects the current schema (content_items/coverage_plans/calendar_progress/
-- itinerary_stops/budget_items are all scoped to a project via project_id;
-- itinerary_stops also carry start_time/end_time), not the migration history.
-- RLS is intentionally left off: the app only ever talks to these tables from
-- server-side code using the service_role key, never from the browser.

create table projects (
  id text primary key,
  prefecture_id text not null,
  name text not null,
  assignees text[] not null default '{}',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table content_items (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  type text not null check (type in ('article','youtube','sns')),
  title text not null,
  url text not null default '',
  publish_date date,
  draft_due_date date,
  status text not null check (status in ('candidate','draft','scheduled','published','discarded')),
  location_id text not null,
  summary text not null default '',
  outline text[] not null default '{}',
  keywords_primary text[] not null default '{}',
  keywords_secondary text[] not null default '{}',
  title_alternatives text[] not null default '{}',
  format text,
  related_prefecture_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table coverage_plans (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
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
  project_id text not null references projects(id) on delete cascade,
  date date not null,
  position integer not null default 0,
  spot_name text not null,
  note text not null default '',
  location_id text not null,
  transport text,
  content_focus text,
  start_time text,
  end_time text,
  created_at timestamptz not null default now()
);

create table budget_items (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  category text not null,
  amount integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

create table calendar_progress (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  date date,
  task text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table media_assets (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  url text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index coverage_checklist_items_plan_id_idx on coverage_checklist_items(plan_id);
create index itinerary_stops_project_id_idx on itinerary_stops(project_id);
create index itinerary_stops_date_position_idx on itinerary_stops(date, position);
create index budget_items_project_id_idx on budget_items(project_id);
create index content_items_project_id_idx on content_items(project_id);
create index coverage_plans_project_id_idx on coverage_plans(project_id);
create index calendar_progress_project_id_idx on calendar_progress(project_id);
create index media_assets_project_id_idx on media_assets(project_id);

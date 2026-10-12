create table if not exists skill_installs (
  id integer primary key autoincrement,
  skill text not null check (length(skill) between 8 and 87 and skill glob 'yeknal-*'),
  scope text not null check (scope in ('project', 'all')),
  created_at text not null default (datetime('now'))
);

-- Last complete total, served when it is fresh or when an outside source is down.
create table if not exists download_total (
  id integer primary key check (id = 1),
  total integer not null,
  updated_at integer not null
);

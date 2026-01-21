alter table public.profiles
  add column if not exists notification_opt_in boolean not null default true;

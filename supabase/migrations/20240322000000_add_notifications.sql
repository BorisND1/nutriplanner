
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notification_enabled boolean default true,
  notification_advance_minutes integer default 15
);

-- Create meal_notifications table
create table meal_notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  meal_name text not null,
  scheduled_time time not null,
  notification_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table profiles enable row level security;
alter table meal_notifications enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Policies for meal_notifications
create policy "Users can view their own notifications"
  on meal_notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on meal_notifications for update
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger for new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

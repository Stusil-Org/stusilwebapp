-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false
);

-- Set up Row Level Security (RLS)
alter table public.messages enable row level security;

-- Policy: Users can see messages sent TO them or BY them
create policy "Users can view their own messages"
on public.messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Policy: Users can insert messages where they are the sender
create policy "Users can send messages"
on public.messages for insert
with check (auth.uid() = sender_id);

-- Optional: Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.messages;

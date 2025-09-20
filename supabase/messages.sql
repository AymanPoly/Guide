-- Messages table for booking threads
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  sender_profile_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

-- Drop existing policies to avoid duplicates when re-running
drop policy if exists "read messages by booking participants" on public.messages;
drop policy if exists "write messages by booking participants" on public.messages;

-- Participants (guest or host) can read messages of their bookings
create policy "read messages by booking participants" on public.messages
for select using (
  exists (
    select 1 from public.bookings b
    join public.experiences e on e.id = b.experience_id
    join public.profiles p_guest on p_guest.id = b.guest_id
    join public.profiles p_host on p_host.id = e.host_id
    where b.id = messages.booking_id
      and (auth.uid() = p_guest.auth_uid or auth.uid() = p_host.auth_uid)
  )
);

-- Participants can write messages for their bookings
create policy "write messages by booking participants" on public.messages
for insert with check (
  exists (
    select 1 from public.bookings b
    join public.experiences e on e.id = b.experience_id
    join public.profiles p_guest on p_guest.id = b.guest_id
    join public.profiles p_host on p_host.id = e.host_id
    where b.id = messages.booking_id
      and (auth.uid() = p_guest.auth_uid or auth.uid() = p_host.auth_uid)
  )
);



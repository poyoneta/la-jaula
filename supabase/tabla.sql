-- La Jaula: tabla para guardar la partida de cada jugador en la nube.
-- Pegalo entero en Supabase > SQL Editor > New query y tocá "Run".
create table if not exists public.partidas (
  user_id    uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  datos      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Cada uno puede ver y cambiar solo su propia partida
alter table public.partidas enable row level security;

drop policy if exists "ver mi partida" on public.partidas;
drop policy if exists "crear mi partida" on public.partidas;
drop policy if exists "editar mi partida" on public.partidas;

create policy "ver mi partida"    on public.partidas for select using (auth.uid() = user_id);
create policy "crear mi partida"  on public.partidas for insert with check (auth.uid() = user_id);
create policy "editar mi partida" on public.partidas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

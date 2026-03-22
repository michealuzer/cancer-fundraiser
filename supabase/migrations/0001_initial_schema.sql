-- ============================================================
-- Small Fighters — Initial Schema
-- ============================================================

-- patients ----------------------------------------------------
create table if not exists patients (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  age              int not null,
  condition        text not null,
  story            text,
  cover_image_url  text,
  goal_amount      numeric not null,
  raised_amount    numeric not null default 0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- donations ---------------------------------------------------
create table if not exists donations (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references patients(id) on delete cascade,
  donor_name   text not null,
  amount       numeric not null check (amount > 0),
  message      text,
  created_at   timestamptz not null default now()
);

-- index for fast donation lookups per patient
create index if not exists donations_patient_id_idx on donations(patient_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table patients  enable row level security;
alter table donations enable row level security;

-- patients: public read
create policy "public can read patients"
  on patients for select
  using (true);

-- patients: only authenticated users (admins) can insert
create policy "authenticated users can insert patients"
  on patients for insert
  to authenticated
  with check (true);

-- patients: only authenticated users (admins) can update/delete
create policy "authenticated users can update patients"
  on patients for update
  to authenticated
  using (true);

create policy "authenticated users can delete patients"
  on patients for delete
  to authenticated
  using (true);

-- donations: public read
create policy "public can read donations"
  on donations for select
  using (true);

-- donations: anyone can insert (public fundraising)
create policy "public can insert donations"
  on donations for insert
  with check (true);

-- ============================================================
-- Trigger: keep raised_amount in sync when a donation is added
-- ============================================================

create or replace function update_raised_amount()
returns trigger language plpgsql as $$
begin
  update patients
  set raised_amount = (
    select coalesce(sum(amount), 0)
    from donations
    where patient_id = new.patient_id
  )
  where id = new.patient_id;
  return new;
end;
$$;

create trigger on_donation_insert
  after insert on donations
  for each row execute procedure update_raised_amount();

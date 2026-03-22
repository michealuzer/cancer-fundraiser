-- Run this in Supabase SQL editor OR via CLI
-- Creates a public bucket for patient cover images

insert into storage.buckets (id, name, public)
values ('patient-images', 'patient-images', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy "authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'patient-images');

-- Allow public read
create policy "public can read images"
  on storage.objects for select
  using (bucket_id = 'patient-images');

-- Allow authenticated users to delete their uploads
create policy "authenticated users can delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'patient-images');

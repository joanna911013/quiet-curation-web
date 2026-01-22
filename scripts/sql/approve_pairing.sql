-- Task E: manual approval gate
-- Approve a pairing by id (run in Supabase SQL editor).
update public.pairings
set status = 'approved'
where id = 'PAIRING_ID';

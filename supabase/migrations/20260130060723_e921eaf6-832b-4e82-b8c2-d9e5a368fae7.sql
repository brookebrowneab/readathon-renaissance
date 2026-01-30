-- Add column to persist logo date text horizontal offset
ALTER TABLE public.events 
ADD COLUMN logo_date_x_offset numeric DEFAULT 0;
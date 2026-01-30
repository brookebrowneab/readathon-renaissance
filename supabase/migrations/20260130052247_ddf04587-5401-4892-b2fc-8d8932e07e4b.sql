-- Add logo_url column to events table to store the custom logo URL
ALTER TABLE public.events 
ADD COLUMN logo_url text;

-- Create storage bucket for event logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-logos', 'event-logos', true);

-- Allow anyone to view event logos (public bucket)
CREATE POLICY "Anyone can view event logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-logos');

-- Allow admins to upload event logos
CREATE POLICY "Admins can upload event logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-logos' 
  AND has_role(auth.uid(), 'admin')
);

-- Allow admins to update event logos
CREATE POLICY "Admins can update event logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'event-logos' 
  AND has_role(auth.uid(), 'admin')
);

-- Allow admins to delete event logos
CREATE POLICY "Admins can delete event logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'event-logos' 
  AND has_role(auth.uid(), 'admin')
);
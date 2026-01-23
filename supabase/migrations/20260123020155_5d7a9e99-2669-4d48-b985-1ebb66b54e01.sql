-- Add child_id to pledges table to link pledges to specific children
ALTER TABLE public.pledges 
ADD COLUMN child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX idx_pledges_child_id ON public.pledges(child_id);

-- Update RLS policies to allow parents to manage pledges for their children
DROP POLICY IF EXISTS "Authenticated users can insert pledges" ON public.pledges;
DROP POLICY IF EXISTS "Authenticated users can update pledges" ON public.pledges;

-- Parents can insert pledges for their own children
CREATE POLICY "Parents can insert pledges for their children" 
ON public.pledges 
FOR INSERT 
WITH CHECK (
  child_id IN (
    SELECT id FROM children WHERE user_id = auth.uid()
  )
  OR auth.uid() IS NOT NULL -- Allow sponsors (non-parents) to also create pledges
);

-- Parents can update pledges for their own children
CREATE POLICY "Parents can update their children's pledges" 
ON public.pledges 
FOR UPDATE 
USING (
  child_id IN (
    SELECT id FROM children WHERE user_id = auth.uid()
  )
  OR sponsor_id IN (
    SELECT id FROM sponsors WHERE user_id = auth.uid()
  )
);

-- Parents can delete pledges for their own children
CREATE POLICY "Parents can delete their children's pledges" 
ON public.pledges 
FOR DELETE 
USING (
  child_id IN (
    SELECT id FROM children WHERE user_id = auth.uid()
  )
);
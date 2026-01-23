-- Create children table for storing child profiles
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  grade_info TEXT,
  class_name TEXT,
  goal_minutes INTEGER NOT NULL DEFAULT 300,
  share_public_link BOOLEAN NOT NULL DEFAULT true,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Parents can view their own children
CREATE POLICY "Parents can view their own children"
ON public.children
FOR SELECT
USING (auth.uid() = user_id);

-- Parents can insert their own children
CREATE POLICY "Parents can insert their own children"
ON public.children
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Parents can update their own children
CREATE POLICY "Parents can update their own children"
ON public.children
FOR UPDATE
USING (auth.uid() = user_id);

-- Parents can delete their own children
CREATE POLICY "Parents can delete their own children"
ON public.children
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all children
CREATE POLICY "Admins can view all children"
ON public.children
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Public can view children with share_public_link enabled (for sponsor pages)
CREATE POLICY "Public can view children with public links"
ON public.children
FOR SELECT
USING (share_public_link = true);

-- Add trigger for updated_at
CREATE TRIGGER update_children_updated_at
BEFORE UPDATE ON public.children
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
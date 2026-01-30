-- Create sponsor_invitations table for tracking sponsor requests and approvals
CREATE TABLE public.sponsor_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  inviter_user_id UUID NOT NULL, -- User who sent the invitation (parent or approved sponsor)
  invitee_email TEXT NOT NULL,
  invitee_user_id UUID, -- Set when the invitee creates an account/makes a pledge
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  can_invite_others BOOLEAN NOT NULL DEFAULT false, -- Whether approved sponsor can re-invite
  invited_by_parent BOOLEAN NOT NULL DEFAULT false, -- True if parent sent invitation (auto-approve)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_sponsor_invitations_child ON public.sponsor_invitations(child_id);
CREATE INDEX idx_sponsor_invitations_invitee ON public.sponsor_invitations(invitee_email);
CREATE INDEX idx_sponsor_invitations_status ON public.sponsor_invitations(status);

-- Enable RLS
ALTER TABLE public.sponsor_invitations ENABLE ROW LEVEL SECURITY;

-- Parents can manage invitations for their own children
CREATE POLICY "Parents can view invitations for their children"
ON public.sponsor_invitations FOR SELECT
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can create invitations for their children"
ON public.sponsor_invitations FOR INSERT
WITH CHECK (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
  OR (
    -- Approved sponsors with can_invite_others permission can also invite
    EXISTS (
      SELECT 1 FROM public.sponsor_invitations si
      WHERE si.child_id = sponsor_invitations.child_id
        AND si.invitee_user_id = auth.uid()
        AND si.status = 'approved'
        AND si.can_invite_others = true
    )
  )
);

CREATE POLICY "Parents can update invitations for their children"
ON public.sponsor_invitations FOR UPDATE
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

CREATE POLICY "Parents can delete invitations for their children"
ON public.sponsor_invitations FOR DELETE
USING (
  child_id IN (SELECT id FROM public.children WHERE user_id = auth.uid())
);

-- Sponsors can view their own received invitations
CREATE POLICY "Users can view invitations sent to them"
ON public.sponsor_invitations FOR SELECT
USING (
  invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR invitee_user_id = auth.uid()
);

-- Approved sponsors with permission can create new invitations
CREATE POLICY "Approved sponsors can invite others"
ON public.sponsor_invitations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sponsor_invitations si
    WHERE si.child_id = sponsor_invitations.child_id
      AND si.invitee_user_id = auth.uid()
      AND si.status = 'approved'
      AND si.can_invite_others = true
  )
);

-- Admins can manage all invitations
CREATE POLICY "Admins can manage all invitations"
ON public.sponsor_invitations FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_sponsor_invitations_updated_at
  BEFORE UPDATE ON public.sponsor_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
-- Table: sponsor_invitations
-- Invitation tracking for sponsor access

CREATE TABLE public.sponsor_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id uuid NOT NULL REFERENCES public.children(id),
  inviter_user_id uuid NOT NULL,
  invitee_email text NOT NULL,
  invitee_user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  invited_by_parent boolean NOT NULL DEFAULT false,
  can_invite_others boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sponsor_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Parents can view invitations for their children"
  ON public.sponsor_invitations
  FOR SELECT
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can create invitations for their children"
  ON public.sponsor_invitations
  FOR INSERT
  WITH CHECK ((child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  )) OR (EXISTS (
    SELECT 1 FROM sponsor_invitations si
    WHERE si.child_id = sponsor_invitations.child_id
      AND si.invitee_user_id = auth.uid()
      AND si.status = 'approved'
      AND si.can_invite_others = true
  )));

CREATE POLICY "Approved sponsors can invite others"
  ON public.sponsor_invitations
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM sponsor_invitations si
    WHERE si.child_id = sponsor_invitations.child_id
      AND si.invitee_user_id = auth.uid()
      AND si.status = 'approved'
      AND si.can_invite_others = true
  ));

CREATE POLICY "Parents can update invitations for their children"
  ON public.sponsor_invitations
  FOR UPDATE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Parents can delete invitations for their children"
  ON public.sponsor_invitations
  FOR DELETE
  USING (child_id IN (
    SELECT children.id FROM children WHERE children.user_id = auth.uid()
  ));

CREATE POLICY "Users can view invitations sent to them"
  ON public.sponsor_invitations
  FOR SELECT
  USING ((invitee_email = (SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text)
    OR (invitee_user_id = auth.uid()));

CREATE POLICY "Admins can manage all invitations"
  ON public.sponsor_invitations
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

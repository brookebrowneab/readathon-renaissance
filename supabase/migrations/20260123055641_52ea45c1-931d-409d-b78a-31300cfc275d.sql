-- Persist school/payment/email settings on the active event record
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS school_name TEXT NOT NULL DEFAULT 'Lincoln Elementary',
  ADD COLUMN IF NOT EXISTS payment_address TEXT NOT NULL DEFAULT 'Lincoln Elementary PTA
Read-a-thon Fund
123 School Street
Anytown, ST 12345',
  ADD COLUMN IF NOT EXISTS accept_checks BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS accept_cards BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS send_reminders BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS reminder_days INTEGER NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS goal_minutes INTEGER NOT NULL DEFAULT 500;
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      archived_pledges: {
        Row: {
          amount: number
          archived_at: string
          event_id: string | null
          event_name: string | null
          id: string
          is_paid: boolean
          original_id: string | null
          pledge_type: string
          sponsor_name: string | null
          student_name: string
        }
        Insert: {
          amount: number
          archived_at?: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_paid?: boolean
          original_id?: string | null
          pledge_type: string
          sponsor_name?: string | null
          student_name: string
        }
        Update: {
          amount?: number
          archived_at?: string
          event_id?: string | null
          event_name?: string | null
          id?: string
          is_paid?: boolean
          original_id?: string | null
          pledge_type?: string
          sponsor_name?: string | null
          student_name?: string
        }
        Relationships: []
      }
      archived_reading_logs: {
        Row: {
          archived_at: string
          book_title: string | null
          event_id: string | null
          event_name: string | null
          id: string
          logged_at: string
          minutes: number
          original_id: string | null
          student_name: string
        }
        Insert: {
          archived_at?: string
          book_title?: string | null
          event_id?: string | null
          event_name?: string | null
          id?: string
          logged_at: string
          minutes: number
          original_id?: string | null
          student_name: string
        }
        Update: {
          archived_at?: string
          book_title?: string | null
          event_id?: string | null
          event_name?: string | null
          id?: string
          logged_at?: string
          minutes?: number
          original_id?: string | null
          student_name?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string | null
          cover_url: string | null
          created_at: string
          id: string
          isbn: string | null
          title: string
        }
        Insert: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          title: string
        }
        Update: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          title?: string
        }
        Relationships: []
      }
      children: {
        Row: {
          class_name: string | null
          created_at: string
          goal_minutes: number
          grade_info: string | null
          homeroom_teacher_id: string | null
          id: string
          name: string
          share_public_link: boolean
          student_login_enabled: boolean
          student_password_hash: string | null
          student_username: string | null
          total_minutes: number
          total_verified: boolean | null
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          class_name?: string | null
          created_at?: string
          goal_minutes?: number
          grade_info?: string | null
          homeroom_teacher_id?: string | null
          id?: string
          name: string
          share_public_link?: boolean
          student_login_enabled?: boolean
          student_password_hash?: string | null
          student_username?: string | null
          total_minutes?: number
          total_verified?: boolean | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          class_name?: string | null
          created_at?: string
          goal_minutes?: number
          grade_info?: string | null
          homeroom_teacher_id?: string | null
          id?: string
          name?: string
          share_public_link?: boolean
          student_login_enabled?: boolean
          student_password_hash?: string | null
          student_username?: string | null
          total_minutes?: number
          total_verified?: boolean | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_homeroom_teacher_id_fkey"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      class_pledges: {
        Row: {
          amount: number
          class_name: string
          created_at: string
          event_id: string | null
          id: string
          is_paid: boolean
          is_unlocked: boolean
          max_cap: number | null
          milestone_minutes_target: number | null
          payment_status: string
          payment_token: string | null
          pledge_type: string
          sponsor_user_id: string
          teacher_id: string | null
        }
        Insert: {
          amount: number
          class_name: string
          created_at?: string
          event_id?: string | null
          id?: string
          is_paid?: boolean
          is_unlocked?: boolean
          max_cap?: number | null
          milestone_minutes_target?: number | null
          payment_status?: string
          payment_token?: string | null
          pledge_type: string
          sponsor_user_id: string
          teacher_id?: string | null
        }
        Update: {
          amount?: number
          class_name?: string
          created_at?: string
          event_id?: string | null
          id?: string
          is_paid?: boolean
          is_unlocked?: boolean
          max_cap?: number | null
          milestone_minutes_target?: number | null
          payment_status?: string
          payment_token?: string | null
          pledge_type?: string
          sponsor_user_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_pledges_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_pledges_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          body: string
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          recipient_type: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          recipient_type?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status"]
          subject: string
          template_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          recipient_type?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_log_status"]
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          recipient_filter: string
          scheduled_for: string | null
          status: Database["public"]["Enums"]["email_template_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          recipient_filter: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["email_template_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          recipient_filter?: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["email_template_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_winners: {
        Row: {
          child_id: string | null
          class_name: string | null
          created_at: string | null
          event_id: string
          grade_info: string
          id: string
          total_minutes: number
          winner_type: string
        }
        Insert: {
          child_id?: string | null
          class_name?: string | null
          created_at?: string | null
          event_id: string
          grade_info: string
          id?: string
          total_minutes: number
          winner_type: string
        }
        Update: {
          child_id?: string | null
          class_name?: string | null
          created_at?: string | null
          event_id?: string
          grade_info?: string
          id?: string
          total_minutes?: number
          winner_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_winners_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_winners_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_winners_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          accept_cards: boolean
          accept_checks: boolean
          class_milestone_enabled: boolean
          class_milestone_goal: number
          class_milestone_reward: string
          created_at: string
          end_date: string
          goal_minutes: number
          id: string
          is_active: boolean
          last_log_date: string
          log_verification_enabled: boolean
          log_verification_thresholds: Json
          logo_date_x_offset: number | null
          logo_url: string | null
          name: string
          payment_address: string
          reminder_days: number
          school_name: string
          send_reminders: boolean
          start_date: string
          teacher_logging_grades: string[]
          timezone: string
          updated_at: string
        }
        Insert: {
          accept_cards?: boolean
          accept_checks?: boolean
          class_milestone_enabled?: boolean
          class_milestone_goal?: number
          class_milestone_reward?: string
          created_at?: string
          end_date: string
          goal_minutes?: number
          id?: string
          is_active?: boolean
          last_log_date: string
          log_verification_enabled?: boolean
          log_verification_thresholds?: Json
          logo_date_x_offset?: number | null
          logo_url?: string | null
          name: string
          payment_address?: string
          reminder_days?: number
          school_name?: string
          send_reminders?: boolean
          start_date: string
          teacher_logging_grades?: string[]
          timezone?: string
          updated_at?: string
        }
        Update: {
          accept_cards?: boolean
          accept_checks?: boolean
          class_milestone_enabled?: boolean
          class_milestone_goal?: number
          class_milestone_reward?: string
          created_at?: string
          end_date?: string
          goal_minutes?: number
          id?: string
          is_active?: boolean
          last_log_date?: string
          log_verification_enabled?: boolean
          log_verification_thresholds?: Json
          logo_date_x_offset?: number | null
          logo_url?: string | null
          name?: string
          payment_address?: string
          reminder_days?: number
          school_name?: string
          send_reminders?: boolean
          start_date?: string
          teacher_logging_grades?: string[]
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      log_verification_requests: {
        Row: {
          child_id: string
          created_at: string
          id: string
          minutes: number
          reading_log_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          threshold_at_time: number
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          minutes: number
          reading_log_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          threshold_at_time: number
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          minutes?: number
          reading_log_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          threshold_at_time?: number
        }
        Relationships: [
          {
            foreignKeyName: "log_verification_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "log_verification_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "log_verification_requests_reading_log_id_fkey"
            columns: ["reading_log_id"]
            isOneToOne: true
            referencedRelation: "reading_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          class_pledge_id: string | null
          created_at: string
          id: string
          notes: string | null
          payer_email: string | null
          payer_name: string | null
          payer_user_id: string | null
          payment_method: string
          pledge_id: string | null
          pledge_type: string
          square_payment_id: string | null
          square_receipt_url: string | null
          student_name: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          class_pledge_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_user_id?: string | null
          payment_method?: string
          pledge_id?: string | null
          pledge_type: string
          square_payment_id?: string | null
          square_receipt_url?: string | null
          student_name?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          class_pledge_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payer_email?: string | null
          payer_name?: string | null
          payer_user_id?: string | null
          payment_method?: string
          pledge_id?: string | null
          pledge_type?: string
          square_payment_id?: string | null
          square_receipt_url?: string | null
          student_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_class_pledge_id_fkey"
            columns: ["class_pledge_id"]
            isOneToOne: false
            referencedRelation: "class_pledges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_pledge_id_fkey"
            columns: ["pledge_id"]
            isOneToOne: false
            referencedRelation: "pledges"
            referencedColumns: ["id"]
          },
        ]
      }
      pledges: {
        Row: {
          amount: number
          child_id: string | null
          created_at: string
          event_id: string | null
          expected_payment_method: string | null
          final_amount: number | null
          finalized_at: string | null
          id: string
          is_paid: boolean
          payment_status: string
          pledge_type: string
          sponsor_id: string | null
          student_name: string
        }
        Insert: {
          amount: number
          child_id?: string | null
          created_at?: string
          event_id?: string | null
          expected_payment_method?: string | null
          final_amount?: number | null
          finalized_at?: string | null
          id?: string
          is_paid?: boolean
          payment_status?: string
          pledge_type: string
          sponsor_id?: string | null
          student_name: string
        }
        Update: {
          amount?: number
          child_id?: string | null
          created_at?: string
          event_id?: string | null
          expected_payment_method?: string | null
          final_amount?: number | null
          finalized_at?: string | null
          id?: string
          is_paid?: boolean
          payment_status?: string
          pledge_type?: string
          sponsor_id?: string | null
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "pledges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pledges_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_logs: {
        Row: {
          book_id: string | null
          book_title: string | null
          child_id: string | null
          created_at: string
          event_id: string | null
          id: string
          logged_at: string
          minutes: number
          student_name: string
        }
        Insert: {
          book_id?: string | null
          book_title?: string | null
          child_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          logged_at?: string
          minutes: number
          student_name: string
        }
        Update: {
          book_id?: string | null
          book_title?: string | null
          child_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          logged_at?: string
          minutes?: number
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_logs_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_logs_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content_type: string
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          content_type?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Update: {
          content_type?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      sponsor_invitations: {
        Row: {
          can_invite_others: boolean
          child_id: string
          created_at: string
          id: string
          invited_by_parent: boolean
          invitee_email: string
          invitee_user_id: string | null
          inviter_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          can_invite_others?: boolean
          child_id: string
          created_at?: string
          id?: string
          invited_by_parent?: boolean
          invitee_email: string
          invitee_user_id?: string | null
          inviter_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          can_invite_others?: boolean
          child_id?: string
          created_at?: string
          id?: string
          invited_by_parent?: boolean
          invitee_email?: string
          invitee_user_id?: string | null
          inviter_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_invitations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_invitations_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_class_assignments: {
        Row: {
          created_at: string
          homeroom_teacher_id: string
          id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          homeroom_teacher_id: string
          id?: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          homeroom_teacher_id?: string
          id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_class_assignments_homeroom_teacher_id_fkey"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_class_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          email: string | null
          grade_level: string | null
          has_full_access: boolean
          id: string
          is_active: boolean
          name: string
          teacher_type: Database["public"]["Enums"]["teacher_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          grade_level?: string | null
          has_full_access?: boolean
          id?: string
          is_active?: boolean
          name: string
          teacher_type?: Database["public"]["Enums"]["teacher_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          grade_level?: string | null
          has_full_access?: boolean
          id?: string
          is_active?: boolean
          name?: string
          teacher_type?: Database["public"]["Enums"]["teacher_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      children_public_safe: {
        Row: {
          class_name: string | null
          display_name: string | null
          goal_minutes: number | null
          grade_info: string | null
          homeroom_teacher_id: string | null
          id: string | null
          share_public_link: boolean | null
          total_minutes: number | null
          user_id: string | null
        }
        Insert: {
          class_name?: string | null
          display_name?: never
          goal_minutes?: number | null
          grade_info?: string | null
          homeroom_teacher_id?: string | null
          id?: string | null
          share_public_link?: boolean | null
          total_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          class_name?: string | null
          display_name?: never
          goal_minutes?: number | null
          grade_info?: string | null
          homeroom_teacher_id?: string | null
          id?: string | null
          share_public_link?: boolean | null
          total_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_homeroom_teacher_id_fkey"
            columns: ["homeroom_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_teacher_view_child: {
        Args: { child_id: string; teacher_user_id: string }
        Returns: boolean
      }
      get_class_favorite_books: {
        Args: { p_class_name: string; p_limit?: number }
        Returns: {
          book_title: string
          read_count: number
        }[]
      }
      get_class_fundraising_total: {
        Args: { p_class_name: string; p_event_id?: string }
        Returns: number
      }
      get_class_milestone_status: {
        Args: { p_class_name: string; p_event_id?: string }
        Returns: {
          next_milestone_amount: number
          next_milestone_minutes: number
          total_pledged: number
          total_unlocked: number
        }[]
      }
      get_class_reading_stats: {
        Args: { p_class_name: string }
        Returns: {
          student_count: number
          total_books: number
          total_minutes: number
        }[]
      }
      get_class_total_minutes: {
        Args: { p_class_name: string }
        Returns: number
      }
      get_grade_favorite_books: {
        Args: { p_grade_info: string; p_limit?: number }
        Returns: {
          book_title: string
          read_count: number
        }[]
      }
      get_grade_total_minutes: {
        Args: { p_grade_info: string }
        Returns: number
      }
      get_verification_threshold: {
        Args: { p_child_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      safe_display_name: { Args: { full_name: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user" | "teacher"
      email_log_status: "pending" | "sent" | "failed"
      email_template_status: "draft" | "scheduled" | "sent"
      teacher_type: "homeroom" | "partner" | "specials" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "teacher"],
      email_log_status: ["pending", "sent", "failed"],
      email_template_status: ["draft", "scheduled", "sent"],
      teacher_type: ["homeroom", "partner", "specials", "staff"],
    },
  },
} as const

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STUDENT_EMAIL_DOMAIN = "student.readathon.local";

interface StudentSession {
  childId: string;
  name: string;
  totalMinutes: number;
  goalMinutes: number;
  className: string | null;
  gradeInfo: string | null;
}

export function useStudentSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current auth user is a student and load their data
  const loadStudentData = useCallback(async () => {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    
    if (!authSession?.user) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    // Check if user's email matches student domain
    const email = authSession.user.email || "";
    if (!email.endsWith(`@${STUDENT_EMAIL_DOMAIN}`)) {
      setSession(null);
      setIsLoading(false);
      return;
    }

    // Fetch child data linked to this student auth account
    const { data: child, error } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes, class_name, grade_info")
      .eq("student_user_id", authSession.user.id)
      .maybeSingle();

    if (error || !child) {
      console.error("Failed to load student data:", error);
      setSession(null);
      setIsLoading(false);
      return;
    }

    const studentSession: StudentSession = {
      childId: child.id,
      name: child.name,
      totalMinutes: child.total_minutes,
      goalMinutes: child.goal_minutes,
      className: child.class_name,
      gradeInfo: child.grade_info,
    };

    setSession(studentSession);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStudentData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN") {
          // Defer to avoid deadlock
          setTimeout(() => loadStudentData(), 0);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadStudentData]);

  // Refresh student data from database
  const refreshData = useCallback(async () => {
    if (!session?.childId) return;

    const { data, error } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes, class_name, grade_info")
      .eq("id", session.childId)
      .maybeSingle();

    if (error || !data) {
      console.error("Failed to refresh student data:", error);
      return;
    }

    setSession({
      childId: data.id,
      name: data.name,
      totalMinutes: data.total_minutes,
      goalMinutes: data.goal_minutes,
      className: data.class_name,
      gradeInfo: data.grade_info,
    });
  }, [session?.childId]);

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/student/login");
  }, [navigate]);

  // Require auth - redirect if not logged in
  const requireAuth = useCallback(() => {
    if (!isLoading && !session) {
      navigate("/student/login");
    }
  }, [isLoading, session, navigate]);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    refreshData,
    logout,
    requireAuth,
  };
}

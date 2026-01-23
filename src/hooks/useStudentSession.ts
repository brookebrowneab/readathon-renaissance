import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface StudentSession {
  childId: string;
  name: string;
  totalMinutes: number;
  goalMinutes: number;
}

export function useStudentSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from storage
  useEffect(() => {
    const stored = sessionStorage.getItem("studentSession");
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("studentSession");
      }
    }
    setIsLoading(false);
  }, []);

  // Refresh student data from database
  const refreshData = useCallback(async () => {
    if (!session?.childId) return;

    const { data, error } = await supabase
      .from("children")
      .select("id, name, total_minutes, goal_minutes")
      .eq("id", session.childId)
      .maybeSingle();

    if (error || !data) {
      console.error("Failed to refresh student data:", error);
      return;
    }

    const updated: StudentSession = {
      childId: data.id,
      name: data.name,
      totalMinutes: data.total_minutes,
      goalMinutes: data.goal_minutes,
    };

    setSession(updated);
    sessionStorage.setItem("studentSession", JSON.stringify(updated));
  }, [session?.childId]);

  // Logout
  const logout = useCallback(() => {
    sessionStorage.removeItem("studentSession");
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

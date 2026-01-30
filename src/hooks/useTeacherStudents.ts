import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeacherAuth } from "./useTeacherAuth";

export interface TeacherStudent {
  id: string;
  name: string;
  grade_info: string | null;
  class_name: string | null;
  goal_minutes: number;
  total_minutes: number;
  homeroom_teacher_id: string | null;
  homeroom_teacher_name?: string;
}

export interface StudentReadingLog {
  id: string;
  child_id: string;
  minutes: number;
  book_title: string | null;
  logged_at: string;
  created_at: string;
}

export const useTeacherStudents = () => {
  const { teacherProfile, isLoading: authLoading } = useTeacherAuth();

  const { data: students = [], isLoading: studentsLoading, error, refetch } = useQuery({
    queryKey: ["teacher-students", teacherProfile?.id],
    queryFn: async () => {
      if (!teacherProfile) return [];

      // The RLS policy can_teacher_view_child handles filtering
      // We just need to query all children and let RLS filter them
      const { data, error } = await supabase
        .from("children")
        .select(`
          id,
          name,
          grade_info,
          class_name,
          goal_minutes,
          total_minutes,
          homeroom_teacher_id
        `)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as TeacherStudent[];
    },
    enabled: !!teacherProfile,
  });

  // Derive unique grades and classes for filtering
  const uniqueGrades = [...new Set(students.map(s => s.grade_info).filter(Boolean))] as string[];
  const uniqueClasses = [...new Set(students.map(s => s.class_name).filter(Boolean))] as string[];

  // Sort grades sensibly
  const sortedGrades = uniqueGrades.sort((a, b) => {
    const gradeOrder = (grade: string) => {
      if (grade.toLowerCase().startsWith('k')) return 0;
      if (grade.toLowerCase().startsWith('pre')) return -1;
      const match = grade.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 100;
    };
    return gradeOrder(a) - gradeOrder(b);
  });

  return {
    students,
    uniqueGrades: sortedGrades,
    uniqueClasses,
    isLoading: authLoading || studentsLoading,
    error,
    refetch,
  };
};

// Hook to fetch recent reading logs for teacher's students
export const useTeacherStudentLogs = (studentIds: string[]) => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ["teacher-student-logs", studentIds],
    queryFn: async () => {
      if (studentIds.length === 0) return [];

      const { data, error } = await supabase
        .from("reading_logs")
        .select("id, child_id, minutes, book_title, logged_at, created_at")
        .in("child_id", studentIds)
        .order("logged_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as StudentReadingLog[];
    },
    enabled: studentIds.length > 0,
  });

  // Group logs by student
  const logsByStudent = logs.reduce((acc, log) => {
    if (!acc[log.child_id]) {
      acc[log.child_id] = [];
    }
    acc[log.child_id].push(log);
    return acc;
  }, {} as Record<string, StudentReadingLog[]>);

  // Get last logged date for each student
  const lastLoggedByStudent = Object.entries(logsByStudent).reduce((acc, [childId, studentLogs]) => {
    if (studentLogs.length > 0) {
      acc[childId] = studentLogs[0].logged_at;
    }
    return acc;
  }, {} as Record<string, string>);

  // Get unique book titles per student
  const booksByStudent = Object.entries(logsByStudent).reduce((acc, [childId, studentLogs]) => {
    const uniqueTitles = [...new Set(
      studentLogs
        .map(log => log.book_title)
        .filter((title): title is string => !!title)
    )];
    acc[childId] = uniqueTitles;
    return acc;
  }, {} as Record<string, string[]>);

  return {
    logs,
    logsByStudent,
    lastLoggedByStudent,
    booksByStudent,
    isLoading,
    error,
  };
};

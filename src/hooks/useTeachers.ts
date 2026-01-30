import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TeacherType = "homeroom" | "partner" | "specials" | "staff";

export interface Teacher {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  teacher_type: TeacherType;
  has_full_access: boolean;
  is_active: boolean;
  grade_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherClassAssignment {
  id: string;
  teacher_id: string;
  homeroom_teacher_id: string;
  created_at: string;
  homeroom_teacher?: Teacher;
}

export interface CreateTeacherInput {
  name: string;
  email?: string;
  teacher_type: TeacherType;
  has_full_access?: boolean;
  grade_level?: string | null;
}

export interface UpdateTeacherInput {
  id: string;
  name?: string;
  email?: string;
  teacher_type?: TeacherType;
  has_full_access?: boolean;
  is_active?: boolean;
  user_id?: string | null;
  grade_level?: string | null;
}

// Fetch all teachers
export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async (): Promise<Teacher[]> => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("teacher_type")
        .order("name");

      if (error) {
        console.error("Error fetching teachers:", error);
        throw error;
      }

      return data as Teacher[];
    },
  });
}

// Fetch only active homeroom teachers (for family signup dropdown)
export function useHomeroomTeachers() {
  return useQuery({
    queryKey: ["teachers", "homeroom", "active"],
    queryFn: async (): Promise<Teacher[]> => {
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("teacher_type", "homeroom")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching homeroom teachers:", error);
        throw error;
      }

      return data as Teacher[];
    },
  });
}

// Fetch class assignments for a partner teacher
export function useTeacherClassAssignments(teacherId?: string) {
  return useQuery({
    queryKey: ["teacher-class-assignments", teacherId],
    queryFn: async (): Promise<TeacherClassAssignment[]> => {
      if (!teacherId) return [];

      const { data, error } = await supabase
        .from("teacher_class_assignments")
        .select(`
          id,
          teacher_id,
          homeroom_teacher_id,
          created_at
        `)
        .eq("teacher_id", teacherId);

      if (error) {
        console.error("Error fetching class assignments:", error);
        throw error;
      }

      // Fetch homeroom teacher details for each assignment
      const assignmentsWithTeachers = await Promise.all(
        data.map(async (assignment) => {
          const { data: homeroomTeacher } = await supabase
            .from("teachers")
            .select("*")
            .eq("id", assignment.homeroom_teacher_id)
            .single();

          return {
            ...assignment,
            homeroom_teacher: homeroomTeacher as Teacher | undefined,
          };
        })
      );

      return assignmentsWithTeachers;
    },
    enabled: !!teacherId,
  });
}

// Create a new teacher
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTeacherInput): Promise<Teacher> => {
      const { data, error } = await supabase
        .from("teachers")
        .insert({
          name: input.name,
          email: input.email || null,
          teacher_type: input.teacher_type,
          has_full_access: input.has_full_access ?? false,
          grade_level: input.grade_level ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating teacher:", error);
        throw error;
      }

      return data as Teacher;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create teacher");
    },
  });
}

// Update a teacher
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTeacherInput): Promise<Teacher> => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("teachers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating teacher:", error);
        throw error;
      }

      return data as Teacher;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update teacher");
    },
  });
}

// Delete a teacher
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teacherId: string): Promise<void> => {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", teacherId);

      if (error) {
        console.error("Error deleting teacher:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete teacher");
    },
  });
}

// Add class assignment for partner teacher
export function useAddClassAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      teacherId,
      homeroomTeacherId,
    }: {
      teacherId: string;
      homeroomTeacherId: string;
    }): Promise<void> => {
      const { error } = await supabase
        .from("teacher_class_assignments")
        .insert({
          teacher_id: teacherId,
          homeroom_teacher_id: homeroomTeacherId,
        });

      if (error) {
        console.error("Error adding class assignment:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-class-assignments", variables.teacherId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add class assignment");
    },
  });
}

// Remove class assignment
export function useRemoveClassAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assignmentId,
      teacherId,
    }: {
      assignmentId: string;
      teacherId: string;
    }): Promise<void> => {
      const { error } = await supabase
        .from("teacher_class_assignments")
        .delete()
        .eq("id", assignmentId);

      if (error) {
        console.error("Error removing class assignment:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-class-assignments", variables.teacherId],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove class assignment");
    },
  });
}

// Bulk create teachers (for CSV upload)
export function useBulkCreateTeachers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teachers: CreateTeacherInput[]): Promise<number> => {
      const { data, error } = await supabase
        .from("teachers")
        .insert(
          teachers.map((t) => ({
            name: t.name,
            email: t.email || null,
            teacher_type: t.teacher_type,
            has_full_access: t.has_full_access ?? false,
            grade_level: t.grade_level ?? null,
          }))
        )
        .select();

      if (error) {
        console.error("Error bulk creating teachers:", error);
        throw error;
      }

      return data.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success(`Added ${count} teachers`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to import teachers");
    },
  });
}

 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
 
 export interface StudentAuth {
   id: string;
   child_id: string;
   username: string | null;
   login_enabled: boolean;
   created_at: string;
   updated_at: string;
 }
 
 export interface StudentAuthUpdate {
   child_id: string;
   username?: string | null;
   login_enabled?: boolean;
 }
 
 // Fetch student auth for a specific child
 export const useStudentAuth = (childId: string | undefined) => {
   return useQuery({
     queryKey: ["student-auth", childId],
     queryFn: async () => {
       if (!childId) return null;
 
       const { data, error } = await supabase
         .from("student_auth")
         .select("id, child_id, username, login_enabled, created_at, updated_at")
         .eq("child_id", childId)
         .maybeSingle();
 
       if (error) throw error;
       return data as StudentAuth | null;
     },
     enabled: !!childId,
   });
 };
 
 // Fetch student auth for all children of current user
 export const useChildrenStudentAuth = (childIds: string[]) => {
   return useQuery({
     queryKey: ["student-auth", "children", childIds],
     queryFn: async () => {
       if (childIds.length === 0) return [];
 
       const { data, error } = await supabase
         .from("student_auth")
         .select("id, child_id, username, login_enabled, created_at, updated_at")
         .in("child_id", childIds);
 
       if (error) throw error;
       return data as StudentAuth[];
     },
     enabled: childIds.length > 0,
   });
 };
 
 // Update student auth (username and login_enabled only - password via edge function)
 export const useUpdateStudentAuth = () => {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: async ({ child_id, username, login_enabled }: StudentAuthUpdate) => {
       // Check if record exists
       const { data: existing } = await supabase
         .from("student_auth")
         .select("id")
         .eq("child_id", child_id)
         .maybeSingle();
 
       if (existing) {
         // Update existing record
         const { data, error } = await supabase
           .from("student_auth")
           .update({ 
             username: username?.toLowerCase().trim() || null, 
             login_enabled: login_enabled ?? false 
           })
           .eq("child_id", child_id)
           .select()
           .single();
 
         if (error) throw error;
         return data;
       } else {
         // Insert new record
         const { data, error } = await supabase
           .from("student_auth")
           .insert({
             child_id,
             username: username?.toLowerCase().trim() || null,
             login_enabled: login_enabled ?? false,
           })
           .select()
           .single();
 
         if (error) throw error;
         return data;
       }
     },
     onSuccess: (data) => {
       queryClient.invalidateQueries({ queryKey: ["student-auth"] });
     },
     onError: (error: Error) => {
       if (error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
         toast.error("Username is already taken. Please choose a different one.");
       } else {
         toast.error("Failed to update student login: " + error.message);
       }
     },
   });
 };
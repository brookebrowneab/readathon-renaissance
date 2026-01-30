import { supabase } from "@/integrations/supabase/client";

export type LinkedTeacher = {
  id: string;
  name: string;
  email: string | null;
  user_id: string | null;
  is_active: boolean;
};

export async function linkTeacherAccount() {
  const { data, error } = await supabase.functions.invoke("link-teacher-account");

  if (error) {
    return { teacher: null as LinkedTeacher | null, linked: false, error: error.message };
  }

  const teacher = (data?.teacher ?? null) as LinkedTeacher | null;
  const linked = Boolean(data?.linked);

  return { teacher, linked, error: null as string | null };
}

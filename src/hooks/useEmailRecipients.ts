import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EmailRecipient {
  id: string;
  name: string;
  email: string;
  type: "sponsor" | "parent" | "teacher";
}

export function useEmailRecipients() {
  return useQuery({
    queryKey: ["email-recipients"],
    queryFn: async (): Promise<EmailRecipient[]> => {
      // Fetch sponsors
      const { data: sponsors, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("id, name, email");

      if (sponsorsError) {
        console.error("Error fetching sponsors:", sponsorsError);
      }

      const sponsorRecipients: EmailRecipient[] = (sponsors || []).map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        type: "sponsor" as const,
      }));

      // For now, we only have sponsors in the database
      // Parents and teachers would be added similarly when those tables exist
      return sponsorRecipients;
    },
  });
}

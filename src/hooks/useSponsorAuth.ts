import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface SponsorProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string | null;
}

// Check if sponsor profile is missing required info
const isProfileIncomplete = (sponsor: SponsorProfile | null): boolean => {
  if (!sponsor) return true;
  return !sponsor.name || sponsor.name.trim() === "";
};

export function useSponsorAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sponsor, setSponsor] = useState<SponsorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchSponsorProfile(session.user.id);
          }, 0);
        } else {
          setSponsor(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchSponsorProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSponsorProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching sponsor profile:", error);
      } else {
        setSponsor(data);
      }
    } catch (err) {
      console.error("Error in fetchSponsorProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: name,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      return { error };
    }

    // Create sponsor profile
    if (data.user) {
      const { error: profileError } = await supabase
        .from("sponsors")
        .insert({
          user_id: data.user.id,
          name,
          email,
          phone: phone || null,
        });

      if (profileError) {
        console.error("Error creating sponsor profile:", profileError);
        return { error: profileError };
      }
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSponsor(null);
    }
    return { error };
  };

  const updateSponsorProfile = async (updates: { name?: string; phone?: string }) => {
    if (!user) return { error: new Error("Not authenticated") };
    
    // Check if sponsor profile exists
    if (sponsor) {
      // Update existing profile
      const { error } = await supabase
        .from("sponsors")
        .update(updates)
        .eq("user_id", user.id);
      
      if (!error) {
        setSponsor({ ...sponsor, ...updates });
      }
      return { error };
    } else {
      // Create new profile (for magic link users who don't have one)
      const { error } = await supabase
        .from("sponsors")
        .insert({
          user_id: user.id,
          name: updates.name || "",
          email: user.email || "",
          phone: updates.phone || null,
        });
      
      if (!error) {
        fetchSponsorProfile(user.id);
      }
      return { error };
    }
  };

  // Set password for magic-link users who want to log in with password later
  const setPassword = async (password: string) => {
    if (!user) return { error: new Error("Not authenticated") };
    
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const isAuthenticated = !!session;

  return {
    user,
    session,
    sponsor,
    loading,
    signUp,
    signIn,
    signOut,
    updateSponsorProfile,
    setPassword,
    isAuthenticated,
    needsProfileCompletion: isAuthenticated && isProfileIncomplete(sponsor),
  };
}

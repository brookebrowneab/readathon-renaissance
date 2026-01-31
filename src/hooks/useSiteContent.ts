import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteContent {
  id: string;
  key: string;
  value: string;
  content_type: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

// Default content values (fallbacks when database is empty)
export const DEFAULT_CONTENT: Record<string, string> = {
  // Home Page
  "home.hero_headlines": JSON.stringify([
    "Every Page Counts.",
    "Read More. Grow Together.",
    "Read books. Support Janney.",
  ]),
  "home.hero_description": "Janney Elementary Read-a-thon runs February 23–March 8. Students read to raise funds for our school. Ask friends and family to pledge per minute—or give a flat donation—and help fund the programs that make Janney exceptional.",
  "home.stats": JSON.stringify({
    minutes_logged: "128,400",
    books_completed: "4,875",
    funds_raised: "$21,320",
  }),
  "home.how_it_works_steps": JSON.stringify([
    { title: "Sign Up & Set Goals", description: "Create your family profile and choose your reading targets. Each child gets a unique sponsor link." },
    { title: "Read & Track Progress", description: "Log reading time and watch your progress grow. Parents can approve logs from any device." },
    { title: "Share with Sponsors", description: "Invite family and friends to pledge their support—per minute read or as a flat donation." },
    { title: "Celebrate Success", description: "At the end, sponsors pay their pledges and funds go directly to supporting our school." },
  ]),
  "home.making_difference_intro": "Janney relies on PTA funds to pay for programs that make our school exceptional. Your donations help fund:",
  "home.making_difference_items": JSON.stringify([
    "Technology materials & support",
    "Classroom supplies",
    "Textbooks",
    "Teacher professional development",
    "Instructional materials",
    "Custodial equipment & supplies",
    "Facilities repairs",
    "Staff positions (10 teachers & support)",
  ]),
  "home.cta_title": "Ready to Join the Read-a-thon?",
  "home.cta_description": "Create your family account and start logging reading minutes today.",

  // About Page
  "about.mission_title": "Our Mission",
  "about.mission_text": "Read-a-thon was founded with a simple belief: every child deserves the opportunity to discover the joy of reading. We combine the excitement of friendly competition with community support to create meaningful reading experiences.\n\nSince 2020, we have helped thousands of students build reading habits while raising funds for their schools. Our platform makes it easy for families, teachers, and sponsors to participate in this rewarding journey.",
  "about.statistics": JSON.stringify([
    { icon: "Users", value: "1,000+", label: "Students Participated" },
    { icon: "BookOpen", value: "1M+", label: "Minutes Read" },
    { icon: "School", value: "2,000+", label: "Books Read" },
    { icon: "Heart", value: "2020", label: "Since" },
  ]),
  "about.values": JSON.stringify([
    { icon: "Target", title: "Goal-Oriented", description: "We believe in setting achievable reading goals that challenge and motivate students to read more." },
    { icon: "Heart", title: "Community-Driven", description: "Our platform connects families, friends, and communities to support young readers together." },
    { icon: "Award", title: "Celebration of Success", description: "Every minute read is an achievement. We celebrate progress at every stage of the journey." },
  ]),
  "about.privacy_text": "We take the privacy and safety of our young readers seriously. Our platform is designed with COPPA compliance in mind. We collect minimal data, never store birth dates or full names of children, and give parents full control over their family's information.",

  // How It Works Page
  "howitworks.hero_description": "A simple 5-step process to get your students reading and fundraising for Janney Elementary.",
  "howitworks.steps": JSON.stringify([
    { title: "Register Your Family", description: "Parents create an account and add their children. Each child receives a unique sponsor link for their fundraising.", details: ["Quick 2-minute signup process", "Add multiple children to one account", "Set individual reading goals"] },
    { title: "Invite Sponsors", description: "Share your child's unique sponsor link with family, friends, and neighbors. Sponsors can pledge per minute read or a flat donation.", details: ["Shareable link via email or social media", "Per-minute or flat-rate pledges", "No account required for sponsors"] },
    { title: "Read & Log Minutes", description: "Students read every day and log their minutes. Parents approve logs, and teachers can see classroom progress.", details: ["Easy daily logging from any device", "Optional student login for older readers", "Visual progress tracking"] },
    { title: "Collect Pledges", description: "At the end of the read-a-thon, sponsors receive an email with the total pledge amount. Secure payment processing.", details: ["Automatic pledge calculations", "Secure payment processing", "Digital receipts for sponsors"] },
    { title: "Celebrate Success", description: "Students who meet their goals earn recognition, and Janney receives the funds raised to support programs.", details: ["Achievement badges and certificates", "Classroom and school leaderboards", "Funds go directly to Janney"] },
  ]),
  "howitworks.faqs": JSON.stringify([
    { q: "Is there a minimum pledge amount?", a: "Sponsors can pledge as little as $0.01 per minute or a $5 flat donation. Pledges under $5 total are waived to minimize processing fees." },
    { q: "How long does the Read-a-thon last?", a: "The Janney Read-a-thon runs February 24–March 8. The typical goal is 600 minutes (10 hours) of reading." },
    { q: "Can siblings share sponsors?", a: "Yes! Parents can manage multiple children from one account, and sponsors can easily pledge to support multiple readers." },
    { q: "What if my child exceeds their goal?", a: "Great news! Our progress rings show overflow with stacked circles. Sponsors can cap their per-minute pledges if they prefer." },
  ]),
  "howitworks.stats": JSON.stringify({
    event_duration: "2 weeks",
    typical_goal: "600 min",
    to_school: "100%",
  }),

  // FAQ Page
  "faq.hero_description": "Find answers to common questions about the Janney Elementary Read-a-thon.",
  "faq.items": JSON.stringify([
    {
      category: "Getting Started",
      questions: [
        { q: "How do I register my family for the Read-a-thon?", a: "Click 'Get Started' on the homepage to create a parent account. Once registered, you can add your children and set reading goals. Each child will receive a unique sponsor link to share with friends and family." },
        { q: "When does the Read-a-thon take place?", a: "The Janney Elementary Read-a-thon runs from February 24 through March 9. Students can log reading minutes throughout this period." },
        { q: "Can I register multiple children?", a: "Yes! After creating your family account, you can add as many children as needed. Each child will have their own reading log and sponsor link." },
      ],
    },
    {
      category: "Reading & Logging",
      questions: [
        { q: "How do students log their reading time?", a: "Students or parents can log reading minutes through the dashboard. Simply enter the number of minutes read and the book title. Parents can review and approve entries from any device." },
        { q: "What counts as reading?", a: "Any independent reading counts—chapter books, picture books, graphic novels, magazines, or e-books. Audiobooks count too when students are actively listening and following along." },
        { q: "Is there a minimum or maximum reading time per day?", a: "There's no minimum requirement, but we encourage consistent daily reading. There's also no maximum—every minute counts toward your child's goal and fundraising total." },
      ],
    },
    {
      category: "Sponsors & Pledges",
      questions: [
        { q: "How do pledges work?", a: "Sponsors can pledge a certain amount per minute read (e.g., 5¢ per minute) or make a flat donation. Per-minute pledges are calculated at the end of the Read-a-thon based on total minutes logged." },
        { q: "How do I invite sponsors?", a: "From your dashboard, you can share your child's unique sponsor link via email, text, or social media. Sponsors click the link to make their pledge—no account required." },
        { q: "When do sponsors pay?", a: "Sponsors receive a payment reminder after the Read-a-thon ends. They can pay securely online or by check. Payment is typically due within two weeks of the event ending." },
        { q: "Is there a minimum pledge amount?", a: "There's no minimum for per-minute pledges. Flat donations have a suggested minimum of $10, but any amount is appreciated." },
      ],
    },
    {
      category: "Payments & Donations",
      questions: [
        { q: "How are payments processed?", a: "We use Square for secure online payments. Sponsors can pay by credit card, debit card, or Apple Pay. Check payments can also be mailed to the school." },
        { q: "Are donations tax-deductible?", a: "Yes, donations to Janney Elementary through the Read-a-thon are tax-deductible. Sponsors will receive a receipt for their records." },
        { q: "Where does the money go?", a: "All funds raised go directly to Janney Elementary to support enrichment programs, classroom resources, library books, and school-wide initiatives." },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        { q: "I forgot my password. How do I reset it?", a: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a link to reset your password within a few minutes." },
        { q: "The sponsor link isn't working. What should I do?", a: "Make sure you're copying the full link. If issues persist, try generating a new link from your dashboard or contact us for assistance." },
        { q: "Who do I contact if I have a problem?", a: "For technical issues or questions, please email the Read-a-thon coordinators at janneyreadathon@janneyschool.org." },
      ],
    },
  ]),
  "faq.still_questions_text": "We're here to help. Reach out to our Read-a-thon coordinators or explore more resources.",
};

// Content descriptions for admin UI
export const CONTENT_DESCRIPTIONS: Record<string, string> = {
  "home.hero_headlines": "Rotating headlines shown in the hero section (JSON array of strings)",
  "home.hero_description": "Main paragraph under the hero headline",
  "home.stats": "Statistics displayed in the stats section (JSON with minutes_logged, books_completed, funds_raised)",
  "home.how_it_works_steps": "Steps shown in How It Works section (JSON array)",
  "home.making_difference_intro": "Introduction text for Making a Difference section",
  "home.making_difference_items": "List of items that funds support (JSON array)",
  "home.cta_title": "Call-to-action section title",
  "home.cta_description": "Call-to-action section description",
  "about.mission_title": "Mission section title",
  "about.mission_text": "Mission statement paragraphs (use \\n for line breaks)",
  "about.statistics": "Statistics grid items (JSON array)",
  "about.values": "Values section items (JSON array)",
  "about.privacy_text": "Privacy & Child Safety section text",
  "howitworks.hero_description": "Hero section description",
  "howitworks.steps": "Detailed steps with descriptions and bullet points (JSON array)",
  "howitworks.faqs": "FAQ items on the How It Works page (JSON array)",
  "howitworks.stats": "Stats section values (JSON with event_duration, typical_goal, to_school)",
  "faq.hero_description": "Hero section description",
  "faq.items": "All FAQ categories and questions (JSON array)",
  "faq.still_questions_text": "Text shown in the 'Still Have Questions' section",
};

// Content types for each key
export const CONTENT_TYPES: Record<string, "text" | "json"> = {
  "home.hero_headlines": "json",
  "home.hero_description": "text",
  "home.stats": "json",
  "home.how_it_works_steps": "json",
  "home.making_difference_intro": "text",
  "home.making_difference_items": "json",
  "home.cta_title": "text",
  "home.cta_description": "text",
  "about.mission_title": "text",
  "about.mission_text": "text",
  "about.statistics": "json",
  "about.values": "json",
  "about.privacy_text": "text",
  "howitworks.hero_description": "text",
  "howitworks.steps": "json",
  "howitworks.faqs": "json",
  "howitworks.stats": "json",
  "faq.hero_description": "text",
  "faq.items": "json",
  "faq.still_questions_text": "text",
};

// Fetch all site content
export function useSiteContentAll() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("key");

      if (error) throw error;
      return data as SiteContent[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch a single content item by key
export function useSiteContent(key: string) {
  const { data: allContent, isLoading } = useSiteContentAll();

  const content = allContent?.find((c) => c.key === key);
  const value = content?.value ?? DEFAULT_CONTENT[key] ?? "";

  return {
    value,
    isLoading,
    isFromDatabase: !!content,
  };
}

// Fetch multiple content items by keys
export function useSiteContentMultiple(keys: string[]) {
  const { data: allContent, isLoading } = useSiteContentAll();

  const content: Record<string, string> = {};
  keys.forEach((key) => {
    const found = allContent?.find((c) => c.key === key);
    content[key] = found?.value ?? DEFAULT_CONTENT[key] ?? "";
  });

  return {
    content,
    isLoading,
  };
}

// Helper to parse JSON content safely
export function parseJsonContent<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// Mutation to upsert site content
export function useSiteContentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      value,
      content_type,
      description,
    }: {
      key: string;
      value: string;
      content_type: string;
      description?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("site_content")
        .upsert(
          {
            key,
            value,
            content_type,
            description,
            updated_by: userData.user?.id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });
}

// Batch mutation to upsert multiple content items
export function useSiteContentBatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      items: Array<{
        key: string;
        value: string;
        content_type: string;
        description?: string;
      }>
    ) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const records = items.map((item) => ({
        key: item.key,
        value: item.value,
        content_type: item.content_type,
        description: item.description,
        updated_by: userData.user?.id,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("site_content")
        .upsert(records, { onConflict: "key" })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });
}

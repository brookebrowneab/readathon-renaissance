import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, FileText, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { handDrawnBorder } from "@/lib/admin-styles";
import {
  useSiteContentAll,
  useSiteContentBatchMutation,
  DEFAULT_CONTENT,
  CONTENT_DESCRIPTIONS,
  CONTENT_TYPES,
} from "@/hooks/useSiteContent";

interface ContentGroup {
  title: string;
  keys: string[];
}

const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Home Page",
    keys: [
      "home.hero_headlines",
      "home.hero_description",
      "home.stats",
      "home.how_it_works_steps",
      "home.making_difference_intro",
      "home.making_difference_items",
      "home.cta_title",
      "home.cta_description",
    ],
  },
  {
    title: "About Page",
    keys: [
      "about.mission_title",
      "about.mission_text",
      "about.statistics",
      "about.values",
      "about.privacy_text",
    ],
  },
  {
    title: "How It Works Page",
    keys: [
      "howitworks.hero_description",
      "howitworks.steps",
      "howitworks.faqs",
      "howitworks.stats",
    ],
  },
  {
    title: "FAQ Page",
    keys: [
      "faq.hero_description",
      "faq.items",
      "faq.still_questions_text",
    ],
  },
];

function getDisplayName(key: string): string {
  const parts = key.split(".");
  const name = parts[parts.length - 1];
  return name
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function validateJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function formatJson(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function SiteContentEditor() {
  const { data: siteContent, isLoading } = useSiteContentAll();
  const batchMutation = useSiteContentBatchMutation();
  
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [openGroups, setOpenGroups] = useState<string[]>(["Home Page"]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [jsonErrors, setJsonErrors] = useState<Record<string, boolean>>({});

  // Initialize edited content from database or defaults
  useEffect(() => {
    const initialContent: Record<string, string> = {};
    
    CONTENT_GROUPS.forEach((group) => {
      group.keys.forEach((key) => {
        const dbContent = siteContent?.find((c) => c.key === key);
        const value = dbContent?.value ?? DEFAULT_CONTENT[key] ?? "";
        // Format JSON for better readability
        initialContent[key] = CONTENT_TYPES[key] === "json" ? formatJson(value) : value;
      });
    });
    
    setEditedContent(initialContent);
  }, [siteContent]);

  const handleContentChange = (key: string, value: string) => {
    setEditedContent((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);

    // Validate JSON if needed
    if (CONTENT_TYPES[key] === "json") {
      setJsonErrors((prev) => ({ ...prev, [key]: !validateJson(value) }));
    }
  };

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const handleSaveAll = async () => {
    // Check for JSON errors
    const hasErrors = Object.values(jsonErrors).some((error) => error);
    if (hasErrors) {
      toast.error("Please fix JSON syntax errors before saving");
      return;
    }

    const items = Object.entries(editedContent).map(([key, value]) => ({
      key,
      value: CONTENT_TYPES[key] === "json" ? JSON.stringify(JSON.parse(value)) : value,
      content_type: CONTENT_TYPES[key] || "text",
      description: CONTENT_DESCRIPTIONS[key],
    }));

    try {
      await batchMutation.mutateAsync(items);
      setHasUnsavedChanges(false);
      toast.success("Site content saved successfully!");
    } catch (error) {
      toast.error("Failed to save site content");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background p-6" style={handDrawnBorder}>
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-background p-6" style={handDrawnBorder}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Site Content
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit text displayed on public pages
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={!hasUnsavedChanges || batchMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {batchMutation.isPending
            ? "Saving..."
            : hasUnsavedChanges
            ? "Save All Changes"
            : "Saved"}
        </Button>
      </div>

      <div className="space-y-4">
        {CONTENT_GROUPS.map((group) => (
          <Collapsible
            key={group.title}
            open={openGroups.includes(group.title)}
            onOpenChange={() => toggleGroup(group.title)}
          >
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-md hover:bg-muted transition-colors">
                {openGroups.includes(group.title) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="font-medium text-foreground">{group.title}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({group.keys.length} items)
                </span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-4 mt-2">
              {group.keys.map((key) => {
                const contentType = CONTENT_TYPES[key] || "text";
                const description = CONTENT_DESCRIPTIONS[key];
                const hasError = jsonErrors[key];
                const isLongText = contentType === "text" && key.includes("_text");

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Label
                        htmlFor={key}
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        {getDisplayName(key)}
                        {contentType === "json" && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            JSON
                          </span>
                        )}
                      </Label>
                      {hasError && (
                        <span className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Invalid JSON
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                    {contentType === "json" || isLongText ? (
                      <Textarea
                        id={key}
                        value={editedContent[key] || ""}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        rows={contentType === "json" ? 8 : 4}
                        className={`font-mono text-sm ${hasError ? "border-destructive" : ""}`}
                      />
                    ) : (
                      <Input
                        id={key}
                        value={editedContent[key] || ""}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

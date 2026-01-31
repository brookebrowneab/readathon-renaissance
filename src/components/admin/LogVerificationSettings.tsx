import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck, Save } from "lucide-react";
import { handDrawnBorder } from "@/lib/admin-styles";
import { useAvailableGrades } from "@/hooks/useAvailableGrades";
import { 
  useVerificationSettings, 
  useUpdateVerificationSettings,
  VerificationThresholds 
} from "@/hooks/useLogVerificationThresholds";

interface LogVerificationSettingsProps {
  onUnsavedChange?: () => void;
}

export const LogVerificationSettings = ({ onUnsavedChange }: LogVerificationSettingsProps) => {
  const { data: settings, isLoading } = useVerificationSettings();
  const { data: availableGrades = [], isLoading: gradesLoading } = useAvailableGrades();
  const updateSettings = useUpdateVerificationSettings();

  const [enabled, setEnabled] = useState(false);
  const [defaultThreshold, setDefaultThreshold] = useState("");
  const [gradeThresholds, setGradeThresholds] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize from settings
  useEffect(() => {
    if (settings) {
      setEnabled(settings.enabled);
      setDefaultThreshold(settings.thresholds.default?.toString() || "90");
      
      const gradeValues: Record<string, string> = {};
      for (const grade of availableGrades) {
        gradeValues[grade] = settings.thresholds[grade]?.toString() || "";
      }
      setGradeThresholds(gradeValues);
      setHasChanges(false);
    }
  }, [settings, availableGrades]);

  const handleChange = () => {
    setHasChanges(true);
    onUnsavedChange?.();
  };

  const handleSave = async () => {
    if (!settings?.eventId) return;

    const thresholds: VerificationThresholds = {};
    
    // Add default threshold
    const defaultVal = parseInt(defaultThreshold, 10);
    if (!isNaN(defaultVal) && defaultVal > 0) {
      thresholds.default = defaultVal;
    }
    
    // Add per-grade thresholds
    for (const [grade, value] of Object.entries(gradeThresholds)) {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        thresholds[grade] = numValue;
      }
    }

    await updateSettings.mutateAsync({
      eventId: settings.eventId,
      enabled,
      thresholds,
    });
    
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="bg-background p-6" style={handDrawnBorder}>
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-background p-6" style={handDrawnBorder}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <h2 className="font-medium text-foreground">Reading Log Verification</h2>
        </div>
        {hasChanges && (
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={updateSettings.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateSettings.isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <Label htmlFor="verificationEnabled" className="font-medium">
              Require parent verification for long sessions
            </Label>
            <p className="text-sm text-muted-foreground">
              When enabled, reading logs exceeding the threshold require parent approval
            </p>
          </div>
          <Switch
            id="verificationEnabled"
            checked={enabled}
            onCheckedChange={(checked) => {
              setEnabled(checked);
              handleChange();
            }}
          />
        </div>

        {enabled && (
          <>
            {/* Default Threshold */}
            <FormField
              label="Default threshold (minutes)"
              htmlFor="defaultThreshold"
              helperText="Reading sessions longer than this will require parent verification"
            >
              <div className="max-w-[200px]">
                <Input
                  id="defaultThreshold"
                  type="number"
                  value={defaultThreshold}
                  onChange={(e) => {
                    setDefaultThreshold(e.target.value);
                    handleChange();
                  }}
                  min={1}
                  placeholder="90"
                />
              </div>
            </FormField>

            {/* Per-Grade Overrides */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Per-grade overrides</Label>
              <p className="text-xs text-muted-foreground">
                Leave empty to use the default threshold for that grade
              </p>
              
              {gradesLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : availableGrades.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No students enrolled yet. Grades will appear once students are added.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableGrades.map((grade) => (
                    <div key={grade} className="flex items-center gap-2">
                      <span className="text-sm font-medium w-12 shrink-0">{grade}</span>
                      <Input
                        type="number"
                        value={gradeThresholds[grade] || ""}
                        onChange={(e) => {
                          setGradeThresholds(prev => ({
                            ...prev,
                            [grade]: e.target.value,
                          }));
                          handleChange();
                        }}
                        min={1}
                        placeholder={defaultThreshold || "default"}
                        className="h-8 w-24"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {Object.entries(gradeThresholds).some(([_, v]) => v) && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <p className="text-xs text-muted-foreground">
                  <strong>Custom thresholds:</strong>{" "}
                  {Object.entries(gradeThresholds)
                    .filter(([_, v]) => v)
                    .map(([grade, mins]) => `${grade}: ${mins} min`)
                    .join(", ") || "None"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

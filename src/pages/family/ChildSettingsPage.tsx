import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormField } from "@/components/ui/form-field";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Shield,
  User,
  GraduationCap,
  BookOpen,
  Save,
} from "lucide-react";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const GRADES = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
];

// Mock child data
const mockChild = {
  id: "1",
  firstName: "Emma",
  lastName: "Johnson",
  grade: "3rd Grade",
  teacher: "Mrs. Peterson",
  readingGoal: 300,
  allowSponsorSharing: false,
};

const ChildSettingsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: mockChild.firstName,
    lastName: mockChild.lastName,
    grade: mockChild.grade,
    teacher: mockChild.teacher,
    readingGoal: mockChild.readingGoal,
    allowSponsorSharing: mockChild.allowSponsorSharing,
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    
    toast.success("Settings saved", {
      description: `${formData.firstName}'s settings have been updated.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-2">
              {formData.firstName}'s Settings
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your child's profile and privacy settings
            </p>
          </div>

          {/* Settings Form */}
          <div 
            className="bg-background p-6 mb-6"
            style={handDrawnBorder}
          >
            <h2 className="font-serif text-xl text-foreground mb-6">Profile Information</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" htmlFor="firstName" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </FormField>

                <FormField label="Last Name" htmlFor="lastName" required>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Grade" htmlFor="grade" required>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => updateField("grade", value)}
                >
                  <SelectTrigger>
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Teacher" htmlFor="teacher" required>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => updateField("teacher", e.target.value)}
                />
              </FormField>

              <FormField 
                label="Reading Goal (minutes)" 
                htmlFor="readingGoal" 
                required
              >
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="readingGoal"
                    type="number"
                    min={1}
                    value={formData.readingGoal}
                    onChange={(e) => updateField("readingGoal", parseInt(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </FormField>
            </div>
          </div>

          {/* Privacy Settings */}
          <div 
            className="bg-background p-6 mb-6"
            style={handDrawnBorder}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl text-foreground">Privacy Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Control how sponsors can interact with your child's profile
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <Label htmlFor="allowSponsorSharing" className="text-sm font-medium">
                    Allow sponsors to invite others
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    When enabled, your child's sponsors can share the sponsor link with friends and family to invite more sponsors
                  </p>
                </div>
                <Switch
                  id="allowSponsorSharing"
                  checked={formData.allowSponsorSharing}
                  onCheckedChange={(checked) => updateField("allowSponsorSharing", checked)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChildSettingsPage;
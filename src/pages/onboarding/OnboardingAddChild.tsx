import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, GraduationCap, BookOpen, Shield } from "lucide-react";
import { useChildren } from "@/hooks/useChildren";
import { useHomeroomTeachers } from "@/hooks/useTeachers";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const GRADES = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
];

const GOAL_PRESETS = [300, 500, 750, 1000];

const OnboardingAddChild = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = (location.state as { from?: string })?.from === "dashboard";
  const { user, isLoading: authLoading } = useAuth();
  const { addChild } = useChildren();
  const { data: homeroomTeachers = [], isLoading: teachersLoading } = useHomeroomTeachers();
  const [hasMultipleChildren, setHasMultipleChildren] = useState(false);
  const [teacherNotListed, setTeacherNotListed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    teacherId: "",
    customTeacher: "",
    readingGoal: 500,
    allowPublicLink: true,
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      toast.error("Please create an account first");
      navigate('/register');
    }
  }, [user, authLoading, navigate]);

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter teachers by grade if they have a grade-like pattern in their name or no filtering needed
  const availableTeachers = homeroomTeachers.filter(t => t.is_active);

  const selectedTeacher = availableTeachers.find(t => t.id === formData.teacherId);

  const isFormValid = 
    formData.firstName.trim() && 
    formData.lastName.trim() && 
    formData.grade && 
    (formData.teacherId || (teacherNotListed && formData.customTeacher.trim())) &&
    formData.readingGoal > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    setIsSubmitting(true);

    try {
      const childName = `${formData.firstName} ${formData.lastName.charAt(0).toUpperCase()}.`;
      const className = teacherNotListed 
        ? formData.customTeacher 
        : selectedTeacher?.name || "";
      
      const result = await addChild.mutateAsync({
        name: childName,
        grade_info: formData.grade,
        class_name: className,
        goal_minutes: formData.readingGoal,
        share_public_link: formData.allowPublicLink,
        homeroom_teacher_id: teacherNotListed ? null : formData.teacherId || null,
      });

      // Store child data for next steps in onboarding
      sessionStorage.setItem('onboardingChildId', result.id);
      sessionStorage.setItem('childData', JSON.stringify({
        id: result.id,
        firstName: formData.firstName,
        lastInitial: formData.lastName.charAt(0).toUpperCase(),
        readingGoal: formData.readingGoal,
      }));
      sessionStorage.setItem('hasMultipleChildren', JSON.stringify(hasMultipleChildren));
      
      navigate('/onboarding/pledge');
    } catch (error) {
      // Error is already handled by the hook
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <PublicLayout>
        <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Back to Dashboard Link */}
          {fromDashboard && (
            <div className="mb-6">
              <Link 
                to="/dashboard" 
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                ← Back to Dashboard
              </Link>
            </div>
          )}
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === 1 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && <div className="w-12 h-0.5 bg-muted" />}
              </div>
            ))}
          </div>

          <div 
            className="animate-fade-in bg-card p-8 shadow-book"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="font-serif text-2xl text-foreground">
                  Add Your Child
                </h1>
                <p className="text-muted-foreground">
                  Tell us about the reader you're enrolling
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Child's First Name" htmlFor="firstName" required>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField 
                    label="Last Name" 
                    htmlFor="lastName" 
                    required
                    helperText="We only store the first initial for privacy"
                  >
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Grade" htmlFor="grade" required>
                  <Select 
                    value={formData.grade} 
                    onValueChange={(value) => {
                      updateField("grade", value);
                    }}
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

                <FormField label="Homeroom Teacher" htmlFor="teacher" required>
                  {!teacherNotListed ? (
                    <>
                      <Select 
                        value={formData.teacherId} 
                        onValueChange={(value) => updateField("teacherId", value)}
                        disabled={teachersLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={teachersLoading ? "Loading teachers..." : "Select homeroom teacher"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTeachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button
                        type="button"
                        onClick={() => setTeacherNotListed(true)}
                        className="text-xs text-primary hover:underline mt-1 inline-link"
                      >
                        Teacher not listed? Enter name manually
                      </button>
                    </>
                  ) : (
                    <>
                      <Input
                        id="customTeacher"
                        placeholder="Enter teacher's name"
                        value={formData.customTeacher}
                        onChange={(e) => updateField("customTeacher", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setTeacherNotListed(false);
                          updateField("customTeacher", "");
                        }}
                        className="text-xs text-primary hover:underline mt-1 inline-link"
                      >
                        Back to teacher list
                      </button>
                    </>
                  )}
                </FormField>

                <FormField 
                  label="Reading Goal (minutes)" 
                  htmlFor="readingGoal" 
                  required
                  helperText="500 minutes = about 15 minutes per day"
                >
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {GOAL_PRESETS.map((goal) => (
                        <Button
                          key={goal}
                          type="button"
                          variant={formData.readingGoal === goal ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateField("readingGoal", goal)}
                          className="flex-1"
                        >
                          {goal}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="readingGoal"
                        type="number"
                        min={1}
                        value={formData.readingGoal}
                        onChange={(e) => updateField("readingGoal", parseInt(e.target.value) || 0)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </FormField>

                {/* Public Link Permission */}
                <div 
                  className="p-4 rounded-lg bg-muted/50 space-y-3"
                  style={{
                    border: 'solid 1px #41403E',
                    borderRadius: '8px',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <Label htmlFor="allowPublicLink" className="text-sm font-medium">
                        Allow Public Sponsor Link
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        When enabled, anyone with the link can sign up as a sponsor
                      </p>
                    </div>
                    <Switch
                      id="allowPublicLink"
                      checked={formData.allowPublicLink}
                      onCheckedChange={(checked) => updateField("allowPublicLink", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="multipleChildren"
                    checked={hasMultipleChildren}
                    onCheckedChange={(checked) => setHasMultipleChildren(checked as boolean)}
                  />
                  <Label
                    htmlFor="multipleChildren"
                    className="text-sm font-normal leading-relaxed"
                  >
                    I have more than one child to enroll
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Continue"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default OnboardingAddChild;

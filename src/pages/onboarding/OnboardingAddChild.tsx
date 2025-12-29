import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, GraduationCap, BookOpen } from "lucide-react";

const GRADES = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
];

// Mock teachers by grade
const TEACHERS_BY_GRADE: Record<string, string[]> = {
  "Pre-K": ["Ms. Adams", "Mr. Brown"],
  "Kindergarten": ["Ms. Carter", "Mrs. Davis"],
  "1st Grade": ["Mr. Evans", "Ms. Foster"],
  "2nd Grade": ["Mrs. Garcia", "Mr. Harris"],
  "3rd Grade": ["Ms. Johnson", "Mr. Kim"],
  "4th Grade": ["Mrs. Lee", "Ms. Martinez"],
  "5th Grade": ["Mr. Nelson", "Mrs. O'Brien"],
};

const GOAL_PRESETS = [300, 500, 750, 1000];

const OnboardingAddChild = () => {
  const navigate = useNavigate();
  const [parentData, setParentData] = useState<{ firstName: string } | null>(null);
  const [hasMultipleChildren, setHasMultipleChildren] = useState(false);
  const [teacherNotListed, setTeacherNotListed] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    teacher: "",
    customTeacher: "",
    readingGoal: 500,
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('parentData');
    if (stored) {
      setParentData(JSON.parse(stored));
    }
  }, []);

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const availableTeachers = formData.grade ? TEACHERS_BY_GRADE[formData.grade] || [] : [];

  const isFormValid = 
    formData.firstName.trim() && 
    formData.lastName.trim() && 
    formData.grade && 
    (formData.teacher || (teacherNotListed && formData.customTeacher.trim())) &&
    formData.readingGoal > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Store child data
    const childData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      lastInitial: formData.lastName.charAt(0).toUpperCase(),
      grade: formData.grade,
      teacher: teacherNotListed ? formData.customTeacher : formData.teacher,
      readingGoal: formData.readingGoal,
    };
    
    sessionStorage.setItem('childData', JSON.stringify(childData));
    sessionStorage.setItem('hasMultipleChildren', JSON.stringify(hasMultipleChildren));
    
    navigate('/onboarding/pledge');
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-lg">
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

          <BookContainer variant="default" className="animate-fade-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <Logo size="small" className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground">
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
                      updateField("teacher", ""); // Reset teacher when grade changes
                      setTeacherNotListed(false);
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

                {formData.grade && (
                  <FormField label="Teacher" htmlFor="teacher" required>
                    {!teacherNotListed ? (
                      <>
                        <Select 
                          value={formData.teacher} 
                          onValueChange={(value) => updateField("teacher", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTeachers.map((teacher) => (
                              <SelectItem key={teacher} value={teacher}>
                                {teacher}
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
                )}

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
                  disabled={!isFormValid}
                >
                  Continue
                </Button>
              </form>
            </div>
          </BookContainer>
        </div>
      </section>
    </PublicLayout>
  );
};

export default OnboardingAddChild;
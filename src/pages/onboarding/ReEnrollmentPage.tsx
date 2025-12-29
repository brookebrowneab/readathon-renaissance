import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  Plus, 
  ArrowRight,
  GraduationCap,
  BookOpen,
  Mail,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

// Grade progression helper
const GRADES = ["Pre-K", "Kindergarten", "1st", "2nd", "3rd", "4th", "5th"];

const getNextGrade = (currentGrade: string): string => {
  const index = GRADES.indexOf(currentGrade);
  if (index === -1 || index === GRADES.length - 1) return currentGrade;
  return GRADES[index + 1];
};

// Mock teachers by grade
const TEACHERS_BY_GRADE: Record<string, string[]> = {
  "Pre-K": ["Ms. Adams", "Mr. Brown"],
  "Kindergarten": ["Ms. Carter", "Mrs. Davis"],
  "1st": ["Mr. Evans", "Ms. Foster"],
  "2nd": ["Mrs. Garcia", "Mr. Harris"],
  "3rd": ["Ms. Johnson", "Mr. Kim"],
  "4th": ["Mrs. Lee", "Ms. Martinez"],
  "5th": ["Mr. Nelson", "Mrs. O'Brien"],
};

// Mock data for returning parent
const MOCK_PARENT = {
  firstName: "Sarah",
  lastName: "Johnson",
};

const MOCK_EVENT = {
  name: "Spring Read-a-thon 2025",
  defaultGoal: 500,
};

// Mock previous children (not enrolled in current event)
const MOCK_PREVIOUS_CHILDREN = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    previousGrade: "2nd",
    previousTeacher: "Mrs. Garcia",
    previousGoal: 500,
  },
  {
    id: "2",
    firstName: "Jacob",
    lastName: "Johnson",
    previousGrade: "Kindergarten",
    previousTeacher: "Ms. Carter",
    previousGoal: 400,
  },
];

// Mock previous sponsors
const MOCK_PREVIOUS_SPONSORS = [
  { id: "1", name: "Grandma Betty", email: "betty@example.com", relationship: "Grandmother", totalPledged: 75 },
  { id: "2", name: "Uncle Mike", email: "mike@example.com", relationship: "Uncle", totalPledged: 50 },
  { id: "3", name: "Aunt Susan", email: "susan@example.com", relationship: "Aunt", totalPledged: 25 },
];

interface ChildEnrollment {
  id: string;
  firstName: string;
  lastName: string;
  previousGrade: string;
  previousTeacher: string;
  selected: boolean;
  newGrade: string;
  newTeacher: string;
}

const ReEnrollmentPage = () => {
  const navigate = useNavigate();
  
  // Initialize children with default progression
  const [children, setChildren] = useState<ChildEnrollment[]>(
    MOCK_PREVIOUS_CHILDREN.map((child) => ({
      ...child,
      selected: true,
      newGrade: getNextGrade(child.previousGrade),
      newTeacher: "",
    }))
  );
  
  const [readingGoal, setReadingGoal] = useState(MOCK_EVENT.defaultGoal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sponsor re-invite state
  const [showSponsorDialog, setShowSponsorDialog] = useState(false);
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>(
    MOCK_PREVIOUS_SPONSORS.map((s) => s.id)
  );
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const updateChild = (id: string, updates: Partial<ChildEnrollment>) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id ? { ...child, ...updates } : child
      )
    );
  };

  const selectedChildren = children.filter((c) => c.selected);
  const canEnroll = selectedChildren.length > 0 && 
    selectedChildren.every((c) => c.newGrade && c.newTeacher);

  const handleEnroll = async () => {
    if (!canEnroll) return;
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    toast.success(`Enrolled ${selectedChildren.length} child${selectedChildren.length > 1 ? "ren" : ""}!`);
    setEnrollmentComplete(true);
    setShowSponsorDialog(true);
  };

  const handleSendInvites = async () => {
    if (selectedSponsors.length === 0) {
      navigate("/dashboard");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    const sponsorCount = selectedSponsors.length;
    toast.success(`Sent invitations to ${sponsorCount} sponsor${sponsorCount > 1 ? "s" : ""}!`);
    navigate("/dashboard");
  };

  const handleSkipSponsors = () => {
    navigate("/dashboard");
  };

  const toggleSponsor = (id: string) => {
    setSelectedSponsors((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background-warm p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          <BookContainer variant="default" className="animate-fade-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <Logo size="large" className="mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {MOCK_PARENT.firstName}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  The <span className="font-medium text-foreground">{MOCK_EVENT.name}</span> is starting! 
                  Enroll your children.
                </p>
              </div>

              {/* Children List */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Your Children</Label>
                
                {children.map((child) => {
                  const availableTeachers = TEACHERS_BY_GRADE[child.newGrade] || [];
                  
                  return (
                    <Card 
                      key={child.id}
                      className={`transition-all ${
                        child.selected 
                          ? "border-primary/50 bg-primary/5" 
                          : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`child-${child.id}`}
                            checked={child.selected}
                            onCheckedChange={(checked) =>
                              updateChild(child.id, { selected: checked as boolean })
                            }
                            className="mt-1"
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label
                                  htmlFor={`child-${child.id}`}
                                  className="text-base font-medium cursor-pointer"
                                >
                                  {child.firstName} {child.lastName.charAt(0)}.
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Was {child.previousGrade}, {child.previousTeacher}
                                </p>
                              </div>
                              {child.selected && child.newGrade && child.newTeacher && (
                                <Badge variant="success" className="ml-2">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Ready
                                </Badge>
                              )}
                            </div>

                            {child.selected && (
                              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                <FormField label="Grade" htmlFor={`grade-${child.id}`}>
                                  <Select
                                    value={child.newGrade}
                                    onValueChange={(value) =>
                                      updateChild(child.id, { 
                                        newGrade: value, 
                                        newTeacher: "" 
                                      })
                                    }
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

                                <FormField label="Teacher" htmlFor={`teacher-${child.id}`}>
                                  <Select
                                    value={child.newTeacher}
                                    onValueChange={(value) =>
                                      updateChild(child.id, { newTeacher: value })
                                    }
                                    disabled={!child.newGrade}
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
                                </FormField>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Reading Goal */}
              <FormField
                label="Reading Goal (minutes)"
                htmlFor="readingGoal"
                helperText="This goal applies to all enrolled children"
              >
                <div className="flex gap-2">
                  {[300, 500, 750, 1000].map((goal) => (
                    <Button
                      key={goal}
                      type="button"
                      variant={readingGoal === goal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReadingGoal(goal)}
                      className="flex-1"
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
                <div className="relative mt-2">
                  <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="readingGoal"
                    type="number"
                    min={1}
                    value={readingGoal}
                    onChange={(e) => setReadingGoal(parseInt(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </FormField>

              {/* Add New Child Link */}
              <Link
                to="/onboarding/add-child"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add a new child
              </Link>

              {/* Enroll Button */}
              <Button
                onClick={handleEnroll}
                disabled={!canEnroll || isSubmitting}
                loading={isSubmitting}
                className="w-full"
                size="lg"
              >
                Enroll {selectedChildren.length > 0 
                  ? `${selectedChildren.length} Child${selectedChildren.length > 1 ? "ren" : ""}` 
                  : "Selected Children"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </BookContainer>
        </div>
      </section>

      {/* Re-invite Sponsors Dialog */}
      <Dialog open={showSponsorDialog} onOpenChange={setShowSponsorDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Re-invite Previous Sponsors
            </DialogTitle>
            <DialogDescription>
              These sponsors supported your children last year. Would you like to invite them again?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-auto">
            {MOCK_PREVIOUS_SPONSORS.map((sponsor) => (
              <Card
                key={sponsor.id}
                className={`cursor-pointer transition-all ${
                  selectedSponsors.includes(sponsor.id)
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
                onClick={() => toggleSponsor(sponsor.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedSponsors.includes(sponsor.id)}
                      onCheckedChange={() => toggleSponsor(sponsor.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{sponsor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {sponsor.relationship} • {sponsor.email}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          Pledged ${sponsor.totalPledged}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {selectedSponsors.length} sponsor{selectedSponsors.length !== 1 ? "s" : ""} will receive an email invitation
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleSkipSponsors}>
              Skip for now
            </Button>
            <Button
              onClick={handleSendInvites}
              loading={isSubmitting}
            >
              <Mail className="h-4 w-4 mr-2" />
              {selectedSponsors.length > 0 
                ? `Send ${selectedSponsors.length} Invitation${selectedSponsors.length !== 1 ? "s" : ""}`
                : "Continue without inviting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
};

export default ReEnrollmentPage;

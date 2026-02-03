import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BookContainer } from "@/components/legacy";
import { toast } from "@/components/ui/sonner";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Hooks
import { useChildren } from "@/hooks/useChildren";
import { useSponsorableChildren } from "@/hooks/useSponsorableChildren";
import { useAvailableClasses, useMultipleClassFundraisingTotals } from "@/hooks/useClassFundraising";
import { usePledges } from "@/hooks/usePledges";
import { useCreateClassPledge, useCreateMilestonePledges } from "@/hooks/useClassPledges";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { useSponsorAuth } from "@/hooks/useSponsorAuth";

// Components
import {
  SponsorTypeSelector,
  SponsorType,
  ChildSelector,
  ClassSelector,
  PledgeAmountForm,
  PledgeType,
} from "@/components/pledge";
import { 
  ClassroomPledgeForm, 
  ClassroomPledgeType, 
  MilestoneTier 
} from "@/components/pledge/ClassroomPledgeForm";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

type Step = 0 | 1 | 2 | 3; // 0: Type, 1: Select, 2: Amount, 3: Confirmation

const SponsorMyChildPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDashboard = location.state?.from === "dashboard";

  // Data hooks
  const { children: myChildren, isLoading: childrenLoading } = useChildren();
  const { sponsor } = useSponsorAuth();
  const { data: sponsorableChildren, isLoading: sponsorableLoading } = useSponsorableChildren();
  const { data: availableClasses, isLoading: classesLoading } = useAvailableClasses();
  const { data: activeEvent } = useActiveEvent();
  const { addPledge } = usePledges();
  const createClassPledge = useCreateClassPledge();
  const createMilestonePledges = useCreateMilestonePledges();

  // Get class names for fundraising totals
  const classNames = useMemo(() => 
    availableClasses?.map(c => c.className) || [], 
    [availableClasses]
  );
  const { data: fundraisingTotals } = useMultipleClassFundraisingTotals(classNames, activeEvent?.id);

  // Step state
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [sponsorType, setSponsorType] = useState<SponsorType | null>(null);
  
  // Selection state
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  
  // Pledge amount state (individual child pledges)
  const [pledgeType, setPledgeType] = useState<PledgeType>("per_minute");
  const [perMinuteAmount, setPerMinuteAmount] = useState("0.05");
  const [flatAmount, setFlatAmount] = useState("25");
  const [maxPledgeCap, setMaxPledgeCap] = useState("");
  
  // Classroom pledge state
  const [classroomPledgeType, setClassroomPledgeType] = useState<ClassroomPledgeType>("flat");
  const [classroomFlatAmount, setClassroomFlatAmount] = useState("50");
  const [milestoneTiers, setMilestoneTiers] = useState<MilestoneTier[]>([
    { id: crypto.randomUUID(), amount: "25", minutesTarget: "1000" },
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get milestone settings from event
  const milestoneGoal = (activeEvent as any)?.class_milestone_goal || 1000;
  const milestoneReward = (activeEvent as any)?.class_milestone_reward || null;
  const milestoneEnabled = (activeEvent as any)?.class_milestone_enabled !== false;

  // Compute selected child/class details
  const selectedChild = useMemo(() => {
    if (sponsorType === "my-children") {
      return myChildren.find(c => c.id === selectedChildId);
    }
    return null;
  }, [sponsorType, selectedChildId, myChildren]);

  const selectedClass = useMemo(() => {
    return availableClasses?.find(c => c.className === selectedClassName);
  }, [selectedClassName, availableClasses]);

  // Calculate projected minutes for pledge calculation
  const projectedMinutes = useMemo(() => {
    if (selectedChild) {
      return selectedChild.goal_minutes;
    }
    if (selectedClass) {
      // Sum of goal minutes for all students in class (estimate)
      return selectedClass.studentCount * 300; // Default 300 min per student
    }
    return 500;
  }, [selectedChild, selectedClass]);

  // Get recipient name for display
  const recipientName = useMemo(() => {
    if (selectedChild) {
      return (selectedChild as any).displayName || selectedChild.name;
    }
    if (selectedClass) {
      return selectedClass.teacherName 
        ? `${selectedClass.teacherName}'s Class` 
        : selectedClass.className;
    }
    return "this reader";
  }, [selectedChild, selectedClass]);

  // Calculate projected amount
  const calculateProjected = () => {
    if (pledgeType === "flat") return parseFloat(flatAmount) || 0;
    const perMin = parseFloat(perMinuteAmount) || 0;
    const cap = parseFloat(maxPledgeCap) || Infinity;
    return Math.min(projectedMinutes * perMin, cap);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      if (fromDashboard) {
        navigate("/dashboard");
      } else {
        navigate(-1);
      }
    } else {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleTypeSelect = (type: SponsorType) => {
    setSponsorType(type);
  };

  const handleTypeNext = () => {
    if (sponsorType) {
      setCurrentStep(1);
    }
  };

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
  };

  const handleClassSelect = (className: string, teacherId: string | null) => {
    setSelectedClassName(className);
    setSelectedTeacherId(teacherId);
  };

  const handleSelectionNext = () => {
    if (sponsorType === "support-classroom" ? selectedClassName : selectedChildId) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (sponsorType === "support-classroom" && selectedClassName) {
        // Create class pledge(s)
        if (classroomPledgeType === "milestone") {
          // Create multiple milestone pledges
          const validMilestones = milestoneTiers
            .filter(t => parseFloat(t.amount) > 0 && parseInt(t.minutesTarget) > 0)
            .map(t => ({
              amount: parseFloat(t.amount),
              minutesTarget: parseInt(t.minutesTarget),
            }));

          if (validMilestones.length === 0) {
            toast.error("Please add at least one valid milestone");
            setIsSubmitting(false);
            return;
          }

          await createMilestonePledges.mutateAsync({
            className: selectedClassName,
            teacherId: selectedTeacherId || undefined,
            eventId: activeEvent?.id,
            milestones: validMilestones,
          });
        } else {
          // Create flat donation
          await createClassPledge.mutateAsync({
            className: selectedClassName,
            teacherId: selectedTeacherId || undefined,
            eventId: activeEvent?.id,
            pledgeType: "flat",
            amount: parseFloat(classroomFlatAmount) || 0,
          });
        }
      } else if (selectedChildId && selectedChild) {
        // Create individual pledge - include sponsor_id if user has a sponsor profile
        await addPledge.mutateAsync({
          child_id: selectedChildId,
          student_name: selectedChild.name,
          pledge_type: pledgeType === "per_minute" ? "per_minute" : "flat",
          amount: pledgeType === "per_minute" 
            ? parseFloat(perMinuteAmount) 
            : parseFloat(flatAmount),
          event_id: activeEvent?.id,
          sponsor_id: sponsor?.id || null,
        });
      }

      setCurrentStep(3);
      toast.success("Pledge created!", {
        description: `Your pledge for ${recipientName} has been saved.`,
      });
    } catch (error) {
      // Error handled by mutation hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step 0: Type Selection
  const renderStep0 = () => {
    return (
      <div className="space-y-6 animate-fade-in">
        <SponsorTypeSelector
          selectedType={sponsorType}
          onSelect={handleTypeSelect}
          hasChildren={myChildren.length > 0}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {fromDashboard ? "Back to Dashboard" : "Back"}
          </Button>
          <Button
            className="flex-1"
            disabled={!sponsorType}
            onClick={handleTypeNext}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Render Step 1: Selection (Child or Class)
  const renderStep1 = () => {
    if (sponsorType === "my-children") {
      const formattedChildren = myChildren.map(c => ({
        id: c.id,
        display_name: c.name, // Parents see full name but we pass it as display_name for component compatibility
        grade_info: c.grade_info,
        class_name: c.class_name,
        total_minutes: c.total_minutes,
        goal_minutes: c.goal_minutes,
        teacher_name: null,
      }));

      return (
        <div className="space-y-6 animate-fade-in">
          <ChildSelector
            children={formattedChildren}
            selectedChildId={selectedChildId}
            onSelect={handleChildSelect}
            title="Select Your Child"
            subtitle="Choose which of your children to sponsor"
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedChildId}
              onClick={handleSelectionNext}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (sponsorType === "support-classroom") {
      return (
        <div className="space-y-6 animate-fade-in">
          <ClassSelector
            classes={availableClasses || []}
            selectedClassName={selectedClassName}
            onSelect={handleClassSelect}
            fundraisingTotals={fundraisingTotals || {}}
            milestoneGoal={milestoneGoal}
            milestoneReward={milestoneEnabled ? milestoneReward : null}
            isLoading={classesLoading}
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedClassName}
              onClick={handleSelectionNext}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render Step 2: Pledge Amount
  const renderStep2 = () => {
    // For classroom sponsorship, use the dedicated classroom pledge form
    if (sponsorType === "support-classroom") {
      return (
        <div className="space-y-6 animate-fade-in">
          <ClassroomPledgeForm
            pledgeType={classroomPledgeType}
            onPledgeTypeChange={setClassroomPledgeType}
            flatAmount={classroomFlatAmount}
            onFlatAmountChange={setClassroomFlatAmount}
            milestoneTiers={milestoneTiers}
            onMilestoneTiersChange={setMilestoneTiers}
            className={selectedClassName || ""}
            teacherName={selectedClass?.teacherName}
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Pledge..." : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Create Pledge
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // For individual child pledges, use the standard pledge form
    return (
      <div className="space-y-6 animate-fade-in">
        <PledgeAmountForm
          pledgeType={pledgeType}
          perMinuteAmount={perMinuteAmount}
          flatAmount={flatAmount}
          maxPledgeCap={maxPledgeCap}
          projectedMinutes={projectedMinutes}
          onPledgeTypeChange={setPledgeType}
          onPerMinuteChange={setPerMinuteAmount}
          onFlatAmountChange={setFlatAmount}
          onMaxCapChange={setMaxPledgeCap}
          recipientName={recipientName}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Pledge..." : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Create Pledge
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Render Step 3: Confirmation
  const renderStep3 = () => {
    const isClassroomPledge = sponsorType === "support-classroom";
    
    // Calculate total for milestone pledges
    const milestoneTotalPledged = milestoneTiers.reduce(
      (sum, t) => sum + (parseFloat(t.amount) || 0), 
      0
    );
    
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>

        <div>
          <h2 className="font-serif text-2xl text-primary mb-2">Pledge Created!</h2>
          <p className="text-muted-foreground">
            You've pledged to {isClassroomPledge ? "support" : "sponsor"} {recipientName}
          </p>
        </div>

        <div className="bg-background-warm p-6" style={handDrawnBorder}>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium">{recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pledge Type</span>
              <span className="font-medium">
                {isClassroomPledge 
                  ? (classroomPledgeType === "milestone" ? "Reading Milestone" : "Fixed Donation")
                  : (pledgeType === "per_minute" ? "Per Minute" : "Flat")}
              </span>
            </div>
            
            {isClassroomPledge ? (
              <>
                {classroomPledgeType === "milestone" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Milestones</span>
                      <span className="font-medium">{milestoneTiers.length} tier(s)</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Total Pledged</span>
                      <span className="text-xl font-semibold text-primary">
                        ${milestoneTotalPledged.toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Donation Amount</span>
                    <span className="text-xl font-semibold text-primary">
                      ${classroomFlatAmount}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {pledgeType === "per_minute" 
                      ? `$${perMinuteAmount}/min` 
                      : `$${flatAmount}`}
                  </span>
                </div>
                {pledgeType === "per_minute" && maxPledgeCap && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maximum Cap</span>
                    <span className="font-medium">${maxPledgeCap}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Projected Total</span>
                  <span className="text-xl font-semibold text-primary">
                    ${calculateProjected().toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => {
            // Reset and start over
            setCurrentStep(0);
            setSponsorType(null);
            setSelectedChildId(null);
            setSelectedClassName(null);
            setSelectedTeacherId(null);
          }} 
          className="flex-1"
        >
          Make Another Pledge
        </Button>
        <Button onClick={() => navigate("/dashboard")} className="flex-1">
          Back to Dashboard
        </Button>
      </div>
    </div>
    );
  };

  // Calculate total steps for progress (excluding confirmation)
  const totalSteps = 3;
  const progressStep = Math.min(currentStep + 1, totalSteps);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
              Make a Pledge
            </h1>
            <p className="text-muted-foreground mt-2">
              Support reading and help make a difference
            </p>
          </div>

          {/* Progress Indicator */}
          {currentStep < 3 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                      progressStep >= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {progressStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {index < 2 && (
                    <div
                      className={cn(
                        "w-12 h-1 mx-2 rounded transition-colors",
                        progressStep > step ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step Content */}
          <div 
            className="bg-background p-6"
            style={handDrawnBorder}
          >
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorMyChildPage;

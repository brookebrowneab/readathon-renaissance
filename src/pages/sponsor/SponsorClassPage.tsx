import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHomeroomTeachers } from "@/hooks/useTeachers";
import { useActiveEvent, formatEventDates } from "@/hooks/useActiveEvent";
import { useGuestClassPledge } from "@/hooks/useGuestClassPledge";
import { 
  Users,
  User,
  Mail,
  Phone,
  DollarSign,
  ArrowRight,
  BookOpen,
  Heart,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Validation schemas
const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(100);
const emailSchema = z.string().trim().email("Please enter a valid email");
const phoneSchema = z.string().trim().min(7, "Please enter a valid phone number").max(20);

const AMOUNT_OPTIONS = [25, 50, 100, 250];

const SponsorClassPage = () => {
  const navigate = useNavigate();
  const { data: teachers, isLoading: teachersLoading } = useHomeroomTeachers();
  const { data: activeEvent } = useActiveEvent();
  const eventDates = formatEventDates(activeEvent);
  const guestPledge = useGuestClassPledge();

  // Form state
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTeacher = useMemo(() => 
    teachers?.find(t => t.id === selectedTeacherId),
    [teachers, selectedTeacherId]
  );

  const effectiveAmount = useMemo(() => {
    if (customAmount) return parseFloat(customAmount);
    return selectedAmount;
  }, [selectedAmount, customAmount]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTeacherId) {
      newErrors.teacher = "Please select a classroom";
    }

    try {
      nameSchema.parse(guestName);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.name = e.errors[0]?.message || "Invalid name";
      }
    }

    try {
      emailSchema.parse(guestEmail);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0]?.message || "Invalid email";
      }
    }

    try {
      phoneSchema.parse(guestPhone);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.phone = e.errors[0]?.message || "Invalid phone";
      }
    }

    if (!effectiveAmount || effectiveAmount <= 0) {
      newErrors.amount = "Please select or enter an amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedTeacher) return;

    try {
      await guestPledge.mutateAsync({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim().toLowerCase(),
        guestPhone: guestPhone.trim(),
        className: selectedTeacher.name, // Using teacher name as class identifier
        teacherId: selectedTeacherId,
        eventId: activeEvent?.id,
        pledgeType: "flat",
        amount: effectiveAmount!,
      });

      navigate("/sponsor/thank-you");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isFormValid = useMemo(() => {
    return (
      selectedTeacherId &&
      guestName.trim().length >= 2 &&
      guestEmail.includes("@") &&
      guestPhone.trim().length >= 7 &&
      effectiveAmount && effectiveAmount > 0
    );
  }, [selectedTeacherId, guestName, guestEmail, guestPhone, effectiveAmount]);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        {/* Bookshelf background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url(${booksShelfBannerV2})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 50%',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground mb-2">
                Support a Classroom
              </h1>
              <p className="text-muted-foreground text-lg">
                Your pledge helps motivate an entire class of young readers!
              </p>
              {activeEvent && (
                <p className="text-sm text-muted-foreground mt-2">
                  {eventDates.daysRemaining} days left in the Read-a-thon
                </p>
              )}
            </div>

            {/* Form */}
            <div 
              className="bg-background p-6 md:p-8 shadow-md"
              style={handDrawnBorder}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Select Classroom */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <span>Choose a Classroom</span>
                  </div>

                  <FormField 
                    label="Select a teacher's class" 
                    htmlFor="teacher"
                    error={errors.teacher}
                  >
                    <Select
                      value={selectedTeacherId}
                      onValueChange={setSelectedTeacherId}
                      disabled={teachersLoading}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={teachersLoading ? "Loading classrooms..." : "Select a classroom"} />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers?.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-muted-foreground" />
                              <span>{teacher.name}'s Class</span>
                              {teacher.grade_level && (
                                <span className="text-muted-foreground">
                                  ({teacher.grade_level})
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                {/* Step 2: Your Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <span>Your Information</span>
                  </div>

                  <FormField 
                    label="Your name" 
                    htmlFor="name"
                    error={errors.name}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Enter your name"
                        className="h-12 pl-10"
                        maxLength={100}
                      />
                    </div>
                  </FormField>

                  <FormField 
                    label="Email address" 
                    htmlFor="email"
                    error={errors.email}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 pl-10"
                        maxLength={255}
                      />
                    </div>
                  </FormField>

                  <FormField 
                    label="Phone number" 
                    htmlFor="phone"
                    error={errors.phone}
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="h-12 pl-10"
                        maxLength={20}
                      />
                    </div>
                  </FormField>
                </div>

                {/* Step 3: Pledge Amount */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <span>Your Pledge</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {AMOUNT_OPTIONS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={cn(
                          "h-14 rounded-lg border-2 font-medium text-lg transition-all",
                          selectedAmount === amount && !customAmount
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  <FormField 
                    label="Or enter a custom amount" 
                    htmlFor="customAmount"
                    error={errors.amount}
                  >
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="customAmount"
                        type="number"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setSelectedAmount(null);
                        }}
                        placeholder="Enter amount"
                        className="h-12 pl-10"
                      />
                    </div>
                  </FormField>
                </div>

                {/* Summary */}
                {selectedTeacher && effectiveAmount && effectiveAmount > 0 && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-foreground">
                        You're pledging <strong>${effectiveAmount}</strong> to support{" "}
                        <strong>{selectedTeacher.name}'s Class</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-14 text-lg"
                  disabled={!isFormValid || guestPledge.isPending}
                  style={handDrawnBorder}
                >
                  {guestPledge.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Heart className="h-5 w-5 mr-2" />
                      Complete Pledge
                    </>
                  )}
                </Button>

                {/* Note */}
                <p className="text-center text-sm text-muted-foreground">
                  Payment instructions will be sent to your email. Thank you for supporting young readers!
                </p>
              </form>
            </div>

            {/* Back link */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/sponsor")}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ← Back to sponsor options
              </button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SponsorClassPage;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Minus, Plus, ArrowLeft, Check, BookOpen, RotateCcw } from "lucide-react";
import logoSvg from "@/assets/logo.svg";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Confetti from "@/components/ui/confetti";

const QUICK_MINUTES = [15, 30, 45, 60];

interface StudentData {
  firstName: string;
  readingGoal: number;
  minutesRead: number;
}

const StudentLogReadingPage = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [selectedDay, setSelectedDay] = useState<"today" | "yesterday">("today");
  const [minutes, setMinutes] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newTotal, setNewTotal] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("studentData");
    if (stored) {
      setStudentData(JSON.parse(stored));
    } else {
      setStudentData({
        firstName: "Emma",
        readingGoal: 500,
        minutesRead: 247,
      });
    }
  }, []);

  const handleIncrement = () => setMinutes((prev) => prev + 5);
  const handleDecrement = () => setMinutes((prev) => Math.max(0, prev - 5));

  const handleQuickSelect = (mins: number) => {
    setMinutes(mins);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (minutes <= 0 || !studentData) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedTotal = studentData.minutesRead + minutes;
    setNewTotal(updatedTotal);

    // Update session storage
    const updatedData = { ...studentData, minutesRead: updatedTotal };
    sessionStorage.setItem("studentData", JSON.stringify(updatedData));

    // Check for 100% milestone
    if (studentData.minutesRead < studentData.readingGoal && updatedTotal >= studentData.readingGoal) {
      setShowConfetti(true);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Great job reading!");
  };

  const handleLogMore = () => {
    setMinutes(0);
    setBookTitle("");
    setIsSuccess(false);
    setShowConfetti(false);
    if (studentData) {
      setStudentData({ ...studentData, minutesRead: newTotal });
    }
  };

  const handleDone = () => {
    navigate("/student");
  };

  if (!studentData) return null;

  // Get book size class based on minutes
  const getBookSize = (mins: number) => {
    if (mins === 15) return "h-10 w-8";
    if (mins === 30) return "h-12 w-10";
    if (mins === 45) return "h-14 w-12";
    return "h-16 w-14";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-yellow/20 to-background-warm">
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link
          to="/student"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-lg">Back</span>
        </Link>
        <img src={logoSvg} alt="Read-a-thon" className="h-10" />
      </header>

      <main className="px-4 pb-8 max-w-lg mx-auto">
        {!isSuccess ? (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="font-handwritten text-4xl text-brand-blue">
                Log Your Reading 📖
              </h1>
            </div>

            <BookContainer variant="default" className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Day Selection */}
                <div className="space-y-3">
                  <label className="block text-xl font-medium text-foreground text-center">
                    When did you read?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDay("today")}
                      className={cn(
                        "h-14 rounded-xl text-xl font-medium transition-all border-2",
                        selectedDay === "today"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDay("yesterday")}
                      className={cn(
                        "h-14 rounded-xl text-xl font-medium transition-all border-2",
                        selectedDay === "yesterday"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      )}
                    >
                      Yesterday
                    </button>
                  </div>
                </div>

                {/* Minutes Counter */}
                <div className="space-y-4">
                  <label className="block text-xl font-medium text-foreground text-center">
                    How many minutes did you read?
                  </label>

                  {/* Giant Counter */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={minutes === 0}
                      className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center disabled:opacity-50 transition-all"
                    >
                      <Minus className="h-8 w-8" />
                    </button>

                    <div className="w-32 h-32 rounded-2xl bg-card border-2 border-border flex items-center justify-center">
                      <span className="font-handwritten text-6xl text-brand-blue">
                        {minutes}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all"
                    >
                      <Plus className="h-8 w-8" />
                    </button>
                  </div>

                  <p className="text-center text-lg text-muted-foreground">minutes</p>
                </div>

                {/* Quick Select Buttons */}
                <div className="grid grid-cols-4 gap-3">
                  {QUICK_MINUTES.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleQuickSelect(mins)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                        minutes === mins
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <BookOpen className={cn("text-brand-blue", getBookSize(mins))} />
                      <span className="text-lg font-medium">{mins}</span>
                    </button>
                  ))}
                </div>

                {/* Book Title */}
                <FormField
                  label="What did you read? (optional)"
                  htmlFor="bookTitle"
                >
                  <Input
                    id="bookTitle"
                    placeholder="Book title..."
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="h-14 text-xl"
                  />
                </FormField>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={minutes === 0 || isSubmitting}
                  loading={isSubmitting}
                  className="w-full h-[72px] text-2xl font-bold bg-brand-yellow hover:bg-accent-hover text-foreground"
                >
                  I Read!
                </Button>
              </form>
            </BookContainer>
          </div>
        ) : (
          /* Success State */
          <div className="space-y-6">
            <BookContainer variant="default" className="p-8 text-center">
              <div className="space-y-6">
                <h1 className="font-handwritten text-5xl text-brand-blue">
                  Awesome! 🎉
                </h1>

                <div className="flex justify-center">
                  <ReadingGoalRing
                    progress={newTotal}
                    goal={studentData.readingGoal}
                    size={200}
                  />
                </div>

                <p className="text-2xl text-foreground">
                  You have read{" "}
                  <span className="font-handwritten text-3xl text-brand-blue">
                    {newTotal} minutes
                  </span>{" "}
                  total!
                </p>

                {newTotal >= studentData.readingGoal && (
                  <div className="p-4 bg-success/20 rounded-xl">
                    <p className="text-xl font-bold text-success">
                      🎉 You reached your goal! 🎉
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={handleLogMore}
                    variant="outline"
                    className="h-14 text-xl"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Log More Reading
                  </Button>

                  <Button
                    onClick={handleDone}
                    className="h-14 text-xl bg-brand-yellow hover:bg-accent-hover text-foreground"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Done
                  </Button>
                </div>
              </div>
            </BookContainer>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentLogReadingPage;
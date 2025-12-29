import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle,
  RotateCcw,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  firstName: string;
  lastInitial: string;
  minutesRead: number;
  goalMinutes: number;
}

const mockStudents: Student[] = [
  { id: "1", firstName: "Emma", lastInitial: "J", minutesRead: 520, goalMinutes: 500 },
  { id: "2", firstName: "Liam", lastInitial: "S", minutesRead: 380, goalMinutes: 500 },
  { id: "3", firstName: "Olivia", lastInitial: "M", minutesRead: 247, goalMinutes: 500 },
  { id: "4", firstName: "Noah", lastInitial: "B", minutesRead: 180, goalMinutes: 500 },
  { id: "5", firstName: "Ava", lastInitial: "W", minutesRead: 420, goalMinutes: 500 },
  { id: "6", firstName: "Ethan", lastInitial: "D", minutesRead: 550, goalMinutes: 500 },
  { id: "7", firstName: "Sophia", lastInitial: "C", minutesRead: 95, goalMinutes: 500 },
  { id: "8", firstName: "Mason", lastInitial: "T", minutesRead: 0, goalMinutes: 500 },
  { id: "9", firstName: "Isabella", lastInitial: "R", minutesRead: 315, goalMinutes: 500 },
  { id: "10", firstName: "Lucas", lastInitial: "H", minutesRead: 0, goalMinutes: 500 },
  { id: "11", firstName: "Mia", lastInitial: "K", minutesRead: 480, goalMinutes: 500 },
  { id: "12", firstName: "Jackson", lastInitial: "L", minutesRead: 125, goalMinutes: 500 },
];

const TeacherLogReading = () => {
  const navigate = useNavigate();
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<"today" | "yesterday">("today");
  const [minutes, setMinutes] = useState(0);
  const [activityNote, setActivityNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loggedInfo, setLoggedInfo] = useState<{ minutes: number; count: number } | null>(null);

  const currentStudent = useMemo(() => {
    return mockStudents.find((s) => s.id === selectedStudent);
  }, [selectedStudent]);

  const handleIncrement = () => setMinutes((prev) => prev + 5);
  const handleDecrement = () => setMinutes((prev) => Math.max(0, prev - 5));

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(mockStudents.map((s) => s.id));
  };

  const selectNone = () => {
    setSelectedStudents([]);
  };

  const isFormValid = bulkMode
    ? selectedStudents.length > 0 && minutes > 0
    : selectedStudent && minutes > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const count = bulkMode ? selectedStudents.length : 1;
    setLoggedInfo({ minutes, count });

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(`Logged ${minutes} minutes for ${count} student${count > 1 ? "s" : ""}!`);
  };

  const handleLogMore = () => {
    setMinutes(0);
    setActivityNote("");
    setSelectedStudent("");
    setSelectedStudents([]);
    setIsSuccess(false);
    setLoggedInfo(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back Link */}
          <Link
            to="/teacher"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {!isSuccess ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                  Log Reading
                </h1>
                <div className="flex items-center gap-2">
                  <Label htmlFor="bulk-mode" className="text-sm text-muted-foreground">
                    Bulk mode
                  </Label>
                  <Switch
                    id="bulk-mode"
                    checked={bulkMode}
                    onCheckedChange={setBulkMode}
                  />
                </div>
              </div>

              <BookContainer variant="default" className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!bulkMode ? (
                    /* Single Student Mode */
                    <>
                      <FormField label="Select Student" htmlFor="student" required>
                        <Select
                          value={selectedStudent}
                          onValueChange={setSelectedStudent}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a student..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.firstName} {student.lastInitial}.
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>

                      {currentStudent && (
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                          <ReadingGoalRing
                            progress={currentStudent.minutesRead}
                            goal={currentStudent.goalMinutes}
                            size={80}
                          />
                          <div>
                            <p className="font-medium text-foreground">
                              {currentStudent.firstName} {currentStudent.lastInitial}.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {currentStudent.minutesRead} / {currentStudent.goalMinutes} minutes
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Bulk Mode */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          Select Students ({selectedStudents.length} selected)
                        </Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={selectAllStudents}
                          >
                            Select All
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={selectNone}
                          >
                            None
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
                        {mockStudents.map((student) => (
                          <label
                            key={student.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                              selectedStudents.includes(student.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudent(student.id)}
                            />
                            <span className="text-sm font-medium">
                              {student.firstName} {student.lastInitial}.
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Date</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedDate("today")}
                        className={cn(
                          "h-12 rounded-lg text-base font-medium transition-all border-2",
                          selectedDate === "today"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:border-primary/50"
                        )}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDate("yesterday")}
                        className={cn(
                          "h-12 rounded-lg text-base font-medium transition-all border-2",
                          selectedDate === "yesterday"
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-border hover:border-primary/50"
                        )}
                      >
                        Yesterday
                      </button>
                    </div>
                  </div>

                  {/* Minutes Input */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Minutes Read</Label>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={minutes === 0}
                        className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center disabled:opacity-50 transition-all"
                      >
                        <Minus className="h-6 w-6" />
                      </button>

                      <div className="w-24">
                        <Input
                          type="number"
                          min={0}
                          value={minutes}
                          onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                          className="h-14 text-2xl text-center font-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="w-14 h-14 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Quick buttons */}
                    <div className="flex justify-center gap-2">
                      {[15, 20, 30, 45].map((m) => (
                        <Button
                          key={m}
                          type="button"
                          variant={minutes === m ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMinutes(m)}
                        >
                          {m} min
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Activity Note */}
                  <FormField
                    label="Activity Note (optional)"
                    htmlFor="activityNote"
                    helperText="e.g., Classroom read-aloud, Silent reading time"
                  >
                    <Textarea
                      id="activityNote"
                      placeholder="What activity was this?"
                      value={activityNote}
                      onChange={(e) => setActivityNote(e.target.value)}
                      rows={2}
                    />
                  </FormField>

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    loading={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {bulkMode ? (
                      <>
                        <Users className="h-5 w-5 mr-2" />
                        Log for {selectedStudents.length} Student{selectedStudents.length !== 1 ? "s" : ""}
                      </>
                    ) : (
                      "Log Reading"
                    )}
                  </Button>
                </form>
              </BookContainer>
            </div>
          ) : (
            /* Success State */
            <BookContainer variant="default" className="p-8 text-center">
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Reading Logged!
                  </h1>
                  {loggedInfo && (
                    <p className="text-xl text-muted-foreground">
                      {loggedInfo.minutes} minutes for {loggedInfo.count} student
                      {loggedInfo.count > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button onClick={handleLogMore} className="w-full" size="lg">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Log More
                  </Button>

                  <Button variant="outline" asChild className="w-full" size="lg">
                    <Link to="/teacher">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </BookContainer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherLogReading;
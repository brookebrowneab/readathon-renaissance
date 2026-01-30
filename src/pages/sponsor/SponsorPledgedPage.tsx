import { useState } from "react";
import { Link } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Mail, 
  Calendar,
  CreditCard,
  Users,
  X
} from "lucide-react";
import logoSvg from "@/assets/logo.svg";

// Mock data - in real app would come from session/API
const getMockData = () => ({
  sponsorName: "Uncle Bob",
  sponsorEmail: "uncle.bob@email.com",
  childFirstName: "Emma",
  amount: 75,
  readingGoal: 500,
  minutesRead: 335,
  endDate: "February 28, 2024",
});

const SponsorPledgedPage = () => {
  const [data] = useState(() => getMockData());

  return (
    <div className="min-h-screen bg-background-warm flex flex-col">
      {/* Header */}
      <header className="bg-card border-b py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img src={logoSvg} alt="Read-a-thon" className="h-10" />
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <BookContainer variant="default" className="p-8 text-center">
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>

              {/* Confirmation Message */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Your pledge is recorded!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Thank you, {data.sponsorName}
                </p>
              </div>

              {/* Pledge Details */}
              <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-center gap-6">
                  <ReadingGoalRing 
                    progress={data.minutesRead} 
                    goal={data.readingGoal} 
                    size={100}
                  />
                  <div className="text-left">
                    <p className="font-serif text-3xl text-brand-blue">
                      ${data.amount}
                    </p>
                    <p className="text-muted-foreground">
                      pledged for {data.childFirstName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Notification */}
              <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 rounded-lg">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <p className="text-foreground text-left">
                  We will email you at <strong>{data.sponsorEmail}</strong> when it is time to pay
                </p>
              </div>

              {/* End Date */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>The read-a-thon ends {data.endDate}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link 
                  to="/sponsor/thank-you" 
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <CreditCard className="h-4 w-4" />
                  Want to pay now instead?
                </Link>

                <Button asChild className="w-full" size="lg">
                  <Link to="/">
                    <Users className="h-5 w-5 mr-2" />
                    Sponsor Another Student
                  </Link>
                </Button>

                <Button variant="ghost" asChild className="w-full">
                  <Link to="/">Close</Link>
                </Button>
              </div>
            </div>
          </BookContainer>
        </div>
      </main>
    </div>
  );
};

export default SponsorPledgedPage;
import { useState } from "react";
import { Link } from "react-router-dom";
import { BookContainer } from "@/components/legacy";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Printer,
  Mail,
  Users,
  X
} from "lucide-react";
import { toast } from "sonner";

// Mock data - in real app would come from session/API
const getMockData = () => ({
  sponsorName: "Aunt Mary",
  sponsorEmail: "aunt.mary@email.com",
  childFirstName: "Emma",
  childLastInitial: "J",
  amount: 100,
  parentFirstName: "Sarah",
  schoolName: "Lincoln Elementary",
  schoolAddress: {
    street: "123 Education Lane",
    city: "Anytown",
    state: "CA",
    zip: "90210",
  },
});

const SponsorCheckInstructionsPage = () => {
  const [data] = useState(() => getMockData());

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInstructions = () => {
    // In real app, would trigger an API call to send email
    toast.success(`Instructions sent to ${data.sponsorEmail}`);
  };

  return (
    <div className="min-h-screen bg-background-warm flex flex-col">
      <PageHeader 
        rightContent={
          <Link to="/" className="text-muted-foreground hover:text-foreground print:hidden">
            <X className="h-6 w-6" />
          </Link>
        }
      />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <BookContainer variant="default" className="p-8">
            <div className="space-y-6">
              {/* Success Icon */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Thank you for your pledge!
                </h1>
                <p className="text-xl text-muted-foreground">
                  ${data.amount} for {data.childFirstName}
                </p>
              </div>

              {/* Check Instructions Card */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 bg-card space-y-5">
                <h2 className="font-serif text-xl text-brand-blue text-center">
                  How to pay by check
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Make check payable to:</p>
                    <p className="font-medium text-lg text-foreground">
                      {data.schoolName} PTA
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Write in the memo line:</p>
                    <p className="font-medium text-lg text-foreground font-mono bg-muted/50 px-3 py-2 rounded">
                      Read-a-thon - {data.childFirstName} {data.childLastInitial}.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mail to:</p>
                    <div className="font-medium text-foreground">
                      <p>{data.schoolName} Read-a-thon</p>
                      <p>{data.schoolAddress.street}</p>
                      <p>{data.schoolAddress.city}, {data.schoolAddress.state} {data.schoolAddress.zip}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Amount:</p>
                    <p className="font-serif text-3xl text-brand-blue">
                      ${data.amount}.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Info */}
              <p className="text-center text-muted-foreground">
                {data.parentFirstName} will be notified when your check arrives.
              </p>

              {/* Actions */}
              <div className="space-y-3 print:hidden">
                <Button onClick={handlePrint} className="w-full" size="lg">
                  <Printer className="h-5 w-5 mr-2" />
                  Print Instructions
                </Button>

                <Button 
                  variant="outline" 
                  onClick={handleEmailInstructions}
                  className="w-full"
                  size="lg"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Me These Instructions
                </Button>

                <div className="pt-2">
                  <Button variant="ghost" asChild className="w-full">
                    <Link to="/">
                      <Users className="h-4 w-4 mr-2" />
                      Sponsor Another Student
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </BookContainer>
        </div>
      </main>
    </div>
  );
};

export default SponsorCheckInstructionsPage;
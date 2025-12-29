import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { 
  PartyPopper, 
  Mail, 
  Facebook, 
  Twitter, 
  Users,
  ExternalLink,
  X
} from "lucide-react";
import Confetti from "@/components/ui/confetti";

// Mock data - in real app would come from session/API
const getMockData = () => ({
  sponsorName: "Grandma Betty",
  sponsorEmail: "grandma.betty@email.com",
  childFirstName: "Emma",
  amount: 50,
  readingGoal: 500,
  minutesRead: 335,
  updatedPledgeTotal: 175,
});

const SponsorThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const [data] = useState(() => getMockData());
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shareMessage = `I just pledged to support ${data.childFirstName}'s reading journey! Join me in supporting young readers.`;
  const shareUrl = window.location.origin;

  const handleShare = (platform: "facebook" | "twitter") => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="min-h-screen bg-background-warm flex flex-col">
      {showConfetti && <Confetti />}
      
      <PageHeader 
        rightContent={
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <X className="h-6 w-6" />
          </Link>
        }
      />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <BookContainer variant="default" className="p-8 text-center">
            <div className="space-y-6">
              {/* Celebration Icon */}
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <PartyPopper className="h-10 w-10 text-success" />
              </div>

              {/* Thank You Message */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Thank you, {data.sponsorName}!
                </h1>
                <p className="text-xl text-muted-foreground">
                  {data.childFirstName} will be so excited!
                </p>
              </div>

              {/* Pledge Amount */}
              <div className="py-4">
                <p className="font-handwritten text-4xl text-brand-blue">
                  ${data.amount} pledged
                </p>
                <p className="text-muted-foreground mt-1">
                  Your generosity makes a difference
                </p>
              </div>

              {/* Progress Ring */}
              <div className="flex flex-col items-center gap-4 py-4 bg-muted/30 rounded-xl">
                <ReadingGoalRing 
                  progress={data.minutesRead} 
                  goal={data.readingGoal} 
                  size={140}
                />
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">${data.updatedPledgeTotal}</span> total pledged for {data.childFirstName}
                </p>
              </div>

              {/* Receipt Info */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Receipt sent to {data.sponsorEmail}</span>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-4">
                {/* Share Section */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Share with friends</p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleShare("facebook")}
                      className="gap-2"
                    >
                      <Facebook className="h-5 w-5" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleShare("twitter")}
                      className="gap-2"
                    >
                      <Twitter className="h-5 w-5" />
                      Twitter
                    </Button>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
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
            </div>
          </BookContainer>
        </div>
      </main>
    </div>
  );
};

export default SponsorThankYouPage;
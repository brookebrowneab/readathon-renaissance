import { useState } from "react";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  DollarSign,
} from "lucide-react";

interface SponsorRequest {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  requestedAt: string;
  pastSponsorships: number;
  totalContributed: number;
  lastYear: string;
  status: "pending" | "approved" | "denied";
}

// Mock data - simulating pending requests
const mockRequests: SponsorRequest[] = [
  {
    id: "1",
    sponsorName: "Grandma Smith",
    sponsorEmail: "g***a@example.com",
    requestedAt: "2025-01-15",
    pastSponsorships: 3,
    totalContributed: 99.35,
    lastYear: "2024",
    status: "pending",
  },
  {
    id: "2",
    sponsorName: "Uncle Bob",
    sponsorEmail: "b***b@example.com",
    requestedAt: "2025-01-14",
    pastSponsorships: 1,
    totalContributed: 25,
    lastYear: "2023",
    status: "pending",
  },
];

const mockChild = {
  name: "Emma",
  grade: "3rd Grade",
};

const SponsorRequestsPage = () => {
  const [requests, setRequests] = useState<SponsorRequest[]>(mockRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "deny";
    request: SponsorRequest | null;
  }>({ open: false, type: "approve", request: null });

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  const handleApprove = async (request: SponsorRequest) => {
    setProcessingId(request.id);
    setConfirmDialog({ open: false, type: "approve", request: null });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "approved" as const } : r))
    );
    setProcessingId(null);

    toast.success(`${request.sponsorName} can now sponsor ${mockChild.name}!`, {
      description: "They'll receive an email with the sponsor link.",
    });
  };

  const handleDeny = async (request: SponsorRequest) => {
    setProcessingId(request.id);
    setConfirmDialog({ open: false, type: "deny", request: null });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "denied" as const } : r))
    );
    setProcessingId(null);

    toast.info("Request declined", {
      description: `${request.sponsorName} has been notified.`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground mb-2">
              Sponsor Requests
            </h1>
            <p className="text-xl text-muted-foreground">
              Review requests from people who want to sponsor {mockChild.name}
            </p>
          </div>

          {/* Privacy Notice */}
          <BookContainer variant="warm" className="p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Your child's privacy is protected
                </h3>
                <p className="text-lg text-muted-foreground">
                  Sponsors can only see {mockChild.name}'s information after you approve their request. 
                  You're always in control of who can sponsor your child.
                </p>
              </div>
            </div>
          </BookContainer>

          {/* Pending Requests */}
          <section className="mb-10">
            <h2 className="text-2xl font-medium text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-accent-gold" />
              Pending Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <BookContainer variant="default" className="p-8 text-center">
                <p className="text-xl text-muted-foreground">
                  No pending requests right now.
                </p>
              </BookContainer>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <BookContainer key={request.id} variant="default" className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* Sponsor Info */}
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-foreground">
                            {request.sponsorName}
                          </h3>
                          <p className="text-lg text-muted-foreground">
                            {request.sponsorEmail}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-base py-1 px-3">
                          <Heart className="h-4 w-4 mr-1" />
                          Returning Sponsor
                        </Badge>
                      </div>

                      {/* Past History */}
                      <div className="grid sm:grid-cols-3 gap-4 ml-16">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4" />
                            <span>Last sponsored</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">
                            {request.lastYear}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Heart className="h-4 w-4" />
                            <span>Times sponsored</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">
                            {request.pastSponsorships}
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span>Total given</span>
                          </div>
                          <p className="text-xl font-semibold text-foreground">
                            ${request.totalContributed.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 ml-16">
                        <Button
                          onClick={() =>
                            setConfirmDialog({ open: true, type: "approve", request })
                          }
                          disabled={processingId === request.id}
                          className="h-14 text-lg px-8"
                          size="lg"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setConfirmDialog({ open: true, type: "deny", request })
                          }
                          disabled={processingId === request.id}
                          className="h-14 text-lg px-8"
                          size="lg"
                        >
                          <XCircle className="h-5 w-5 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </BookContainer>
                ))}
              </div>
            )}
          </section>

          {/* Recently Processed */}
          {processedRequests.length > 0 && (
            <section>
              <h2 className="text-2xl font-medium text-foreground mb-4">
                Recently Processed
              </h2>
              <div className="space-y-4">
                {processedRequests.map((request) => (
                  <BookContainer key={request.id} variant="default" className="p-6 opacity-75">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-muted flex-shrink-0">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-foreground">
                            {request.sponsorName}
                          </h3>
                          <p className="text-lg text-muted-foreground">
                            {request.sponsorEmail}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={request.status === "approved" ? "success" : "destructive"}
                        className="text-base py-1 px-3"
                      >
                        {request.status === "approved" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Declined
                          </>
                        )}
                      </Badge>
                    </div>
                  </BookContainer>
                ))}
              </div>
            </section>
          )}

          {/* Footer Help */}
          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-lg text-center text-muted-foreground">
              Questions? Contact us at{" "}
              <a href="mailto:help@school.org" className="text-primary hover:underline">
                help@school.org
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              {confirmDialog.type === "approve"
                ? "Approve this sponsor?"
                : "Decline this request?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {confirmDialog.type === "approve" ? (
                <>
                  <strong>{confirmDialog.request?.sponsorName}</strong> will receive an email 
                  with a link to sponsor {mockChild.name} in this year's Read-a-thon.
                </>
              ) : (
                <>
                  <strong>{confirmDialog.request?.sponsorName}</strong> will be notified that 
                  their request was not approved. They won't see any information about {mockChild.name}.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmDialog.type === "approve"
                  ? handleApprove(confirmDialog.request!)
                  : handleDeny(confirmDialog.request!)
              }
              className={`h-12 text-lg ${
                confirmDialog.type === "deny"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }`}
            >
              {confirmDialog.type === "approve" ? "Approve" : "Decline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SponsorRequestsPage;

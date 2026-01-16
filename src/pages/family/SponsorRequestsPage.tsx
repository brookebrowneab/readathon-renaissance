import { useState } from "react";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
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
  Share2,
} from "lucide-react";

// Hand-drawn border style matching homepage/login
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface SponsorRequest {
  id: string;
  sponsorName: string;
  sponsorEmail: string;
  requestedAt: string;
  pastSponsorships: number;
  totalContributed: number;
  lastYear: string;
  status: "pending" | "approved" | "denied";
  allowSharing?: boolean; // Permission for this specific sponsor to share
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
    allowSharing: boolean;
  }>({ open: false, type: "approve", request: null, allowSharing: false });

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  const handleApprove = async (request: SponsorRequest, allowSharing: boolean) => {
    setProcessingId(request.id);
    setConfirmDialog({ open: false, type: "approve", request: null, allowSharing: false });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "approved" as const, allowSharing } : r))
    );
    setProcessingId(null);

    const sharingNote = allowSharing 
      ? " They can also invite others to sponsor."
      : "";
    toast.success(`${request.sponsorName} can now sponsor ${mockChild.name}!`, {
      description: `They'll receive an email with the sponsor link.${sharingNote}`,
    });
  };

  const handleDeny = async (request: SponsorRequest) => {
    setProcessingId(request.id);
    setConfirmDialog({ open: false, type: "deny", request: null, allowSharing: false });

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
          <div 
            className="bg-background p-6 mb-8"
            style={handDrawnBorder}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground mb-2">
                  Your child's privacy is protected
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sponsors can only see {mockChild.name}'s information after you approve their request. 
                  You're always in control of who can sponsor your child.
                </p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <section className="mb-10">
            <h2 className="font-serif text-2xl text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Pending Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div 
                className="bg-background p-8 text-center"
                style={handDrawnBorder}
              >
                <p className="text-sm text-muted-foreground">
                  No pending requests right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-background p-6"
                    style={handDrawnBorder}
                  >
                    <div className="flex flex-col gap-4">
                      {/* Sponsor Info */}
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl text-foreground">
                            {request.sponsorName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.sponsorEmail}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs py-1 px-2">
                          <Heart className="h-3 w-3 mr-1" />
                          Returning
                        </Badge>
                      </div>

                      {/* Past History - Inline stats like homepage */}
                      <div 
                        className="grid grid-cols-3 gap-4 ml-12 bg-background-warm p-4"
                        style={handDrawnBorder}
                      >
                        <div className="text-center">
                          <p className="font-serif text-xl text-foreground">
                            {request.lastYear}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last sponsored
                          </p>
                        </div>
                        <div 
                          className="text-center px-4"
                          style={{ borderLeft: 'solid 1px #41403E', borderRight: 'solid 1px #41403E' }}
                        >
                          <p className="font-serif text-xl text-foreground">
                            {request.pastSponsorships}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Times sponsored
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-serif text-xl text-foreground">
                            ${request.totalContributed.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Total given
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 ml-12">
                        <Button
                          onClick={() =>
                            setConfirmDialog({ open: true, type: "approve", request, allowSharing: false })
                          }
                          disabled={processingId === request.id}
                          className="px-6"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setConfirmDialog({ open: true, type: "deny", request, allowSharing: false })
                          }
                          disabled={processingId === request.id}
                          style={handDrawnBorder}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recently Processed */}
          {processedRequests.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl text-foreground mb-4">
                Recently Processed
              </h2>
              <div className="space-y-4">
                {processedRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-background p-6 opacity-75"
                    style={handDrawnBorder}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-muted flex-shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-foreground">
                            {request.sponsorName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {request.sponsorEmail}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={request.status === "approved" ? "success" : "destructive"}
                        className="text-xs py-1 px-2"
                      >
                        {request.status === "approved" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Declined
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer Help */}
          <div className="mt-10 pt-6" style={{ borderTop: 'solid 1px #41403E' }}>
            <p className="text-xs text-center text-muted-foreground">
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
            <AlertDialogDescription asChild>
              <div className="text-lg space-y-4">
                {confirmDialog.type === "approve" ? (
                  <>
                    <p>
                      <strong>{confirmDialog.request?.sponsorName}</strong> will receive an email 
                      with a link to sponsor {mockChild.name} in this year's Read-a-thon.
                    </p>
                    {/* Sharing permission checkbox */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 mt-4">
                      <Checkbox
                        id="allowSharing"
                        checked={confirmDialog.allowSharing}
                        onCheckedChange={(checked) =>
                          setConfirmDialog((prev) => ({ ...prev, allowSharing: checked as boolean }))
                        }
                      />
                      <div className="flex-1">
                        <Label htmlFor="allowSharing" className="text-sm font-medium cursor-pointer">
                          <Share2 className="h-4 w-4 inline mr-2" />
                          Allow this sponsor to invite others
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          When enabled, they can share the sponsor link with friends and family
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p>
                    <strong>{confirmDialog.request?.sponsorName}</strong> will be notified that 
                    their request was not approved. They won't see any information about {mockChild.name}.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmDialog.type === "approve"
                  ? handleApprove(confirmDialog.request!, confirmDialog.allowSharing)
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

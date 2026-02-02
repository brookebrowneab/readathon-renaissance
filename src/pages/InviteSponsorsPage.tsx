import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainNav, Footer, BottomTabBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Copy,
  MessageSquare,
  Printer,
  Check,
  Send,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  X,
  ExternalLink,
  UserCheck,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RELATIONSHIPS = [
  "Grandparent",
  "Aunt/Uncle",
  "Family Friend",
  "Neighbor",
  "Parent's Colleague",
  "Other",
];

// Mock data
const getMockChildData = (id: string) => ({
  id,
  firstName: "Emma",
  lastInitial: "J",
  publicCode: "emma-j-2024",
});

const mockInvitations = [
  {
    id: "1",
    name: "Grandma Betty",
    email: "grandma.betty@email.com",
    sentDate: "Jan 15",
    status: "pledged" as const,
    amount: 50,
  },
  {
    id: "2",
    name: "Uncle Bob",
    email: "bob@email.com",
    sentDate: "Jan 15",
    status: "opened" as const,
  },
  {
    id: "3",
    name: "Aunt Mary",
    email: "mary@email.com",
    sentDate: "Jan 16",
    status: "sent" as const,
  },
];

// Mock previous sponsors from past events
const mockPreviousSponsors = [
  {
    id: "prev-1",
    name: "Grandma Betty",
    email: "grandma.betty@email.com",
    lastPledgeAmount: 75,
    lastPledgeType: "flat" as const,
    lastEventYear: "2024",
    lastEventName: "Fall Read-a-thon 2024",
  },
  {
    id: "prev-2",
    name: "Uncle Mike",
    email: "mike@email.com",
    lastPledgeAmount: 0.25,
    lastPledgeType: "per-minute" as const,
    lastEventYear: "2024",
    lastEventName: "Fall Read-a-thon 2024",
  },
  {
    id: "prev-3",
    name: "Aunt Susan",
    email: "susan@email.com",
    lastPledgeAmount: 50,
    lastPledgeType: "flat" as const,
    lastEventYear: "2023",
    lastEventName: "Spring Read-a-thon 2023",
  },
  {
    id: "prev-4",
    name: "Neighbor Dave",
    email: "dave@email.com",
    lastPledgeAmount: 25,
    lastPledgeType: "flat" as const,
    lastEventYear: "2024",
    lastEventName: "Fall Read-a-thon 2024",
  },
];

type InvitationStatus = "sent" | "opened" | "pledged";

interface Invitation {
  id: string;
  name: string;
  email: string;
  sentDate: string;
  status: InvitationStatus;
  amount?: number;
}

interface PreviousSponsor {
  id: string;
  name: string;
  email: string;
  lastPledgeAmount: number;
  lastPledgeType: "flat" | "per-minute";
  lastEventYear: string;
  lastEventName: string;
}

// Hand-drawn border style matching homepage
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const InviteSponsorsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [childData] = useState(() => getMockChildData(id || "1"));
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations);
  const [previousSponsors] = useState<PreviousSponsor[]>(mockPreviousSponsors);
  const [invitedPreviousIds, setInvitedPreviousIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [publicLinkEnabled, setPublicLinkEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInvitingAll, setIsInvitingAll] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    relationship: "",
    message: "",
  });

  // Family sponsor link - uses parent's user ID
  const sponsorLink = user?.id 
    ? `${window.location.origin}/f/${user.id}` 
    : `${window.location.origin}/sponsor`;

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.email.trim() && formData.name.trim();

  // Previous sponsor invite handlers
  const handleInvitePreviousSponsor = async (sponsor: PreviousSponsor) => {
    setInvitedPreviousIds((prev) => new Set([...prev, sponsor.id]));
    
    // Add to invitations list
    const newInvitation: Invitation = {
      id: `returning-${Date.now()}`,
      name: sponsor.name,
      email: sponsor.email,
      sentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "sent",
    };
    
    setInvitations((prev) => [newInvitation, ...prev]);
    toast.success(`Returning sponsor invitation sent to ${sponsor.name}!`);
  };

  const handleInviteAllPrevious = async () => {
    const uninvited = previousSponsors.filter((s) => !invitedPreviousIds.has(s.id));
    if (uninvited.length === 0) return;
    
    setIsInvitingAll(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newIds = new Set(invitedPreviousIds);
    const newInvitations: Invitation[] = [];
    
    uninvited.forEach((sponsor) => {
      newIds.add(sponsor.id);
      newInvitations.push({
        id: `returning-${Date.now()}-${sponsor.id}`,
        name: sponsor.name,
        email: sponsor.email,
        sentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        status: "sent",
      });
    });
    
    setInvitedPreviousIds(newIds);
    setInvitations((prev) => [...newInvitations, ...prev]);
    setIsInvitingAll(false);
    toast.success(`Sent invitations to ${uninvited.length} returning sponsors!`);
  };

  const uninvitedPreviousSponsors = previousSponsors.filter(
    (s) => !invitedPreviousIds.has(s.id)
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sponsorLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (method: "sms" | "whatsapp" | "print") => {
    const message = `Help support our children's reading! Pledge to sponsor them in the Read-a-thon: ${sponsorLink}`;

    switch (method) {
      case "sms":
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "print":
        window.print();
        break;
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      sentDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "sent",
    };

    setInvitations((prev) => [newInvitation, ...prev]);
    setFormData({ email: "", name: "", relationship: "", message: "" });
    setIsSubmitting(false);
    toast.success(`Invitation sent to ${formData.name}!`);
  };

  const handleResend = async (invitation: Invitation) => {
    toast.success(`Invitation resent to ${invitation.name}`);
  };

  const handleCancel = async (invitation: Invitation) => {
    setInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
    toast.success(`Invitation to ${invitation.name} cancelled`);
  };

  const getStatusBadge = (invitation: Invitation) => {
    switch (invitation.status) {
      case "pledged":
        return (
          <Badge variant="success" className="gap-1">
            <Check className="h-3 w-3" />
            Pledged ${invitation.amount}
          </Badge>
        );
      case "opened":
        return <Badge variant="info">Opened</Badge>;
      case "sent":
        return <Badge variant="secondary">Sent</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-3xl">
          {/* Back Link */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
                Invite sponsors for your family
              </h1>
              <p className="text-muted-foreground mt-2">
                Send personalized invitations to family and friends — they can sponsor any of your children
              </p>
            </div>

            {/* Section 1: Previous Sponsors */}
            {previousSponsors.length > 0 && (
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif text-xl text-foreground">
                          Previous Sponsors
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          These people sponsored your children before
                        </p>
                      </div>
                    </div>
                    {uninvitedPreviousSponsors.length > 1 && (
                      <Button
                        onClick={handleInviteAllPrevious}
                        loading={isInvitingAll}
                        size="sm"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Invite All ({uninvitedPreviousSponsors.length})
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {previousSponsors.map((sponsor) => {
                      const isInvited = invitedPreviousIds.has(sponsor.id);
                      return (
                        <div
                          key={sponsor.id}
                          className={cn(
                            "p-4 bg-muted/30 rounded-lg transition-all",
                            isInvited && "opacity-60"
                          )}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="p-2 rounded-full bg-background shrink-0">
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{sponsor.name}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {sponsor.email}
                                </p>
                              </div>
                            </div>
                            
                            <div className="hidden sm:flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                                  {sponsor.lastPledgeType === "per-minute" 
                                    ? `${sponsor.lastPledgeAmount}/min`
                                    : `${sponsor.lastPledgeAmount} flat`
                                  }
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {sponsor.lastEventYear}
                                </div>
                              </div>
                            </div>
                            
                            <div className="shrink-0">
                              {isInvited ? (
                                <Badge variant="success" className="gap-1">
                                  <Check className="h-3 w-3" />
                                  Invited
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleInvitePreviousSponsor(sponsor)}
                                >
                                  <Send className="h-3.5 w-3.5 mr-1.5" />
                                  Invite
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* Mobile: Show pledge info below */}
                          <div className="sm:hidden mt-3 pt-3 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {sponsor.lastPledgeType === "per-minute" 
                                ? `${sponsor.lastPledgeAmount}/min`
                                : `$${sponsor.lastPledgeAmount} flat`
                              }
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {sponsor.lastEventName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {uninvitedPreviousSponsors.length === 0 && (
                    <div className="text-center py-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      All previous sponsors have been invited!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Email Invitation Form */}
            <div 
              className="bg-background p-6 shadow-md"
              style={handDrawnBorder}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-1">
                    Send a personal invitation
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We'll send a beautiful email on your behalf
                  </p>
                </div>

                <form onSubmit={handleSendInvitation} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField label="Recipient's Email" htmlFor="email" required>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </FormField>

                    <FormField
                      label="Recipient's Name"
                      htmlFor="name"
                      required
                      helperText="So we can personalize the message"
                    >
                      <Input
                        id="name"
                        placeholder="Grandma Betty"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Relationship" htmlFor="relationship">
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => updateField("relationship", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIPS.map((rel) => (
                          <SelectItem key={rel} value={rel}>
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Personal Message"
                    htmlFor="message"
                    helperText={`${formData.message.length}/500 characters`}
                  >
                    <Textarea
                      id="message"
                      placeholder="Add a personal note..."
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value.slice(0, 500))}
                      rows={3}
                    />
                  </FormField>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      loading={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/children/${id}/add-sponsor`}>
                        Record a pledge manually
                      </Link>
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Section 3: Quick Share Options */}
            <div 
              className="bg-background p-6 shadow-md"
              style={handDrawnBorder}
            >
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl text-foreground mb-1">
                    Or share your family's sponsor link directly
                  </h2>
                </div>

                {/* Link Display */}
                <div 
                  className="flex gap-2 p-3 bg-muted/30"
                  style={{
                    borderRadius: '8px',
                  }}
                >
                  <div className="flex-1 text-sm text-muted-foreground truncate font-mono">
                    {sponsorLink}
                  </div>
                  <Button
                    variant={copied ? "secondary" : "ghost"}
                    size="sm"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>

                {/* Share Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-4 gap-2"
                    onClick={() => handleShare("sms")}
                    style={handDrawnBorder}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm">Text</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-4 gap-2"
                    onClick={() => handleShare("whatsapp")}
                    style={handDrawnBorder}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-sm">WhatsApp</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-4 gap-2"
                    onClick={() => handleShare("print")}
                    style={handDrawnBorder}
                  >
                    <Printer className="h-5 w-5" />
                    <span className="text-sm">Print</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Section 4: Sent Invitations */}
            {invitations.length > 0 && (
              <div 
                className="bg-background p-6 shadow-md"
                style={handDrawnBorder}
              >
                <div className="space-y-4">
                  <h2 className="font-serif text-xl text-foreground">
                    Invitations you've sent
                  </h2>

                  <div className="space-y-3">
                    {invitations.map((invitation) => (
                      <div 
                        key={invitation.id}
                        className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{invitation.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {invitation.email} • {invitation.sentDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getStatusBadge(invitation)}
                          {invitation.status !== "pledged" && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResend(invitation)}
                                className="h-8 w-8 p-0"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              {invitation.status === "sent" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCancel(invitation)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Public Link Toggle */}
            <div 
              className="bg-background p-6 shadow-md"
              style={handDrawnBorder}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="font-serif text-xl text-foreground">
                      Public sponsor link
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Allow anyone with the link to sponsor your children
                    </p>
                  </div>
                  <Switch
                    checked={publicLinkEnabled}
                    onCheckedChange={setPublicLinkEnabled}
                  />
                </div>

                {publicLinkEnabled && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">
                        Anyone with this link can view your children's reading
                        progress and make a pledge. Only share with people you trust.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-muted/30 rounded-lg text-sm truncate font-mono">
                        {sponsorLink}
                      </div>
                      <Button variant="outline" onClick={handleCopyLink} className="shrink-0">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setPublicLinkEnabled(false)}
                    >
                      Disable Public Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for Bottom Tab Bar */}
        <div className="h-20 md:hidden" />
      </main>

      <Footer />
      <BottomTabBar role="parent" />
    </div>
  );
};

export default InviteSponsorsPage;

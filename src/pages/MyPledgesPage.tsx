import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useParentPledges, ParentPledge } from "@/hooks/useParentPledges";
import { usePledges } from "@/hooks/usePledges";
import { useChildren } from "@/hooks/useChildren";
import { useEventStatus } from "@/hooks/useEventStatus";
import { useUserPayments } from "@/hooks/usePayments";
import { DeleteConfirm } from "@/components/ui/confirm-dialog";
import { EditPledgeDialog, EditablePledge } from "@/components/pledge/EditPledgeDialog";
import {
  ArrowLeft,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Trash2,
  Pencil,
  ExternalLink,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const MyPledgesPage = () => {
  const { pledges, pledgesByChild, totalPledges, totalSponsors, isLoading, error, refetch } = useParentPledges();
  const { deletePledge, updatePledge } = usePledges();
  const { children } = useChildren();
  const { isPaymentsDue } = useEventStatus();
  const { payments: userPayments, isLoading: isLoadingPayments } = useUserPayments();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pledgeToDelete, setPledgeToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [pledgeToEdit, setPledgeToEdit] = useState<EditablePledge | null>(null);

  const paidCount = pledges.filter(p => p.is_paid).length;
  const pendingCount = pledges.filter(p => !p.is_paid).length;

  const handleDeleteClick = (pledgeId: string) => {
    setPledgeToDelete(pledgeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pledgeToDelete) {
      deletePledge.mutate(pledgeToDelete);
    }
    setDeleteDialogOpen(false);
    setPledgeToDelete(null);
  };

  const handleEditClick = (pledge: ParentPledge) => {
    setPledgeToEdit({
      id: pledge.id,
      student_name: pledge.student_name,
      pledge_type: pledge.pledge_type,
      amount: pledge.amount,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (id: string, pledgeType: string, amount: number) => {
    updatePledge.mutate(
      { id, pledge_type: pledgeType, amount },
      {
        onSuccess: () => {
          refetch();
          setEditDialogOpen(false);
          setPledgeToEdit(null);
        },
      }
    );
  };

  // Determine if "Pay Now" should be available
  const canPayNow = (pledge: ParentPledge) => {
    if (pledge.is_paid) return false;
    // Flat pledges can always be paid
    if (pledge.pledge_type === "flat") return true;
    // Per-minute pledges can only be paid after event closes
    if (pledge.pledge_type === "per_minute") return isPaymentsDue;
    return false;
  };

  const getStatusBadge = (pledge: ParentPledge) => {
    if (pledge.is_paid) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      );
    }
    if (pledge.payment_status === "pending") {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    }
    return <Badge variant="secondary">{pledge.payment_status}</Badge>;
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "check":
        return <FileText className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Calculate estimated total for per-minute pledges
  const getEstimatedTotal = (pledge: ParentPledge) => {
    if (pledge.pledge_type === "flat") {
      return pledge.amount;
    }
    // Find the child to get their total minutes
    const child = children.find(c => c.id === pledge.child_id);
    const totalMinutes = child?.total_minutes || 0;
    return pledge.amount * totalMinutes;
  };

  // Get payments for a specific pledge
  const getPaymentsForPledge = (pledgeId: string) => {
    return userPayments.filter(p => p.pledge_id === pledgeId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-2xl">
          {/* Back Link */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              My Pledges
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              View and manage pledges for your children
            </p>
          </div>

          {/* Summary Stats */}
          <div 
            className="grid grid-cols-3 gap-4 p-4 bg-background mb-6"
            style={handDrawnBorder}
          >
            <div className="text-center">
              <p className="text-2xl font-serif text-primary">${totalPledges.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Total Pledged</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-serif text-success">{paidCount}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-serif text-muted-foreground">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-background" style={handDrawnBorder}>
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div 
              className="p-6 bg-destructive/10 text-center"
              style={handDrawnBorder}
            >
              <p className="text-destructive">Failed to load pledges</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && pledges.length === 0 && (
            <div 
              className="p-8 bg-background text-center"
              style={handDrawnBorder}
            >
              <DollarSign className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No pledges yet</h3>
              {children.length > 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Invite sponsors to support your children's reading journey.
                  </p>
                  <Button asChild>
                    <Link to="/invite">Invite Sponsors</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Sponsor a student or invite others to sponsor. Sponsorship requests will be sent to parents for approval.
                  </p>
                  <Button asChild>
                    <Link to="/sponsor">Sponsor a Student</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Pledges List by Child */}
          {!isLoading && !error && pledgesByChild.length > 0 && (
            <div className="space-y-6">
              {pledgesByChild.map((child) => (
                <div key={child.childId}>
                  <h2 className="font-serif text-lg text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {child.childName}
                    <Badge variant="outline" className="ml-auto">
                      {child.pledges.length} pledge{child.pledges.length !== 1 ? "s" : ""}
                    </Badge>
                  </h2>
                  
                  {child.pledges.length === 0 ? (
                    <div 
                      className="p-4 bg-background text-center text-muted-foreground"
                      style={handDrawnBorder}
                    >
                      No pledges for {child.childName} yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {child.pledges.map((pledge) => (
                        <div
                          key={pledge.id}
                          className="p-4 bg-background"
                          style={handDrawnBorder}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge(pledge)}
                                <span className="text-xs text-muted-foreground">
                                  {pledge.pledge_type === "flat" ? "Flat amount" : "Per minute"}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(pledge.created_at), "MMM d, yyyy")}
                                </span>
                                {pledge.expected_payment_method && (
                                  <span className="flex items-center gap-1">
                                    {getPaymentMethodIcon(pledge.expected_payment_method)}
                                    {pledge.expected_payment_method === "card" ? "Card" : "Check"}
                                  </span>
                                )}
                              </div>

                              {/* Show estimated total for per-minute pledges */}
                              {pledge.pledge_type === "per_minute" && !pledge.is_paid && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  {isPaymentsDue 
                                    ? `Final amount: $${getEstimatedTotal(pledge).toFixed(2)}`
                                    : "Final amount calculated when read-a-thon ends"
                                  }
                                </p>
                              )}
                            </div>

                            <div className="text-right flex items-center gap-2">
                              <div>
                                <p className="font-serif text-xl text-primary">
                                  ${pledge.amount.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {pledge.pledge_type === "flat" ? "flat" : "/min"}
                                </p>
                              </div>
                              {!pledge.is_paid && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                    onClick={() => handleEditClick(pledge)}
                                    title="Edit pledge"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleDeleteClick(pledge.id)}
                                    title="Delete pledge"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Payment History Section */}
                          {getPaymentsForPledge(pledge.id).length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                <Receipt className="h-3 w-3" />
                                Payment History
                              </h4>
                              <div className="space-y-2">
                                {getPaymentsForPledge(pledge.id).map((payment) => (
                                  <div 
                                    key={payment.id}
                                    className="flex items-center justify-between text-sm bg-muted/30 rounded px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                                      <span className="text-muted-foreground">
                                        {format(new Date(payment.created_at), "MMM d, yyyy")}
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {payment.pledge_type === 'per_minute' ? 'Per Min' : 'One-Time'}
                                      </Badge>
                                    </div>
                                    {payment.square_receipt_url && (
                                      <a
                                        href={payment.square_receipt_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        Receipt
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pay Now section - only for unpaid pledges */}
                          {canPayNow(pledge) && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <Button 
                                size="sm" 
                                className="w-full"
                                asChild
                              >
                                <Link to={`/sponsor/pay?pledge=${pledge.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Pay Now
                                </Link>
                              </Button>
                            </div>
                          )}

                          {/* Show pending message for per-minute pledges during active event */}
                          {!pledge.is_paid && pledge.pledge_type === "per_minute" && !isPaymentsDue && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-center text-xs text-muted-foreground">
                                Payment available after read-a-thon ends
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName="this pledge"
      />

      {/* Edit Pledge Dialog */}
      <EditPledgeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        pledge={pledgeToEdit}
        onSave={handleSaveEdit}
        isLoading={updatePledge.isPending}
      />
    </div>
  );
};

export default MyPledgesPage;

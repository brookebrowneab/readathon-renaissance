import { useState } from "react";
import { Link } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useParentPledges, ParentPledge } from "@/hooks/useParentPledges";
import { usePledges } from "@/hooks/usePledges";
import { useChildren } from "@/hooks/useChildren";
import { DeleteConfirm, ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditPledgeDialog, EditablePledge } from "@/components/pledge/EditPledgeDialog";
import { sendPledgeNotification } from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";
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
  CircleDollarSign,
  Undo2,
  Pencil,
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pledgeToDelete, setPledgeToDelete] = useState<string | null>(null);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);
  const [pledgeToMarkPaid, setPledgeToMarkPaid] = useState<ParentPledge | null>(null);
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

  const handleMarkPaidClick = (pledge: ParentPledge) => {
    setPledgeToMarkPaid(pledge);
    setMarkPaidDialogOpen(true);
  };

  const handleConfirmMarkPaid = async () => {
    if (pledgeToMarkPaid) {
      updatePledge.mutate(
        { id: pledgeToMarkPaid.id, is_paid: true, payment_status: "paid" },
        {
          onSuccess: async () => {
            // Send email notification to sponsor if we have their info
            try {
              if (pledgeToMarkPaid.sponsor_id) {
                const { data: sponsorData } = await supabase
                  .from("sponsors")
                  .select("*")
                  .eq("id", pledgeToMarkPaid.sponsor_id)
                  .maybeSingle();
                
                // Get child's total minutes for per-minute calculation
                const child = children.find(c => c.id === pledgeToMarkPaid.child_id);
                const totalMinutes = child?.total_minutes || 0;
                
                if (sponsorData?.email) {
                  await sendPledgeNotification({
                    type: "payment_complete",
                    pledgeId: pledgeToMarkPaid.id,
                    recipientEmail: sponsorData.email,
                    recipientName: sponsorData.name,
                    studentName: pledgeToMarkPaid.student_name,
                    amount: pledgeToMarkPaid.amount,
                    pledgeType: pledgeToMarkPaid.pledge_type as "flat" | "per_minute",
                    totalMinutes,
                  });
                }
              }
            } catch (notifyError) {
              console.error("Failed to send payment notification:", notifyError);
            }
            
            refetch();
            setMarkPaidDialogOpen(false);
            setPledgeToMarkPaid(null);
          },
        }
      );
    }
  };

  const handleMarkUnpaid = (pledgeId: string) => {
    updatePledge.mutate(
      { id: pledgeId, is_paid: false, payment_status: "pending" },
      { onSuccess: () => refetch() }
    );
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
              <p className="text-muted-foreground mb-6">
                Invite sponsors to support your children's reading journey.
              </p>
              <Button asChild>
                <Link to="/invite">Invite Sponsors</Link>
              </Button>
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
                            </div>
                          </div>

                          {pledge.is_paid ? (
                            <div className="mt-4 pt-4 border-t border-border flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleMarkUnpaid(pledge.id)}
                                disabled={updatePledge.isPending}
                              >
                                <Undo2 className="h-4 w-4 mr-2" />
                                Mark as Unpaid
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-4 pt-4 border-t border-border flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleMarkPaidClick(pledge)}
                                disabled={updatePledge.isPending}
                              >
                                <CircleDollarSign className="h-4 w-4 mr-2" />
                                Mark as Paid
                              </Button>
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

      {/* Mark as Paid Confirmation Dialog */}
      <ConfirmDialog
        open={markPaidDialogOpen}
        onOpenChange={setMarkPaidDialogOpen}
        onConfirm={handleConfirmMarkPaid}
        title="Mark Pledge as Paid"
        description={pledgeToMarkPaid ? `Are you sure you want to mark the $${pledgeToMarkPaid.amount.toFixed(2)} pledge for ${pledgeToMarkPaid.student_name} as paid?` : ""}
        confirmLabel="Mark as Paid"
        variant="default"
        icon={<CircleDollarSign className="h-5 w-5 text-success" />}
        loading={updatePledge.isPending}
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

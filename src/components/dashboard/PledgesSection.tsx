import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  DollarSign,
  UserPlus,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ParentPledge, PledgesByChild } from "@/hooks/useParentPledges";
import { DeleteConfirm } from "@/components/ui/confirm-dialog";
import { useState } from "react";

// Hand-drawn border style
const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

interface PledgesSectionProps {
  pledgesByChild: PledgesByChild[];
  totalPledges: number;
  isLoading: boolean;
  onDeletePledge?: (pledgeId: string) => void;
}

export const PledgesSection = ({
  pledgesByChild,
  totalPledges,
  isLoading,
  onDeletePledge,
}: PledgesSectionProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pledgeToDelete, setPledgeToDelete] = useState<string | null>(null);

  const handleDeleteClick = (pledgeId: string) => {
    setPledgeToDelete(pledgeId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pledgeToDelete && onDeletePledge) {
      onDeletePledge(pledgeToDelete);
    }
    setDeleteDialogOpen(false);
    setPledgeToDelete(null);
  };

  if (isLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground">
            Pledges & Sponsors
          </h2>
        </div>
        <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>
      </section>
    );
  }

  const allPledges = pledgesByChild.flatMap((c) => c.pledges);
  const recentPledges = allPledges.slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl md:text-2xl font-normal text-foreground">
          Pledges & Sponsors
        </h2>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to="/my-pledges">
            View all pledges
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="bg-background p-6 shadow-md mb-4" style={handDrawnBorder}>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
              ${totalPledges.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">
              Total Pledged
            </p>
          </div>
          {pledgesByChild.slice(0, 2).map((child) => (
            <div
              key={child.childId}
              className="text-center"
              style={{
                borderLeft: 'solid 1px #41403E',
              }}
            >
              <p className="font-serif text-2xl md:text-3xl text-foreground tracking-tight">
                ${child.totalAmount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                {child.childName} ({child.sponsorCount})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Pledges List */}
      {recentPledges.length > 0 ? (
        <div className="bg-background p-6 shadow-md" style={handDrawnBorder}>
          <h3 className="font-serif text-lg text-foreground mb-4">Recent Pledges</h3>
          <div className="space-y-3">
            {recentPledges.map((pledge) => (
              <PledgeItem
                key={pledge.id}
                pledge={pledge}
                onDelete={onDeletePledge ? () => handleDeleteClick(pledge.id) : undefined}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-background p-6 shadow-md text-center" style={handDrawnBorder}>
          <DollarSign className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No pledges yet</p>
          <Button asChild>
            <Link to="/invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Sponsors
            </Link>
          </Button>
        </div>
      )}

      {/* Invite More Sponsors Button */}
      {recentPledges.length > 0 && (
        <div className="mt-4">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
            style={handDrawnBorder}
          >
            <Link to="/invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite More Sponsors
            </Link>
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName="this pledge"
      />
    </section>
  );
};

interface PledgeItemProps {
  pledge: ParentPledge;
  onDelete?: () => void;
}

const PledgeItem = ({ pledge, onDelete }: PledgeItemProps) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-3">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <DollarSign className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground text-sm md:text-base truncate">
            {pledge.student_name}
          </p>
          {pledge.is_paid ? (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">
          {pledge.pledge_type === "flat" ? "Flat pledge" : "Per-minute"} •{" "}
          {format(new Date(pledge.created_at), "MMM d, yyyy")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-serif text-lg text-primary">
          ${pledge.amount.toFixed(2)}
          {pledge.pledge_type === "per_minute" && <span className="text-xs">/min</span>}
        </span>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

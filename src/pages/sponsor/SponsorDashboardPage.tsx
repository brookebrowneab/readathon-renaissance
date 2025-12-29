import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Edit,
  LogOut,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockSponsor = {
  name: "Grandma Smith",
  email: "grandma@example.com",
};

interface Pledge {
  id: string;
  childFirstName: string;
  childLastInitial: string;
  grade: string;
  school: string;
  minutesRead: number;
  goalMinutes: number;
  pledgeType: "fixed" | "per-minute";
  pledgeAmount: number;
  currentTotal: number;
  status: "pending" | "paid" | "event-active";
  eventEnded: boolean;
}

const mockPledges: Pledge[] = [
  {
    id: "1",
    childFirstName: "Emma",
    childLastInitial: "J",
    grade: "3rd",
    school: "Lincoln Elementary",
    minutesRead: 347,
    goalMinutes: 500,
    pledgeType: "per-minute",
    pledgeAmount: 0.05,
    currentTotal: 17.35,
    status: "event-active",
    eventEnded: false,
  },
  {
    id: "2",
    childFirstName: "Noah",
    childLastInitial: "B",
    grade: "1st",
    school: "Lincoln Elementary",
    minutesRead: 500,
    goalMinutes: 500,
    pledgeType: "fixed",
    pledgeAmount: 25.0,
    currentTotal: 25.0,
    status: "pending",
    eventEnded: true,
  },
  {
    id: "3",
    childFirstName: "Sophia",
    childLastInitial: "M",
    grade: "5th",
    school: "Washington Elementary",
    minutesRead: 420,
    goalMinutes: 500,
    pledgeType: "per-minute",
    pledgeAmount: 0.10,
    currentTotal: 42.0,
    status: "paid",
    eventEnded: true,
  },
];

const SponsorDashboardPage = () => {
  const navigate = useNavigate();

  const totalPledged = mockPledges.reduce((sum, p) => sum + p.currentTotal, 0);
  const totalPaid = mockPledges
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.currentTotal, 0);
  const totalOutstanding = totalPledged - totalPaid;

  const getStatusBadge = (pledge: Pledge) => {
    if (pledge.status === "paid") {
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>
      );
    }
    if (pledge.eventEnded) {
      return (
        <Badge variant="warning" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Payment Due
        </Badge>
      );
    }
    return (
      <Badge variant="info" className="gap-1">
        <Clock className="h-3 w-3" />
        Pay When Event Ends
      </Badge>
    );
  };

  const handlePayNow = (pledgeIds: string[]) => {
    navigate("/sponsor/pay", { state: { pledgeIds } });
  };

  const unpaidPledges = mockPledges.filter((p) => p.status !== "paid");

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                Your Pledges
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {mockSponsor.name}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>

          {/* Pay All Outstanding Button */}
          {totalOutstanding > 0 && (
            <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4 flex items-center justify-between mb-6">
              <div>
                <p className="font-medium text-foreground">
                  You have ${totalOutstanding.toFixed(2)} in outstanding pledges
                </p>
                <p className="text-sm text-muted-foreground">
                  {unpaidPledges.length} pledge{unpaidPledges.length !== 1 ? "s" : ""} ready for payment
                </p>
              </div>
              <Button
                onClick={() => handlePayNow(unpaidPledges.map((p) => p.id))}
                className="bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay All Now
              </Button>
            </div>
          )}

          {/* Pledges List */}
          <div className="space-y-4">
            {mockPledges.map((pledge) => (
              <BookContainer
                key={pledge.id}
                variant="default"
                className={cn(
                  "p-6",
                  pledge.eventEnded && pledge.status !== "paid" && "ring-2 ring-accent-gold/50"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Progress Ring */}
                  <div className="flex-shrink-0">
                    <ReadingGoalRing
                      progress={pledge.minutesRead}
                      goal={pledge.goalMinutes}
                      size={80}
                    />
                  </div>

                  {/* Child Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-lg text-foreground">
                          {pledge.childFirstName} {pledge.childLastInitial}.
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {pledge.grade} Grade at {pledge.school}
                        </p>
                      </div>
                      {getStatusBadge(pledge)}
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Your pledge</p>
                        <p className="font-medium text-foreground">
                          {pledge.pledgeType === "per-minute"
                            ? `$${pledge.pledgeAmount.toFixed(2)}/minute`
                            : `$${pledge.pledgeAmount.toFixed(2)} fixed`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current total</p>
                        <p className="font-medium text-foreground text-lg">
                          ${pledge.currentTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-muted-foreground">
                      {pledge.minutesRead} / {pledge.goalMinutes} minutes (
                      {Math.round((pledge.minutesRead / pledge.goalMinutes) * 100)}%)
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2">
                    {pledge.status !== "paid" && (
                      <Button
                        onClick={() => handlePayNow([pledge.id])}
                        variant={pledge.eventEnded ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          pledge.eventEnded && "bg-accent-gold hover:bg-accent-gold/90 text-accent-gold-foreground"
                        )}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pay Now
                      </Button>
                    )}
                    {pledge.status !== "paid" && !pledge.eventEnded && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                    )}
                    {pledge.status === "paid" && (
                      <span className="text-sm text-success font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Thank you!
                      </span>
                    )}
                  </div>
                </div>
              </BookContainer>
            ))}
          </div>

          {/* Summary */}
          <BookContainer variant="default" className="mt-8 p-6">
            <div className="flex flex-wrap gap-8 justify-center text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Pledged</p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalPledged.toFixed(2)}
                </p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-success">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-accent-gold">
                  ${totalOutstanding.toFixed(2)}
                </p>
              </div>
            </div>
          </BookContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorDashboardPage;

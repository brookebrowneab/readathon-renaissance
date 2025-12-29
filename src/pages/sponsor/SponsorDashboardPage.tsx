import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainNav, Footer } from "@/components/layout";
import { BookContainer, ReadingGoalRing } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  CreditCard,
  LogOut,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockSponsor = {
  name: "Grandma Smith",
  email: "grandma@example.com",
};

const currentYear = "2025";

interface SponsorableChild {
  id: string;
  firstName: string;
  lastInitial: string;
  grade: string;
  school: string;
  eventName: string;
  lastYearPledge: number;
  lastYearPledgeType: "fixed" | "per-minute";
  lastYearMinutesRead: number;
  lastYearTotal: number;
  sponsoredThisYear: boolean;
  currentMinutesRead?: number;
  currentGoal?: number;
}

interface PledgeHistory {
  id: string;
  year: string;
  eventName: string;
  childName: string;
  pledgeType: "fixed" | "per-minute";
  pledgeAmount: number;
  minutesRead: number;
  totalAmount: number;
  status: "paid" | "pending" | "active";
}

// Children available to sponsor again
const mockSponsorableChildren: SponsorableChild[] = [
  {
    id: "1",
    firstName: "Emma",
    lastInitial: "J",
    grade: "4th",
    school: "Lincoln Elementary",
    eventName: "Spring Read-a-thon 2025",
    lastYearPledge: 50,
    lastYearPledgeType: "fixed",
    lastYearMinutesRead: 487,
    lastYearTotal: 50,
    sponsoredThisYear: false,
    currentMinutesRead: 125,
    currentGoal: 500,
  },
  {
    id: "2",
    firstName: "Noah",
    lastInitial: "B",
    grade: "2nd",
    school: "Lincoln Elementary",
    eventName: "Spring Read-a-thon 2025",
    lastYearPledge: 0.05,
    lastYearPledgeType: "per-minute",
    lastYearMinutesRead: 520,
    lastYearTotal: 26,
    sponsoredThisYear: false,
    currentMinutesRead: 89,
    currentGoal: 500,
  },
];

// Full pledge history
const mockPledgeHistory: PledgeHistory[] = [
  {
    id: "h1",
    year: "2024",
    eventName: "Fall Read-a-thon 2024",
    childName: "Emma J.",
    pledgeType: "fixed",
    pledgeAmount: 50,
    minutesRead: 487,
    totalAmount: 50,
    status: "paid",
  },
  {
    id: "h2",
    year: "2024",
    eventName: "Fall Read-a-thon 2024",
    childName: "Noah B.",
    pledgeType: "per-minute",
    pledgeAmount: 0.05,
    minutesRead: 520,
    totalAmount: 26,
    status: "paid",
  },
  {
    id: "h3",
    year: "2023",
    eventName: "Spring Read-a-thon 2023",
    childName: "Emma J.",
    pledgeType: "fixed",
    pledgeAmount: 25,
    minutesRead: 350,
    totalAmount: 25,
    status: "paid",
  },
  {
    id: "h4",
    year: "2023",
    eventName: "Fall Read-a-thon 2023",
    childName: "Emma J.",
    pledgeType: "per-minute",
    pledgeAmount: 0.10,
    minutesRead: 425,
    totalAmount: 42.50,
    status: "paid",
  },
];

// Group history by year
const historyByYear = mockPledgeHistory.reduce((acc, pledge) => {
  if (!acc[pledge.year]) acc[pledge.year] = [];
  acc[pledge.year].push(pledge);
  return acc;
}, {} as Record<string, PledgeHistory[]>);

const SponsorDashboardPage = () => {
  const navigate = useNavigate();

  const unsponsoredChildren = mockSponsorableChildren.filter(c => !c.sponsoredThisYear);
  const totalHistoricalPledges = mockPledgeHistory.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalChildrenSponsored = new Set(mockPledgeHistory.map(p => p.childName)).size;

  const handleSponsorAgain = (child: SponsorableChild) => {
    // Navigate to returning sponsor page with pre-filled data
    navigate(`/returning/${child.id}`);
  };

  const getStatusBadge = (status: PledgeHistory["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "active":
        return (
          <Badge variant="info" className="gap-1">
            <Clock className="h-3 w-3" />
            Active
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <main className="flex-1 bg-background-warm">
        <div className="container py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground">
                  Welcome back, {mockSponsor.name.split(" ")[0]}!
                </h1>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Returning Sponsor
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Thank you for supporting young readers
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Given</p>
                  <p className="text-2xl font-bold">${totalHistoricalPledges.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/10">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Supported</p>
                  <p className="text-2xl font-bold">{totalChildrenSponsored}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-accent-gold/10">
                  <Calendar className="h-5 w-5 text-accent-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Years Sponsoring</p>
                  <p className="text-2xl font-bold">{Object.keys(historyByYear).length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sponsor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sponsor" className="gap-2">
                <Heart className="h-4 w-4" />
                Sponsor Again
                {unsponsoredChildren.length > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {unsponsoredChildren.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Your History
              </TabsTrigger>
            </TabsList>

            {/* Sponsor Again Tab */}
            <TabsContent value="sponsor" className="space-y-4">
              {unsponsoredChildren.length === 0 ? (
                <BookContainer variant="warm" className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h2 className="text-xl font-medium text-foreground mb-2">
                    All caught up!
                  </h2>
                  <p className="text-muted-foreground">
                    You've sponsored all available children for this year.
                  </p>
                </BookContainer>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-foreground">
                      Sponsor for {currentYear}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {unsponsoredChildren.length} child{unsponsoredChildren.length !== 1 ? "ren" : ""} waiting
                    </p>
                  </div>

                  {unsponsoredChildren.map((child) => (
                    <BookContainer
                      key={child.id}
                      variant="default"
                      className="p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Progress Ring */}
                        {child.currentMinutesRead !== undefined && child.currentGoal && (
                          <div className="flex-shrink-0 mx-auto md:mx-0">
                            <ReadingGoalRing
                              progress={child.currentMinutesRead}
                              goal={child.currentGoal}
                              size={100}
                            />
                          </div>
                        )}

                        {/* Child Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-xl text-foreground">
                                  {child.firstName} {child.lastInitial}.
                                </h3>
                                <Badge variant="outline" className="text-warning border-warning">
                                  Not yet sponsored for {currentYear}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="h-4 w-4" />
                                <span>{child.grade} Grade at {child.school}</span>
                              </div>
                            </div>
                          </div>

                          {/* Last Year Stats */}
                          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">Last year:</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Your pledge</p>
                                <p className="font-medium text-foreground">
                                  {child.lastYearPledgeType === "per-minute"
                                    ? `$${child.lastYearPledge}/min`
                                    : `$${child.lastYearPledge}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">{child.firstName} read</p>
                                <p className="font-medium text-foreground">
                                  {child.lastYearMinutesRead} min
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total</p>
                                <p className="font-medium text-foreground">
                                  ${child.lastYearTotal.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sponsor Button */}
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => handleSponsorAgain(child)}
                            size="lg"
                            className="w-full md:w-auto gap-2"
                          >
                            <Heart className="h-5 w-5" />
                            Sponsor Again
                          </Button>
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Pre-fills ${child.lastYearPledgeType === "fixed" 
                              ? child.lastYearPledge 
                              : child.lastYearTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </BookContainer>
                  ))}
                </>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              {Object.entries(historyByYear)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([year, pledges]) => {
                  const yearTotal = pledges.reduce((sum, p) => sum + p.totalAmount, 0);
                  return (
                    <BookContainer key={year} variant="default" className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-foreground">{year}</h3>
                        <Badge variant="secondary">
                          Total: ${yearTotal.toFixed(2)}
                        </Badge>
                      </div>

                      <div className="overflow-x-auto -mx-6 px-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Event</TableHead>
                              <TableHead>Child</TableHead>
                              <TableHead>Pledge</TableHead>
                              <TableHead>Minutes</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pledges.map((pledge) => (
                              <TableRow key={pledge.id}>
                                <TableCell className="font-medium">
                                  {pledge.eventName}
                                </TableCell>
                                <TableCell>{pledge.childName}</TableCell>
                                <TableCell>
                                  {pledge.pledgeType === "per-minute"
                                    ? `$${pledge.pledgeAmount}/min`
                                    : `$${pledge.pledgeAmount} flat`}
                                </TableCell>
                                <TableCell>{pledge.minutesRead}</TableCell>
                                <TableCell className="font-medium">
                                  ${pledge.totalAmount.toFixed(2)}
                                </TableCell>
                                <TableCell>{getStatusBadge(pledge.status)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </BookContainer>
                  );
                })}

              {/* Lifetime Summary */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">
                      Your Impact
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        ${totalHistoricalPledges.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Contributed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {mockPledgeHistory.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Pledges Made</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {mockPledgeHistory.reduce((sum, p) => sum + p.minutesRead, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Minutes Supported</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SponsorDashboardPage;

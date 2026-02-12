import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Plus, UserPlus, DollarSign, Heart, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SponsorTab } from "@/components/layout/SponsorTab";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface DashboardMobileBarProps {
  isSponsorOnly: boolean;
  pendingSponsorRequests?: number;
}

export function DashboardMobileBar({ isSponsorOnly, pendingSponsorRequests = 0 }: DashboardMobileBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-stretch justify-between">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="m-2"
        aria-label="Quick Actions"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sponsor Banner (right side, drops from header) */}
      <SponsorTab variant="banner" />

      {/* Quick Actions Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl">Quick Actions</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-6">
            {isSponsorOnly ? (
              <SponsorQuickActions onClose={() => setOpen(false)} />
            ) : (
              <ParentQuickActions
                onClose={() => setOpen(false)}
                pendingSponsorRequests={pendingSponsorRequests}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SponsorQuickActions({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" asChild>
        <Link to="/sponsor" onClick={onClose}>
          <Heart className="h-4 w-4 mr-2" />
          Make a Pledge
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/my-pledges" onClick={onClose}>
          <DollarSign className="h-4 w-4 mr-2" />
          My Pledges
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/sponsor/pay" onClick={onClose}>
          <DollarSign className="h-4 w-4 mr-2" />
          Make a Payment
        </Link>
      </Button>
    </>
  );
}

function ParentQuickActions({ onClose, pendingSponsorRequests }: { onClose: () => void; pendingSponsorRequests: number }) {
  return (
    <>
      <Button className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90" asChild>
        <Link to="/log-reading" onClick={onClose}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reading Log
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/invite" onClick={onClose}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Sponsor
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/my-pledges" onClick={onClose}>
          <DollarSign className="h-4 w-4 mr-2" />
          My Pledges
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/family/sponsor-my-child" onClick={onClose}>
          <Heart className="h-4 w-4 mr-2" />
          Make a Pledge
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link to="/onboarding/add-child" state={{ from: "dashboard" }} onClick={onClose}>
          <Plus className="h-4 w-4 mr-2" />
          Add a Child
        </Link>
      </Button>
      <Button variant="outline" className="w-full justify-start relative" asChild>
        <Link to="/family/sponsor-requests" onClick={onClose}>
          <Bell className="h-4 w-4 mr-2" />
          Sponsor Requests
          {pendingSponsorRequests > 0 && (
            <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
              {pendingSponsorRequests}
            </Badge>
          )}
        </Link>
      </Button>
    </>
  );
}

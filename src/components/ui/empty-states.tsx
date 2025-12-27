import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  BookOpen,
  Users,
  Heart,
  Search,
  FolderOpen,
  FileQuestion,
  Inbox,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
    >
      {icon && (
        <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          action.href ? (
            <Button asChild>
              <Link to={action.href}>
                <Plus className="h-4 w-4 mr-2" />
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )
        )}
        {secondaryAction && (
          secondaryAction.href ? (
            <Button variant="outline" asChild>
              <Link to={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios

export function EmptyChildren({
  onAddChild,
  className,
}: {
  onAddChild?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12 text-muted-foreground" />}
      title="No children added yet"
      description="Add your first child to start tracking their reading progress and inviting sponsors."
      action={{
        label: "Add Your First Child",
        onClick: onAddChild,
      }}
      className={className}
    />
  );
}

export function EmptyReadingLogs({
  childName,
  onLogReading,
  className,
}: {
  childName?: string;
  onLogReading?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<BookOpen className="h-12 w-12 text-muted-foreground" />}
      title="No reading sessions logged"
      description={
        childName
          ? `${childName} hasn't logged any reading yet. Start by logging their first reading session!`
          : "Start logging reading sessions to track progress toward your goal."
      }
      action={{
        label: "Log First Reading Session",
        onClick: onLogReading,
      }}
      className={className}
    />
  );
}

export function EmptyPledges({
  childName,
  shareLink,
  onInvite,
  className,
}: {
  childName?: string;
  shareLink?: string;
  onInvite?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Heart className="h-12 w-12 text-muted-foreground" />}
      title="No sponsors yet"
      description={
        childName
          ? `Invite grandparents, aunts, uncles, and family friends to sponsor ${childName}'s reading!`
          : "Share your reading journey with family and friends who want to support you."
      }
      action={{
        label: "Invite Sponsors",
        onClick: onInvite,
      }}
      secondaryAction={
        shareLink
          ? {
              label: "Copy Share Link",
              onClick: () => navigator.clipboard.writeText(shareLink),
            }
          : undefined
      }
      className={className}
    />
  );
}

export function EmptySearchResults({
  query,
  onClear,
  className,
}: {
  query?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12 text-muted-foreground" />}
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}". Try adjusting your search or filters.`
          : "No results match your current filters. Try adjusting your search criteria."
      }
      action={
        onClear
          ? {
              label: "Clear Search",
              onClick: onClear,
            }
          : undefined
      }
      className={className}
    />
  );
}

export function EmptyStudents({
  onAddStudent,
  className,
}: {
  onAddStudent?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Users className="h-12 w-12 text-muted-foreground" />}
      title="No students in your class"
      description="Add students to your class to track their reading progress during the read-a-thon."
      action={{
        label: "Add Students",
        onClick: onAddStudent,
      }}
      className={className}
    />
  );
}

export function EmptyData({
  title = "No data available",
  description = "There's nothing to display here yet.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
      title={title}
      description={description}
      className={className}
    />
  );
}

export function EmptyFolder({
  title = "This folder is empty",
  description = "Upload or create files to see them here.",
  onUpload,
  className,
}: {
  title?: string;
  description?: string;
  onUpload?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FolderOpen className="h-12 w-12 text-muted-foreground" />}
      title={title}
      description={description}
      action={
        onUpload
          ? {
              label: "Upload Files",
              onClick: onUpload,
            }
          : undefined
      }
      className={className}
    />
  );
}

import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  WifiOff,
  AlertTriangle,
  ShieldX,
  FileQuestion,
  RefreshCw,
  Home,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function ErrorState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-4",
        className
      )}
      role="alert"
    >
      {icon && (
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl font-medium text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          action.href ? (
            <Button asChild>
              <Link to={action.href}>
                {action.icon}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>
              {action.icon}
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

// Connection Error
export function ConnectionError({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<WifiOff className="h-10 w-10 text-destructive" />}
      title="Connection Problem"
      description="We're having trouble connecting to the server. Please check your internet connection and try again."
      action={{
        label: "Try Again",
        onClick: onRetry,
        icon: <RefreshCw className="h-4 w-4 mr-2" />,
      }}
      className={className}
    />
  );
}

// 404 Not Found
export function NotFoundError({
  backHref = "/",
  className,
}: {
  backHref?: string;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<FileQuestion className="h-10 w-10 text-muted-foreground" />}
      title="Page Not Found"
      description="Oops! The page you're looking for doesn't exist or may have been moved."
      action={{
        label: "Go Home",
        href: "/",
        icon: <Home className="h-4 w-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Go Back",
        onClick: () => window.history.back(),
      }}
      className={className}
    />
  );
}

// Permission Denied
export function PermissionDenied({
  className,
}: {
  className?: string;
}) {
  return (
    <ErrorState
      icon={<ShieldX className="h-10 w-10 text-destructive" />}
      title="Access Denied"
      description="You don't have permission to view this page. If you think this is a mistake, please contact support."
      action={{
        label: "Contact Support",
        href: "mailto:support@example.com",
        icon: <Mail className="h-4 w-4 mr-2" />,
      }}
      secondaryAction={{
        label: "Go Home",
        href: "/",
      }}
      className={className}
    />
  );
}

// Generic Error
export function GenericError({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <ErrorState
      icon={<AlertTriangle className="h-10 w-10 text-amber-500" />}
      title="Something Went Wrong"
      description="We ran into an unexpected issue. Don't worry, our team has been notified. Please try again in a moment."
      action={
        onRetry
          ? {
              label: "Try Again",
              onClick: onRetry,
              icon: <RefreshCw className="h-4 w-4 mr-2" />,
            }
          : undefined
      }
      secondaryAction={{
        label: "Go Home",
        href: "/",
      }}
      className={className}
    />
  );
}

// Form Submission Error
export function FormError({
  message = "There was a problem submitting your information. Please check your entries and try again.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-destructive/10 border border-destructive/30 p-4",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">
            Unable to complete request
          </p>
          <p className="text-sm text-destructive/80 mt-1">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Error Boundary Fallback
export function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: {
  error?: Error;
  resetErrorBoundary?: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md text-center">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-serif text-2xl font-medium text-foreground mb-2">
          Oops! Something broke
        </h1>
        <p className="text-muted-foreground mb-6">
          We're sorry for the inconvenience. The app ran into an unexpected problem.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {resetErrorBoundary && (
            <Button onClick={resetErrorBoundary}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Technical Details
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy, Save } from "lucide-react";

// Inline Success Message
interface InlineSuccessProps {
  message?: string;
  show: boolean;
  className?: string;
}

export function InlineSuccess({ message = "Success!", show, className }: InlineSuccessProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-success text-sm animate-fade-in",
        className
      )}
      role="status"
    >
      <Check className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

// Save Confirmation - appears briefly after save
interface SaveConfirmationProps {
  show: boolean;
  className?: string;
}

export function SaveConfirmation({ show, className }: SaveConfirmationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-success text-sm font-medium animate-fade-in",
        className
      )}
      role="status"
    >
      <Check className="h-4 w-4" />
      Saved!
    </span>
  );
}

// Copy Confirmation Tooltip
interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopyButton({ textToCopy, className, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "relative inline-flex items-center gap-2 transition-colors",
        className
      )}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {children || (
        <>
          <Copy className="h-4 w-4" />
          <span>Copy</span>
        </>
      )}
      
      {/* Tooltip */}
      {copied && (
        <span
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-xs font-medium animate-fade-in whitespace-nowrap"
          role="status"
        >
          Copied!
        </span>
      )}
    </button>
  );
}

// Copy with Icon Button (compact)
export function CopyIconButton({ textToCopy, className }: { textToCopy: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "p-2 rounded-md hover:bg-muted transition-colors",
        copied && "text-success",
        className
      )}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

// Auto-save indicator
interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  className?: string;
}

export function AutoSaveIndicator({ status, className }: AutoSaveIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm transition-opacity",
        status === "idle" && "opacity-0",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {status === "saving" && (
        <>
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-4 w-4 text-success" />
          <span className="text-success">All changes saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <div className="h-2 w-2 rounded-full bg-destructive" />
          <span className="text-destructive">Failed to save</span>
        </>
      )}
    </div>
  );
}

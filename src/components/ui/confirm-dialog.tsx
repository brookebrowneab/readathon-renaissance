import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";
import { AlertTriangle, Trash2, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  icon,
  loading = false,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {icon && (
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  variant === "destructive" ? "bg-destructive/10" : "bg-muted"
                )}
              >
                {icon}
              </div>
            </div>
          )}
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel disabled={isLoading || loading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || loading}
            className={cn(
              variant === "destructive" &&
                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {(isLoading || loading) ? "Please wait..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-built confirmation dialogs

interface DeleteConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType?: string;
  onConfirm: () => void | Promise<void>;
}

export function DeleteConfirm({
  open,
  onOpenChange,
  itemName,
  itemType = "item",
  onConfirm,
}: DeleteConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete ${itemType}?`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmLabel={`Delete ${itemType}`}
      variant="destructive"
      onConfirm={onConfirm}
      icon={<Trash2 className="h-6 w-6 text-destructive" />}
    />
  );
}

export function LogoutConfirm({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Log out?"
      description="You'll need to sign in again to access your account."
      confirmLabel="Log Out"
      onConfirm={onConfirm}
      icon={<LogOut className="h-6 w-6 text-muted-foreground" />}
    />
  );
}

export function DiscardChangesConfirm({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Discard changes?"
      description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
      confirmLabel="Discard Changes"
      variant="destructive"
      onConfirm={onConfirm}
      icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
    />
  );
}

export function CancelPledgeConfirm({
  open,
  onOpenChange,
  pledgeAmount,
  childName,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pledgeAmount: string;
  childName: string;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel pledge?"
      description={`Are you sure you want to cancel your ${pledgeAmount} pledge for ${childName}? This action cannot be undone.`}
      confirmLabel="Cancel Pledge"
      variant="destructive"
      onConfirm={onConfirm}
      icon={<X className="h-6 w-6 text-destructive" />}
    />
  );
}

// Hook for managing confirm dialogs
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const confirm = (action: () => void) => {
    setPendingAction(() => action);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    pendingAction?.();
    setIsOpen(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setPendingAction(null);
  };

  return {
    isOpen,
    setIsOpen,
    confirm,
    handleConfirm,
    handleCancel,
  };
}

import { cn } from "@/lib/utils";
import { Check, Upload, File, X } from "lucide-react";
import { Progress } from "./progress";

// Step Progress Indicator
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Text indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        {labels && labels[currentStep - 1] && (
          <span className="text-sm font-medium text-foreground">
            {labels[currentStep - 1]}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-blue transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={i}
              className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium transition-all",
                isCompleted && "bg-brand-blue text-white",
                isCurrent && "bg-brand-blue text-white ring-4 ring-brand-blue/20",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="h-3 w-3" /> : stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Long Operation Progress
interface OperationProgressProps {
  progress: number;
  message?: string;
  className?: string;
}

export function OperationProgress({
  progress,
  message = "Processing...",
  className,
}: OperationProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{message}</span>
        <span className="font-medium text-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}

// File Upload Progress
interface FileUploadProgressProps {
  fileName: string;
  progress: number;
  fileSize?: string;
  status?: "uploading" | "complete" | "error";
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function FileUploadProgress({
  fileName,
  progress,
  fileSize,
  status = "uploading",
  onCancel,
  onRetry,
  className,
}: FileUploadProgressProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card",
        status === "error" && "border-destructive/50 bg-destructive/5",
        status === "complete" && "border-success/50 bg-success/5",
        className
      )}
    >
      {/* File Icon */}
      <div
        className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
          status === "uploading" && "bg-brand-blue/10",
          status === "complete" && "bg-success/10",
          status === "error" && "bg-destructive/10"
        )}
      >
        {status === "complete" ? (
          <Check className="h-5 w-5 text-success" />
        ) : status === "error" ? (
          <X className="h-5 w-5 text-destructive" />
        ) : (
          <Upload className="h-5 w-5 text-brand-blue animate-pulse" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
          {status === "uploading" && (
            <span className="text-xs text-muted-foreground shrink-0">
              {Math.round(progress)}%
            </span>
          )}
        </div>

        {status === "uploading" && (
          <div className="mt-1">
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {fileSize && status !== "uploading" && (
          <p className="text-xs text-muted-foreground mt-0.5">{fileSize}</p>
        )}

        {status === "error" && (
          <p className="text-xs text-destructive mt-0.5">Upload failed</p>
        )}
      </div>

      {/* Actions */}
      {status === "uploading" && onCancel && (
        <button
          onClick={onCancel}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          aria-label="Cancel upload"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      {status === "error" && onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-brand-blue hover:underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// Multiple Files Upload Progress
interface MultiFileUploadProps {
  files: {
    id: string;
    name: string;
    progress: number;
    status: "uploading" | "complete" | "error";
    size?: string;
  }[];
  onCancelFile?: (id: string) => void;
  onRetryFile?: (id: string) => void;
  className?: string;
}

export function MultiFileUpload({
  files,
  onCancelFile,
  onRetryFile,
  className,
}: MultiFileUploadProps) {
  const completedCount = files.filter((f) => f.status === "complete").length;
  const totalProgress =
    files.length > 0
      ? files.reduce((acc, f) => acc + f.progress, 0) / files.length
      : 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Overall Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Uploading {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
        <span className="font-medium text-foreground">
          {completedCount}/{files.length} complete
        </span>
      </div>
      <Progress value={totalProgress} className="h-2" />

      {/* Individual Files */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.map((file) => (
          <FileUploadProgress
            key={file.id}
            fileName={file.name}
            progress={file.progress}
            fileSize={file.size}
            status={file.status}
            onCancel={onCancelFile ? () => onCancelFile(file.id) : undefined}
            onRetry={onRetryFile ? () => onRetryFile(file.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// Indeterminate Progress (for unknown duration)
export function IndeterminateProgress({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-sm text-muted-foreground">{message}</span>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-brand-blue rounded-full animate-[indeterminate_1.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

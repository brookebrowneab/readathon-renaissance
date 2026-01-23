import { useReadingLogs } from "@/hooks/useReadingLogs";
import { ReadingLogsTable } from "@/components/family/ReadingLogsTable";
import { Loader2 } from "lucide-react";

interface ChildReadingLogsSectionProps {
  childId: string;
  childName: string;
}

export const ChildReadingLogsSection = ({ childId, childName }: ChildReadingLogsSectionProps) => {
  const { logs, isLoading, updateLog, deleteLog } = useReadingLogs(childId);

  const handleEdit = (logId: string, minutes: number, bookTitle: string) => {
    updateLog.mutate({
      id: logId,
      minutes,
      book_title: bookTitle || null,
    });
  };

  const handleDelete = (logId: string) => {
    deleteLog.mutate(logId);
  };

  if (isLoading) {
    return (
      <div className="border-t border-border p-6 bg-muted/20 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Transform logs to match ReadingLogsTable interface
  const tableLogs = logs.map((log) => ({
    id: log.id,
    logged_at: log.logged_at,
    minutes: log.minutes,
    book_title: log.book_title,
    student_name: log.student_name,
  }));

  return (
    <div className="border-t border-border p-6 bg-muted/20">
      <h4 className="font-serif text-lg text-foreground mb-4">Reading Logs</h4>
      <ReadingLogsTable
        logs={tableLogs}
        childName={childName}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

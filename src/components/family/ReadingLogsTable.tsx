import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Save, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export interface ReadingLog {
  id: string;
  logged_at: string;
  minutes: number;
  book_title: string | null;
  student_name: string;
}

interface ReadingLogsTableProps {
  logs: ReadingLog[];
  childName: string;
  onEdit: (id: string, minutes: number, bookTitle: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const ReadingLogsTable = ({
  logs,
  childName,
  onEdit,
  onDelete,
  isLoading = false,
}: ReadingLogsTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState<number>(0);
  const [editBookTitle, setEditBookTitle] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStartEdit = (log: ReadingLog) => {
    setEditingId(log.id);
    setEditMinutes(log.minutes);
    setEditBookTitle(log.book_title || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditMinutes(0);
    setEditBookTitle("");
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onEdit(editingId, editMinutes, editBookTitle);
      handleCancelEdit();
    }
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          No reading logs for {childName} yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[100px]">Minutes</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {format(new Date(log.logged_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {editingId === log.id ? (
                    <Input
                      type="number"
                      min={1}
                      max={480}
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
                      className="w-20 h-8"
                    />
                  ) : (
                    <Badge variant="secondary" className="font-mono">
                      {log.minutes} min
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === log.id ? (
                    <Input
                      type="text"
                      value={editBookTitle}
                      onChange={(e) => setEditBookTitle(e.target.value)}
                      placeholder="Book title (optional)"
                      className="h-8"
                    />
                  ) : (
                    <span className="text-muted-foreground">
                      {log.book_title || "—"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === log.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary"
                        onClick={handleSaveEdit}
                        disabled={editMinutes < 1}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStartEdit(log)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(log.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reading Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reading log? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

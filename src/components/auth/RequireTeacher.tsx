import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { Loader2 } from "lucide-react";

interface RequireTeacherProps {
  children: ReactNode;
}

export const RequireTeacher = ({ children }: RequireTeacherProps) => {
  const { isTeacher, isLoading, user } = useTeacherAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isTeacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <div className="text-center space-y-4 max-w-md p-8">
          <h1 className="font-serif text-2xl text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have teacher access to this page. If you believe this is an error,
            please contact your school administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

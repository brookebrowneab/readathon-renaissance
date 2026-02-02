import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useParentFromChild } from "@/hooks/useFamilyChildren";
import { PublicLayout } from "@/components/layout";

/**
 * Redirect component that converts old child-specific sponsor links
 * to the new family-based sponsor links with preselection.
 * 
 * /s/:childId -> /f/:parentUserId?child=:childId
 */
const ChildToFamilyRedirect = () => {
  const { code, token } = useParams<{ code?: string; token?: string }>();
  const childId = code || token;
  const navigate = useNavigate();
  
  const { data: parentUserId, isLoading, error } = useParentFromChild(childId);

  useEffect(() => {
    if (parentUserId) {
      // Redirect to family page with child preselected
      navigate(`/f/${parentUserId}?child=${childId}`, { replace: true });
    }
  }, [parentUserId, childId, navigate]);

  useEffect(() => {
    if (error) {
      // If we can't find the parent, redirect to sponsor gateway
      navigate("/sponsor", { replace: true });
    }
  }, [error, navigate]);

  // Show loading while fetching parent
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-20 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </PublicLayout>
    );
  }

  return null;
};

export default ChildToFamilyRedirect;

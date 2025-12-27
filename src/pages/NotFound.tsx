import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <PublicLayout>
      <section className="min-h-[calc(100vh-8rem)] bg-background-warm flex items-center justify-center py-12">
        <div className="container max-w-lg text-center">
          <div className="animate-fade-in space-y-6">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <BookIcon size="large" variant="primary" className="opacity-60" />
            </div>
            <div className="space-y-2">
              <h1 className="font-handwritten text-6xl text-primary">404</h1>
              <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Looks like this page got lost in a good book! Let's get you back on track.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild>
                <Link to="/"><Home className="h-4 w-4 mr-2" />Go Home</Link>
              </Button>
              <Button variant="secondary" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />Go Back
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default NotFound;

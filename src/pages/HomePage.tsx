import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

const HERO_HEADLINES = [
  "Every Page Counts.",
  "Read More. Grow Together.",
  "Read books. Support Janney.",
];

const HomePage = () => {
  // Randomize hero text on page load (stable for component lifecycle)
  const heroHeadline = useMemo(() => {
    return HERO_HEADLINES[Math.floor(Math.random() * HERO_HEADLINES.length)];
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section - Editorial, calm */}
      <section className="relative pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="container">
          <div className="max-w-3xl">
            {/* Large headline - editorial serif */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.1] mb-6">
              {heroHeadline}
            </h1>

            {/* Body text - readable, book-like */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Janney Elementary Read-a-thon runs February 24–March 9. Students read to raise funds for our school. 
              Ask friends and family to pledge per minute—or give a flat donation—and help fund the programs that make Janney exceptional.
            </p>

            {/* CTA Buttons - minimal, confident */}
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 font-sans text-sm tracking-wide"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-foreground hover:bg-transparent hover:text-muted-foreground font-sans text-sm tracking-wide"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Thin rule divider */}
      <div className="container">
        <div className="border-t border-border/60" />
      </div>

      {/* Stats Section - typographic, no cards */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Stats as simple text rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <p className="font-serif text-4xl md:text-5xl text-foreground tracking-tight mb-1">
                  128,400
                </p>
                <p className="text-sm text-muted-foreground tracking-wide font-sans uppercase">
                  Minutes Logged
                </p>
              </div>
              <div className="text-center md:text-left md:border-l md:border-border/40 md:pl-12">
                <p className="font-serif text-4xl md:text-5xl text-foreground tracking-tight mb-1">
                  4,875
                </p>
                <p className="text-sm text-muted-foreground tracking-wide font-sans uppercase">
                  Books Completed
                </p>
              </div>
              <div className="text-center md:text-left md:border-l md:border-border/40 md:pl-12">
                <p className="font-serif text-4xl md:text-5xl text-foreground tracking-tight mb-1">
                  $21,320
                </p>
                <p className="text-sm text-muted-foreground tracking-wide font-sans uppercase">
                  Funds Raised
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - clean, editorial layout */}
      <section className="py-16 md:py-20 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
                How It Works
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl">
                A simple way for students to read, fundraise, and celebrate together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
              <div className="border-l-2 border-border/40 pl-6">
                <span className="font-sans text-xs text-muted-foreground/60 uppercase tracking-widest">Step 1</span>
                <h3 className="font-serif text-xl text-foreground mt-1 mb-2">
                  Sign Up & Set Goals
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create your family profile and choose your reading targets. Each child gets a unique sponsor link.
                </p>
              </div>

              <div className="border-l-2 border-border/40 pl-6">
                <span className="font-sans text-xs text-muted-foreground/60 uppercase tracking-widest">Step 2</span>
                <h3 className="font-serif text-xl text-foreground mt-1 mb-2">
                  Read & Track Progress
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Log reading time and watch your progress grow. Parents can approve logs from any device.
                </p>
              </div>

              <div className="border-l-2 border-border/40 pl-6">
                <span className="font-sans text-xs text-muted-foreground/60 uppercase tracking-widest">Step 3</span>
                <h3 className="font-serif text-xl text-foreground mt-1 mb-2">
                  Share with Sponsors
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Invite family and friends to pledge their support—per minute read or as a flat donation.
                </p>
              </div>

              <div className="border-l-2 border-border/40 pl-6">
                <span className="font-sans text-xs text-muted-foreground/60 uppercase tracking-widest">Step 4</span>
                <h3 className="font-serif text-xl text-foreground mt-1 mb-2">
                  Celebrate Success
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  At the end, sponsors pay their pledges and funds go directly to supporting our school.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making a Difference - text-forward, no visual noise */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                  Making a Difference
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Your participation helps provide books, resources, and enrichment 
                  programs for our school community. Every minute read brings us closer to our goals.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Last year's read-a-thon funded new library materials, classroom supplies, 
                  and enrichment programs that benefit every student at Janney.
                </p>
              </div>

              {/* Progress summary - simple lines, not cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-muted-foreground">Pages Read</span>
                  <span className="font-serif text-2xl text-foreground">620</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-muted-foreground">Minutes Logged</span>
                  <span className="font-serif text-2xl text-foreground">1,125</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-border/50 pb-3">
                  <span className="text-muted-foreground">Books Completed</span>
                  <span className="font-serif text-2xl text-foreground">16</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Active Sponsors</span>
                  <span className="font-serif text-2xl text-foreground">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin rule divider */}
      <div className="container">
        <div className="border-t border-border/60" />
      </div>

      {/* CTA Section - calm, confident */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Ready to Join the Read-a-thon?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Create your family account and start logging reading minutes today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary-hover px-10 font-sans text-sm tracking-wide"
                >
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-border text-foreground hover:bg-muted/50 px-10 font-sans text-sm tracking-wide"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;

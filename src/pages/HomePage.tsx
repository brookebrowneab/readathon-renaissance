import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import booksShelfHero from "@/assets/books-shelf-hero.png";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import openBook from "@/assets/open-book.png";
import bookStackAccent from "@/assets/book-stack-accent.png";

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section - Large left-aligned headline */}
      <section className="relative py-10 md:py-16">
        <div className="container">
          <div className="max-w-5xl">
            {/* Large headline - left aligned */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-foreground leading-[1.05] mb-6">
              Every Page Counts
            </h1>

            {/* Body text - full width, two lines, smaller */}
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-6">
              Janney Elementary Read-a-thon runs February 24–March 9. Students read to raise funds for our school. 
              Ask friends and family to pledge per minute—or give a flat donation—and help fund the programs that make Janney exceptional.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-foreground hover:bg-muted"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - with tiled book illustration background */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Tiled background illustrations */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div className="flex flex-wrap justify-center items-center gap-8 h-full">
            <img src={booksShelfHero} alt="" className="w-64 h-auto" aria-hidden="true" />
            <img src={openBook} alt="" className="w-48 h-auto" aria-hidden="true" />
            <img src={booksShelfDivider} alt="" className="w-64 h-auto" aria-hidden="true" />
            <img src={bookStackAccent} alt="" className="w-40 h-auto" aria-hidden="true" />
            <img src={booksShelfHero} alt="" className="w-64 h-auto" aria-hidden="true" />
          </div>
        </div>
        
        <div className="container relative">
          <div className="grid grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto bg-background/80 backdrop-blur-sm rounded-lg p-6 md:p-10 border border-border">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                128,400
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Minutes Logged
              </p>
            </div>
            <div className="text-center border-x border-border">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                4,875
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Books Completed
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                $21,320
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Funds Raised
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-2">
                How It Works
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                A simple way for students to read, fundraise, and celebrate together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">
              <div className="flex gap-4">
                <span className="font-serif text-xl text-muted-foreground/50 shrink-0">1.</span>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    Sign Up & Set Goals
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create your family profile and choose your reading targets. Each child gets a unique sponsor link.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-serif text-xl text-muted-foreground/50 shrink-0">2.</span>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    Read & Track Progress
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Log reading time and watch your progress grow. Parents can approve logs from any device.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-serif text-xl text-muted-foreground/50 shrink-0">3.</span>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    Share with Sponsors
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Invite family and friends to pledge their support—per minute read or as a flat donation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="font-serif text-xl text-muted-foreground/50 shrink-0">4.</span>
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1">
                    Celebrate Success
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    At the end, sponsors pay their pledges and funds go directly to supporting our school.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making a Difference - with vertical tiled illustrations */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Vertical tiled illustrations on right side */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.12] pointer-events-none hidden md:flex flex-col justify-center items-center gap-6 overflow-hidden">
          <img src={booksShelfHero} alt="" className="w-full max-w-xs h-auto" aria-hidden="true" />
          <img src={openBook} alt="" className="w-full max-w-xs h-auto" aria-hidden="true" />
          <img src={bookStackAccent} alt="" className="w-full max-w-xs h-auto" aria-hidden="true" />
        </div>
        
        <div className="container relative">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Making a Difference
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              Your participation helps provide books, resources, and enrichment 
              programs for our school community. Every minute read brings us closer to our goals.
            </p>

            {/* Progress summary */}
            <div className="space-y-3 max-w-md">
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Pages Read</span>
                <span className="font-serif text-xl text-foreground">620</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Minutes Logged</span>
                <span className="font-serif text-xl text-foreground">1,125</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Books Completed</span>
                <span className="font-serif text-xl text-foreground">16</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book shelf band divider */}
      <div className="w-full bg-background-warm">
        <div className="flex justify-center items-center gap-4 py-3 opacity-60 overflow-hidden">
          <img src={booksShelfDivider} alt="" className="h-12 w-auto" aria-hidden="true" />
          <img src={booksShelfDivider} alt="" className="h-12 w-auto" aria-hidden="true" />
          <img src={booksShelfDivider} alt="" className="h-12 w-auto hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
        {/* Subtle tiled background */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="flex flex-wrap justify-center items-center gap-12 h-full">
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
            <img src={booksShelfHero} alt="" className="w-64 h-auto invert" aria-hidden="true" />
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
          </div>
        </div>
        
        <div className="container text-center relative">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-3">
            Ready to Join the Read-a-thon?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-lg mx-auto leading-relaxed">
            Create your family account and start logging reading minutes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 px-8"
              >
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;

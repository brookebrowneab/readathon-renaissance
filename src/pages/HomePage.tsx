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
      {/* Hero Section - Clean, editorial */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Subtle label */}
            <p className="text-sm tracking-wide uppercase text-muted-foreground mb-6">
              Janney Elementary · February 24–March 9
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.15] mb-6">
              Every Page Counts
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Students read to support Janney Elementary. Ask friends and family 
              to pledge per minute—or give a flat donation—and help fund the 
              programs that make our school exceptional.
            </p>

            {/* CTA Buttons - Minimal, confident */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      {/* Book shelf divider - subtle accent */}
      <div className="w-full flex justify-center py-4">
        <img 
          src={booksShelfHero} 
          alt="" 
          className="max-w-lg w-full h-auto opacity-80"
          aria-hidden="true"
        />
      </div>

      {/* Stats Section - Text-forward, no cards */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-8 md:gap-12">
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                  128,400
                </p>
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                  Minutes Logged
                </p>
              </div>
              <div className="text-center border-x border-border">
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                  4,875
                </p>
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                  Books Completed
                </p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                  $21,320
                </p>
                <p className="text-sm text-muted-foreground mt-2 tracking-wide">
                  Funds Raised
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin rule divider */}
      <div className="container">
        <hr className="border-border" />
      </div>

      {/* How It Works - Open layout, minimal boxes */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A simple way for students to read, fundraise, and celebrate together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex gap-5">
                <span className="font-serif text-2xl text-muted-foreground/60 shrink-0">1.</span>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    Sign Up & Set Goals
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create your family profile and choose your reading targets. Each child gets a unique sponsor link.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="font-serif text-2xl text-muted-foreground/60 shrink-0">2.</span>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    Read & Track Progress
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Log reading time and watch your progress grow. Parents can approve logs from any device.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="font-serif text-2xl text-muted-foreground/60 shrink-0">3.</span>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    Share with Sponsors
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Invite family and friends to pledge their support—per minute read or as a flat donation.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <span className="font-serif text-2xl text-muted-foreground/60 shrink-0">4.</span>
                <div>
                  <h3 className="font-serif text-xl text-foreground mb-2">
                    Celebrate Success
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    At the end, sponsors pay their pledges and funds go directly to supporting our school.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative open book accent */}
      <div className="w-full flex justify-center py-6">
        <img 
          src={openBook} 
          alt="" 
          className="max-w-md w-full h-auto opacity-70"
          aria-hidden="true"
        />
      </div>

      {/* Making a Difference - Background texture section */}
      <section className="py-16 md:py-24 bg-background-warm relative">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-10 items-center">
              {/* Text content */}
              <div className="md:col-span-3">
                <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                  Making a Difference
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Your participation helps provide books, resources, and enrichment 
                  programs for our school community. Every minute read brings us 
                  closer to our goals.
                </p>

                {/* Progress summary - horizontal, text-based */}
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-border pb-3">
                    <span className="text-muted-foreground">Pages Read</span>
                    <span className="font-serif text-2xl text-foreground">620</span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-border pb-3">
                    <span className="text-muted-foreground">Minutes Logged</span>
                    <span className="font-serif text-2xl text-foreground">1,125</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Books Completed</span>
                    <span className="font-serif text-2xl text-foreground">16</span>
                  </div>
                </div>
              </div>

              {/* Illustration accent - margin decoration */}
              <div className="md:col-span-2 flex justify-center">
                <img 
                  src={bookStackAccent} 
                  alt="" 
                  className="max-w-48 w-full h-auto opacity-75"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book shelf divider */}
      <div className="w-full flex justify-center py-6 bg-background">
        <img 
          src={booksShelfDivider} 
          alt="" 
          className="max-w-2xl w-full h-auto opacity-75"
          aria-hidden="true"
        />
      </div>

      {/* CTA Section - Clean, confident */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-4">
            Ready to Join the Read-a-thon?
          </h2>
          <p className="text-primary-foreground/80 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your family account and start logging reading minutes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

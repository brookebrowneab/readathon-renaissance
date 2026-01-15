import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import booksShelfHero from "@/assets/books-shelf-hero.png";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import openBook from "@/assets/open-book.png";
import bookStackAccent from "@/assets/book-stack-accent.png";

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
      {/* Hero Section - Large left-aligned headline */}
      <section className="relative py-10 md:py-16">
        <div className="container">
          {/* Constrain hero content to ~2/3 page width, indent to align with data block */}
          <div className="max-w-4xl pl-4 md:pl-10 lg:pl-16 text-left">
            {/* Large headline - left aligned with pencil underline */}
            <div className="relative inline-block mb-6">
              <h1 className="font-handwritten text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-foreground leading-[1.05]">
                {heroHeadline}
              </h1>
              {/* Handwritten pencil underline - rough sketchy style */}
              <svg 
                className="absolute -bottom-6 left-0 w-full h-8" 
                viewBox="0 0 400 32" 
                fill="none" 
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Heavy rough main stroke */}
                <path 
                  d="M2 16 L12 15 L22 17 L35 14 L50 16 L68 15 L85 17 L100 14 L118 16 L135 15 L152 17 L170 14 L188 16 L205 15 L222 17 L240 14 L258 16 L275 15 L292 16 L310 15 L328 17 L345 14 L362 16 L380 15 L398 16" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                {/* Second overlapping stroke - slightly offset */}
                <path 
                  d="M5 18 L18 17 L32 19 L48 16 L65 18 L82 17 L98 19 L115 16 L132 18 L150 17 L168 18 L185 17 L202 19 L220 16 L238 18 L255 17 L272 19 L290 16 L308 18 L325 17 L342 18 L360 17 L378 19 L395 17" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
                {/* Thin scratchy accent strokes */}
                <path 
                  d="M8 14 L25 13 L45 15 L70 12 L95 14 L120 13 L145 15 L170 12 L195 14 L220 13 L245 14 L270 13 L295 15 L320 12 L345 14 L370 13 L392 14" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="1" 
                  strokeLinecap="round"
                  opacity="0.4"
                />
                {/* Extra texture strokes */}
                <path 
                  d="M15 20 L40 19 L65 21 L90 18 L115 20 L140 19 L165 20 L190 19 L215 21 L240 18 L265 20 L290 19 L315 20 L340 19 L365 21 L390 19" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth="0.75" 
                  strokeLinecap="round"
                  opacity="0.3"
                />
              </svg>
            </div>

            {/* Body text - full width, two lines, smaller */}
            <p className="font-serif text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
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

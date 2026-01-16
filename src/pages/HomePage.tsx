import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { differenceInDays, differenceInHours } from "date-fns";
import booksShelfHero from "@/assets/books-shelf-hero.png";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import openBook from "@/assets/open-book.png";
import bookStackAccent from "@/assets/book-stack-accent.png";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";


const HERO_HEADLINES = [
  "Every Page Counts.",
  "Read More. Grow Together.",
  "Read books. Support Janney.",
];

// Read-a-thon end date: March 8, 2025 at 11:59 PM EST
const READATHON_END = new Date("2025-03-08T23:59:59-05:00");

const HomePage = () => {
  // Randomize hero text on page load (stable for component lifecycle)
  const heroHeadline = useMemo(() => {
    return HERO_HEADLINES[Math.floor(Math.random() * HERO_HEADLINES.length)];
  }, []);

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    const now = new Date();
    const days = differenceInDays(READATHON_END, now);
    const hours = differenceInHours(READATHON_END, now) % 24;
    return { days: Math.max(0, days), hours: Math.max(0, hours) };
  }, []);

  return (
    <PublicLayout>
      {/* Countdown - Top right below header */}
      <div className="container pt-4 md:pt-6">
        <div className="flex justify-end">
          <div 
            className="inline-flex items-baseline gap-1 bg-background px-4 py-2"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <span className="font-serif text-2xl md:text-3xl text-foreground">{daysRemaining.days}</span>
            <span className="text-sm text-muted-foreground mr-2">days</span>
            <span className="font-serif text-2xl md:text-3xl text-foreground">{daysRemaining.hours}</span>
            <span className="text-sm text-muted-foreground">hours left</span>
          </div>
        </div>
      </div>

      {/* Hero Section - Large left-aligned headline */}
      <section className="relative pt-4 md:pt-6 pb-4 md:pb-6">
        <div className="container">
          {/* Constrain hero content to ~2/3 page width, indent to align with data block */}
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20 text-left">
            {/* Large headline - left aligned with highlighter effect */}
            <div className="relative inline-block mb-6">
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  {heroHeadline.includes(". ") ? (
                    <>
                      {heroHeadline.split(". ")[0]}.<br />
                      {heroHeadline.split(". ")[1]}
                    </>
                  ) : (
                    heroHeadline
                  )}
                  {/* Highlighter effect - sits behind text */}
                  <span 
                    className="absolute inset-0 -skew-y-1 bg-accent/30 -z-10 transform -rotate-[0.5deg]"
                    style={{
                      top: '45%',
                      height: '55%',
                      left: '-2%',
                      right: '-2%',
                      borderRadius: '4px 8px 4px 6px',
                    }}
                    aria-hidden="true"
                  />
                </span>
              </h1>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
              Janney Elementary Read-a-thon runs February 24–March 8. Students read to raise funds for our school. 
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
                  style={{
                    border: 'solid 1px #41403E',
                    borderTopLeftRadius: '255px 15px',
                    borderTopRightRadius: '15px 225px',
                    borderBottomRightRadius: '225px 15px',
                    borderBottomLeftRadius: '15px 255px',
                  }}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Bookshelf band background - tiled, bottom-aligned */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${booksShelfBannerV2})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 50%',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <div 
            className="grid grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto bg-background p-6 md:p-10"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                128,400
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Minutes Logged
              </p>
            </div>
            <div 
              className="text-center px-4 md:px-6"
              style={{
                borderLeft: 'solid 1px #41403E',
                borderRight: 'solid 1px #41403E',
              }}
            >
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

      {/* Hand-drawn section divider */}
      <div 
        className="w-full"
        style={{
          borderTop: 'solid 2px #41403E',
        }}
      />

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

      {/* Making a Difference */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Making a Difference
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              Janney relies on PTA funds to pay for programs that make our school exceptional. 
              Your donations help fund:
            </p>

            {/* What funds support */}
            <ul 
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-8 bg-background p-6"
              style={{
                border: 'solid 1px #41403E',
                borderTopLeftRadius: '255px 15px',
                borderTopRightRadius: '15px 225px',
                borderBottomRightRadius: '225px 15px',
                borderBottomLeftRadius: '15px 255px',
              }}
            >
              {[
                "Technology materials & support",
                "Classroom supplies",
                "Textbooks",
                "Teacher professional development",
                "Instructional materials",
                "Custodial equipment & supplies",
                "Facilities repairs",
                "Staff positions (10 teachers & support)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-muted-foreground/70 italic">
              Questions? Contact <a href="mailto:janneyreadathon@janneyschool.org" className="underline hover:text-foreground">janneyreadathon@janneyschool.org</a>
            </p>
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
                className="bg-white text-primary hover:bg-white/90 px-8"
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

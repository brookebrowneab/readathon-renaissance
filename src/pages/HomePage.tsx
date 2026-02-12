import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";

import { ArrowRight, GraduationCap } from "lucide-react";
import { useMemo, useRef } from "react";
import { differenceInDays, differenceInHours } from "date-fns";
import booksShelfHero from "@/assets/books-shelf-hero.png";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import openBook from "@/assets/open-book.png";
import bookStackAccent from "@/assets/book-stack-accent.png";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { FontDebugOverlay } from "@/components/debug/FontDebugOverlay";
import {
  useSiteContentMultiple,
  parseJsonContent,
  DEFAULT_CONTENT,
} from "@/hooks/useSiteContent";

const HomePage = () => {
  const { data: activeEvent } = useActiveEvent();
  const heroHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Fetch dynamic content
  const { content } = useSiteContentMultiple([
    "home.hero_headlines",
    "home.hero_description",
    "home.stats",
    "home.how_it_works_steps",
    "home.making_difference_intro",
    "home.making_difference_items",
    "home.cta_title",
    "home.cta_description",
    "home.sponsor_logo_url",
    "home.sponsor_name",
  ]);

  const debugFonts = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("debugFonts") === "1";
  }, []);

  // Parse content with fallbacks
  const heroHeadlines = parseJsonContent<string[]>(
    content["home.hero_headlines"],
    JSON.parse(DEFAULT_CONTENT["home.hero_headlines"])
  );
  const heroDescription = content["home.hero_description"] || DEFAULT_CONTENT["home.hero_description"];
  const stats = parseJsonContent<{ minutes_logged: string; books_completed: string; funds_raised: string }>(
    content["home.stats"],
    JSON.parse(DEFAULT_CONTENT["home.stats"])
  );
  const howItWorksSteps = parseJsonContent<Array<{ title: string; description: string }>>(
    content["home.how_it_works_steps"],
    JSON.parse(DEFAULT_CONTENT["home.how_it_works_steps"])
  );
  const makingDifferenceIntro = content["home.making_difference_intro"] || DEFAULT_CONTENT["home.making_difference_intro"];
  const makingDifferenceItems = parseJsonContent<string[]>(
    content["home.making_difference_items"],
    JSON.parse(DEFAULT_CONTENT["home.making_difference_items"])
  );
  const ctaTitle = content["home.cta_title"] || DEFAULT_CONTENT["home.cta_title"];
  const ctaDescription = content["home.cta_description"] || DEFAULT_CONTENT["home.cta_description"];
  const sponsorLogoUrl = content["home.sponsor_logo_url"] || "";
  const sponsorName = content["home.sponsor_name"] || "";

  // Randomize hero text on page load (stable for component lifecycle)
  const heroHeadline = useMemo(() => {
    return heroHeadlines[Math.floor(Math.random() * heroHeadlines.length)];
  }, [heroHeadlines]);

  // Calculate countdown - before event starts, count to start; during/after, count to end
  const countdown = useMemo(() => {
    const now = new Date();
    
    if (!activeEvent) {
      return { days: 0, hours: 0, label: "until reading starts" };
    }
    
    const startDate = new Date(activeEvent.start_date);
    const endDate = new Date(activeEvent.end_date);
    
    // Before the event starts - countdown to reading
    if (now < startDate) {
      const days = differenceInDays(startDate, now);
      const hours = differenceInHours(startDate, now) % 24;
      return { days: Math.max(0, days), hours: Math.max(0, hours), label: "until reading starts" };
    }
    
    // During or after the event - countdown to end
    const days = differenceInDays(endDate, now);
    const hours = differenceInHours(endDate, now) % 24;
    return { days: Math.max(0, days), hours: Math.max(0, hours), label: "left to read" };
  }, [activeEvent]);

  return (
    <PublicLayout>
      {/* Countdown + Sponsor Logo - Top right below header */}
      <div className="container pt-4 md:pt-6">
        <div className="flex flex-col items-end gap-2">
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
            <span className="font-serif text-2xl md:text-3xl text-foreground">{countdown.days}</span>
            <span className="text-sm text-muted-foreground mr-2">days</span>
            <span className="font-serif text-2xl md:text-3xl text-foreground">{countdown.hours}</span>
            <span className="text-sm text-muted-foreground mr-2">hours</span>
            <span className="text-sm text-muted-foreground">{countdown.label}</span>
          </div>
          {sponsorLogoUrl && (
            <div className="flex items-center gap-2 opacity-70">
              <span className="text-xs text-muted-foreground tracking-wide uppercase">Proudly supported by</span>
              <img
                src={sponsorLogoUrl}
                alt={sponsorName || "Sponsor"}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Hero Section - Large left-aligned headline with decorative background */}
      {/* Hero Section - Large left-aligned headline */}
      <div className="pt-4 md:pt-6 pb-4 md:pb-6 mt-[30px]">
        <div className="container">
          {/* Constrain hero content - equal padding on mobile, left-aligned indent on desktop */}
          <div className="max-w-4xl px-4 md:px-0 md:pl-14 lg:pl-20 md:ml-[30px] text-left">
            {/* Large headline - left aligned with highlighter effect */}
            <div className="relative inline-block mb-6">
              <h1
                ref={heroHeadingRef}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.05] relative"
              >
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

            {/* Enable with ?debugFonts=1 in the URL */}
            <FontDebugOverlay enabled={debugFonts} targetRef={heroHeadingRef} />

            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
              {heroDescription}
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
      </div>

      {/* Stats Section */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Bookshelf band background - tiled, bottom-aligned, scrolls with page */}
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
          {/* Mobile: single container with horizontally scrollable content inside */}
          <div 
            className="md:hidden bg-background p-4 overflow-x-auto scrollbar-hide"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div 
              className="flex gap-4 min-w-max"
              style={{ touchAction: 'pan-x' }}
            >
              <div className="text-center px-4 min-w-[120px]">
                <p className="font-serif text-2xl text-foreground tracking-tight">
                  {stats.minutes_logged}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                  Minutes Logged
                </p>
              </div>
              <div 
                className="text-center px-4 min-w-[120px]"
                style={{
                  borderLeft: 'solid 1px #41403E',
                  borderRight: 'solid 1px #41403E',
                }}
              >
                <p className="font-serif text-2xl text-foreground tracking-tight">
                  {stats.books_completed}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                  Books Completed
                </p>
              </div>
              <div className="text-center px-4 min-w-[120px]">
                <p className="font-serif text-2xl text-foreground tracking-tight">
                  {stats.funds_raised}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                  Funds Raised
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: grid layout */}
          <div 
            className="hidden md:grid grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto bg-background p-6 md:p-10"
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
                {stats.minutes_logged}
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
                {stats.books_completed}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 tracking-wide">
                Books Completed
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground tracking-tight">
                {stats.funds_raised}
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
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <span className="font-serif text-xl text-muted-foreground/50 shrink-0">{index + 1}.</span>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
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
              {makingDifferenceIntro}
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
              {makingDifferenceItems.map((item) => (
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
            {ctaTitle}
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-lg mx-auto leading-relaxed">
            {ctaDescription}
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
          
          {/* Student login link */}
          <div className="mt-6 pt-6 border-t border-primary-foreground/20">
            <Link 
              to="/student/login" 
              className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
            >
              <GraduationCap className="h-4 w-4" />
              Student Login
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;

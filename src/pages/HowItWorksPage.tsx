import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import checkmarkImage from "@/assets/checkmark.png";
import {
  useSiteContentMultiple,
  parseJsonContent,
  DEFAULT_CONTENT,
} from "@/hooks/useSiteContent";

interface Step {
  title: string;
  description: string;
  details: string[];
}

interface FAQ {
  q: string;
  a: string;
}

interface Stats {
  event_duration: string;
  typical_goal: string;
  to_school: string;
}

const HowItWorksPage = () => {
  // Fetch dynamic content
  const { content } = useSiteContentMultiple([
    "howitworks.hero_description",
    "howitworks.steps",
    "howitworks.faqs",
    "howitworks.stats",
  ]);

  // Parse content with fallbacks
  const heroDescription = content["howitworks.hero_description"] || DEFAULT_CONTENT["howitworks.hero_description"];
  const steps = parseJsonContent<Step[]>(
    content["howitworks.steps"],
    JSON.parse(DEFAULT_CONTENT["howitworks.steps"])
  );
  const faqs = parseJsonContent<FAQ[]>(
    content["howitworks.faqs"],
    JSON.parse(DEFAULT_CONTENT["howitworks.faqs"])
  );
  const stats = parseJsonContent<Stats>(
    content["howitworks.stats"],
    JSON.parse(DEFAULT_CONTENT["howitworks.stats"])
  );

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-14 pb-8 md:pb-10">
        <div className="container">
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-[1.1] mb-4">
              <span className="relative inline-block">
                How It Works
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
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div 
        className="w-full"
        style={{ borderTop: 'solid 1px #41403E' }}
      />

      {/* Steps Section */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10"
              >
                {/* Step checkmark and title */}
                <div className="flex gap-4 items-start">
                  <img 
                    src={checkmarkImage} 
                    alt="Checkmark" 
                    className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0 mt-1"
                  />
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                      {step.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div 
        className="w-full"
        style={{ borderTop: 'solid 1px #41403E' }}
      />

      {/* FAQ Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              Frequently Asked Questions
            </h2>

            <div 
              className="bg-background p-6 md:p-8 space-y-6"
              style={{
                border: 'solid 1px #41403E',
                borderTopLeftRadius: '255px 15px',
                borderTopRightRadius: '15px 225px',
                borderBottomRightRadius: '225px 15px',
                borderBottomLeftRadius: '15px 255px',
              }}
            >
              {faqs.map((faq, index) => (
                <div key={index} className={index > 0 ? "pt-6 border-t border-border" : ""}>
                  <h3 className="font-serif text-lg text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Impact Section */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Bookshelf band background */}
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
            className="grid grid-cols-3 gap-6 md:gap-10 max-w-3xl mx-auto bg-background p-6 md:p-10"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <div className="text-center">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                {stats.event_duration}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Event Duration
              </p>
            </div>
            <div 
              className="text-center px-4 md:px-6"
              style={{
                borderLeft: 'solid 1px #41403E',
                borderRight: 'solid 1px #41403E',
              }}
            >
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                {stats.typical_goal}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Typical Goal
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                {stats.to_school}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                To Janney
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
        <div className="container text-center relative">
          <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-sm md:text-base text-primary-foreground/80 mb-6 max-w-lg mx-auto leading-relaxed">
            Join families already participating in the Janney Read-a-thon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 px-8"
              >
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
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

export default HowItWorksPage;

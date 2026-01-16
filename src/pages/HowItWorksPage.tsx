import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import checkmarkImage from "@/assets/checkmark.png";
const HowItWorksPage = () => {
  const steps = [
    {
      number: "1",
      title: "Register Your Family",
      description:
        "Parents create an account and add their children. Each child receives a unique sponsor link for their fundraising.",
      details: [
        "Quick 2-minute signup process",
        "Add multiple children to one account",
        "Set individual reading goals",
      ],
    },
    {
      number: "2",
      title: "Invite Sponsors",
      description:
        "Share your child's unique sponsor link with family, friends, and neighbors. Sponsors can pledge per minute read or a flat donation.",
      details: [
        "Shareable link via email or social media",
        "Per-minute or flat-rate pledges",
        "No account required for sponsors",
      ],
    },
    {
      number: "3",
      title: "Read & Log Minutes",
      description:
        "Students read every day and log their minutes. Parents approve logs, and teachers can see classroom progress.",
      details: [
        "Easy daily logging from any device",
        "Optional student login for older readers",
        "Visual progress tracking",
      ],
    },
    {
      number: "4",
      title: "Collect Pledges",
      description:
        "At the end of the read-a-thon, sponsors receive an email with the total pledge amount. Secure payment processing.",
      details: [
        "Automatic pledge calculations",
        "Secure payment processing",
        "Digital receipts for sponsors",
      ],
    },
    {
      number: "5",
      title: "Celebrate Success",
      description:
        "Students who meet their goals earn recognition, and Janney receives the funds raised to support programs.",
      details: [
        "Achievement badges and certificates",
        "Classroom and school leaderboards",
        "Funds go directly to Janney",
      ],
    },
  ];

  const faqs = [
    {
      q: "Is there a minimum pledge amount?",
      a: "Sponsors can pledge as little as $0.01 per minute or a $5 flat donation. Pledges under $5 total are waived to minimize processing fees.",
    },
    {
      q: "How long does the Read-a-thon last?",
      a: "The Janney Read-a-thon runs February 24–March 8. The typical goal is 600 minutes (10 hours) of reading.",
    },
    {
      q: "Can siblings share sponsors?",
      a: "Yes! Parents can manage multiple children from one account, and sponsors can easily pledge to support multiple readers.",
    },
    {
      q: "What if my child exceeds their goal?",
      a: "Great news! Our progress rings show overflow with stacked circles. Sponsors can cap their per-minute pledges if they prefer.",
    },
  ];

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
              A simple 5-step process to get your students reading and fundraising for Janney Elementary.
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
                2 weeks
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
                600 min
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Typical Goal
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                100%
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
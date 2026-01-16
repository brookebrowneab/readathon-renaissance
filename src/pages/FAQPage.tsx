import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";

const FAQ_ITEMS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I register my family for the Read-a-thon?",
        a: "Click 'Get Started' on the homepage to create a parent account. Once registered, you can add your children and set reading goals. Each child will receive a unique sponsor link to share with friends and family.",
      },
      {
        q: "When does the Read-a-thon take place?",
        a: "The Janney Elementary Read-a-thon runs from February 24 through March 9. Students can log reading minutes throughout this period.",
      },
      {
        q: "Can I register multiple children?",
        a: "Yes! After creating your family account, you can add as many children as needed. Each child will have their own reading log and sponsor link.",
      },
    ],
  },
  {
    category: "Reading & Logging",
    questions: [
      {
        q: "How do students log their reading time?",
        a: "Students or parents can log reading minutes through the dashboard. Simply enter the number of minutes read and the book title. Parents can review and approve entries from any device.",
      },
      {
        q: "What counts as reading?",
        a: "Any independent reading counts—chapter books, picture books, graphic novels, magazines, or e-books. Audiobooks count too when students are actively listening and following along.",
      },
      {
        q: "Is there a minimum or maximum reading time per day?",
        a: "There's no minimum requirement, but we encourage consistent daily reading. There's also no maximum—every minute counts toward your child's goal and fundraising total.",
      },
    ],
  },
  {
    category: "Sponsors & Pledges",
    questions: [
      {
        q: "How do pledges work?",
        a: "Sponsors can pledge a certain amount per minute read (e.g., 5¢ per minute) or make a flat donation. Per-minute pledges are calculated at the end of the Read-a-thon based on total minutes logged.",
      },
      {
        q: "How do I invite sponsors?",
        a: "From your dashboard, you can share your child's unique sponsor link via email, text, or social media. Sponsors click the link to make their pledge—no account required.",
      },
      {
        q: "When do sponsors pay?",
        a: "Sponsors receive a payment reminder after the Read-a-thon ends. They can pay securely online or by check. Payment is typically due within two weeks of the event ending.",
      },
      {
        q: "Is there a minimum pledge amount?",
        a: "There's no minimum for per-minute pledges. Flat donations have a suggested minimum of $10, but any amount is appreciated.",
      },
    ],
  },
  {
    category: "Payments & Donations",
    questions: [
      {
        q: "How are payments processed?",
        a: "We use Square for secure online payments. Sponsors can pay by credit card, debit card, or Apple Pay. Check payments can also be mailed to the school.",
      },
      {
        q: "Are donations tax-deductible?",
        a: "Yes, donations to Janney Elementary through the Read-a-thon are tax-deductible. Sponsors will receive a receipt for their records.",
      },
      {
        q: "Where does the money go?",
        a: "All funds raised go directly to Janney Elementary to support enrichment programs, classroom resources, library books, and school-wide initiatives.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a link to reset your password within a few minutes.",
      },
      {
        q: "The sponsor link isn't working. What should I do?",
        a: "Make sure you're copying the full link. If issues persist, try generating a new link from your dashboard or contact us for assistance.",
      },
      {
        q: "Who do I contact if I have a problem?",
        a: "For technical issues or questions, please email the Read-a-thon coordinators at janneyreadathon@janneyschool.org.",
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-8 md:pt-12 pb-6 md:pb-8">
        <div className="container">
          <div className="max-w-4xl pl-9 md:pl-14 lg:pl-20">
            {/* Large headline with highlighter effect */}
            <div className="relative inline-block mb-4">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  Frequently Asked<br />Questions
                  {/* Highlighter effect */}
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
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Find answers to common questions about the Janney Elementary Read-a-thon.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider - Tiled */}
      <div 
        className="w-full h-16 md:h-20 relative z-10"
        style={{
          backgroundImage: `url(${booksShelfDivider})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      />

      {/* FAQ Sections */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-10">
            {FAQ_ITEMS.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-foreground/20">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${sectionIndex}-${itemIndex}`}
                      className="bg-background px-4 data-[state=open]:bg-background"
                      style={{
                        border: 'solid 1px #41403E',
                        borderTopLeftRadius: '255px 15px',
                        borderTopRightRadius: '15px 225px',
                        borderBottomRightRadius: '225px 15px',
                        borderBottomLeftRadius: '15px 255px',
                      }}
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
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

      {/* Still Have Questions Section - with bookshelf background */}
      <section className="py-10 md:py-14 relative overflow-hidden">
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
            className="max-w-2xl mx-auto text-center bg-background p-6 md:p-10"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We're here to help. Reach out to our Read-a-thon coordinators or explore more resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:janneyreadathon@janneyschool.org">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </a>
              <Link to="/how-it-works">
                <Button 
                  variant="ghost" 
                  size="lg"
                  style={{
                    border: 'solid 1px #41403E',
                    borderTopLeftRadius: '255px 15px',
                    borderTopRightRadius: '15px 225px',
                    borderBottomRightRadius: '225px 15px',
                    borderBottomLeftRadius: '15px 255px',
                  }}
                >
                  How It Works <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-primary">
        <div className="container text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-3">
            Ready to Get Started?
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

export default FAQPage;

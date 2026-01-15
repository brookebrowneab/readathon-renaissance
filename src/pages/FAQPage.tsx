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
        a: "For technical issues or questions, please email the Read-a-thon coordinators at readathon@janneyhsa.org.",
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="pt-16 md:pt-20 pb-10 md:pb-12 bg-background-warm">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Find answers to common questions about the Janney Elementary Read-a-thon.
            </p>
          </div>
        </div>
      </section>

      {/* Book shelf divider */}
      <div className="w-full bg-background">
        <div className="flex justify-center items-center gap-4 py-3 opacity-50 overflow-hidden">
          <img src={booksShelfDivider} alt="" className="h-10 w-auto" aria-hidden="true" />
          <img src={booksShelfDivider} alt="" className="h-10 w-auto" aria-hidden="true" />
          <img src={booksShelfDivider} alt="" className="h-10 w-auto hidden md:block" aria-hidden="true" />
        </div>
      </div>

      {/* FAQ Sections */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-10">
            {FAQ_ITEMS.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4 pb-2 border-b border-border">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((item, itemIndex) => (
                    <AccordionItem 
                      key={itemIndex} 
                      value={`${sectionIndex}-${itemIndex}`}
                      className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
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

      {/* Still Have Questions Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We're here to help. Reach out to our Read-a-thon coordinators or explore more resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:readathon@janneyhsa.org">
                <Button size="lg" className="px-8">
                  Contact Us
                </Button>
              </a>
              <Link to="/how-it-works">
                <Button variant="ghost" size="lg">
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

export default FAQPage;

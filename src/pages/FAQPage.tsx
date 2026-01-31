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
import {
  useSiteContentMultiple,
  parseJsonContent,
  DEFAULT_CONTENT,
} from "@/hooks/useSiteContent";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

const FAQPage = () => {
  // Fetch dynamic content
  const { content } = useSiteContentMultiple([
    "faq.hero_description",
    "faq.items",
    "faq.still_questions_text",
  ]);

  // Parse content with fallbacks
  const heroDescription = content["faq.hero_description"] || DEFAULT_CONTENT["faq.hero_description"];
  const faqItems = parseJsonContent<FAQCategory[]>(
    content["faq.items"],
    JSON.parse(DEFAULT_CONTENT["faq.items"])
  );
  const stillQuestionsText = content["faq.still_questions_text"] || DEFAULT_CONTENT["faq.still_questions_text"];

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
              {heroDescription}
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
            {faqItems.map((section, sectionIndex) => (
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
              {stillQuestionsText}
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

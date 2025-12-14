import { PublicLayout } from "@/components/layout";
import { BookContainer, BookIcon } from "@/components/legacy";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserPlus, BookOpen, Share2, DollarSign, Trophy, ArrowRight } from "lucide-react";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Register Your Family",
      description:
        "Parents create an account and add their children to the platform. Each child receives a unique sponsor code for their fundraising.",
      details: [
        "Quick 2-minute signup process",
        "Add multiple children to one account",
        "Set individual reading goals",
      ],
    },
    {
      icon: Share2,
      title: "2. Invite Sponsors",
      description:
        "Share your child's unique sponsor link with family, friends, and neighbors. Sponsors can pledge per minute read or a flat donation.",
      details: [
        "Shareable link via email or social media",
        "Per-minute or flat-rate pledges",
        "No account required for sponsors",
      ],
    },
    {
      icon: BookOpen,
      title: "3. Read & Log Minutes",
      description:
        "Students read every day and log their minutes. Parents can approve logs, and teachers can see classroom progress.",
      details: [
        "Easy daily logging from any device",
        "Optional student login for older readers",
        "Visual progress tracking",
      ],
    },
    {
      icon: DollarSign,
      title: "4. Collect Pledges",
      description:
        "At the end of the read-a-thon, sponsors receive an email with the total pledge amount. Secure payment through Square.",
      details: [
        "Automatic pledge calculations",
        "Secure Square payment processing",
        "Digital receipts for sponsors",
      ],
    },
    {
      icon: Trophy,
      title: "5. Celebrate Success",
      description:
        "Students who meet their goals earn recognition, and schools receive the funds raised to support programs and resources.",
      details: [
        "Achievement badges and certificates",
        "Classroom and school leaderboards",
        "Funds go directly to schools",
      ],
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-background-warm py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
              How Read-a-thon Works
            </h1>
            <p className="text-lg text-muted-foreground">
              A simple 5-step process to get your students reading and fundraising.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-background py-16">
        <div className="container">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid items-center gap-8 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <BookContainer variant={index % 2 === 0 ? "warm" : "default"} className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h2 className="mb-2 text-2xl font-bold text-foreground">{step.title}</h2>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </BookContainer>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-yellow">
                          <span className="text-xs font-bold text-foreground">✓</span>
                        </div>
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-background-warm py-16">
        <div className="container">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto grid max-w-4xl gap-4">
            {[
              {
                q: "Is there a minimum pledge amount?",
                a: "Sponsors can pledge as little as $0.01 per minute or a $5 flat donation. Pledges under $5 total are waived to minimize processing fees.",
              },
              {
                q: "How long does a read-a-thon last?",
                a: "Most read-a-thons run for 2-4 weeks, but schools can customize the duration. The typical goal is 600 minutes (10 hours) of reading.",
              },
              {
                q: "Can siblings share sponsors?",
                a: "Yes! Parents can manage multiple children from one account, and sponsors can easily pledge to support multiple readers.",
              },
              {
                q: "What if my child exceeds their goal?",
                a: "Great news! Our progress rings show overflow with stacked circles. Sponsors can cap their per-minute pledges if they prefer.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{faq.a}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue py-16 text-white">
        <div className="container text-center">
          <BookIcon size="large" variant="white" className="mx-auto mb-6" />
          <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            Join thousands of families already participating in Read-a-thon events.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-brand-yellow text-foreground hover:bg-brand-yellow/90">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HowItWorksPage;

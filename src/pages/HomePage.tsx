import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Heart, ArrowRight, Sparkles, Gift, HelpCircle, DollarSign, School, Mail } from "lucide-react";

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background-warm">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-brand-blue blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-brand-yellow blur-3xl" />
        </div>

        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-in space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/20 px-4 py-2 text-sm font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-brand-yellow" />
              {/* TODO: Update dates each year */}
              <span>February 24 – March 9</span>
            </div>

            <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Read. Raise funds. Support our school.
            </h1>

            <p className="text-lg text-muted-foreground">
              Join the fun in the Janney Read-A-Thon, happening February 24 through March 9.
            </p>
            <p className="text-sm text-muted-foreground">
              {/* TODO: Update dates each year */}
              Reading minutes count from 12:00 a.m. EST on 2/24 through 11:59 p.m. EST on 3/9.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="w-full bg-brand-blue text-white hover:bg-brand-blue/90 sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                {/* TODO: Update each year */}
                <p className="font-handwritten text-4xl text-brand-blue">14 days</p>
                <p className="text-sm text-muted-foreground">of reading</p>
              </div>
              <div>
                <p className="font-handwritten text-4xl text-brand-blue">2 ways</p>
                <p className="text-sm text-muted-foreground">to pledge</p>
              </div>
              <div>
                <p className="font-handwritten text-4xl text-brand-blue">1 goal</p>
                <p className="text-sm text-muted-foreground">support Janney</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-normal text-foreground md:text-4xl">
              How the Read-A-Thon Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A simple, fun way to encourage reading while raising funds for Janney.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "1. Register & Read",
                description:
                  "Students sign up and start logging their reading minutes daily throughout the event.",
              },
              {
                icon: Users,
                title: "2. Get Sponsors",
                description:
                  "Share your unique sponsor link with family and friends who pledge per minute or a flat amount.",
              },
              {
                icon: Trophy,
                title: "3. Celebrate Success",
                description:
                  "Track your progress, exceed goals, and celebrate achievements with our school community.",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-card shadow-md transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Types */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-left max-w-2xl">
            <h2 className="mb-4 font-serif text-3xl font-normal text-foreground md:text-4xl">
              Two Ways to Pledge
            </h2>
            <p className="text-muted-foreground">
              Students ask friends, family, and neighbors to support them by pledging:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl">
            <Card className="group relative overflow-hidden border-0 bg-card shadow-md transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Flat Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A one-time gift to support your reader.</p>
                <p className="font-handwritten text-2xl text-brand-blue mt-2">$20, $40, or more</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-card shadow-md transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Per-Minute Pledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">The more they read, the more they raise!</p>
                <p className="font-handwritten text-2xl text-brand-blue mt-2">$0.05, $0.10/min</p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-lg font-medium text-brand-blue">
            Every page helps strengthen our school community.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                Why the Read-A-Thon Matters
              </h2>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  Janney Elementary is one of the largest elementary schools in Washington, DC, yet our per-student district funding is among the lowest in the city.
                </p>
                <p>
                  DCPS funds are used primarily to pay teachers. Nearly everything else that makes Janney special is supported by PTA fundraising.
                </p>
                <p>
                  Our students, families, and staff make Janney an exceptional place to learn—and the Read-A-Thon helps keep it that way.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-md">
              <p className="font-medium text-foreground mb-4">Because of this support, Janney is proud to offer:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                  <span className="text-muted-foreground">Art, music, technology, and Spanish for most grades</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                  <span className="text-muted-foreground">Strong academic and enrichment programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                  <span className="text-muted-foreground">A school culture rooted in respect, curiosity, and diligence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Your Donations Support */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="mb-8 max-w-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <School className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl mb-4">
              What Your Donations Support
            </h2>
            <p className="text-muted-foreground">
              Funds raised through the Read-A-Thon help pay for:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
            {[
              "Technology materials and support",
              "Classroom supplies and textbooks",
              "Instructional materials",
              "Teacher professional development",
              "Custodial equipment and supplies",
              "Facilities repairs",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-green shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-lg bg-card p-4 shadow-sm sm:col-span-2 lg:col-span-1">
              <span className="mt-1 h-2 w-2 rounded-full bg-brand-green shrink-0" />
              <span className="text-muted-foreground">Salaries for <span className="font-handwritten text-xl text-brand-green">10</span> teacher and support staff positions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/20 text-brand-yellow">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl mb-4">
              Prizes 🎉
            </h2>
            <p className="text-lg text-muted-foreground">
              The top reader in each grade will receive a gift card to Politics and Prose.
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl mb-4">
              Questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're here to help with anything you need.
            </p>
            <a 
              href="mailto:janneyreadathon@janneyschool.org" 
              className="inline-flex items-center gap-2 text-brand-blue hover:underline font-medium"
            >
              <Mail className="h-5 w-5" />
              janneyreadathon@janneyschool.org
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-16 text-white md:py-24">
        <div className="container text-center">
          <BookIcon size="large" variant="white" className="mx-auto mb-6" />
          <h2 className="mb-4 font-serif text-3xl font-normal md:text-4xl">Ready to Join the Read-A-Thon?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Help your student read, raise funds, and support Janney Elementary.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="w-full bg-brand-yellow text-foreground hover:bg-brand-yellow/90 sm:w-auto">
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
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

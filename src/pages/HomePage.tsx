import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { BookContainer, ReadingGoalRing, BookIcon } from "@/components/legacy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Heart, ArrowRight, Sparkles, Star } from "lucide-react";

type TimeUnit = "minutes" | "hours" | "days";

const formatTime = (minutes: number, unit: TimeUnit): string => {
  switch (unit) {
    case "hours":
      return `${(minutes / 60).toFixed(1)} hrs`;
    case "days":
      return `${(minutes / 60 / 24).toFixed(1)} days`;
    default:
      return `${minutes.toLocaleString()} min`;
  }
};

const cycleUnit = (current: TimeUnit): TimeUnit => {
  const order: TimeUnit[] = ["minutes", "hours", "days"];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
};

const HomePage = () => {
  const [totalTimeUnit, setTotalTimeUnit] = useState<TimeUnit>("minutes");
  const [classUnit, setClassUnit] = useState<TimeUnit>("minutes");
  const [gradeUnit, setGradeUnit] = useState<TimeUnit>("minutes");
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
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Hero Content */}
            <div className="animate-fade-in space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/20 px-4 py-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-brand-yellow" />
                <span>Supporting readers since 2010</span>
              </div>

              <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="text-muted-foreground">Every Page </span>
                <span className="text-foreground">Counts</span>
                <span className="text-muted-foreground">.</span>
              </h1>

              <p className="max-w-lg text-lg text-muted-foreground">
                Join thousands of students, families, and sponsors in our community reading 
                challenge. Track progress, earn pledges, and make reading a celebration.
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
                  <p className="font-handwritten text-4xl text-brand-blue">50K+</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div>
                  <p className="font-handwritten text-4xl text-brand-blue">2M+</p>
                  <p className="text-sm text-muted-foreground">Minutes Read</p>
                </div>
                <div>
                  <p className="font-handwritten text-4xl text-brand-blue">$500K+</p>
                  <p className="text-sm text-muted-foreground">Raised</p>
                </div>
              </div>
            </div>

            {/* Hero Visual - Book Container with Progress Ring */}
            <div className="relative animate-scale-in">
              <h2 className="mb-4 text-center font-serif text-2xl text-brand-blue">Emma's Reading Journey</h2>
              <BookContainer variant="default" className="min-h-[450px] w-full max-w-lg">
                <div className="flex flex-col items-center gap-4 py-6">
                  <ReadingGoalRing progress={1890} goal={600} size={140} />
                  
                  {/* Stats Grid */}
                  <div className="mt-2 grid w-full grid-cols-2 gap-4 px-4">
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <span className="text-xs text-muted-foreground">Reading Goal</span>
                      <span className="font-handwritten text-2xl text-brand-blue">600 min</span>
                    </div>
                    <div 
                      className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                      onClick={() => setTotalTimeUnit(cycleUnit(totalTimeUnit))}
                    >
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">Total Time Read</span>
                      <span className="font-handwritten text-2xl text-brand-blue">{formatTime(1890, totalTimeUnit)}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <span className="text-xs text-muted-foreground">Minutes Today</span>
                      <span className="font-handwritten text-2xl text-brand-blue">45 min</span>
                    </div>
                    <div 
                      className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                      onClick={() => setClassUnit(cycleUnit(classUnit))}
                    >
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">My Class Has Read</span>
                      <span className="font-handwritten text-2xl text-brand-blue">{formatTime(12450, classUnit)}</span>
                    </div>
                    <div 
                      className="relative flex cursor-pointer flex-col items-center rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                      onClick={() => setGradeUnit(cycleUnit(gradeUnit))}
                    >
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">My Grade Has Read</span>
                      <span className="font-handwritten text-2xl text-brand-blue">{formatTime(48200, gradeUnit)}</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">Money I've Raised</span>
                      <span className="font-handwritten text-2xl text-brand-green">$127.50</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <span className="text-xs text-muted-foreground">My Sponsors</span>
                      <span className="font-handwritten text-2xl text-brand-blue">8</span>
                    </div>
                    <div className="relative flex flex-col items-center rounded-lg bg-muted/50 p-3">
                      <Star className="absolute -right-1 -top-1 h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      <span className="text-xs text-muted-foreground">Books I've Read</span>
                      <span className="font-handwritten text-2xl text-brand-blue">12</span>
                    </div>
                  </div>
                </div>
              </BookContainer>
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-brand-yellow/30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-normal text-foreground md:text-4xl">
              How Read-a-thon Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A simple, fun way to encourage reading while raising funds for your school.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "1. Register & Read",
                description:
                  "Students sign up through their school and start logging their reading minutes daily.",
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
                  "Track your progress, exceed goals, and celebrate achievements with your community.",
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

      {/* Features Section */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                Built for Students, Parents & Schools
              </h2>
              <p className="text-muted-foreground">
                Our platform makes it easy for everyone to participate in the reading challenge.
              </p>

              <ul className="space-y-4">
                {[
                  {
                    icon: BookOpen,
                    title: "Easy Reading Logs",
                    description: "Students can log their reading in seconds from any device.",
                  },
                  {
                    icon: Heart,
                    title: "Sponsor Management",
                    description: "Parents easily manage pledges and track sponsorships.",
                  },
                  {
                    icon: Trophy,
                    title: "Progress Tracking",
                    description: "Visual progress rings show how close students are to their goals.",
                  },
                ].map((feature, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual demo with multiple progress rings */}
            <div className="relative">
              <BookContainer variant="warm" className="p-8">
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-brand-blue">Class Leaderboard</h3>
                  
                  {[
                    { name: "Emma S.", progress: 720, goal: 600 },
                    { name: "Liam T.", progress: 540, goal: 600 },
                    { name: "Olivia R.", progress: 480, goal: 600 },
                  ].map((student, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg bg-background/80 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="font-handwritten text-lg text-muted-foreground">
                          {student.progress} / {student.goal} min
                        </p>
                      </div>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-progress-bg">
                        <div
                          className="h-full bg-brand-blue transition-all duration-500"
                          style={{ width: `${Math.min((student.progress / student.goal) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </BookContainer>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue py-16 text-white md:py-24">
        <div className="container text-center">
          <BookIcon size="large" variant="white" className="mx-auto mb-6" />
          <h2 className="mb-4 font-serif text-3xl font-normal md:text-4xl">Ready to Start Your Read-a-thon?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Join our community of readers and make every page count. Registration is free for students.
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

import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Clock, Users, Heart } from "lucide-react";
import bookshelfBand from "@/assets/bookshelf-band.png";
import childReading from "@/assets/child-reading.png";
import bookStack from "@/assets/book-stack.png";

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-background-warm py-12 md:py-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <BookOpen className="h-4 w-4" />
                <span>Janney Elementary Read-a-thon</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-tight">
                Every Page Counts.
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                From February 24–March 9, students read to support Janney Elementary. 
                Ask friends and family to pledge per minute—or give a flat donation—and 
                help fund the programs that make Janney exceptional.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-8 shadow-sm"
                  >
                    Start Reading
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="text-primary hover:bg-primary/5"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src={childReading} 
                alt="Child reading a book" 
                className="max-w-xs md:max-w-sm w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-serif text-foreground">128,400</p>
              <p className="text-sm text-muted-foreground mt-1">Minutes Logged</p>
            </div>
            <div className="text-center p-4 border-x border-border">
              <p className="text-3xl md:text-4xl font-serif text-foreground">4,875</p>
              <p className="text-sm text-muted-foreground mt-1">Books Completed</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-serif text-foreground">$21,320</p>
              <p className="text-sm text-muted-foreground mt-1">Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bookshelf Decoration */}
      <div className="w-full overflow-hidden bg-[#FAF5E8]">
        <img 
          src={bookshelfBand} 
          alt="" 
          className="w-full h-auto max-h-24 object-cover object-center"
        />
      </div>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple way for students to read, fundraise, and celebrate success together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      1. Sign Up & Set Goals
                    </h3>
                    <p className="text-muted-foreground">
                      Create your profile and choose your reading targets. Each child gets a unique sponsor link.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      2. Read & Track Progress
                    </h3>
                    <p className="text-muted-foreground">
                      Log your reading time and watch your progress grow. Parents can approve logs from any device.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      3. Share with Sponsors
                    </h3>
                    <p className="text-muted-foreground">
                      Invite family and friends to pledge their support—per minute read or as a flat donation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      4. Celebrate Success
                    </h3>
                    <p className="text-muted-foreground">
                      At the end, sponsors pay their pledges and funds go directly to supporting our school.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Making a Difference */}
      <section className="py-16 md:py-24 bg-background-warm">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Text and Stats */}
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Making a Difference
              </h2>
              <p className="text-muted-foreground mb-8">
                Your participation helps provide books, resources, and enrichment programs for our school community.
              </p>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 text-center shadow-sm">
                  <p className="text-2xl md:text-3xl font-serif text-foreground">620</p>
                  <p className="text-xs text-muted-foreground mt-1">Pages Read</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center shadow-sm">
                  <p className="text-2xl md:text-3xl font-serif text-foreground">1,125</p>
                  <p className="text-xs text-muted-foreground mt-1">Minutes Logged</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center shadow-sm">
                  <p className="text-2xl md:text-3xl font-serif text-foreground">16</p>
                  <p className="text-xs text-muted-foreground mt-1">Books Completed</p>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="order-1 md:order-2 flex justify-center">
              <img 
                src={bookStack} 
                alt="Stack of colorful books" 
                className="max-w-48 md:max-w-64 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Ready to Join the Read-a-thon?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Create your family account and start logging reading minutes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg px-8"
              >
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-lg px-8"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Bookshelf */}
      <div className="w-full overflow-hidden bg-[#FAF5E8]">
        <img 
          src={bookshelfBand} 
          alt="" 
          className="w-full h-auto max-h-24 object-cover object-center"
        />
      </div>
    </PublicLayout>
  );
};

export default HomePage;

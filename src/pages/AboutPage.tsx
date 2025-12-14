import { PublicLayout } from "@/components/layout";
import { BookContainer, Logo, BookIcon } from "@/components/legacy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Heart, Target, Award, BookOpen } from "lucide-react";

const AboutPage = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Logo size="large" className="mx-auto mb-6" />
            <h1 className="mb-4 font-serif text-4xl font-normal text-foreground md:text-5xl">
              About Read-a-thon
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Inspiring a lifelong love of reading while supporting schools and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-background py-16">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <BookContainer variant="warm" className="p-8">
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-brand-blue">Our Mission</h2>
                <p className="text-muted-foreground">
                  Read-a-thon was founded with a simple belief: every child deserves the opportunity 
                  to discover the joy of reading. We combine the excitement of friendly competition 
                  with community support to create meaningful reading experiences.
                </p>
                <p className="text-muted-foreground">
                  Since 2010, we have helped thousands of students build reading habits while 
                  raising funds for their schools. Our platform makes it easy for families, 
                  teachers, and sponsors to participate in this rewarding journey.
                </p>
              </div>
            </BookContainer>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, value: "50,000+", label: "Students Participated" },
                { icon: School, value: "200+", label: "Schools Served" },
                { icon: BookOpen, value: "2M+", label: "Minutes Read" },
                { icon: Heart, value: "$500K+", label: "Funds Raised" },
              ].map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="mx-auto mb-2 h-8 w-8 text-brand-blue" />
                    <p className="font-handwritten text-3xl text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background-warm py-16">
        <div className="container">
          <h2 className="mb-12 text-center font-serif text-3xl font-normal text-foreground">Our Values</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: "Goal-Oriented",
                description:
                  "We believe in setting achievable reading goals that challenge and motivate students to read more.",
              },
              {
                icon: Heart,
                title: "Community-Driven",
                description:
                  "Our platform connects families, friends, and communities to support young readers together.",
              },
              {
                icon: Award,
                title: "Celebration of Success",
                description:
                  "Every minute read is an achievement. We celebrate progress at every stage of the journey.",
              },
            ].map((value, index) => (
              <Card key={index} className="border-0 bg-card shadow-md">
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/20 text-brand-blue">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="bg-background py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <BookContainer variant="default" className="p-8">
              <div className="space-y-6 text-center">
                <BookIcon size="large" variant="primary" className="mx-auto" />
                <h2 className="font-serif text-2xl font-normal text-foreground">
                  Privacy & Child Safety
                </h2>
                <p className="text-muted-foreground">
                  We take the privacy and safety of our young readers seriously. Our platform is 
                  designed with COPPA and GDPR compliance in mind. We collect minimal data, never 
                  store birth dates or full names of children, and give parents full control over 
                  their family&apos;s information.
                </p>
                <p className="text-sm text-muted-foreground">
                  All financial transactions are processed securely through Square, and we never 
                  store payment information on our servers.
                </p>
              </div>
            </BookContainer>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;

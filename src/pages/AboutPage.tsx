import { PublicLayout } from "@/components/layout";
import { Users, School, Heart, Target, Award, BookOpen } from "lucide-react";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import openBook from "@/assets/open-book.png";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

const AboutPage = () => {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-background-warm py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl font-normal text-foreground md:text-5xl relative inline-block">
              <span className="relative">
                About
                {/* Highlighter effect */}
                <span 
                  className="absolute inset-0 -skew-y-1 bg-accent/50 -z-10"
                  style={{
                    top: '45%',
                    height: '55%',
                    left: '-4%',
                    right: '-4%',
                    borderRadius: '4px 8px 4px 6px',
                  }}
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Inspiring a lifelong love of reading while supporting schools and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Hand-drawn section divider */}
      <div 
        className="w-full"
        style={{ borderTop: 'solid 2px #41403E' }}
      />

      {/* Mission */}
      <section className="py-16 relative overflow-hidden">
        {/* Bookshelf band background */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${booksShelfBannerV2})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 40%',
            backgroundPosition: 'center bottom',
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div 
              className="bg-background p-8"
              style={handDrawnBorder}
            >
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-primary">Our Mission</h2>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, value: "50,000+", label: "Students Participated" },
                { icon: School, value: "200+", label: "Schools Served" },
                { icon: BookOpen, value: "2M+", label: "Minutes Read" },
                { icon: Heart, value: "$500K+", label: "Funds Raised" },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-background p-6 text-center"
                  style={handDrawnBorder}
                >
                  <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-serif text-3xl text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hand-drawn section divider */}
      <div 
        className="w-full"
        style={{ borderTop: 'solid 2px #41403E' }}
      />

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
              <div 
                key={index} 
                className="bg-background p-6"
                style={handDrawnBorder}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-primary">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Safety */}
      <section className="py-16 bg-primary relative overflow-hidden">
        {/* Subtle tiled background */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="flex flex-wrap justify-center items-center gap-12 h-full">
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
          </div>
        </div>

        <div className="container relative">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-primary-foreground/80" />
              <h2 className="font-serif text-2xl font-normal text-primary-foreground md:text-3xl">
                Privacy & Child Safety
              </h2>
              <p className="text-primary-foreground/80">
                We take the privacy and safety of our young readers seriously. Our platform is 
                designed with COPPA compliance in mind. We collect minimal data, never 
                store birth dates or full names of children, and give parents full control over 
                their family's information.
              </p>
              <p className="text-sm text-primary-foreground/60">
                All financial transactions are processed securely through Square, and we never 
                store payment information on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;

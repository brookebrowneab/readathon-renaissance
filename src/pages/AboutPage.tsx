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
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto px-4 md:px-0 md:pl-14 lg:pl-20 md:ml-[30px]">
            {/* Large headline with highlighter effect */}
            <div className="relative inline-block mb-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-foreground leading-[1.05] relative">
                <span className="relative">
                  About Read-a-thon
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

      {/* Stats Section */}
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto bg-background p-6 md:p-10"
            style={handDrawnBorder}
          >
            {[
              { icon: Users, value: "50,000+", label: "Students Participated" },
              { icon: School, value: "200+", label: "Schools Served" },
              { icon: BookOpen, value: "2M+", label: "Minutes Read" },
              { icon: Heart, value: "$500K+", label: "Funds Raised" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 md:h-8 md:w-8 text-primary" />
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hand-drawn section divider */}
      <div 
        className="w-full"
        style={{ borderTop: 'solid 2px #41403E' }}
      />

      {/* Mission Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
              Our Mission
            </h2>
            <div 
              className="bg-background p-6 md:p-8 space-y-4"
              style={handDrawnBorder}
            >
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Read-a-thon was founded with a simple belief: every child deserves the opportunity 
                to discover the joy of reading. We combine the excitement of friendly competition 
                with community support to create meaningful reading experiences.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Since 2010, we have helped thousands of students build reading habits while 
                raising funds for their schools. Our platform makes it easy for families, 
                teachers, and sponsors to participate in this rewarding journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
              Our Values
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
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
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Safety CTA */}
      <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
        {/* Subtle tiled background */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="flex flex-wrap justify-center items-center gap-12 h-full">
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
            <img src={openBook} alt="" className="w-48 h-auto invert" aria-hidden="true" />
          </div>
        </div>
        
        <div className="container text-center relative">
          <div className="max-w-2xl mx-auto">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
            <h2 className="font-serif text-3xl md:text-4xl text-primary-foreground mb-3">
              Privacy & Child Safety
            </h2>
            <p className="text-sm md:text-base text-primary-foreground/80 mb-4 leading-relaxed">
              We take the privacy and safety of our young readers seriously. Our platform is 
              designed with COPPA and GDPR compliance in mind. We collect minimal data, never 
              store birth dates or full names of children, and give parents full control over 
              their family's information.
            </p>
            <p className="text-xs text-primary-foreground/60">
              All financial transactions are processed securely through Square, and we never 
              store payment information on our servers.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;

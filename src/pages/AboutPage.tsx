import { PublicLayout } from "@/components/layout";
import { Users, School, Heart, Target, Award, BookOpen } from "lucide-react";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";
import openBook from "@/assets/open-book.png";
import {
  useSiteContentMultiple,
  parseJsonContent,
  DEFAULT_CONTENT,
} from "@/hooks/useSiteContent";

const handDrawnBorder = {
  border: 'solid 1px #41403E',
  borderTopLeftRadius: '255px 15px',
  borderTopRightRadius: '15px 225px',
  borderBottomRightRadius: '225px 15px',
  borderBottomLeftRadius: '15px 255px',
};

// Icon mapping for dynamic content
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  School,
  Heart,
  Target,
  Award,
  BookOpen,
};

const AboutPage = () => {
  // Fetch dynamic content
  const { content } = useSiteContentMultiple([
    "about.mission_title",
    "about.mission_text",
    "about.statistics",
    "about.values",
    "about.privacy_text",
  ]);

  // Parse content with fallbacks
  const missionTitle = content["about.mission_title"] || "Our Mission";
  const missionText = content["about.mission_text"] || DEFAULT_CONTENT["about.mission_text"];
  const statistics = parseJsonContent<Array<{ icon: string; value: string; label: string }>>(
    content["about.statistics"],
    JSON.parse(DEFAULT_CONTENT["about.statistics"])
  );
  const values = parseJsonContent<Array<{ icon: string; title: string; description: string }>>(
    content["about.values"],
    JSON.parse(DEFAULT_CONTENT["about.values"])
  );
  const privacyText = content["about.privacy_text"] || DEFAULT_CONTENT["about.privacy_text"];

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
              className="bg-background p-8 max-h-80 overflow-y-auto"
              style={handDrawnBorder}
            >
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-primary">{missionTitle}</h2>
                {missionText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {statistics.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || Users;
                return (
                  <div 
                    key={index} 
                    className="bg-background p-6 text-center"
                    style={handDrawnBorder}
                  >
                    <IconComponent className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="font-serif text-3xl text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
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
            {values.map((value, index) => {
              const IconComponent = iconMap[value.icon] || Target;
              return (
                <div 
                  key={index} 
                  className="bg-background p-6"
                  style={handDrawnBorder}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-primary">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
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
                {privacyText}
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

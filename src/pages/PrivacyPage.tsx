import { PublicLayout } from "@/components/layout";
import booksShelfDivider from "@/assets/books-shelf-divider.png";
import booksShelfBannerV2 from "@/assets/books-shelf-banner-v2.png";

const PrivacyPage = () => {
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
                  Privacy Policy
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
            <p className="text-sm text-muted-foreground">
              Last updated: February 13, 2022
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

      {/* Intro Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              This Web site is owned and operated by the Janney Elementary School PTA, a 501(c)(3) non-profit organization headquartered at 4130 Albemarle St. NW Washington, DC 20016, USA ("the Janney Elementary School PTA" or "we"). Our online properties comprise of, but are not limited to, all pages found on our main site (www.janneyschool.org), the Janney 5K (www.janney5k.org), the Janney Read-a-thon, and certain partner sites.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The Janney Elementary School PTA is committed to respecting and protecting the privacy of our visitors. This privacy policy discloses how we collect, protect, and use Personal Data you provide or we collect online, as well as how we protect children's privacy. "Personal Data" is any information relating to an identified or identifiable person, for example, your e-mail address, name, or phone number.
            </p>
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

      {/* Personal Data Collection */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Personal Data Collection
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              At our site, we do not collect Personal Data from individuals unless they provide it to us voluntarily and knowingly. This means we do not require you to register or provide information to us in order to view our site. The Janney Elementary School PTA only gathers Personal Data on our site, such as names, addresses, Zip/postal codes, email addresses, etc., when voluntarily submitted by a visitor.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              The Janney Elementary School PTA may automatically collect certain technical information from your computer such as your Internet service provider, your Internet Protocol address, your browser type, your operating system, the web pages viewed, and the search terms entered to get to our site. This information will only be used and processed by us to improve and customize our services.
            </p>
          </div>
        </div>
      </section>

      {/* Use and Sharing - with bookshelf background */}
      <section className="py-10 md:py-14 relative overflow-hidden">
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
          <div 
            className="max-w-4xl mx-auto bg-background p-6 md:p-10"
            style={{
              border: 'solid 1px #41403E',
              borderTopLeftRadius: '255px 15px',
              borderTopRightRadius: '15px 225px',
              borderBottomRightRadius: '225px 15px',
              borderBottomLeftRadius: '15px 255px',
            }}
          >
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Use and Sharing of Personal Data
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              The Personal Data you provide is used for general business purposes including membership activities, program participation, and fundraising activities. We do not sell Personal Data to third parties.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              We may share Personal Data with:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "School staff and faculty",
                "Service providers who help operate the site",
                "To facilitate PTA programs and services",
                "To comply with legal processes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We do not share or exchange your Personal Data with third parties for their fundraising or marketing purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Children's Privacy
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              The Janney Elementary School PTA is committed to providing a safe, secure, and fun online experience for children who visit our site. We are dedicated to safeguarding any Personal Data collected online and to helping parents and children have positive experiences on the Internet.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              We will never knowingly request Personal Data from anyone under the age of 13 without prior verifiable parental consent. With parental consent, we may collect Personal Data from children under 13 such as name, address, email address, and account information.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              Parents can revoke their consent and ask that information about their children be deleted from the site. When a parent revokes consent, we will stop collecting, using, processing, or disclosing information from that child.
            </p>

            <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3">
              Submissions
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We follow the guidelines for interactive electronic media published by the Children's Advertising Review Unit (CARU) of the Better Business Bureau. We encourage children to participate only with their parent's knowledge and supervision, and to use an alias or first name for any activities involving public posting.
            </p>
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

      {/* Cookies */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Use of Cookies and Similar Technologies
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
              "Cookies" are small text files a Web site can use to recognize repeat visitors and facilitate ongoing access. Cookies are not programs that damage files. If you do not want information collected through cookies, most browsers allow you to deny or accept the cookie feature.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We use cookie technology to improve your online experience and facilitate your visit within our site. Cookies expire after they have fulfilled their purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Security - Featured section */}
      <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-primary-foreground mb-4">
              Our Security Safeguards
            </h2>
            <p className="text-sm md:text-base text-primary-foreground/80 leading-relaxed mb-6">
              The safety and security of your online experience is of the utmost concern to us.
            </p>
            
            <div 
              className="bg-background p-6 md:p-8 text-left"
              style={{
                border: 'solid 1px #41403E',
                borderTopLeftRadius: '255px 15px',
                borderTopRightRadius: '15px 225px',
                borderBottomRightRadius: '225px 15px',
                borderBottomLeftRadius: '15px 255px',
              }}
            >
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                We take measures to implement reasonable physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access.
              </p>
              <p className="text-sm font-medium text-foreground mb-3">Security measures we employ:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  "Row Level Security (RLS) policies",
                  "Encrypted data transmission (HTTPS/TLS)",
                  "Secure authentication with email verification",
                  "No credit card storage on our servers",
                  "Regular security audits",
                  "Secure password handling",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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

      {/* Your Rights */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              Your Rights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl text-foreground mb-2">
                  Marketing Communications
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  We do not use your data for marketing. Communications you receive from the Janney Read-a-thon will be about the Janney Read-a-thon only. Emails collected for the Read-a-Thon are stored separately from other email databases.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl text-foreground mb-2">
                  Access, Correct, and Delete Your Data
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  You have the right to ask us which Personal Data we hold about you, and to correct or delete it. Contact us by mail at: Janney Elementary School PTA, 4130 Albemarle St. NW, Washington, DC 20016.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 md:py-14 bg-background-warm">
        <div className="container">
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
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
              How to Contact Us
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              If you have any questions about our Privacy Policy, you can contact us at:
            </p>
            <address className="not-italic text-sm md:text-base text-foreground mb-4">
              <strong>Janney Elementary School PTA</strong><br />
              4130 Albemarle St. NW<br />
              Washington, DC 20016
            </address>
            <p className="text-sm md:text-base">
              <a 
                href="mailto:janneyreadathon@janneyschool.org" 
                className="text-accent hover:underline font-medium"
              >
                janneyreadathon@janneyschool.org
              </a>
            </p>
            <p className="text-xs text-muted-foreground/70 italic mt-6">
              Thank you for visiting our site.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPage;

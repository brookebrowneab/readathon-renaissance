import { PublicLayout } from "@/components/layout";
import booksShelfDivider from "@/assets/books-shelf-divider.png";

const PrivacyPage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#e8f4f8] to-white py-16">
        <div className="container max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: February 13, 2022
          </p>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="w-full -mt-2 relative z-10">
        <img
          src={booksShelfDivider}
          alt=""
          className="w-full h-auto object-cover"
          style={{ maxHeight: 90 }}
        />
      </div>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <p className="lead text-lg text-muted-foreground mb-8">
              This Web site is owned and operated by the Janney Elementary School PTA, a 501(c)(3) non-profit organization headquartered at 4130 Albemarle St. NW Washington, DC 20016, USA ("the Janney Elementary School PTA" or "we"). Our online properties comprise of, but are not limited to, all pages found on our main site (www.janneyschool.org), the Janney 5K (www.janney5k.org), the Janney Read-a-thon, and certain partner sites. This privacy policy applies to these sites and other sites, mobile apps or other online services we operate that link to this policy (collectively, referred to below as the site).
            </p>

            <p className="mb-8">
              The Janney Elementary School PTA is committed to respecting and protecting the privacy of our visitors. This privacy policy discloses how we collect, protect, and use Personal Data you provide or we collect online, as well as how we protect children's privacy. "Personal Data" is any information relating to an identified or identifiable person, for example, your e-mail address, name, or phone number. If our policy practices change in the future, we will let you know by posting our revised privacy policy on our site. By using the pages on this site or other services covered by the posted Privacy Policy, you are accepting the practices described in the Privacy Policy.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Personal Data Collection</h2>
            <p className="mb-4">
              At our site, we do not collect Personal Data from individuals unless they provide it to us voluntarily and knowingly and as described in this Privacy Policy. This means we do not require you to register or provide information to us in order to view our site. The Janney Elementary School PTA only gathers Personal Data on our site, such as names, addresses, Zip/postal codes, email addresses, etc., when voluntarily submitted by a visitor. Once collected, we may combine this information with other information collected from external sources, where permitted by applicable law.
            </p>
            <p className="mb-8">
              The Janney Elementary School PTA may automatically collect certain technical information from your computer such as your Internet service provider, your Internet Protocol address, your browser type, your operating system, the web pages viewed, the web pages viewed immediately before and after accessing the Web site, and the search terms entered to get to our site. This information may contain Personal Data. This information will only be used and processed by us to improve and customize our services. We and our service providers may collect this information using "cookies," which are small text files that many websites save on your computer, or similar technologies. See the section on "Use of Cookies and Similar Technology" below for more information.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Use and Sharing of Personal Data</h2>
            <p className="mb-4">
              The Personal Data you provide and that we collect is used and processed by the Janney Elementary School PTA and other entities who are involved by us in the operation of this site or who provide support for the Janney Elementary School PTA mission and programs, for general business purposes and for the purposes for which you provided the information. General business purposes are the Janney Elementary School PTA membership activities, program participation, marketing, promotions, sales, merchandising, and fundraising activities and communications. The purposes for which you provide information includes, for example, our use of your Personal Data to process online transactions, purchases, and donations, facilitate participation in the Janney Elementary School PTA programs, promotions and services, or process job applications.
            </p>
            <p className="mb-4">
              We do not sell Personal Data or other information you provide to us online with third parties. We may share Personal Data with the following categories of third parties:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>With school staff and faculty</li>
              <li>When the person submitting the information authorizes us to share it</li>
              <li>When sharing the information is with a service provider in furtherance of our operations or the operation of the site, for instance, to process a purchase or other transaction you make</li>
              <li>To facilitate participation in the Janney Elementary School PTA programs, promotions, and services</li>
              <li>To comply with legal processes such as a subpoena or court order or to otherwise protect your or our legal rights</li>
              <li>For other purposes for which you provided the information</li>
            </ul>
            <p className="mb-8">
              The Janney Elementary School PTA has no control over or responsibility for the data collection and use practices of third parties that process online transactions. We do not share or exchange your Personal Data collected online or offline with third parties for their fundraising or marketing purposes, and only in accordance with applicable law and any required consents. Your Personal Data is collected through, stored, and processed by us or our service providers in the United States of America.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Children's Privacy</h2>
            <p className="mb-4">
              The Janney Elementary School PTA is committed to providing a safe, secure, and fun online experience for children who visit our site. We are dedicated to safeguarding any Personal Data collected online and to helping parents and children have positive experiences on the Internet.
            </p>
            <p className="mb-4">
              We will never knowingly request Personal Data from anyone under the age of 13 without prior verifiable parental consent. With parental consent, we may collect Personal Data from children under the age of 13 such as: name, address, email address, account information, and user generated content. This information allows us to fulfill a requested transaction and facilitate participation in online programs, keep records, undertake certain marketing activities (only in accordance with applicable law and any required consents), or to otherwise customize or enhance the Web site experience for children.
            </p>
            <p className="mb-4">
              Children under the age of 13 may be able to make certain content such as user generated content visible to others or the public. However, absent parental consent, children under 13 would be allowed to display only limited information such as a first name or unique user name or other information that does not allow for online contacting by third parties.
            </p>
            <p className="mb-8">
              Regardless of what information is displayed, parents can revoke their consent and ask that information about their children be deleted from the site. To do this or to review Personal Data collected from children, we must verify the identity of the requesting parent. When a parent revokes consent, we will stop collecting, using, processing, or disclosing information from that child.
            </p>

            <h3 className="text-xl font-display text-primary mt-8 mb-4">Submissions</h3>
            <p className="mb-8">
              The Janney Elementary School PTA welcomes children to learn more about our organization and, where appropriate, participate in polls and surveys, as well as submit comments, artwork, writings, and other submissions for posting on our Web site. For this reason, the Janney Elementary School PTA follows the guidelines for interactive electronic media published by the Children's Advertising Review Unit (CARU) of the Better Business Bureau for pages targeted to children under 13. However, we encourage this be done only with their parent's knowledge and supervision. We also encourage children to use an alias (e.g., "Bookworm", "Skater", etc.), first name, nickname, initials, or other alternative to full names or screen names which correspond with an email address for any activities which will involve public posting.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Use of Cookies and Similar Technologies</h2>
            <p className="mb-4">
              Visitors should be aware that Personal Data and non-personal information and data may be automatically collected by the Janney Elementary School PTA Web site through the use of "cookies" or other similar technologies such as web beacons. "Cookies" are small text files a Web site can use to recognize repeat visitors, facilitate the visitor's ongoing access to and use of the site, and allow a site to track usage behavior and compile aggregate data that will allow content improvements.
            </p>
            <p className="mb-4">
              Cookies are not programs that come onto a visitor's system and damage files. Generally, cookies work by assigning a unique number to the visitor that has no meaning outside the assigning site. If a visitor does not want information collected through the use of cookies, there is a simple procedure in most browsers that allows the visitor to deny or accept the cookie feature.
            </p>
            <p className="mb-8">
              The Janney Elementary School PTA may use "cookie" technology only to obtain information including Personal Data from its online visitors in order to improve visitors' online experience and facilitate their visit within our site. The Janney Elementary School PTA may use web beacons to improve website services, conduct website analytics, first party advertising relating to us and our sponsors, and to optimize the browsing experience. Cookies expire after they have fulfilled their purpose.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Links to Other Web Sites and Services</h2>
            <p className="mb-8">
              This site may be linked to other sites and services that are not maintained by the Janney Elementary School PTA. These Web sites have their own privacy policies, which you should review prior to visiting them. We have no responsibility for linked Web sites and provide these links solely for the convenience and information of our visitors.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Our Security Safeguards</h2>
            <p className="mb-4">
              The safety and security of your online experience is of the utmost concern to us. We take measures to implement reasonable physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access, maintain data security, and correctly use the information we collect online.
            </p>
            <p className="mb-4">
              <strong>Security measures we employ include:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Row Level Security (RLS) policies to ensure users can only access their own data</li>
              <li>Encrypted data transmission using HTTPS/TLS</li>
              <li>Secure authentication with email verification</li>
              <li>No storage of credit card information on our servers</li>
              <li>Regular security audits and monitoring</li>
            </ul>

            <h3 className="text-xl font-display text-primary mt-8 mb-4">Credit Card Safety</h3>
            <p className="mb-4">
              Protecting the safety of your credit card information is also important to us; so, we do not process any credit card transactions directly. Instead our site will direct you to a third-party vendor who will be able to process any transactions securely.
            </p>
            <p className="mb-8">
              It is important for you to protect against unauthorized access to your password and to your computer. Be sure to sign off when finished using a shared computer.
            </p>

            <h3 className="text-xl font-display text-primary mt-8 mb-4">Children</h3>
            <p className="mb-8">
              If you are under 18, you need parent/guardian permission to use a credit card to make purchases online.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Your Right to Opt Out from Receiving Marketing Communications</h2>
            <p className="mb-8">
              We do not use your data for marketing. Communications you receive from the Janney Read-a-thon will be about the Janney Read-a-thon. We do not include schoolwide emails or other related listservs here when discussing marketing and data. Emails collected for the Read-a-Thon are stored and accessed separately from other email databases the school and the PTA utilize.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">Your Right to Access, Correct, and Delete Your Personal Data</h2>
            <p className="mb-8">
              You have the right to ask us which Personal Data we hold about you. In addition, you have the right to correct or delete Personal Data we hold about you. If you want to request a correction or deletion of the Personal Data we hold about you, you must contact us by mail at: the Janney Elementary School PTA, 4130 Albemarle St. NW, Washington, DC 20016, Attention: Janney Elementary Parent Teacher Association.
            </p>

            <h2 className="text-2xl font-display text-primary mt-12 mb-4">How to Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our Privacy Policy, you can contact us at:
            </p>
            <address className="not-italic mb-4">
              <strong>Janney Elementary School PTA</strong><br />
              4130 Albemarle St. NW<br />
              Washington, DC 20016
            </address>
            <p className="mb-8">
              <strong>Email:</strong>{" "}
              <a 
                href="mailto:janneyreadathon@janneyschool.org" 
                className="text-accent hover:underline"
              >
                janneyreadathon@janneyschool.org
              </a>
            </p>

            <p className="text-muted-foreground italic">
              Thank you for visiting our site.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default PrivacyPage;

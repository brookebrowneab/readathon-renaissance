import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import booksHero from "@/assets/books-hero.png";
import booksShelf from "@/assets/books-shelf.png";
import watercolorBg from "@/assets/watercolor-bg.jpg";

const HomePage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center"
        style={{
          backgroundImage: `url(${watercolorBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container relative py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left animate-fade-in space-y-6">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-slate-800">
                Read More. Grow Together.
              </h1>

              <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                Join our school read-a-thon to inspire a love of reading and support our students.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-slate-400" />
                </div>
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-slate-700 text-white hover:bg-slate-800 rounded-md px-8"
                  >
                    Start Reading
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button 
                    variant="ghost" 
                    size="lg"
                    className="text-slate-700 hover:bg-transparent hover:text-slate-900"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:flex justify-end">
              <img 
                src={booksHero} 
                alt="Stack of books illustration" 
                className="max-w-md w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white/60 backdrop-blur-sm border-y border-slate-200/50">
        <div className="container">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 border-r border-slate-200 last:border-r-0">
              <p className="text-3xl md:text-4xl font-serif text-slate-800">128,400</p>
              <p className="text-sm text-slate-500 mt-1">Minutes Logged</p>
            </div>
            <div className="text-center p-4 border-r border-slate-200">
              <p className="text-3xl md:text-4xl font-serif text-slate-800">4,875</p>
              <p className="text-sm text-slate-500 mt-1">Books Completed</p>
            </div>
            <div className="text-center p-4">
              <p className="text-3xl md:text-4xl font-serif text-slate-800">$21,320</p>
              <p className="text-sm text-slate-500 mt-1">Funds Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section 
        className="relative py-16 md:py-24"
        style={{
          backgroundImage: `url(${watercolorBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="container">
          <h2 className="text-center font-serif text-3xl md:text-4xl text-slate-800 mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-slate-800 mb-2">
                <span className="text-slate-400 mr-2">1.</span>
                Sign Up & Set Goals
              </h3>
              <p className="text-slate-600">
                Create your profile and choose your reading targets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-slate-800 mb-2">
                <span className="text-slate-400 mr-2">2.</span>
                Read & Track Progress
              </h3>
              <p className="text-slate-600">
                Log your reading time and watch your progress grow.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-slate-800 mb-2">
                <span className="text-slate-400 mr-2">3.</span>
                Share with Sponsors
              </h3>
              <p className="text-slate-600">
                Invite family and friends to pledge their support.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 p-6 shadow-sm">
              <h3 className="font-serif text-xl text-slate-800 mb-2">
                <span className="text-slate-400 mr-2">4.</span>
                Celebrate Success
              </h3>
              <p className="text-slate-600">
                Reach your goals and celebrate with prizes!
              </p>
            </div>
          </div>
        </div>

        {/* Book shelf decoration */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
          <img 
            src={booksShelf} 
            alt="" 
            className="w-full max-h-32 object-cover object-top opacity-60"
          />
        </div>
      </section>

      {/* Making a Difference */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
              Making a Difference
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Your participation helps provide books and resources to our school.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Pages Read</p>
                <p className="text-2xl md:text-3xl font-serif text-slate-800">620</p>
              </div>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Minutes Logged</p>
                <p className="text-2xl md:text-3xl font-serif text-slate-800">1,125</p>
              </div>
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Books Completed</p>
                <p className="text-2xl md:text-3xl font-serif text-slate-800">16</p>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex justify-center">
              <img 
                src={booksHero} 
                alt="Books illustration" 
                className="max-w-xs w-full h-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-16 md:py-24"
        style={{
          backgroundImage: `url(${watercolorBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
        <div className="container text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-slate-800 mb-4">
            Ready to Start Reading?
          </h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Join our community of readers and help support our school.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-slate-700 text-white hover:bg-slate-800 rounded-md px-8"
              >
                Register Now
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md px-8"
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

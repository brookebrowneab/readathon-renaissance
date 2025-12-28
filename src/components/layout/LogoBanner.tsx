import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";
import kidsReadingImage from "@/assets/kids-reading.jpeg";

const LogoBanner = () => {
  return (
    <div className="relative z-40">
      {/* Logo container */}
      <div className="w-full bg-card pt-4 pb-1 md:pt-6 shadow-md">
        <div className="container flex items-center pl-4">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo size="hero" />
          </Link>
        </div>
      </div>
      
      {/* Masked photo overlay - separate layer positioned on top */}
      <div 
        className="hidden md:block absolute z-50 pointer-events-none"
        style={{
          width: '450px',
          height: '582px',
          right: '0',
          bottom: '0',
          transform: 'translateY(42%)',
        }}
      >
        <svg viewBox="0 0 612 792" className="w-full h-full">
          <defs>
            <clipPath id="decorativeShapeMask">
              <path d="M35.5,335.6l161.6-178.5s58.3,1.2,109.8,43.2,59.4,119.9,59.4,119.9c0,0,62.5-29.4,131.6,1.6,65.7,29.4,81.5,91.6,81.5,91.6l-97.1,211.8s-42.6-63.1-97.5-96.6c-74-45.2-132.1-28.1-132.1-28.1,0,0-16.6-70.4-102-124.4-55.1-34.9-115.1-40.4-115.1-40.4Z"/>
            </clipPath>
          </defs>
          <image 
            href={kidsReadingImage}
            width="612"
            height="792"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#decorativeShapeMask)"
          />
        </svg>
      </div>
    </div>
  );
};

export { LogoBanner };

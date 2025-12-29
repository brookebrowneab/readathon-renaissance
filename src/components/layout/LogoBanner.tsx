import { Link } from "react-router-dom";
import { Logo } from "@/components/legacy";
import kidsReadingImage from "@/assets/kids-reading.jpeg";

interface MaskedImageProps {
  image: string;
  className?: string;
  style?: React.CSSProperties;
  flipX?: boolean;
  flipY?: boolean;
}

const MaskedImage = ({ image, className, style, flipX, flipY }: MaskedImageProps) => {
  const transform = [
    flipX ? "scaleX(-1)" : "",
    flipY ? "scaleY(-1)" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={className} style={style}>
      <svg 
        viewBox="0 0 612 792" 
        className="w-full h-full"
        style={{ transform: transform || undefined }}
      >
        <defs>
          <clipPath id={`decorativeShapeMask-${flipX}-${flipY}`}>
            <path d="M35.5,335.6l161.6-178.5s58.3,1.2,109.8,43.2,59.4,119.9,59.4,119.9c0,0,62.5-29.4,131.6,1.6,65.7,29.4,81.5,91.6,81.5,91.6l-97.1,211.8s-42.6-63.1-97.5-96.6c-74-45.2-132.1-28.1-132.1-28.1,0,0-16.6-70.4-102-124.4-55.1-34.9-115.1-40.4-115.1-40.4Z"/>
          </clipPath>
        </defs>
        <image 
          href={image}
          width="612"
          height="792"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#decorativeShapeMask-${flipX}-${flipY})`}
        />
      </svg>
    </div>
  );
};

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
      
      {/* Primary masked photo - right side */}
      <MaskedImage
        image={kidsReadingImage}
        className="hidden md:block absolute z-50 pointer-events-none"
        style={{
          width: '480px',
          height: '620px',
          right: '-20px',
          bottom: '0',
          transform: 'translateY(calc(45% - 7px))',
        }}
      />
      
      {/* Secondary masked photo - left side, flipped */}
      <MaskedImage
        image={kidsReadingImage}
        flipX
        className="hidden lg:block absolute z-40 pointer-events-none opacity-60"
        style={{
          width: '320px',
          height: '414px',
          left: '-40px',
          bottom: '0',
          transform: 'translateY(calc(70%))',
        }}
      />
      
      {/* Tertiary accent - smaller, subtle */}
      <MaskedImage
        image={kidsReadingImage}
        flipY
        className="hidden xl:block absolute z-30 pointer-events-none opacity-30"
        style={{
          width: '200px',
          height: '259px',
          right: '380px',
          bottom: '0',
          transform: 'translateY(calc(90%))',
        }}
      />
    </div>
  );
};

export { LogoBanner };

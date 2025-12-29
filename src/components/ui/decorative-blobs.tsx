import decorativeShape from "@/assets/decorative-shape.svg";
import { cn } from "@/lib/utils";

interface DecorativeBlobProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  /** Opacity from 0-100, default 5 */
  opacity?: number;
  /** Size in pixels or tailwind class, default 400 */
  size?: number | string;
  /** Color class for the blob, defaults to primary */
  colorClass?: string;
}

/**
 * Decorative blob shape for subtle background accents at section edges
 */
export const DecorativeBlob = ({
  position,
  className,
  opacity = 5,
  size = 400,
  colorClass = "text-primary",
}: DecorativeBlobProps) => {
  const positionClasses = {
    "top-left": "-top-1/4 -left-1/4 rotate-0",
    "top-right": "-top-1/4 -right-1/4 rotate-90",
    "bottom-left": "-bottom-1/4 -left-1/4 -rotate-90",
    "bottom-right": "-bottom-1/4 -right-1/4 rotate-180",
  };

  const sizeStyle = typeof size === "number" ? { width: size, height: size } : undefined;
  const sizeClass = typeof size === "string" ? size : undefined;

  return (
    <div
      className={cn(
        "absolute pointer-events-none select-none",
        positionClasses[position],
        sizeClass,
        colorClass,
        className
      )}
      style={{
        ...sizeStyle,
        opacity: opacity / 100,
      }}
      aria-hidden="true"
    >
      <img
        src={decorativeShape}
        alt=""
        className="w-full h-full"
        style={{ filter: "blur(1px)" }}
      />
    </div>
  );
};

interface DecorativeBackgroundProps {
  children: React.ReactNode;
  className?: string;
  /** Which corners to show blobs */
  blobs?: Array<"top-left" | "top-right" | "bottom-left" | "bottom-right">;
  /** Opacity for all blobs, 0-100 */
  opacity?: number;
  /** Size for all blobs */
  size?: number;
  /** Color class for blobs */
  colorClass?: string;
}

/**
 * Wrapper that adds decorative blob shapes to section backgrounds
 */
export const DecorativeBackground = ({
  children,
  className,
  blobs = ["top-right", "bottom-left"],
  opacity = 5,
  size = 400,
  colorClass,
}: DecorativeBackgroundProps) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {blobs.map((position) => (
        <DecorativeBlob
          key={position}
          position={position}
          opacity={opacity}
          size={size}
          colorClass={colorClass}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

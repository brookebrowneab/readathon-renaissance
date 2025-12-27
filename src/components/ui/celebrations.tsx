import { useEffect, useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-animations";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

interface ConfettiProps {
  isActive: boolean;
  particleCount?: number;
  duration?: number;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "hsl(var(--brand-yellow))",
  "hsl(var(--brand-blue))",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#A855F7",
];

export const Confetti = memo(function Confetti({
  isActive,
  particleCount = 30,
  duration = 2500,
  colors = defaultColors,
  className,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));

    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(timer);
  }, [isActive, particleCount, duration, colors, prefersReducedMotion]);

  if (pieces.length === 0) return null;

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-50 overflow-hidden", className)}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
});

// Star burst for milestone achievements
interface StarBurstProps {
  isActive: boolean;
  x?: number;
  y?: number;
  starCount?: number;
  className?: string;
}

export const StarBurst = memo(function StarBurst({
  isActive,
  x = 50,
  y = 50,
  starCount = 8,
  className,
}: StarBurstProps) {
  const [show, setShow] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      setShow(false);
      return;
    }

    setShow(true);
    const timer = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timer);
  }, [isActive, prefersReducedMotion]);

  if (!show) return null;

  return (
    <div
      className={cn("pointer-events-none absolute z-50", className)}
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {Array.from({ length: starCount }, (_, i) => {
        const angle = (i / starCount) * 360;
        const distance = 30 + Math.random() * 20;
        return (
          <div
            key={i}
            className="absolute animate-star-burst"
            style={{
              "--tx": `${Math.cos((angle * Math.PI) / 180) * distance}px`,
              "--ty": `${Math.sin((angle * Math.PI) / 180) * distance}px`,
              animationDelay: `${i * 0.03}s`,
            } as React.CSSProperties}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="hsl(var(--brand-yellow))"
              className="drop-shadow-sm"
            >
              <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18 5.5,22 7,14.5 2,9.5 9,9" />
            </svg>
          </div>
        );
      })}
    </div>
  );
});

// Particle burst for goal reached
interface ParticleBurstProps {
  isActive: boolean;
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export const ParticleBurst = memo(function ParticleBurst({
  isActive,
  particleCount = 12,
  colors = defaultColors,
  className,
}: ParticleBurstProps) {
  const [show, setShow] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      setShow(false);
      return;
    }

    setShow(true);
    const timer = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(timer);
  }, [isActive, prefersReducedMotion]);

  if (!show) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-50", className)}>
      {Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * 360;
        const distance = 40 + Math.random() * 30;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 animate-particle-burst"
            style={{
              "--tx": `${Math.cos((angle * Math.PI) / 180) * distance}px`,
              "--ty": `${Math.sin((angle * Math.PI) / 180) * distance}px`,
              width: 8,
              height: 8,
              backgroundColor: colors[i % colors.length],
              borderRadius: "50%",
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
});

// Pulse ring effect
interface PulseRingProps {
  isActive: boolean;
  color?: string;
  className?: string;
}

export const PulseRing = memo(function PulseRing({
  isActive,
  color = "hsl(var(--brand-blue))",
  className,
}: PulseRingProps) {
  const [show, setShow] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isActive || prefersReducedMotion) {
      setShow(false);
      return;
    }

    setShow(true);
    const timer = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(timer);
  }, [isActive, prefersReducedMotion]);

  if (!show) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 animate-pulse-ring rounded-full border-2",
        className
      )}
      style={{ borderColor: color }}
    />
  );
});

import { useEffect, useRef, useState, useCallback } from "react";

// Check if user prefers reduced motion
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// Intersection observer for viewport animations
export function useInViewAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, prefersReducedMotion]);

  return { ref, isInView };
}

// Staggered animation for lists
export function useStaggeredAnimation(itemCount: number, baseDelay = 50) {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const getDelay = useCallback(
    (index: number) => {
      if (prefersReducedMotion) return 0;
      return index * baseDelay;
    },
    [baseDelay, prefersReducedMotion]
  );

  return { getDelay, shouldAnimate: !prefersReducedMotion };
}

// Shake animation trigger
export function useShakeAnimation() {
  const [isShaking, setIsShaking] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const triggerShake = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, [prefersReducedMotion]);

  return { isShaking, triggerShake };
}

// Success animation trigger
export function useSuccessAnimation() {
  const [showSuccess, setShowSuccess] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const triggerSuccess = useCallback(() => {
    setShowSuccess(true);
    if (!prefersReducedMotion) {
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      setTimeout(() => setShowSuccess(false), 500);
    }
  }, [prefersReducedMotion]);

  return { showSuccess, triggerSuccess };
}

// Page transition hook
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const startTransition = useCallback(
    (callback: () => void) => {
      if (prefersReducedMotion) {
        callback();
        return;
      }

      setIsTransitioning(true);
      setTimeout(() => {
        callback();
        setIsTransitioning(false);
      }, 200);
    },
    [prefersReducedMotion]
  );

  return { isTransitioning, startTransition };
}

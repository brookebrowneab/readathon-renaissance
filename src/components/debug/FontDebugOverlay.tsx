import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

type FontDebugInfo = {
  userAgent: string;
  targetFontFamily: string;
  targetFontWeight: string;
  targetHasFontSerifClass: boolean;
  probeFontFamily: string;
  fontsApiAvailable: boolean;
  instrumentSerifLoaded: boolean | null;
  sourceSerifLoaded: boolean | null;
  fontFaceSetStatus: string | null;
};

function safeGetComputedFont(el: HTMLElement | null) {
  if (!el) return { fontFamily: "(missing)", fontWeight: "(missing)" };
  const cs = window.getComputedStyle(el);
  return { fontFamily: cs.fontFamily, fontWeight: cs.fontWeight };
}

export function FontDebugOverlay({
  enabled,
  targetRef,
}: {
  enabled: boolean;
  targetRef: RefObject<HTMLElement>;
}) {
  const probeRef = useRef<HTMLSpanElement | null>(null);
  const [info, setInfo] = useState<FontDebugInfo | null>(null);

  const fontsApiAvailable = useMemo(() => {
    return typeof document !== "undefined" && "fonts" in document;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const el = targetRef.current;
    const target = safeGetComputedFont(el);
    const probe = safeGetComputedFont(probeRef.current);

    const instrumentLoaded = fontsApiAvailable
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).fonts.check('16px "Instrument Serif"')
      : null;
    const sourceLoaded = fontsApiAvailable
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).fonts.check('16px "Source Serif 4"')
      : null;
    const fontFaceSetStatus = fontsApiAvailable
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).fonts.status
      : null;

    const next: FontDebugInfo = {
      userAgent: navigator.userAgent,
      targetFontFamily: target.fontFamily,
      targetFontWeight: target.fontWeight,
      targetHasFontSerifClass: !!el?.classList?.contains("font-serif"),
      probeFontFamily: probe.fontFamily,
      fontsApiAvailable,
      instrumentSerifLoaded: instrumentLoaded,
      sourceSerifLoaded: sourceLoaded,
      fontFaceSetStatus,
    };

    // Helpful for me to inspect via Lovable console logs on next message.
    // eslint-disable-next-line no-console
    console.log("[FontDebugOverlay]", next);
    setInfo(next);
  }, [enabled, fontsApiAvailable, targetRef]);

  if (!enabled) return null;

  return (
    <div
      className="fixed bottom-3 left-3 z-[100] max-w-[92vw] rounded-md border border-border bg-background/95 p-3 text-xs text-foreground shadow-lg"
      role="status"
      aria-label="Typography debug"
    >
      {/* Probe element to see what Tailwind's font-serif resolves to */}
      <span ref={probeRef} className="sr-only font-serif">
        serif-probe
      </span>

      <div className="font-semibold">Typography Debug</div>
      {info ? (
        <div className="mt-2 space-y-1">
          <div>
            <span className="font-medium">Target has</span> <code>font-serif</code>: {String(info.targetHasFontSerifClass)}
          </div>
          <div>
            <span className="font-medium">Target font-family</span>: {info.targetFontFamily}
          </div>
          <div>
            <span className="font-medium">Target weight</span>: {info.targetFontWeight}
          </div>
          <div>
            <span className="font-medium">Tailwind font-serif</span>: {info.probeFontFamily}
          </div>
          <div>
            <span className="font-medium">Instrument Serif loaded</span>: {String(info.instrumentSerifLoaded)}
          </div>
          <div>
            <span className="font-medium">Source Serif 4 loaded</span>: {String(info.sourceSerifLoaded)}
          </div>
          <div>
            <span className="font-medium">FontFaceSet status</span>: {String(info.fontFaceSetStatus)}
          </div>
        </div>
      ) : (
        <div className="mt-2 text-muted-foreground">Collecting…</div>
      )}
    </div>
  );
}

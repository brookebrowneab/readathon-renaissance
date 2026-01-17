import { useEffect, useMemo, useRef, useState } from "react";
import pencilPattern from "@/assets/pencil-pattern-blue.png";
import { ReadingGoalRing } from "@/components/legacy/ReadingGoalRing";

type Rect = { top: number; right: number; bottom: number; left: number; width: number; height: number };

function toRect(r: DOMRect): Rect {
  return {
    top: r.top,
    right: r.right,
    bottom: r.bottom,
    left: r.left,
    width: r.width,
    height: r.height,
  };
}

function round(n: number, d = 2) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

function analyzeImageAlpha(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  // Sample a few rows near the bottom and near the top to see if the asset has transparent padding.
  const sampleRows = {
    top: Math.min(2, canvas.height - 1),
    bottom: Math.max(canvas.height - 2, 0),
  };

  const summarizeRow = (y: number) => {
    const imageData = ctx.getImageData(0, y, canvas.width, 1);
    const data = imageData.data;
    let transparent = 0;
    let opaque = 0;

    for (let x = 0; x < canvas.width; x++) {
      const a = data[x * 4 + 3];
      if (a === 0) transparent++;
      else opaque++;
    }

    return {
      y,
      transparent,
      opaque,
      transparentPct: canvas.width ? transparent / canvas.width : 0,
    };
  };

  return {
    width: canvas.width,
    height: canvas.height,
    topRow: summarizeRow(sampleRows.top),
    bottomRow: summarizeRow(sampleRows.bottom),
  };
}

function SvgGeometryTest({ pixelSize }: { pixelSize: number }) {
  // Match the legacy ring geometry
  const viewBoxSize = 20;
  const r = 4.75;
  const strokeWidth = 9.5;

  const outerRadius = r + strokeWidth / 2; // 9.5
  const marginUnits = 10 - outerRadius; // 0.5 (with center at 10)

  const theory = useMemo(() => {
    const marginPct = marginUnits / viewBoxSize;
    return {
      outerRadius,
      marginUnits,
      marginPx: pixelSize * marginPct,
      marginPct: marginPct * 100,
    };
  }, [pixelSize]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const [measured, setMeasured] = useState<null | {
    svg: Rect;
    circle: Rect;
    gapTop: number;
    gapRight: number;
    gapBottom: number;
    gapLeft: number;
  }>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const circle = circleRef.current;
    if (!svg || !circle) return;

    // Wait a frame to ensure layout is settled
    const raf = requestAnimationFrame(() => {
      const svgRect = svg.getBoundingClientRect();
      const circleRect = circle.getBoundingClientRect();

      setMeasured({
        svg: toRect(svgRect),
        circle: toRect(circleRect),
        gapTop: circleRect.top - svgRect.top,
        gapRight: svgRect.right - circleRect.right,
        gapBottom: svgRect.bottom - circleRect.bottom,
        gapLeft: circleRect.left - svgRect.left,
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [pixelSize]);

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test A — Raw SVG geometry ({pixelSize}px)</h2>
        <p className="text-sm text-muted-foreground">
          Renders the same circle geometry used in the progress ring, with a viewport outline.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid place-items-center">
          <svg
            ref={svgRef}
            width={pixelSize}
            height={pixelSize}
            viewBox="0 0 20 20"
            className="rounded-md"
            style={{ background: "hsl(var(--background))" }}
          >
            {/* ViewBox bounds */}
            <rect
              x="0"
              y="0"
              width="20"
              height="20"
              fill="transparent"
              stroke="hsl(var(--destructive))"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />

            {/* Theoretical outer-edge (should land at 0.5..19.5) */}
            <circle
              r={outerRadius}
              cx="10"
              cy="10"
              fill="transparent"
              stroke="hsl(var(--warning))"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />

            <defs>
              <pattern
                id="debug-pencil-pattern"
                patternUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <image
                  href={pencilPattern}
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>
            </defs>

            <circle
              ref={circleRef}
              r={r}
              cx="10"
              cy="10"
              fill="transparent"
              stroke="url(#debug-pencil-pattern)"
              strokeWidth={strokeWidth}
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={0}
              transform="rotate(-90 10 10)"
            />
          </svg>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="rounded-md bg-muted/40 p-3">
            <div className="font-medium">Theoretical</div>
            <ul className="mt-2 grid gap-1">
              <li>
                Outer radius: <code>{outerRadius}</code> units
              </li>
              <li>
                ViewBox margin: <code>{theory.marginUnits}</code> units ({round(theory.marginPct)}%)
              </li>
              <li>
                Expected pixel inset at {pixelSize}px: <code>{round(theory.marginPx)}</code> px
              </li>
            </ul>
          </div>

          <div className="rounded-md bg-muted/40 p-3">
            <div className="font-medium">Measured (DOM bounding boxes)</div>
            {measured ? (
              <ul className="mt-2 grid gap-1">
                <li>
                  gapTop: <code>{round(measured.gapTop)}</code> px
                </li>
                <li>
                  gapRight: <code>{round(measured.gapRight)}</code> px
                </li>
                <li>
                  gapBottom: <code>{round(measured.gapBottom)}</code> px
                </li>
                <li>
                  gapLeft: <code>{round(measured.gapLeft)}</code> px
                </li>
                <li className="text-muted-foreground">
                  Note: SVG element bounds vs circle bounds can vary by browser; this is best used as a sanity check.
                </li>
              </ul>
            ) : (
              <div className="mt-2 text-muted-foreground">Measuring…</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PatternAssetTest() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [alpha, setAlpha] = useState<ReturnType<typeof analyzeImageAlpha> | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const run = () => setAlpha(analyzeImageAlpha(img));

    if (img.complete) run();
    img.addEventListener("load", run);
    return () => img.removeEventListener("load", run);
  }, []);

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test B — Pattern asset alpha padding</h2>
        <p className="text-sm text-muted-foreground">
          Checks if the pencil pattern image has transparent padding near its top/bottom edges.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid place-items-center">
          <div
            className="rounded-md border p-3"
            style={{
              background:
                "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            <img
              ref={imgRef}
              src={pencilPattern}
              alt="Pencil pattern asset"
              className="h-40 w-40 object-contain"
            />
          </div>
        </div>

        <div className="rounded-md bg-muted/40 p-3 text-sm">
          {alpha ? (
            <ul className="grid gap-1">
              <li>
                Natural size: <code>{alpha.width}×{alpha.height}</code>
              </li>
              <li>
                Top sampled row y={alpha.topRow.y}: transparent {round(alpha.topRow.transparentPct * 100, 1)}%
              </li>
              <li>
                Bottom sampled row y={alpha.bottomRow.y}: transparent {round(alpha.bottomRow.transparentPct * 100, 1)}%
              </li>
              <li className="mt-2 text-muted-foreground">
                If the bottom row is ~100% transparent, the stroke will show the container background at certain alignments, which can look like a
                “cut off” edge.
              </li>
            </ul>
          ) : (
            <div className="text-muted-foreground">Analyzing…</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function DebugRingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-5xl gap-6 p-6">
        <header className="grid gap-2">
          <h1 className="font-serif text-3xl">Progress Ring Cutoff Investigation</h1>
          <p className="text-sm text-muted-foreground">
            This page runs a couple of small diagnostic “tests” in-browser to explain why the pencil fill can appear inset/cut off at the circle edge.
          </p>
        </header>

        <section className="grid gap-4 rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">Control — Current component rendering</h2>
          <p className="text-sm text-muted-foreground">
            Visual reference using the existing component (no changes made to it).
          </p>
          <div className="flex flex-wrap items-start gap-10">
            <div className="grid gap-2">
              <ReadingGoalRing progress={100} goal={100} size={220} />
              <div className="text-xs text-muted-foreground">size=220, progress=100%</div>
            </div>
            <div className="grid gap-2">
              <ReadingGoalRing progress={82} goal={100} size={220} />
              <div className="text-xs text-muted-foreground">size=220, progress=82%</div>
            </div>
          </div>
        </section>

        <SvgGeometryTest pixelSize={220} />
        <SvgGeometryTest pixelSize={160} />
        <PatternAssetTest />

        <section className="rounded-lg border bg-card p-4 text-sm">
          <h2 className="text-lg font-semibold">What to look for</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              In Test A, compare the red ViewBox outline to the yellow “outer edge” guide. The ring geometry intentionally leaves a small margin.
            </li>
            <li>
              If Test B reports a high transparent percentage on the bottom sampled row, the image asset itself has bottom padding, which can create a
              consistent-looking “blank band”.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import pencilPattern from "@/assets/pencil-pattern-blue.png";
import { ReadingGoalRing } from "@/components/legacy/ReadingGoalRing";

function round(n: number, d = 2) {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

function PatternClippingTest() {
  // Tests whether the pattern/image element has an internal bounding box that clips content
  const viewBoxSize = 20;
  const r = 4.75;
  const strokeWidth = 9.5;

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test A — Pattern &amp; Image Clipping</h2>
        <p className="text-sm text-muted-foreground">
          Compares different pattern/image configurations to isolate clipping behavior.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Control: Current implementation */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Current implementation</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="test-pattern-current"
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
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#test-pattern-current)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">patternUnits=userSpaceOnUse</code>
        </div>

        {/* Test: overflow visible on pattern and image */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">With overflow="visible"</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20" overflow="visible">
              <defs>
                <pattern
                  id="test-pattern-overflow"
                  patternUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  overflow="visible"
                >
                  <image
                    href={pencilPattern}
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    preserveAspectRatio="xMidYMid slice"
                    overflow="visible"
                  />
                </pattern>
              </defs>
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#test-pattern-overflow)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">overflow="visible" on svg, pattern, image</code>
        </div>

        {/* Test: Larger pattern bounds */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Larger pattern (24×24)</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20" overflow="visible">
              <defs>
                <pattern
                  id="test-pattern-larger"
                  patternUnits="userSpaceOnUse"
                  x="-2"
                  y="-2"
                  width="24"
                  height="24"
                >
                  <image
                    href={pencilPattern}
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              </defs>
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#test-pattern-larger)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">pattern x/y=-2, width/height=24</code>
        </div>
      </div>
    </section>
  );
}

function ImageBoundsTest() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number; ratio: string } | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const run = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDims({ w, h, ratio: `${round(w / h, 3)}:1` });
    };
    if (img.complete) run();
    img.addEventListener("load", run);
    return () => img.removeEventListener("load", run);
  }, []);

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test B — Pattern Asset Dimensions</h2>
        <p className="text-sm text-muted-foreground">
          If the image isn't square, preserveAspectRatio="slice" may clip content.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid place-items-center">
          <div
            className="rounded-md border"
            style={{
              background:
                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              padding: 8,
            }}
          >
            <img
              ref={imgRef}
              src={pencilPattern}
              alt="Pencil pattern"
              style={{ display: "block", maxWidth: 200, border: "1px solid red" }}
            />
          </div>
        </div>
        <div className="rounded-md bg-muted/40 p-3 text-sm">
          {dims ? (
            <ul className="grid gap-1">
              <li>
                Natural size: <code>{dims.w}×{dims.h}</code>
              </li>
              <li>
                Aspect ratio: <code>{dims.ratio}</code>
              </li>
              <li className="mt-2 text-muted-foreground">
                If the image is taller than wide, the top/bottom get sliced off when rendered into a square pattern box with <code>slice</code>. If it's wider, left/right get sliced.
              </li>
            </ul>
          ) : (
            <div className="text-muted-foreground">Loading…</div>
          )}
        </div>
      </div>
    </section>
  );
}

function PreserveAspectRatioTest() {
  const r = 4.75;
  const strokeWidth = 9.5;

  const variants: { label: string; par: string }[] = [
    { label: "xMidYMid slice (current)", par: "xMidYMid slice" },
    { label: "xMidYMid meet", par: "xMidYMid meet" },
    { label: "none (stretch)", par: "none" },
    { label: "xMinYMin slice", par: "xMinYMin slice" },
    { label: "xMaxYMax slice", par: "xMaxYMax slice" },
  ];

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test C — preserveAspectRatio variants</h2>
        <p className="text-sm text-muted-foreground">
          Different values change how the image is fit/clipped inside the pattern tile.
        </p>
      </header>

      <div className="flex flex-wrap gap-4">
        {variants.map((v, i) => (
          <div key={i} className="grid gap-2">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={140} height={140} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id={`par-test-${i}`}
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
                      preserveAspectRatio={v.par}
                    />
                  </pattern>
                </defs>
                <circle
                  r={r}
                  cx="10"
                  cy="10"
                  fill="transparent"
                  stroke={`url(#par-test-${i})`}
                  strokeWidth={strokeWidth}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={0}
                  transform="rotate(-90 10 10)"
                />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground max-w-[140px] break-words">{v.label}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

function SolidFillComparison() {
  const r = 4.75;
  const strokeWidth = 9.5;

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test D — Solid fill vs Pattern fill</h2>
        <p className="text-sm text-muted-foreground">
          If solid fill reaches the edge but pattern doesn't, the issue is pattern/image clipping.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Solid stroke</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20">
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="#3b5998"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">Pattern stroke</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="test-pattern-compare"
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
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#test-pattern-compare)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
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
            Focus: Pattern/image bounding box clipping behavior.
          </p>
        </header>

        <section className="grid gap-4 rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold">Control — Current component</h2>
          <div className="flex flex-wrap items-start gap-10">
            <ReadingGoalRing progress={100} goal={100} size={180} />
            <ReadingGoalRing progress={75} goal={100} size={180} />
          </div>
        </section>

        <SolidFillComparison />
        <PatternClippingTest />
        <ImageBoundsTest />
        <PreserveAspectRatioTest />

        <section className="rounded-lg border bg-card p-4 text-sm">
          <h2 className="text-lg font-semibold">What to look for</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li><strong>Test D:</strong> If solid fill reaches the edge but pattern doesn't → the clipping is in the pattern/image, not ring geometry.</li>
            <li><strong>Test A:</strong> If "overflow=visible" or "larger pattern" fixes it → the pattern bounds were clipping.</li>
            <li><strong>Test B:</strong> If the image isn't square, "slice" clips the longer dimension.</li>
            <li><strong>Test C:</strong> Different preserveAspectRatio values show how the image is positioned inside the tile.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
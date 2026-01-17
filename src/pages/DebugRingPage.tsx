import { useRef, useState } from "react";
import pencilPattern from "@/assets/pencil-pattern-blue.png";
import { ReadingGoalRing } from "@/components/legacy/ReadingGoalRing";

const r = 4.75;
const strokeWidth = 9.5;

/**
 * Test 1: Rotation test
 * If the "cutoff" moves with rotation, it's tied to stroke start/end.
 * If it stays at the bottom regardless of rotation, it's position-based.
 */
function RotationTest() {
  const rotations = [
    { label: "Current (-90°, starts top)", rotate: -90 },
    { label: "0° (starts right)", rotate: 0 },
    { label: "90° (starts bottom)", rotate: 90 },
    { label: "180° (starts left)", rotate: 180 },
  ];

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 1 — Rotation (stroke start position)</h2>
        <p className="text-sm text-muted-foreground">
          75% fill at different rotations. Watch where the "cutoff" appears relative to the stroke start/end vs. the bottom of the circle.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        {rotations.map((rot, i) => (
          <div key={i} className="grid gap-2">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={140} height={140} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id={`rot-pattern-${i}`}
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
                  stroke={`url(#rot-pattern-${i})`}
                  strokeWidth={strokeWidth}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={25} /* 75% fill */
                  transform={`rotate(${rot.rotate} 10 10)`}
                />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground max-w-[140px]">{rot.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <strong>Interpretation:</strong>
        <ul className="mt-1 list-disc pl-4 text-muted-foreground">
          <li>If cutoff follows the stroke end → it's the dashoffset gap (intentional pie shape)</li>
          <li>If cutoff stays at 6 o'clock regardless → it's position-based clipping (unintentional)</li>
        </ul>
      </div>
    </section>
  );
}

/**
 * Test 2: Full circle (100%) at different rotations
 * With 100% fill there's no dashoffset gap, so any visible cutoff is unintentional.
 */
function FullCircleTest() {
  const rotations = [-90, 0, 45, 90, 135, 180];

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 2 — 100% fill at different rotations</h2>
        <p className="text-sm text-muted-foreground">
          No dashoffset gap. Any visible cutoff here is <strong>unintentional clipping</strong>.
        </p>
      </header>

      <div className="flex flex-wrap gap-4">
        {rotations.map((rot, i) => (
          <div key={i} className="grid gap-2">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 120, height: 120, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={120} height={120} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id={`full-pattern-${i}`}
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
                  stroke={`url(#full-pattern-${i})`}
                  strokeWidth={strokeWidth}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={0} /* 100% fill */
                  transform={`rotate(${rot} 10 10)`}
                />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground">rotate({rot}°)</code>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Test 3: Pattern tile grid overlay
 * Visualizes where 20x20 pattern tiles align relative to the circle.
 */
function PatternGridTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 3 — Pattern tile grid overlay</h2>
        <p className="text-sm text-muted-foreground">
          Red grid shows 20×20 pattern tile boundaries. Check if cutoff aligns with tile edges.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">With tile grid</div>
          <div
            className="relative grid place-items-center rounded-full"
            style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={180} height={180} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="grid-pattern"
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
                {/* Grid pattern for overlay */}
                <pattern
                  id="tile-grid"
                  patternUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <rect x="0" y="0" width="20" height="20" fill="none" stroke="red" strokeWidth="0.2" />
                </pattern>
              </defs>
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#grid-pattern)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={0}
                transform="rotate(-90 10 10)"
              />
              {/* Grid overlay */}
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#tile-grid)"
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
          <div className="text-sm font-medium">Tile boundary reference</div>
          <div className="rounded-md bg-muted/40 p-3 text-sm">
            <p>Pattern tiles at:</p>
            <ul className="mt-1 list-disc pl-4 text-muted-foreground">
              <li>x: 0, y: 0 (only one tile in 20×20 viewBox)</li>
              <li>Circle center: (10, 10)</li>
              <li>Stroke outer edge: 0.5 to 19.5</li>
            </ul>
            <p className="mt-2">
              If cutoff appears at y≈19.5 or y≈0.5, it could be pattern edge alignment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Test 4: Stroke edge analysis
 * Compare the visual edge at different positions around the circle.
 */
function StrokeEdgeTest() {
  const [highlight, setHighlight] = useState<"top" | "right" | "bottom" | "left" | null>(null);

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 4 — Stroke edge comparison</h2>
        <p className="text-sm text-muted-foreground">
          Hover/tap to highlight different edges. Compare pattern density at each edge.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid place-items-center">
          <div className="relative">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 200, height: 200, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={200} height={200} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id="edge-pattern"
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
                  stroke="url(#edge-pattern)"
                  strokeWidth={strokeWidth}
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={0}
                  transform="rotate(-90 10 10)"
                />
              </svg>
            </div>
            {/* Edge highlight overlays */}
            {(["top", "right", "bottom", "left"] as const).map((edge) => {
              const positions: Record<string, React.CSSProperties> = {
                top: { top: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 30 },
                right: { top: "50%", right: 0, transform: "translateY(-50%)", width: 30, height: 60 },
                bottom: { bottom: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 30 },
                left: { top: "50%", left: 0, transform: "translateY(-50%)", width: 30, height: 60 },
              };
              return (
                <div
                  key={edge}
                  className="absolute cursor-pointer transition-colors"
                  style={{
                    ...positions[edge],
                    background: highlight === edge ? "rgba(255,0,0,0.2)" : "transparent",
                    border: highlight === edge ? "2px solid red" : "2px solid transparent",
                  }}
                  onMouseEnter={() => setHighlight(edge)}
                  onMouseLeave={() => setHighlight(null)}
                />
              );
            })}
          </div>
        </div>

        <div className="rounded-md bg-muted/40 p-3 text-sm">
          <div className="font-medium mb-2">Edge Analysis</div>
          <p className="text-muted-foreground">
            Hover over each edge zone. If the <strong>bottom</strong> shows less pattern density at the outer rim compared to top/left/right, that's the unintentional clipping.
          </p>
          <div className="mt-3 grid gap-1">
            <div className={highlight === "top" ? "font-medium text-foreground" : "text-muted-foreground"}>
              Top edge: y ≈ 0.5 in viewBox
            </div>
            <div className={highlight === "bottom" ? "font-medium text-foreground" : "text-muted-foreground"}>
              Bottom edge: y ≈ 19.5 in viewBox
            </div>
            <div className={highlight === "left" ? "font-medium text-foreground" : "text-muted-foreground"}>
              Left edge: x ≈ 0.5 in viewBox
            </div>
            <div className={highlight === "right" ? "font-medium text-foreground" : "text-muted-foreground"}>
              Right edge: x ≈ 19.5 in viewBox
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Test 5: Zoomed crop comparison
 * Side-by-side crops of top vs bottom edge at high zoom.
 */
function ZoomedCropTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 5 — Zoomed edge crops</h2>
        <p className="text-sm text-muted-foreground">
          ViewBox crops showing just the top or bottom edge at 4× zoom. Compare pattern-to-edge distance.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Top edge (y: 0–5)</div>
          <div className="rounded-md border overflow-hidden" style={{ width: 200, height: 100 }}>
            <svg width={200} height={100} viewBox="0 0 20 5">
              <defs>
                <pattern
                  id="zoom-top-pattern"
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
              <rect x="0" y="0" width="20" height="5" fill="#E6EAF1" />
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#zoom-top-pattern)"
                strokeWidth={strokeWidth}
              />
              {/* Edge marker */}
              <line x1="0" y1="0.5" x2="20" y2="0.5" stroke="red" strokeWidth="0.05" />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Red line = y: 0.5 (theoretical edge)</code>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">Bottom edge (y: 15–20)</div>
          <div className="rounded-md border overflow-hidden" style={{ width: 200, height: 100 }}>
            <svg width={200} height={100} viewBox="0 15 20 5">
              <defs>
                <pattern
                  id="zoom-bottom-pattern"
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
              <rect x="0" y="15" width="20" height="5" fill="#E6EAF1" />
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#zoom-bottom-pattern)"
                strokeWidth={strokeWidth}
              />
              {/* Edge marker */}
              <line x1="0" y1="19.5" x2="20" y2="19.5" stroke="red" strokeWidth="0.05" />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Red line = y: 19.5 (theoretical edge)</code>
        </div>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <strong>What to compare:</strong>
        <ul className="mt-1 list-disc pl-4 text-muted-foreground">
          <li>Does the pattern reach the red line equally at top and bottom?</li>
          <li>Is there more grey background visible at bottom than top?</li>
          <li>This would indicate unintentional clipping at the bottom.</li>
        </ul>
      </div>
    </section>
  );
}

/**
 * Control: Current component
 */
function ControlSection() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold">Control — Current component</h2>
      <p className="text-sm text-muted-foreground">Reference rendering from the actual component.</p>
      <div className="flex flex-wrap items-start gap-10">
        <div className="grid gap-1">
          <ReadingGoalRing progress={100} goal={100} size={160} showLabel={false} />
          <div className="text-xs text-muted-foreground">100%</div>
        </div>
        <div className="grid gap-1">
          <ReadingGoalRing progress={75} goal={100} size={160} showLabel={false} />
          <div className="text-xs text-muted-foreground">75%</div>
        </div>
        <div className="grid gap-1">
          <ReadingGoalRing progress={50} goal={100} size={160} showLabel={false} />
          <div className="text-xs text-muted-foreground">50%</div>
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
            Distinguishing intentional pie-chart clipping (dashoffset) from unintentional bottom-edge clipping.
          </p>
        </header>

        <div className="rounded-lg border border-warning bg-warning/10 p-4 text-sm">
          <strong>Key distinction:</strong>
          <ul className="mt-1 list-disc pl-4">
            <li><strong>Intentional:</strong> The "missing slice" created by strokeDashoffset — this follows the stroke path and creates the pie chart wedge.</li>
            <li><strong>Unintentional:</strong> Pattern appearing cut off at the outer rim before reaching the circle edge — visible as a gap between pattern and container border.</li>
          </ul>
        </div>

        <ControlSection />
        <RotationTest />
        <FullCircleTest />
        <PatternGridTest />
        <StrokeEdgeTest />
        <ZoomedCropTest />

        <section className="rounded-lg border bg-card p-4 text-sm">
          <h2 className="text-lg font-semibold">Summary: What to look for</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong>Test 1:</strong> If cutoff moves with rotation → intentional (dashoffset). If it stays at bottom → unintentional.</li>
            <li><strong>Test 2:</strong> 100% fill has no dashoffset gap. Any visible edge cutoff here is purely unintentional.</li>
            <li><strong>Test 3:</strong> Check if cutoff aligns with pattern tile boundaries.</li>
            <li><strong>Test 4:</strong> Compare pattern density at all four edges.</li>
            <li><strong>Test 5:</strong> Zoomed comparison of top vs bottom — if bottom has more grey gap, that's the unintentional clipping.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
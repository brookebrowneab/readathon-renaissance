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
 * Test 3: patternUnits comparison
 * userSpaceOnUse vs objectBoundingBox - the key difference
 */
function PatternUnitsTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 3 — patternUnits: the root cause</h2>
        <p className="text-sm text-muted-foreground">
          <code>userSpaceOnUse</code> tiles relative to the PAGE. <code>objectBoundingBox</code> tiles relative to the ELEMENT.
        </p>
      </header>

      <div className="rounded-md bg-destructive/10 border-destructive/30 border p-3 text-sm">
        <strong>Root Cause Identified:</strong> With <code>patternUnits="userSpaceOnUse"</code>, the pattern's 20×20 grid is fixed to the page coordinate system. The visible "cutoff line" is where the pattern tile boundary falls within each SVG — this varies by SVG position on the page.
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Current: userSpaceOnUse */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Current: userSpaceOnUse</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="pattern-usou"
                  patternUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-usou)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[160px]">
            Pattern grid fixed to page. Cutoff depends on SVG position.
          </div>
        </div>

        {/* Test: objectBoundingBox */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Alternative: objectBoundingBox</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="pattern-obb"
                  patternUnits="objectBoundingBox"
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                >
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-obb)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[160px]">
            Pattern scales to element bounding box. May distort on non-square strokes.
          </div>
        </div>

        {/* Test: userSpaceOnUse with patternTransform */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Fix: patternContentUnits</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern
                  id="pattern-fixed"
                  patternUnits="userSpaceOnUse"
                  patternContentUnits="objectBoundingBox"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                >
                  <image href={pencilPattern} x="0" y="0" width="1" height="1" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-fixed)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[160px]">
            Hybrid approach.
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Same pattern, different positions</div>
          <div className="flex gap-4">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={100} height={100} viewBox="0 0 20 20">
                <defs>
                  <pattern id="pattern-pos1" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-pos1)" strokeWidth={strokeWidth} />
              </svg>
            </div>
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E", marginLeft: 37 }}
            >
              <svg width={100} height={100} viewBox="0 0 20 20">
                <defs>
                  <pattern id="pattern-pos2" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-pos2)" strokeWidth={strokeWidth} />
              </svg>
            </div>
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E", marginLeft: 73 }}
            >
              <svg width={100} height={100} viewBox="0 0 20 20">
                <defs>
                  <pattern id="pattern-pos3" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#pattern-pos3)" strokeWidth={strokeWidth} />
              </svg>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Different horizontal offsets → different cutoff positions within each circle
          </div>
        </div>
      </div>
    </section>
  );
}
/**
 * Test 4: Large pattern tile (FIX)
 * Use a pattern tile large enough to cover the entire circle without visible tiling
 */
function LargePatternTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 4 — Large pattern tile (potential fix)</h2>
        <p className="text-sm text-muted-foreground">
          Use a pattern tile larger than the SVG viewBox to eliminate visible tiling boundaries.
        </p>
      </header>

      <div className="rounded-md bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 border p-3 text-sm">
        <strong>Hypothesis:</strong> If the pattern tile is large enough (e.g., 100×100 in a 20×20 viewBox), no tile boundary will be visible within the rendered circle.
      </div>

      <div className="flex flex-wrap gap-6">
        {/* Current 20x20 tile */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Current: 20×20 tile</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-20" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#tile-20)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground">Visible tiling boundary</div>
        </div>

        {/* 100x100 tile */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">Fix: 100×100 tile</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-100" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#tile-100)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground">No visible tile boundary</div>
        </div>

        {/* 100x100 tile as progress ring with dashoffset */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">100×100 with 75% fill</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 160, height: 160, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-100-progress" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle
                r={r}
                cx="10"
                cy="10"
                fill="transparent"
                stroke="url(#tile-100-progress)"
                strokeWidth={strokeWidth}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={25}
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground">Progress ring style</div>
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="text-sm font-medium">Same 100×100 pattern at different positions</div>
        <div className="flex gap-4">
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={100} height={100} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-100-a" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#tile-100-a)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E", marginLeft: 50 }}
          >
            <svg width={100} height={100} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-100-b" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#tile-100-b)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E", marginLeft: 100 }}
          >
            <svg width={100} height={100} viewBox="0 0 20 20">
              <defs>
                <pattern id="tile-100-c" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#tile-100-c)" strokeWidth={strokeWidth} />
            </svg>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          All three should look consistent — no position-dependent cutoff
        </div>
      </div>
    </section>
  );
}
/**
 * Test 4: Stroke edge analysis
 * Compare the visual edge at different positions around the circle.
 * UPDATED: Now tests both 20x20 and 100x100 pattern configs side by side
 */
function StrokeEdgeTest() {
  const [highlight, setHighlight] = useState<"top" | "right" | "bottom" | "left" | null>(null);

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 4 — Stroke edge comparison (20x20 vs 100x100)</h2>
        <p className="text-sm text-muted-foreground">
          Hover/tap to highlight different edges. Compare pattern density at each edge for both pattern sizes.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 20x20 pattern - problematic */}
        <div className="grid gap-2">
          <div className="text-sm font-medium text-destructive">20×20 pattern (problematic)</div>
          <div className="relative grid place-items-center">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={180} height={180} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id="edge-pattern-20"
                    patternUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                  >
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#edge-pattern-20)" strokeWidth={strokeWidth} />
              </svg>
            </div>
          </div>
        </div>

        {/* 100x100 pattern - should be fixed */}
        <div className="grid gap-2">
          <div className="text-sm font-medium text-green-600">100×100 pattern (should be fixed)</div>
          <div className="relative grid place-items-center">
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 180, height: 180, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={180} height={180} viewBox="0 0 20 20">
                <defs>
                  <pattern
                    id="edge-pattern-100"
                    patternUnits="userSpaceOnUse"
                    x="-40"
                    y="-40"
                    width="100"
                    height="100"
                  >
                    <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#edge-pattern-100)" strokeWidth={strokeWidth} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <strong>Observation:</strong> The 100×100 pattern appears blurry because the 20×20 image is being upscaled 5×. The fix needs to keep the image at 20×20 while eliminating tile boundaries.
      </div>
    </section>
  );
}

/**
 * Test 5: Zoomed crop comparison - now with multiple pattern approaches
 */
function ZoomedCropTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 5 — Zoomed edge crops (multiple approaches)</h2>
        <p className="text-sm text-muted-foreground">
          ViewBox crops showing bottom edge at 4× zoom. Compare different pattern configurations.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        {/* Approach A: 20x20 pattern (current problematic) */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">A: 20×20 (problematic)</div>
          <div className="rounded-md border overflow-hidden" style={{ width: 200, height: 100 }}>
            <svg width={200} height={100} viewBox="0 15 20 5">
              <defs>
                <pattern id="zoom-a" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <rect x="0" y="15" width="20" height="5" fill="#E6EAF1" />
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#zoom-a)" strokeWidth={strokeWidth} />
              <line x1="0" y1="19.5" x2="20" y2="19.5" stroke="red" strokeWidth="0.05" />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Tile boundary visible</code>
        </div>

        {/* Approach B: 100x100 scaled pattern */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">B: 100×100 scaled</div>
          <div className="rounded-md border overflow-hidden" style={{ width: 200, height: 100 }}>
            <svg width={200} height={100} viewBox="0 15 20 5">
              <defs>
                <pattern id="zoom-b" patternUnits="userSpaceOnUse" x="-40" y="-40" width="100" height="100">
                  <image href={pencilPattern} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <rect x="0" y="15" width="20" height="5" fill="#E6EAF1" />
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#zoom-b)" strokeWidth={strokeWidth} />
              <line x1="0" y1="19.5" x2="20" y2="19.5" stroke="red" strokeWidth="0.05" />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Blurry but no tile line</code>
        </div>

        {/* Approach C: 20x20 pattern with offset to center on viewBox */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">C: 20×20 offset to center</div>
          <div className="rounded-md border overflow-hidden" style={{ width: 200, height: 100 }}>
            <svg width={200} height={100} viewBox="0 15 20 5">
              <defs>
                <pattern id="zoom-c" patternUnits="userSpaceOnUse" x="-10" y="-10" width="20" height="20">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <rect x="0" y="15" width="20" height="5" fill="#E6EAF1" />
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#zoom-c)" strokeWidth={strokeWidth} />
              <line x1="0" y1="19.5" x2="20" y2="19.5" stroke="red" strokeWidth="0.05" />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Offset by half tile</code>
        </div>
      </div>

      <div className="rounded-md bg-destructive/10 border-destructive/30 border p-3 text-sm mt-4">
        <strong>Core problem:</strong> The pattern image is 20×20px. To avoid upscaling blur while eliminating tile boundaries, we need a different approach.
      </div>
    </section>
  );
}

/**
 * Test 6: Alternative pattern approaches to avoid blur
 */
function AlternativeApproachesTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 6 — Alternative pattern approaches</h2>
        <p className="text-sm text-muted-foreground">
          Testing different SVG pattern strategies to eliminate tile boundary without blur.
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        {/* Approach 1: Tiled 20x20 at native size (reference) */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">1: Native 20×20 tiled</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={140} height={140} viewBox="0 0 20 20">
              <defs>
                <pattern id="alt-1" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#alt-1)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[140px]">Shows tile boundary</div>
        </div>

        {/* Approach 2: 40x40 tile with 2x2 image repeats */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">2: 40×40 with 2×2 repeat</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={140} height={140} viewBox="0 0 20 20">
              <defs>
                <pattern id="alt-2" patternUnits="userSpaceOnUse" x="-10" y="-10" width="40" height="40">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  <image href={pencilPattern} x="20" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  <image href={pencilPattern} x="0" y="20" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  <image href={pencilPattern} x="20" y="20" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#alt-2)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[140px]">Larger tile, native resolution</div>
        </div>

        {/* Approach 3: objectBoundingBox with proper scaling */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">3: objectBoundingBox scaled</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={140} height={140} viewBox="0 0 20 20">
              <defs>
                <pattern id="alt-3" patternUnits="objectBoundingBox" width="0.5" height="0.5">
                  <image href={pencilPattern} x="0" y="0" width="10" height="10" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#alt-3)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[140px]">OBB with fractional size</div>
        </div>

        {/* Approach 4: Large pattern container with multiple tiles */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">4: 60×60 with 3×3 repeat</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={140} height={140} viewBox="0 0 20 20">
              <defs>
                <pattern id="alt-4" patternUnits="userSpaceOnUse" x="-20" y="-20" width="60" height="60">
                  {[0, 1, 2].map(row => 
                    [0, 1, 2].map(col => (
                      <image 
                        key={`${row}-${col}`}
                        href={pencilPattern} 
                        x={col * 20} 
                        y={row * 20} 
                        width="20" 
                        height="20" 
                        preserveAspectRatio="xMidYMid slice" 
                      />
                    ))
                  )}
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#alt-4)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[140px]">3×3 = covers 60×60</div>
        </div>

        {/* Approach 5: Clip path approach */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">5: Clip path mask</div>
          <div
            className="grid place-items-center rounded-full"
            style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
          >
            <svg width={140} height={140} viewBox="0 0 20 20">
              <defs>
                <clipPath id="ring-clip">
                  <circle r={r} cx="10" cy="10" strokeWidth={strokeWidth} />
                </clipPath>
                <pattern id="alt-5" patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#alt-5)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <div className="text-xs text-muted-foreground max-w-[140px]">With clip path</div>
        </div>
      </div>

      <div className="rounded-md bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700 border p-3 text-sm mt-4">
        <strong>Goal:</strong> Find an approach that:
        <ul className="list-disc pl-4 mt-1 text-muted-foreground">
          <li>Uses native 20×20 image (no blur)</li>
          <li>Has no visible tile boundary in the viewBox area</li>
          <li>Works consistently regardless of page position</li>
        </ul>
      </div>
    </section>
  );
}

/**
 * Test 7: Pattern offset investigation
 * Testing if offsetting the pattern can hide tile boundaries without scaling
 */
function PatternOffsetTest() {
  const offsets = [
    { x: 0, y: 0, label: "No offset" },
    { x: -5, y: -5, label: "x=-5, y=-5" },
    { x: -10, y: -10, label: "x=-10, y=-10 (centered)" },
    { x: -15, y: -15, label: "x=-15, y=-15" },
  ];

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 7 — Pattern offset values</h2>
        <p className="text-sm text-muted-foreground">
          Does offsetting the 20×20 pattern hide the tile boundary within the viewBox?
        </p>
      </header>

      <div className="flex flex-wrap gap-6">
        {offsets.map((offset, i) => (
          <div key={i} className="grid gap-2">
            <div className="text-sm font-medium">{offset.label}</div>
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 140, height: 140, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={140} height={140} viewBox="0 0 20 20">
                <defs>
                  <pattern 
                    id={`offset-${i}`} 
                    patternUnits="userSpaceOnUse" 
                    x={offset.x} 
                    y={offset.y} 
                    width="20" 
                    height="20"
                  >
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#offset-${i})`} strokeWidth={strokeWidth} />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground">
              Tile at ({offset.x}, {offset.y})
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm">
        <strong>Key insight:</strong> The viewBox is 0–20. The ring spans from ~0.5 to ~19.5. A 20×20 tile starting at (0,0) has its boundary at y=20 (outside viewBox). But <code>userSpaceOnUse</code> tiles globally, so the boundary may fall inside depending on page position.
      </div>
    </section>
  );
}

/**
 * Test 8: Simulating the real component at different page positions
 */
function PagePositionTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 8 — Page position simulation</h2>
        <p className="text-sm text-muted-foreground">
          The same SVG at different horizontal positions on page. Watch for inconsistent tile boundaries.
        </p>
      </header>

      <div className="flex gap-0">
        {[0, 7, 14, 21].map((margin, i) => (
          <div 
            key={i} 
            className="grid gap-2"
            style={{ marginLeft: `${margin}px` }}
          >
            <div
              className="grid place-items-center rounded-full"
              style={{ width: 120, height: 120, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
            >
              <svg width={120} height={120} viewBox="0 0 20 20">
                <defs>
                  <pattern id={`pos-test-${i}`} patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#pos-test-${i})`} strokeWidth={strokeWidth} />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground">+{margin}px</code>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 border p-3 text-sm">
        <strong>Observation:</strong> With <code>userSpaceOnUse</code>, the pattern is fixed to page coordinates. Different page positions cause the 20×20 tile boundary to fall at different places within each circle.
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

/**
 * Test 9: Container vs SVG isolation
 * Is the cutoff happening at the SVG level or the container div level?
 */
function ContainerIsolationTest() {
  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 9 — Container vs SVG isolation</h2>
        <p className="text-sm text-muted-foreground">
          Comparing: full container styling vs bare SVG vs different container styles.
        </p>
      </header>

      <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 border p-3 text-sm">
        <strong>Hypothesis:</strong> If the cutoff disappears when we remove container styling (borderRadius, overflow, etc.), then the issue is CSS-based, not SVG-based.
      </div>

      <div className="flex flex-wrap gap-8">
        {/* A: Full container styling (like the component) */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">A: Full container styling</div>
          <div
            className="progress-ring-container"
            style={{
              width: 160,
              height: 160,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#E6EAF1',
              borderRadius: '50%',
              border: 'solid 0.5px #41403E',
              position: 'relative',
            }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20" style={{ width: 160, height: 'auto' }}>
              <defs>
                <pattern id="iso-a" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-a)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">borderRadius: 50%<br/>border, background</code>
        </div>

        {/* B: Bare SVG - no container */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">B: Bare SVG (no container)</div>
          <svg width={160} height={160} viewBox="0 0 20 20" style={{ background: '#E6EAF1' }}>
            <defs>
              <pattern id="iso-b" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
              </pattern>
            </defs>
            <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-b)" strokeWidth={strokeWidth} />
          </svg>
          <code className="text-xs text-muted-foreground">No container div<br/>SVG only</code>
        </div>

        {/* C: Container without borderRadius */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">C: No borderRadius</div>
          <div
            style={{
              width: 160,
              height: 160,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#E6EAF1',
              border: 'solid 0.5px #41403E',
            }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20">
              <defs>
                <pattern id="iso-c" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-c)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">Square container<br/>No borderRadius</code>
        </div>

        {/* D: Container with overflow:visible */}
        <div className="grid gap-2">
          <div className="text-sm font-medium">D: overflow: visible</div>
          <div
            style={{
              width: 160,
              height: 160,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#E6EAF1',
              borderRadius: '50%',
              border: 'solid 0.5px #41403E',
              overflow: 'visible',
            }}
          >
            <svg width={160} height={160} viewBox="0 0 20 20" style={{ overflow: 'visible' }}>
              <defs>
                <pattern id="iso-d" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                  <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>
              <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-d)" strokeWidth={strokeWidth} />
            </svg>
          </div>
          <code className="text-xs text-muted-foreground">overflow: visible<br/>on both container & SVG</code>
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="text-sm font-medium">SVG with explicit dimensions vs height:auto</div>
        <div className="flex flex-wrap gap-8">
          {/* E: Fixed width and height */}
          <div className="grid gap-2">
            <div className="text-sm font-medium">E: width=160, height=160</div>
            <div style={{ background: '#E6EAF1', display: 'inline-block' }}>
              <svg width={160} height={160} viewBox="0 0 20 20">
                <defs>
                  <pattern id="iso-e" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-e)" strokeWidth={strokeWidth} />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground">Explicit dimensions</code>
          </div>

          {/* F: width with height:auto (like component) */}
          <div className="grid gap-2">
            <div className="text-sm font-medium">F: width=160, height=auto</div>
            <div style={{ background: '#E6EAF1', display: 'inline-block' }}>
              <svg width={160} viewBox="0 0 20 20" style={{ width: 160, height: 'auto' }}>
                <defs>
                  <pattern id="iso-f" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-f)" strokeWidth={strokeWidth} />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground">height: auto (like component)</code>
          </div>

          {/* G: Larger viewBox with padding */}
          <div className="grid gap-2">
            <div className="text-sm font-medium">G: Larger viewBox (padding)</div>
            <div style={{ background: '#E6EAF1', display: 'inline-block' }}>
              <svg width={160} height={160} viewBox="-1 -1 22 22">
                <defs>
                  <pattern id="iso-g" patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                    <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                  </pattern>
                </defs>
                <circle r={r} cx="10" cy="10" fill="transparent" stroke="url(#iso-g)" strokeWidth={strokeWidth} />
              </svg>
            </div>
            <code className="text-xs text-muted-foreground">viewBox="-1 -1 22 22"<br/>Extra padding</code>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm mt-4">
        <strong>What to compare:</strong>
        <ul className="list-disc pl-4 mt-1 text-muted-foreground">
          <li><strong>A vs B:</strong> If B has no cutoff, container is causing it</li>
          <li><strong>A vs C:</strong> If C has no cutoff, borderRadius is causing it</li>
          <li><strong>A vs D:</strong> If D has no cutoff, overflow is causing it</li>
          <li><strong>E vs F:</strong> If F has cutoff but E doesn't, height:auto is the issue</li>
          <li><strong>G:</strong> If larger viewBox fixes it, the stroke is hitting viewBox edge</li>
        </ul>
      </div>
    </section>
  );
}

/**
 * Test 10: objectBoundingBox at different vertical positions
 * Does objectBoundingBox also have position-dependent cutoff?
 */
function ObjectBoundingBoxPositionTest() {
  // Create spacers of different heights to push circles to different vertical positions
  const verticalOffsets = [0, 50, 100, 150, 200];

  return (
    <section className="grid gap-4 rounded-lg border bg-card p-4">
      <header className="grid gap-1">
        <h2 className="text-lg font-semibold">Test 10 — objectBoundingBox at different vertical positions</h2>
        <p className="text-sm text-muted-foreground">
          Same objectBoundingBox pattern at different vertical page positions. Does cutoff appear/disappear?
        </p>
      </header>

      <div className="rounded-md bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 border p-3 text-sm">
        <strong>Hypothesis:</strong> If objectBoundingBox is truly element-relative, all circles should look identical regardless of vertical position. If they differ, there's a browser rendering quirk.
      </div>

      <div className="grid gap-4">
        <div className="text-sm font-medium">Horizontal row (same vertical position, different horizontal)</div>
        <div className="flex gap-4">
          {[0, 17, 34, 51].map((marginLeft, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : marginLeft }}>
              <div
                className="grid place-items-center rounded-full"
                style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
              >
                <svg width={100} height={100} viewBox="0 0 20 20">
                  <defs>
                    <pattern id={`obb-h-${i}`} patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                      <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                  </defs>
                  <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#obb-h-${i})`} strokeWidth={strokeWidth} />
                </svg>
              </div>
              <code className="text-xs text-muted-foreground">+{marginLeft}px</code>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="text-sm font-medium">Vertical stack (different vertical positions)</div>
        <div className="grid gap-2">
          {verticalOffsets.map((offset, i) => (
            <div key={i} className="flex items-center gap-4" style={{ marginTop: i === 0 ? 0 : offset - verticalOffsets[i-1] - 100 - 8 }}>
              <div
                className="grid place-items-center rounded-full"
                style={{ width: 100, height: 100, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
              >
                <svg width={100} height={100} viewBox="0 0 20 20">
                  <defs>
                    <pattern id={`obb-v-${i}`} patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                      <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                    </pattern>
                  </defs>
                  <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#obb-v-${i})`} strokeWidth={strokeWidth} />
                </svg>
              </div>
              <code className="text-xs text-muted-foreground">Vertical position #{i + 1}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mt-4">
        <div className="text-sm font-medium">Compare: userSpaceOnUse vs objectBoundingBox side by side</div>
        <div className="flex gap-8">
          <div className="grid gap-2">
            <div className="text-sm text-destructive font-medium">userSpaceOnUse (20×20)</div>
            <div className="flex gap-2">
              {[0, 13, 26].map((ml, i) => (
                <div key={i} style={{ marginLeft: ml }}>
                  <div
                    className="grid place-items-center rounded-full"
                    style={{ width: 80, height: 80, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
                  >
                    <svg width={80} height={80} viewBox="0 0 20 20">
                      <defs>
                        <pattern id={`usou-cmp-${i}`} patternUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                          <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                        </pattern>
                      </defs>
                      <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#usou-cmp-${i})`} strokeWidth={strokeWidth} />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-green-600 font-medium">objectBoundingBox</div>
            <div className="flex gap-2">
              {[0, 13, 26].map((ml, i) => (
                <div key={i} style={{ marginLeft: ml }}>
                  <div
                    className="grid place-items-center rounded-full"
                    style={{ width: 80, height: 80, background: "#E6EAF1", border: "solid 0.5px #41403E" }}
                  >
                    <svg width={80} height={80} viewBox="0 0 20 20">
                      <defs>
                        <pattern id={`obb-cmp-${i}`} patternUnits="objectBoundingBox" x="0" y="0" width="1" height="1">
                          <image href={pencilPattern} x="0" y="0" width="20" height="20" preserveAspectRatio="xMidYMid slice" />
                        </pattern>
                      </defs>
                      <circle r={r} cx="10" cy="10" fill="transparent" stroke={`url(#obb-cmp-${i})`} strokeWidth={strokeWidth} />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-muted/40 p-3 text-sm mt-4">
        <strong>What to compare:</strong>
        <ul className="list-disc pl-4 mt-1 text-muted-foreground">
          <li><strong>Horizontal row:</strong> Do all objectBoundingBox circles look identical?</li>
          <li><strong>Vertical stack:</strong> Does the cutoff appear at certain vertical positions?</li>
          <li><strong>Side by side:</strong> userSpaceOnUse should vary by position, objectBoundingBox should not</li>
        </ul>
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
        <PatternUnitsTest />
        <LargePatternTest />
        <StrokeEdgeTest />
        <ZoomedCropTest />
        <AlternativeApproachesTest />
        <PatternOffsetTest />
        <PagePositionTest />
        <ContainerIsolationTest />
        <ObjectBoundingBoxPositionTest />

        <section className="rounded-lg border bg-card p-4 text-sm">
          <h2 className="text-lg font-semibold">Summary: What to look for</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong>Test 1:</strong> If cutoff moves with rotation → intentional (dashoffset). If it stays at bottom → unintentional.</li>
            <li><strong>Test 2:</strong> 100% fill has no dashoffset gap. Any visible edge cutoff here is purely unintentional.</li>
            <li><strong>Test 3:</strong> Which reference line aligns with the visible cutoff? This tells us the y-coordinate.</li>
            <li><strong>Test 4:</strong> Compare 20×20 vs 100×100 pattern on same stroke edge analysis.</li>
            <li><strong>Test 5:</strong> Zoomed bottom edge with multiple approaches (20×20, 100×100, offset).</li>
            <li><strong>Test 6:</strong> Alternative approaches: 2×2 repeat, 3×3 repeat, objectBoundingBox, clip path.</li>
            <li><strong>Test 7:</strong> Pattern offset values — does centering the tile hide the boundary?</li>
            <li><strong>Test 8:</strong> Same pattern at different page positions — proves userSpaceOnUse is position-dependent.</li>
            <li><strong>Test 9:</strong> Container isolation — is the cutoff from CSS or SVG?</li>
            <li><strong>Test 10:</strong> objectBoundingBox at different positions — is it truly position-independent?</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
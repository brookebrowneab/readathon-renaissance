import { createRoot } from "react-dom/client";

// Import fonts directly to ensure Vite bundles them
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
// Fallback: bundle Instrument Serif via @fontsource as well, in case a preview
// environment caches/blocks the self-hosted font files.
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";

import App from "./App.tsx";
import "./styles/serif-fonts.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
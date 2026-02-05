import { createRoot } from "react-dom/client";

// Sans fonts via @fontsource
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
// Source Serif 4 is loaded via Adobe Typekit in index.html

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import { LanguageProvider } from "./i18n/LanguageContext";
import { langFromPath } from "./i18n/paths";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/instrument-sans";
import "./index.css";

const root = document.getElementById("root");
const app = (
	<StrictMode>
		<LanguageProvider lang={langFromPath(window.location.pathname)}>
			<App />
		</LanguageProvider>
	</StrictMode>
);

// Production pages are prerendered (scripts/prerender.mjs): hydrate them. The dev server serves an empty root.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

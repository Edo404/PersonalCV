import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { LanguageProvider } from "./i18n/LanguageContext";

// Used by scripts/prerender.mjs to produce the static HTML of each language
export function render(lang) {
	return renderToString(
		<StrictMode>
			<LanguageProvider lang={lang}>
				<App />
			</LanguageProvider>
		</StrictMode>
	);
}

import { createContext, useCallback, useContext, useMemo } from "react";
import it from "./it";
import en from "./en";

const dictionaries = { it, en };
export const LANGUAGES = ["it", "en"];

const LanguageContext = createContext(null);

// The language comes from the URL (see paths.js), so the same markup renders on the server and in the browser
export function LanguageProvider({ lang, children }) {
	// Resolves "a.b.c" in the active dictionary; returns the fallback when the key is missing
	const t = useCallback(
		(key, fallback = key) => key.split(".").reduce((node, part) => node?.[part], dictionaries[lang]) ?? fallback,
		[lang]
	);

	const value = useMemo(() => ({ lang, t }), [lang, t]);
	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
	return useContext(LanguageContext);
}

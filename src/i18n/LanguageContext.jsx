import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import it from "./it";
import en from "./en";

const dictionaries = { it, en };
export const LANGUAGES = ["it", "en"];
const STORAGE_KEY = "language";
const DEFAULT_LANGUAGE = "it";

function readLanguage() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
	} catch {
		return DEFAULT_LANGUAGE;
	}
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
	const [lang, setLangState] = useState(readLanguage);

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	const setLang = useCallback((next) => {
		setLangState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// storage unavailable: the choice just won't be remembered
		}
	}, []);

	// Resolves "a.b.c" in the active dictionary; returns the fallback when the key is missing
	const t = useCallback(
		(key, fallback = key) => key.split(".").reduce((node, part) => node?.[part], dictionaries[lang]) ?? fallback,
		[lang]
	);

	const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
	return useContext(LanguageContext);
}

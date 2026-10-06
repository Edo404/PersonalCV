// Each language lives at its own URL so crawlers can index both
export const LANG_PATHS = { it: "/", en: "/en/" };

export function langFromPath(pathname) {
	return /^\/en(\/|$)/.test(pathname) ? "en" : "it";
}

// Runs after the client and SSR builds: writes one fully rendered HTML page per language plus crawler files
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import it from "../src/i18n/it.js";
import en from "../src/i18n/en.js";
import { LANG_PATHS } from "../src/i18n/paths.js";
import { headTags, llmsTxt, robotsTxt, sitemapXml } from "../src/seo.js";

const DIST = resolve("dist");
const SSR_ENTRY = resolve("dist-ssr/entry-server.js");
const dictionaries = { it, en };

// Same lookup as LanguageContext's t(), for the build-time head
const makeT = (dict) => (key, fallback = key) => key.split(".").reduce((node, part) => node?.[part], dict) ?? fallback;

const { render } = await import(pathToFileURL(SSR_ENTRY).href);
const template = readFileSync(resolve(DIST, "index.html"), "utf8");

for (const lang of Object.keys(LANG_PATHS)) {
	const t = makeT(dictionaries[lang]);
	const html = template
		.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
		.replace(/\s*<!-- Dev-only title[^>]*-->\s*<title>[^<]*<\/title>/, "")
		// Function replacements: "$&", "$'"... in site text must be inserted literally
		.replace("<!--app-head-->", () => headTags(lang, t))
		.replace("<!--app-html-->", () => render(lang));

	const dir = resolve(DIST, `.${LANG_PATHS[lang]}`);
	mkdirSync(dir, { recursive: true });
	writeFileSync(resolve(dir, "index.html"), html);
	console.log(`prerendered ${LANG_PATHS[lang]} (${lang})`);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(resolve(DIST, "robots.txt"), robotsTxt());
writeFileSync(resolve(DIST, "sitemap.xml"), sitemapXml(today));
writeFileSync(resolve(DIST, "llms.txt"), llmsTxt(makeT(en)));
rmSync(resolve("dist-ssr"), { recursive: true, force: true });
console.log("wrote robots.txt, sitemap.xml, llms.txt");

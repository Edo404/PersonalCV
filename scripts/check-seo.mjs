// Verifies the prerendered build is complete for search engines and AI agents (run after npm run build)
import { existsSync, readFileSync } from "node:fs";

const SITE = "https://edoardogamurrini.netlify.app";
const errors = [];
const read = (path) => (existsSync(path) ? readFileSync(path, "utf8") : (errors.push(`missing file: ${path}`), ""));
const expect = (cond, msg) => cond || errors.push(msg);

const pages = [
	{ file: "dist/index.html", lang: "it", url: `${SITE}/`, text: "Chi sono", resume: "Esperienza e formazione" },
	{ file: "dist/en/index.html", lang: "en", url: `${SITE}/en/`, text: "About Me", resume: "Experience &amp; Education" },
];

for (const page of pages) {
	const html = read(page.file);
	expect(html.includes(`<html lang="${page.lang}">`), `${page.file}: html lang is not ${page.lang}`);
	expect(/<title>[^<]*Edoardo Gamurrini[^<]*<\/title>/.test(html), `${page.file}: title without full name`);
	expect((html.match(/<title>/g) || []).length === 1, `${page.file}: expected exactly one <title>`);
	expect(html.includes(`<link rel="canonical" href="${page.url}">`), `${page.file}: wrong canonical`);
	expect(html.includes(`hreflang="it"`) && html.includes(`hreflang="en"`) && html.includes(`hreflang="x-default"`), `${page.file}: hreflang links missing`);
	expect(html.includes(page.text), `${page.file}: prerendered content missing ("${page.text}")`);
	expect(/<h1[^>]*>.*Edoardo Gamurrini/.test(html), `${page.file}: h1 without full name`);
	expect(html.includes(page.resume) && html.includes("Avvale S.p.A."), `${page.file}: experience section missing`);
	expect(html.includes(`<form name="contact"`), `${page.file}: hidden Netlify form missing`);
	expect(!html.includes("<!--app-"), `${page.file}: unreplaced template marker`);

	const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
	expect(blocks.length > 0, `${page.file}: no JSON-LD`);
	for (const [, json] of blocks) {
		try {
			const data = JSON.parse(json);
			expect(data.mainEntity?.name === "Edoardo Gamurrini", `${page.file}: JSON-LD mainEntity.name wrong`);
			expect(data.mainEntity?.worksFor?.name === "Avvale S.p.A." && data.mainEntity?.alumniOf?.length === 1, `${page.file}: JSON-LD worksFor/alumniOf missing`);
		} catch (e) {
			errors.push(`${page.file}: JSON-LD does not parse (${e.message})`);
		}
	}
}

const robots = read("dist/robots.txt");
expect(robots.includes("GPTBot") && robots.includes("ClaudeBot") && robots.includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt incomplete");
const sitemap = read("dist/sitemap.xml");
expect(sitemap.includes(`<loc>${SITE}/</loc>`) && sitemap.includes(`<loc>${SITE}/en/</loc>`), "sitemap.xml missing a URL");
const llms = read("dist/llms.txt");
expect(llms.startsWith("# Edoardo Gamurrini"), "llms.txt must start with # Edoardo Gamurrini");
expect(existsSync("dist/og-image.png"), "og-image.png missing");
expect(!existsSync("dist-ssr"), "dist-ssr should be removed after prerender");

if (errors.length) {
	console.error(errors.join("\n"));
	process.exit(1);
}
console.log("SEO OK: 2 pages, robots.txt, sitemap.xml, llms.txt, og-image.png");

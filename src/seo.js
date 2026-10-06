// Everything search engines and AI agents read: <head> tags, JSON-LD, robots.txt, sitemap.xml, llms.txt.
// Used only at build time by scripts/prerender.mjs. Change SITE_URL when moving to a custom domain.
import { items } from "./data/items.js";
import { timeline } from "./data/resume.js";
import { LANG_PATHS } from "./i18n/paths.js";

export const SITE_URL = "https://edoardogamurrini.netlify.app";
// Google Search Console ownership token (must stay on the home page)
const GOOGLE_SITE_VERIFICATION = "zl8vG2KhvcWw2BR9bInAR1FX3RsbY5VtQWzUtx07whk";

const PERSON = {
	name: "Edoardo Gamurrini",
	givenName: "Edoardo",
	familyName: "Gamurrini",
	country: "IT",
	image: "/postsPics/edoardo-gamurrini.png",
	sameAs: ["https://www.linkedin.com/in/edoardo-gamurrini/", "https://github.com/Edo404"],
};

const OG_IMAGE = "/og-image.png";
const OG_LOCALES = { it: "it_IT", en: "en_US" };

// Issuer names for structured data, keyed like the logos map in items.js
const ISSUERS = {
	microsoft: "Microsoft",
	linkedin: "LinkedIn",
	pmi: "Project Management Institute",
	nasba: "NASBA",
	bocconi: "Università Bocconi",
	pendo: "Pendo.io",
	claude: "Anthropic",
};

const pageUrl = (lang) => SITE_URL + LANG_PATHS[lang];
const currentJob = timeline.find((entry) => entry.kind === "work" && /oggi|present/.test(entry.period.en + entry.period.it));
const schools = timeline.filter((entry) => entry.kind === "education");
const certifications = items.filter((item) => item.type === "certification");
const projects = items.filter((item) => item.type === "project");
// Skills come from the card tags, minus the generic ones
const skills = [...new Set(items.flatMap((item) => item.tags))].filter((tag) => !["Certification", "Project"].includes(tag));

const escapeAttr = (value) =>
	String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function jsonLd(lang, t) {
	return {
		"@context": "https://schema.org",
		"@type": "ProfilePage",
		url: pageUrl(lang),
		name: t("meta.title"),
		inLanguage: lang,
		mainEntity: {
			"@type": "Person",
			"@id": `${SITE_URL}/#person`,
			name: PERSON.name,
			givenName: PERSON.givenName,
			familyName: PERSON.familyName,
			url: pageUrl(lang),
			image: SITE_URL + PERSON.image,
			jobTitle: t("meta.jobTitle"),
			description: t("meta.description"),
			address: { "@type": "PostalAddress", addressCountry: PERSON.country },
			sameAs: PERSON.sameAs,
			...(currentJob && { worksFor: { "@type": "Organization", name: currentJob.org } }),
			alumniOf: schools.map((entry) => ({ "@type": "CollegeOrUniversity", name: entry.org })),
			knowsLanguage: ["it", "en"],
			knowsAbout: skills,
			hasCredential: certifications.map((item) => ({
				"@type": "EducationalOccupationalCredential",
				name: item.title,
				description: item.description[lang],
				credentialCategory: "certificate",
				url: item.link,
				recognizedBy: (item.logos ?? []).map((key) => ({ "@type": "Organization", name: ISSUERS[key] ?? key })),
			})),
		},
	};
}

export function headTags(lang, t) {
	const url = pageUrl(lang);
	const title = escapeAttr(t("meta.title"));
	const description = escapeAttr(t("meta.description"));
	const otherLang = lang === "it" ? "en" : "it";
	// "<" inside JSON would let a string close the script tag
	const ld = JSON.stringify(jsonLd(lang, t)).replace(/</g, "\\u003c");

	return [
		`<title>${title}</title>`,
		`<meta name="description" content="${description}">`,
		`<meta name="author" content="${PERSON.name}">`,
		`<meta name="robots" content="index, follow, max-image-preview:large">`,
		`<meta name="theme-color" content="#212529">`,
		`<meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}">`,
		`<link rel="canonical" href="${url}">`,
		`<link rel="alternate" hreflang="it" href="${pageUrl("it")}">`,
		`<link rel="alternate" hreflang="en" href="${pageUrl("en")}">`,
		`<link rel="alternate" hreflang="x-default" href="${pageUrl("it")}">`,
		`<meta property="og:type" content="profile">`,
		`<meta property="og:site_name" content="${PERSON.name}">`,
		`<meta property="og:title" content="${title}">`,
		`<meta property="og:description" content="${description}">`,
		`<meta property="og:url" content="${url}">`,
		`<meta property="og:image" content="${SITE_URL}${OG_IMAGE}">`,
		`<meta property="og:image:width" content="1200">`,
		`<meta property="og:image:height" content="630">`,
		`<meta property="og:image:alt" content="${PERSON.name}">`,
		`<meta property="og:locale" content="${OG_LOCALES[lang]}">`,
		`<meta property="og:locale:alternate" content="${OG_LOCALES[otherLang]}">`,
		`<meta property="profile:first_name" content="${PERSON.givenName}">`,
		`<meta property="profile:last_name" content="${PERSON.familyName}">`,
		`<meta name="twitter:card" content="summary_large_image">`,
		`<meta name="twitter:title" content="${title}">`,
		`<meta name="twitter:description" content="${description}">`,
		`<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE}">`,
		`<script type="application/ld+json">${ld}</script>`,
	].join("\n    ");
}

// Explicitly welcome search engines and AI crawlers
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export function robotsTxt() {
	return [
		"User-agent: *",
		"Allow: /",
		"",
		...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", ""]),
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		"",
	].join("\n");
}

export function sitemapXml(date) {
	const alternates = ["it", "en"]
		.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${pageUrl(lang)}"/>`)
		.concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl("it")}"/>`)
		.join("\n");
	const entry = (lang) => `  <url>\n    <loc>${pageUrl(lang)}</loc>\n    <lastmod>${date}</lastmod>\n${alternates}\n  </url>`;
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry("it")}
${entry("en")}
</urlset>
`;
}

// Markdown summary for AI agents (llmstxt.org), written in English
export function llmsTxt(t) {
	const plain = (text) => text.replace(/\*\*/g, "");
	const issuers = (item) => (item.logos ?? []).map((key) => ISSUERS[key] ?? key).join(", ");
	return `# ${PERSON.name}

> ${t("meta.description")}

${plain(t("about.body"))}

## Pages
- [Portfolio (English)](${pageUrl("en")}): roles, about, certifications, projects and contact form
- [Portfolio (Italiano)](${pageUrl("it")}): same content in Italian
- [Resume (PDF, English)](${SITE_URL}/_EG_CV_ENG.pdf)

## Profiles
- [LinkedIn](${PERSON.sameAs[0]})
- [GitHub](${PERSON.sameAs[1]})

## Experience & Education
${timeline.map((entry) => `- ${entry.role.en}, ${entry.org} (${entry.place.en}, ${entry.period.en}): ${entry.summary.en}`).join("\n")}

## Certifications
${certifications.map((item) => `- [${item.title}](${item.link}): ${item.description.en}${issuers(item) ? ` (issued by ${issuers(item)})` : ""}`).join("\n")}

## Projects
${projects.map((item) => `- [${item.title}](${item.titleLink?.startsWith("http") ? item.titleLink : item.link}): ${item.description.en}. Source: ${item.link}`).join("\n")}

## Contact
Use the contact form on the portfolio or reach out on LinkedIn.
`;
}

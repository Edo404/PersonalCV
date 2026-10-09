// Experience and education from the resume (public/_EG_CV_ENG.pdf), newest first.
// kind: "work" | "education" (used by the JSON-LD in src/seo.js)
export const timeline = [
	{
		kind: "work",
		role: { it: "IT Consultant", en: "IT Consultant" },
		org: "Avvale S.p.A.",
		url: "https://www.avvale.com/",
		place: { it: "Milano", en: "Milan" },
		period: { it: "2023 - oggi", en: "2023 - present" },
		summary: {
			it: "Gestisco il ticketing di più progetti e sviluppo soluzioni Power Apps e Power Automate per i clienti, dai requisiti al rilascio. Con il team ho ridotto di circa il 10% il tempo dedicato ai ticket in un anno.",
			en: "I manage ticketing across multiple projects and build Power Apps and Power Automate solutions for clients, from requirements to delivery. With my team I cut time spent on tickets by about 10% in one year.",
		},
	},
	{
		kind: "education",
		role: { it: "Laurea in Informatica", en: "Bachelor's Degree in Computer Science" },
		org: "Università degli Studi di Urbino",
		url: "https://www.uniurb.it/",
		place: { it: "Urbino", en: "Urbino" },
		period: { it: "2023", en: "2023" },
		summary: {
			it: "Laurea triennale con tesi sulle metodologie di software testing.",
			en: "Bachelor's degree with a thesis on software testing methodologies.",
		},
	},
	{
		kind: "work",
		role: { it: "Frontend Developer", en: "Frontend Developer" },
		org: "kint",
		url: "https://kint.ch/",
		place: { it: "Lugano", en: "Lugano" },
		period: { it: "2021 - 2022", en: "2021 - 2022" },
		summary: {
			it: "Siti su misura in HTML, CSS e JavaScript in una startup, con la responsabilità del frontend e della UX/UI.",
			en: "Custom websites in HTML, CSS and JavaScript at a startup, owning frontend development and UX/UI.",
		},
	},
	{
		kind: "work",
		role: { it: "Software Testing & Research Intern", en: "Software Testing & Research Intern" },
		org: "Websolute S.p.A.",
		url: "https://www.websolute.com/",
		place: { it: "Pesaro", en: "Pesaro" },
		period: { it: "2021", en: "2021" },
		summary: {
			it: "Test automatici ed end-to-end sui siti aziendali con Cypress e Postman.",
			en: "Automated and end-to-end testing of company websites with Cypress and Postman.",
		},
	},
];

// Skill groups and languages shown under the timeline
export const skills = [
	{
		group: { it: "Project management", en: "Project management" },
		items: { it: "Jira, Confluence, comunicazione con il cliente, gestione ticket", en: "Jira, Confluence, client communication, ticket management" },
	},
	{
		group: { it: "Competenze tecniche", en: "Technical skills" },
		items: { it: "Power Apps, Power Automate, SQL, JavaScript, React, Git, HTML/CSS, test automatici", en: "Power Apps, Power Automate, SQL, JavaScript, React, Git, HTML/CSS, automated testing" },
	},
	{
		group: { it: "Soft skills", en: "Soft skills" },
		items: { it: "Leadership, negoziazione, gestione degli stakeholder, problem solving", en: "Leadership, negotiation, stakeholder engagement, problem solving" },
	},
	{
		group: { it: "Lingue", en: "Languages" },
		items: { it: "Italiano (madrelingua), inglese (B2)", en: "Italian (native), English (B2)" },
	},
];

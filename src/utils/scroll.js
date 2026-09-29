// Smooth scrolling for in-page anchor links
export function scrollToSection(e, href) {
	e.preventDefault();
	document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

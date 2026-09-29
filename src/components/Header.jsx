import { useEffect, useState } from "react";
import { scrollToSection } from "../utils/scroll";

const links = [
	{ href: "#about", label: "About" },
	{ href: "#projects", label: "Certifications & Projects" },
	{ href: "#contact", label: "Contact" },
];

export default function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	// Header scroll effect
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 50);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const handleLink = (e, href) => {
		setMenuOpen(false);
		scrollToSection(e, href);
	};

	return (
		<header className={scrolled ? "scrolled" : ""}>
			<nav className="container">
				<a href="#home" className="logo" onClick={(e) => handleLink(e, "#home")}>
					<img
						src="/postsPics/2o.png"
						alt="Edoardo Gamurrini"
						style={{ width: "50px", height: "50px", borderRadius: "50%", borderStyle: "solid", borderWidth: "2px", borderColor: "var(--gray-400)" }}
					/>
				</a>
				<ul className={`nav-links${menuOpen ? " active" : ""}`}>
					{links.map(({ href, label }) => (
						<li key={href}>
							<a href={href} onClick={(e) => handleLink(e, href)}>{label}</a>
						</li>
					))}
				</ul>
				<button className="nav-toggle" onClick={() => setMenuOpen((open) => !open)}>
					{menuOpen ? "✕" : "☰"}
				</button>
			</nav>
		</header>
	);
}

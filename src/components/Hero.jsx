import { scrollToSection } from "../utils/scroll";

export default function Hero() {
	return (
		<section className="hero" id="home">
			<div className="container">
				<div className="hero-content fade-in">
					<h1>Hello, I'm <span style={{ color: "var(--secondary)" }}>Edoardo!</span></h1>
					<h2 className="fade-in delay-1">I'm a Software Analyst | Digital Engineering</h2>
					<p className="fade-in delay-2">Creative aspiring Project/Product Manager with a passion for innovation. My dream is to build my own business and drive impactful solutions</p>
					<div className="fade-in delay-3">
						<a href="#projects" className="btn" onClick={(e) => scrollToSection(e, "#projects")}>Certifications & Projects</a>
						<a href="#contact" className="btn btn-outline" onClick={(e) => scrollToSection(e, "#contact")}>Contact Me</a>
					</div>
				</div>
			</div>
		</section>
	);
}

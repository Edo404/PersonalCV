import { useEffect, useRef, useState } from "react";
import { items } from "../data/items";
import { useLanguage } from "../i18n/LanguageContext";
import { scrollToSection } from "../utils/scroll";

const ROLES = ["Software Analyst", "AI Software Developer", "Product Builder"];

// Role changes once per bar at 100 BPM (4 beats x 600ms)
const ROLE_INTERVAL_MS = 2400;

const DECK_TITLES = ["Claude Code in action", "Claude Code 101", "Claude 101", "Microsoft PL-400"];
const DECK = DECK_TITLES.map((title) => items.find((item) => item.title === title)).filter(Boolean);
// Resting offsets of the stacked cards and their angles once fanned out on hover
const DECK_REST = [
	{ rot: "-2deg", dx: "0px", dy: "0px", fan: "13deg" },
	{ rot: "3deg", dx: "10px", dy: "-8px", fan: "4deg" },
	{ rot: "-6deg", dx: "-12px", dy: "6px", fan: "-5deg" },
	{ rot: "7deg", dx: "16px", dy: "-14px", fan: "-14deg" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RoleRotator() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (prefersReducedMotion()) return;
		const timer = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), ROLE_INTERVAL_MS);
		return () => clearInterval(timer);
	}, []);

	const prev = (index + ROLES.length - 1) % ROLES.length;

	return (
		<span className="role-rotator" aria-hidden="true">
			{/* Invisible copy of the longest role reserves the width */}
			<span className="role-sizer">{ROLES.reduce((a, b) => (b.length > a.length ? b : a))}</span>
			{ROLES.map((role, i) => (
				<span key={role} className={`role${i === index ? " is-active" : i === prev ? " is-prev" : ""}`}>
					{role}
				</span>
			))}
		</span>
	);
}

function CertDeck() {
	const deck = useRef();
	const { t } = useLanguage();

	// Tilt follows the pointer through CSS variables, outside React state
	const tilt = (e) => {
		const r = deck.current.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width - 0.5;
		const y = (e.clientY - r.top) / r.height - 0.5;
		deck.current.style.setProperty("--tilt-x", `${x * 12}deg`);
		deck.current.style.setProperty("--tilt-y", `${-y * 12}deg`);
	};
	const resetTilt = () => {
		deck.current.style.setProperty("--tilt-x", "0deg");
		deck.current.style.setProperty("--tilt-y", "0deg");
	};

	return (
		<div className="hero-visual fade-in delay-2">
			<a
				ref={deck}
				href="#projects"
				className="cert-deck"
				aria-label={t("hero.deckLabel")}
				onClick={(e) => scrollToSection(e, "#projects")}
				onPointerMove={tilt}
				onPointerLeave={resetTilt}
			>
				{DECK.map((item, i) => (
					<span
						key={item.title}
						className="deck-card"
						style={{
							"--i": i,
							"--rest-rot": DECK_REST[i].rot,
							"--dx": DECK_REST[i].dx,
							"--dy": DECK_REST[i].dy,
							"--fan": DECK_REST[i].fan,
						}}
					>
						<img src={item.image} alt={item.title} />
					</span>
				))}
			</a>
		</div>
	);
}

export default function Hero() {
	const { t } = useLanguage();

	return (
		<section className="hero" id="home">
			<div className="container hero-grid">
				<div className="hero-content">
					<h1 className="fade-in">{t("hero.greeting")} <span style={{ color: "var(--secondary)" }}>Edoardo!</span></h1>
					<h2 className="hero-role fade-in delay-1" aria-label={ROLES.join(", ")}>
						<RoleRotator />
					</h2>
					<p className="fade-in delay-2">{t("hero.subtitle")}</p>
					<div className="fade-in delay-3">
						<a href="#projects" className="btn" onClick={(e) => scrollToSection(e, "#projects")}>{t("hero.ctaProjects")}</a>
						<a href="#contact" className="btn btn-outline" onClick={(e) => scrollToSection(e, "#contact")}>{t("hero.ctaContact")}</a>
					</div>
				</div>
				<CertDeck />
			</div>
		</section>
	);
}

import { useEffect, useRef, useState } from "react";
import { items } from "../data/items";
import { scrollToSection } from "../utils/scroll";

const ROLES = ["Software Analyst", "AI Software Developer", "Product Builder"];

// Everything moves on one tempo: 100 BPM, 16th-note steps, role changes once per bar
const STEP_MS = 150;
const BAR_MS = STEP_MS * 16;

// One bar of a funk groove: 3 = kick/snare accent, 2 = ghost note, 1 = hi-hat
const GROOVE = [3, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 3, 1, 2, 1];
const BEAT_BARS = Array.from({ length: 64 }, (_, i) => GROOVE[i % 16]);

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
		const timer = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), BAR_MS);
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
				aria-label="Latest certifications"
				onClick={(e) => scrollToSection(e, "#projects")}
				onPointerMove={tilt}
				onPointerLeave={resetTilt}
			>
				<span className="deck-pulse">
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
				</span>
			</a>
		</div>
	);
}

export default function Hero() {
	return (
		<section className="hero" id="home" style={{ "--step": `${STEP_MS}ms` }}>
			<div className="container hero-grid">
				<div className="hero-content">
					<h1 className="fade-in">Hello, I'm <span style={{ color: "var(--secondary)" }}>Edoardo!</span></h1>
					<h2 className="hero-role fade-in delay-1" aria-label={ROLES.join(", ")}>
						<RoleRotator />
					</h2>
					<p className="fade-in delay-2">I turn business needs into AI-powered software, from analysis to shipped product. Next goal: building my own business.</p>
					<div className="fade-in delay-3">
						<a href="#projects" className="btn" onClick={(e) => scrollToSection(e, "#projects")}>Certifications & Projects</a>
						<a href="#contact" className="btn btn-outline" onClick={(e) => scrollToSection(e, "#contact")}>Contact Me</a>
					</div>
				</div>
				<CertDeck />
			</div>

			{/* Step-sequencer strip: a playhead sweeps four bars of the groove */}
			<div className="beat-strip" aria-hidden="true">
				{BEAT_BARS.map((level, i) => (
					<span key={i} className={`beat-bar level-${level}`} style={{ "--n": i }} />
				))}
			</div>
		</section>
	);
}

import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useLanguage } from "../i18n/LanguageContext";
import { scrollToSection } from "../utils/scroll";

const SECTIONS = [
	{ href: "#about", key: "nav.about" },
	{ href: "#projects", key: "nav.projects" },
];

export default function Header() {
	const { lang, setLang, t } = useLanguage();
	// null | "sections" (mobile ⋮ menu) | "language"
	const [openMenu, setOpenMenu] = useState(null);
	const navRef = useRef();

	// Close the open menu on outside click or Escape
	useEffect(() => {
		if (!openMenu) return;
		const onPointerDown = (e) => {
			if (!navRef.current.contains(e.target)) setOpenMenu(null);
		};
		const onKeyDown = (e) => {
			if (e.key === "Escape") setOpenMenu(null);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [openMenu]);

	const toggle = (menu) => setOpenMenu((current) => (current === menu ? null : menu));

	const go = (e, href) => {
		setOpenMenu(null);
		scrollToSection(e, href);
	};

	const chooseLanguage = (code) => {
		setLang(code);
		setOpenMenu(null);
	};

	return (
		<header className="site-header">
			<nav ref={navRef} className="nav-pill">
				<a href="#home" className="nav-avatar" aria-label={t("nav.home")} onClick={(e) => go(e, "#home")}>
					<img src="/postsPics/2o.png" alt="" />
				</a>
				<span className="nav-divider nav-divider-start" aria-hidden="true" />

				<button
					type="button"
					className="nav-icon-btn nav-sections-toggle"
					aria-label={t("nav.menu")}
					aria-expanded={openMenu === "sections"}
					onClick={() => toggle("sections")}
				>
					<i className="fa" aria-hidden="true">{""}</i>
				</button>
				<ul className={`nav-sections${openMenu === "sections" ? " is-open" : ""}`}>
					{SECTIONS.map(({ href, key }) => (
						<li key={href}>
							<a href={href} onClick={(e) => go(e, href)}>{t(key)}</a>
						</li>
					))}
				</ul>

				<a href="#contact" className="nav-cta" onClick={(e) => go(e, "#contact")}>{t("nav.contact")}</a>
				<span className="nav-divider" aria-hidden="true" />

				<div className="nav-lang">
					<button
						type="button"
						className="nav-icon-btn nav-lang-toggle"
						aria-label={t("nav.language")}
						aria-expanded={openMenu === "language"}
						onClick={() => toggle("language")}
					>
						<img src={`/flags/${lang}.svg`} alt="" className="flag" />
						<span className="nav-lang-code">{lang.toUpperCase()}</span>
						<i className="fa nav-chevron" aria-hidden="true">{""}</i>
					</button>
					{openMenu === "language" && (
						<ul className="nav-dropdown">
							{LANGUAGES.map((code) => (
								<li key={code}>
									<button type="button" className={code === lang ? "is-active" : ""} onClick={() => chooseLanguage(code)}>
										<img src={`/flags/${code}.svg`} alt="" className="flag" />
										{t(`languages.${code}`)}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</nav>
		</header>
	);
}

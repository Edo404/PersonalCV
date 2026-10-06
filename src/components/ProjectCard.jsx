import { useEffect, useState } from "react";
import { logos } from "../data/items";
import { useLanguage } from "../i18n/LanguageContext";
import { scrollToSection } from "../utils/scroll";

// Fades the card in/out (300ms, matching the CSS transition) instead of toggling it abruptly
function useFade(visible) {
	const [displayed, setDisplayed] = useState(visible);
	const [opacity, setOpacity] = useState(visible ? 1 : 0);

	useEffect(() => {
		let timer;
		if (visible) {
			setDisplayed(true);
			timer = setTimeout(() => setOpacity(1), 50);
		} else {
			setOpacity(0);
			timer = setTimeout(() => setDisplayed(false), 300);
		}
		return () => clearTimeout(timer);
	}, [visible]);

	return { display: displayed ? "flex" : "none", opacity };
}

export default function ProjectCard({ item, visible, onToggleSub, onSelectTag }) {
	const style = useFade(visible);
	const { lang, t } = useLanguage();
	const isInternal = item.titleLink?.startsWith("#");

	return (
		<div className="project-card" style={style}>
			<div className="project-image">
				<img src={item.image} alt={item.title} style={item.imageStyle} />
			</div>
			<div className="project-content">
				<h3>
					{item.titleLink ? (
						<a href={item.titleLink} onClick={isInternal ? (e) => scrollToSection(e, item.titleLink) : undefined}>
							{item.title}
						</a>
					) : (
						item.title
					)}
				</h3>
				<p>{item.description[lang]}</p>
				<div className="project-tags">
					{item.tags.map((tag) => (
						<button key={tag} type="button" className="project-tag" onClick={() => onSelectTag({ kind: "tag", value: tag })}>
							{t(`tags.${tag}`, tag)}
						</button>
					))}
					{item.logos?.map((key) => (
						<button key={key} type="button" className="project-tag" title={logos[key].alt} onClick={() => onSelectTag({ kind: "logo", value: key })}>
							<img src={logos[key].src} alt={logos[key].alt} style={logos[key].style} />
						</button>
					))}
				</div>
				<div className="project-links">
					<a href={item.link} className="btn">
						{item.type === "project" ? t("projects.viewSource") : t("projects.viewCertification")}
					</a>
					{item.parent && onToggleSub && (
						<a className="btn-career" onClick={onToggleSub}>
							<i style={{ fontSize: "22px" }} className="fa">{""}</i>
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

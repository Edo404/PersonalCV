import { useEffect, useState } from "react";
import { logos } from "../data/items";
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

export default function ProjectCard({ item, visible, onToggleSub }) {
	const style = useFade(visible);
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
				<p>{item.description}</p>
				<div className="project-tags">
					{item.tags.map((tag) => (
						<span key={tag} className="project-tag">{tag}</span>
					))}
					{item.logos?.map((key) => (
						<span key={key} className="project-tag">
							<img src={logos[key].src} alt={logos[key].alt} style={logos[key].style} />
						</span>
					))}
				</div>
				<div className="project-links">
					<a href={item.link} className="btn">
						{item.type === "project" ? "View Source Code </>" : "View Certification"}
					</a>
					{item.parent && (
						<a className="btn-career" onClick={onToggleSub}>
							<i style={{ fontSize: "22px" }} className="fa">{""}</i>
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

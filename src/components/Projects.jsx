import { useEffect, useRef, useState } from "react";
import { items, logos } from "../data/items";
import { useLanguage } from "../i18n/LanguageContext";
import ProjectCard from "./ProjectCard";

// tag: null | { kind: "tag" | "logo", value }
function matchesTag(item, tag) {
	return tag.kind === "logo" ? !!item.logos?.includes(tag.value) : item.tags.includes(tag.value);
}

export default function Projects() {
	// activeFilter drives the buttons immediately; shownFilter lags 300ms so the old cards fade out first
	const [activeFilter, setActiveFilter] = useState({ type: "certification", tag: null });
	const [shownFilter, setShownFilter] = useState(activeFilter);
	const [subExpanded, setSubExpanded] = useState(false);
	const timer = useRef();
	const { t } = useLanguage();

	useEffect(() => () => clearTimeout(timer.current), []);

	const applyFilter = (filter) => {
		setActiveFilter(filter);
		setSubExpanded(false);
		if (shownFilter && filter.type === shownFilter.type && filter.tag?.kind === shownFilter.tag?.kind && filter.tag?.value === shownFilter.tag?.value) return;
		setShownFilter(null);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setShownFilter(filter), 300);
	};

	const selectType = (type) => applyFilter({ type, tag: null });

	const selectTag = (type, tag) => {
		// A tag shared by every card of the section (e.g. "Certification") means "show all"
		const sameType = items.filter((item) => item.type === type);
		applyFilter({ type, tag: sameType.every((item) => matchesTag(item, tag)) ? null : tag });
		document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
	};

	const isVisible = (item) => {
		if (!shownFilter || item.type !== shownFilter.type) return false;
		// With a tag filter active, matching sub-certifications are shown directly
		return shownFilter.tag ? matchesTag(item, shownFilter.tag) : !item.sub || subExpanded;
	};

	const activeTag = activeFilter.tag;

	return (
		<section className="projects" id="projects">
			<div className="container">
				<h2>{t("projects.title")}</h2>

				<div className="filter-buttons" style={{ textAlign: "center", marginBottom: "2rem" }}>
					<button
						className={`filter-btn${activeFilter.type === "certification" ? " active" : ""}`}
						onClick={() => selectType("certification")}
					>
						<i style={{ fontSize: "15px" }} className="fa">{""}</i>    {t("projects.certifications")}
					</button>
					<button
						className={`filter-btn${activeFilter.type === "project" ? " active" : ""}`}
						onClick={() => selectType("project")}
					>
						<i style={{ fontSize: "15px" }} className="fa">{""}</i>    {t("projects.projects")}
					</button>
				</div>

				{activeTag && (
					<div className="active-tag-filter">
						<button type="button" className="project-tag active" onClick={() => selectType(activeFilter.type)} title={t("projects.removeFilter")}>
							{activeTag.kind === "logo" ? (
								<>
									<span className="active-tag-logo">
										<img src={logos[activeTag.value].src} alt="" style={logos[activeTag.value].style} />
									</span>
									{logos[activeTag.value].alt}
								</>
							) : (
								t(`tags.${activeTag.value}`, activeTag.value)
							)}
							<span>✕</span>
						</button>
					</div>
				)}

				<div className="projects-grid">
					{items.map((item) => (
						<ProjectCard
							key={item.title}
							item={item}
							visible={isVisible(item)}
							onToggleSub={shownFilter?.tag ? undefined : () => setSubExpanded((expanded) => !expanded)}
							onSelectTag={(tag) => selectTag(item.type, tag)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

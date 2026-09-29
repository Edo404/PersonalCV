import { useEffect, useRef, useState } from "react";
import { items } from "../data/items";
import ProjectCard from "./ProjectCard";

export default function Projects() {
	// activeFilter drives the buttons immediately; shownFilter lags 300ms so the old cards fade out first
	const [activeFilter, setActiveFilter] = useState("certification");
	const [shownFilter, setShownFilter] = useState("certification");
	const [subExpanded, setSubExpanded] = useState(false);
	const timer = useRef();

	useEffect(() => () => clearTimeout(timer.current), []);

	const selectFilter = (filter) => {
		setActiveFilter(filter);
		setSubExpanded(false);
		if (filter === shownFilter) return;
		setShownFilter(null);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => setShownFilter(filter), 300);
	};

	return (
		<section className="projects" id="projects">
			<div className="container">
				<h2>Certifications & Projects</h2>

				<div className="filter-buttons" style={{ textAlign: "center", marginBottom: "2rem" }}>
					<button
						className={`filter-btn${activeFilter === "certification" ? " active" : ""}`}
						onClick={() => selectFilter("certification")}
					>
						<i style={{ fontSize: "15px" }} className="fa">{""}</i>    Certifications
					</button>
					<button
						className={`filter-btn${activeFilter === "project" ? " active" : ""}`}
						onClick={() => selectFilter("project")}
					>
						<i style={{ fontSize: "15px" }} className="fa">{""}</i>    Projects
					</button>
				</div>

				<div className="projects-grid">
					{items.map((item) => (
						<ProjectCard
							key={item.title}
							item={item}
							visible={item.type === shownFilter && (!item.sub || subExpanded)}
							onToggleSub={() => setSubExpanded((expanded) => !expanded)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

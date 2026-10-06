import { useEffect, useRef } from "react";
import { skills, timeline } from "../data/resume";
import { useLanguage } from "../i18n/LanguageContext";

export default function Resume() {
	const { lang, t } = useLanguage();
	const listRef = useRef();

	// The orange line fills up to the middle of the viewport and lights each dot it reaches.
	// Values are written to a CSS variable and classes, outside React state.
	useEffect(() => {
		const list = listRef.current;
		const dots = [...list.querySelectorAll(".timeline-dot")];
		let frame = 0;

		const update = () => {
			frame = 0;
			const mid = window.innerHeight / 2;
			const box = list.getBoundingClientRect();
			const progress = Math.min(Math.max((mid - box.top) / box.height, 0), 1);
			list.style.setProperty("--progress", progress.toFixed(3));
			for (const dot of dots) {
				const { top, height } = dot.getBoundingClientRect();
				dot.closest(".timeline-item").classList.toggle("is-active", top + height / 2 <= mid);
			}
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, []);

	return (
		<section className="resume" id="experience">
			<div className="container">
				<h2>{t("resume.title")}</h2>
				<p className="resume-intro">{t("resume.intro")}</p>

				<ol ref={listRef} className="timeline">
					{timeline.map((entry) => (
						<li key={entry.org} className="timeline-item">
							<span className="timeline-dot" aria-hidden="true" />
							<p className="timeline-meta">
								{entry.period[lang]} · {entry.place[lang]}
							</p>
							<h3>{entry.role[lang]}</h3>
							<p className="timeline-org">{entry.org}</p>
							<p className="timeline-summary">{entry.summary[lang]}</p>
						</li>
					))}
				</ol>

				<dl className="resume-skills">
					{skills.map((skill) => (
						<div key={skill.group.en}>
							<dt>{skill.group[lang]}</dt>
							<dd>{skill.items[lang]}</dd>
						</div>
					))}
				</dl>

				<div className="resume-actions">
					<a href="/_EG_CV_ENG.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
						<i className="fa" aria-hidden="true">{""}</i>
						{t("resume.download")}
					</a>
				</div>
			</div>
		</section>
	);
}

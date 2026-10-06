import { useLanguage } from "../i18n/LanguageContext";

export default function About() {
	const { t } = useLanguage();

	return (
		<section className="about" id="about">
			<div className="container">
				<div className="about-content">
					<div className="about-img">
						<img src="/postsPics/edoardo-gamurrini.png" alt={t("about.photoAlt")} />
					</div>
					<div className="about-text">
						<h2>{t("about.title")}</h2>
						<p>{t("about.body")}</p>
						<a href="https://www.linkedin.com/in/edoardo-gamurrini/" target="_blank" rel="noopener noreferrer" className="btn" aria-label={t("about.connectLabel")}>
							<i className="fa" aria-hidden="true">{""}</i>
							{t("about.connect")}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

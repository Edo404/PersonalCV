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
						<a href="/_EG_CV_ENG.pdf" target="_blank" rel="noopener noreferrer" className="btn">{t("about.resume")}</a>
					</div>
				</div>
			</div>
		</section>
	);
}

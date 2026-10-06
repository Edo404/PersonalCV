import { useLanguage } from "../i18n/LanguageContext";
import { renderBold } from "../i18n/richText";

export default function About() {
	const { t } = useLanguage();

	return (
		<section className="about" id="about">
			<div className="container">
				<div className="about-content">
					<div className="about-img">
						<img src="/postsPics/2o.png" alt="Edoardo Gamurrini" />
					</div>
					<div className="about-text">
						<h2>{t("about.title")}</h2>
						<p>{renderBold(t("about.body"))}</p>
						<a href="/_EG_CV_ENG.pdf" target="_blank" rel="noopener noreferrer" className="btn">{t("about.resume")}</a>
					</div>
				</div>
			</div>
		</section>
	);
}

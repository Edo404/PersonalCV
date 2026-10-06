import { logos } from "../data/items";
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
							{/* Same LinkedIn logo as the certification filter, on a white chip */}
							<span className="btn-logo">
								<img src={logos.linkedin.src} alt="" />
							</span>
							{t("about.connect")}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}

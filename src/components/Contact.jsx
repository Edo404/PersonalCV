import { useLanguage } from "../i18n/LanguageContext";

export default function Contact() {
	const { t } = useLanguage();

	return (
		<section className="contact" id="contact">
			<div className="container">
				<h2>{t("contact.title")}</h2>
				<p>{t("contact.intro")}</p>

				{/* Netlify form: a static copy in index.html lets Netlify register it at deploy time */}
				<form className="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
					<input type="hidden" name="form-name" value="contact" />

					{/* Field to prevent spam */}
					<p style={{ display: "none" }}>
						<label>{t("contact.honeypot")} <input name="bot-field" /></label>
					</p>

					<input type="hidden" name="notification-email" value="edoardogamurrini@gmail.com" />

					<div className="form-group">
						<input type="text" name="name" className="form-control" placeholder={t("contact.name")} required />
					</div>
					<div className="form-group">
						<input type="email" name="email" className="form-control" placeholder={t("contact.email")} required />
					</div>
					<div className="form-group">
						<input type="text" name="subject" className="form-control" placeholder={t("contact.subject")} required />
					</div>
					<div className="form-group">
						<textarea name="message" className="form-control" rows="5" placeholder={t("contact.message")} required></textarea>
					</div>
					<button type="submit" className="submit-btn">{t("contact.send")}</button>
				</form>

				<div className="social-links">
					<a href="https://www.linkedin.com/in/edoardo-gamurrini/" className="social-link">
						<i style={{ fontSize: "24px" }} className="fa">{""}</i>
					</a>
					<a href="https://github.com/Edo404" className="social-link">
						<i style={{ fontSize: "24px" }} className="fa">{""}</i>
					</a>
				</div>
			</div>
		</section>
	);
}

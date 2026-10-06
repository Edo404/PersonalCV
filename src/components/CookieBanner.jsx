import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { disableTrackingCookies, enableTrackingCookies } from "../utils/analytics";

const STORAGE_KEY = "cookiePreference";

function readPreference() {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

function savePreference(value) {
	try {
		localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// storage unavailable: the choice just won't be remembered
	}
}

export default function CookieBanner() {
	const [show, setShow] = useState(false);
	const { t } = useLanguage();

	useEffect(() => {
		const preference = readPreference();
		// Mostra il banner se non è stato ancora fatto una scelta
		if (!preference) {
			const timer = setTimeout(() => setShow(true), 1000);
			return () => clearTimeout(timer);
		}
		if (preference === "declined") disableTrackingCookies();
		else if (preference === "accepted") enableTrackingCookies();
	}, []);

	const accept = () => {
		savePreference("accepted");
		setShow(false);
		enableTrackingCookies();
	};

	const decline = () => {
		savePreference("declined");
		setShow(false);
		disableTrackingCookies();
	};

	return (
		<>
			<div id="cookie-banner" className={`cookie-banner${show ? " show" : ""}`}>
				<p>
					🍪 {t("cookie.text")}{" "}
					<a href="/privacyPolicy.txt" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-300)" }}>{t("cookie.learnMore")}</a>
				</p>
				<div className="buttons">
					<button id="accept-cookies" onClick={accept}>{t("cookie.accept")}</button>
					<button id="decline-cookies" onClick={decline}>{t("cookie.decline")}</button>
				</div>
			</div>

			{/* Pulsante per modificare la scelta */}
			<div id="cookie-settings" className="cookie-settings">
				<button onClick={() => setShow(true)} aria-label={t("cookie.settings")}>🍪</button>
			</div>
		</>
	);
}

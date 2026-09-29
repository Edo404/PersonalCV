import { useEffect, useState } from "react";
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
					🍪 Questo sito utilizza i cookie per migliorare l'esperienza utente.{" "}
					<a href="/privacyPolicy.txt" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gray-300)" }}>Scopri di più</a>
				</p>
				<div className="buttons">
					<button id="accept-cookies" onClick={accept}>Accetta</button>
					<button id="decline-cookies" onClick={decline}>Rifiuta</button>
				</div>
			</div>

			{/* Pulsante per modificare la scelta */}
			<div id="cookie-settings" className="cookie-settings">
				<button onClick={() => setShow(true)}>🍪</button>
			</div>
		</>
	);
}

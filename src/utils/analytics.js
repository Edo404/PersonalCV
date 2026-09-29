// Funzione per bloccare Google Analytics & Tracking
export function disableTrackingCookies() {
	window["ga-disable-UA-XXXXX-Y"] = true;
	console.log("❌ Tracking disabilitato");
}

// Funzione per attivare Google Analytics & Tracking
export function enableTrackingCookies() {
	console.log("✅ Tracking attivato");
	window.GoogleAnalyticsObject = "ga";
	window.ga =
		window.ga ||
		function () {
			(window.ga.q = window.ga.q || []).push(arguments);
		};
	window.ga.l = 1 * new Date();

	const script = document.createElement("script");
	script.async = true;
	script.src = "https://www.google-analytics.com/analytics.js";
	document.head.appendChild(script);

	window.ga("create", "UA-XXXXX-Y", "auto");
	window.ga("send", "pageview");
}

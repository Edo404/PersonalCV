// Header scroll effect
window.addEventListener("scroll", () => {
	const header = document.querySelector("header");
	if (window.scrollY > 50) {
		header.classList.add("scrolled");
	} else {
		header.classList.remove("scrolled");
	}
});

// Mobile menu toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
	navLinks.classList.toggle("active");
	navToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		if (navLinks.classList.contains("active")) {
			navLinks.classList.remove("active");
			navToggle.textContent = "☰";
		}

		document.querySelector(this.getAttribute("href")).scrollIntoView({
			behavior: "smooth",
		});
	});
});

// Fade-in elements on scroll
const fadeElements = document.querySelectorAll(".fade-in");
const options = {
	threshold: 0.3,
};

const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = 1;
			entry.target.style.transform = "translateY(0)";
			observer.unobserve(entry.target);
		}
	});
}, options);

fadeElements.forEach((el) => {
	el.style.opacity = 0;
	el.style.transform = "translateY(20px)";
	observer.observe(el);
});

// Filter functionality with smooth transitions
document.addEventListener("DOMContentLoaded", function () {
	const certBtn = document.getElementById("certifications-btn");
	const projBtn = document.getElementById("projects-btn");
	const certCards = document.querySelectorAll(".certification-card");
	const projCards = document.querySelectorAll(".project-card-only");

	// Initial state - show only certifications
	showCertifications();

	// Button event listeners
	certBtn.addEventListener("click", function () {
		showCertifications();
	});

	projBtn.addEventListener("click", function () {
		showProjects();
	});

	function showCertifications() {
		// Update buttons
		certBtn.classList.add("active");
		projBtn.classList.remove("active");

		// First fade out the project cards that are visible
		projCards.forEach((card) => {
			if (card.style.display !== "none") {
				card.style.opacity = "0";
				setTimeout(() => {
					card.style.display = "none";

					// Then fade in the certification cards
					certCards.forEach((certCard) => {
						certCard.style.display = "flex";
						certCard.style.opacity = "0";

						// Small delay before starting to fade in
						setTimeout(() => {
							certCard.style.opacity = "1";
						}, 50);
					});
				}, 300);
			}
		});

		// If no project cards were visible, directly show certification cards
		if (projCards[0].style.display === "none") {
			certCards.forEach((card) => {
				card.style.display = "flex";
				setTimeout(() => {
					card.style.opacity = "1";
				}, 50);
			});
		}
	}

	function showProjects() {
		// Update buttons
		projBtn.classList.add("active");
		certBtn.classList.remove("active");

		// First fade out the certification cards that are visible
		certCards.forEach((card) => {
			if (card.style.display !== "none") {
				card.style.opacity = "0";
				setTimeout(() => {
					card.style.display = "none";

					// Then fade in the project cards
					projCards.forEach((projCard) => {
						projCard.style.display = "flex";
						projCard.style.opacity = "0";

						// Small delay before starting to fade in
						setTimeout(() => {
							projCard.style.opacity = "1";
						}, 50);
					});
				}, 300);
			}
		});

		// If no certification cards were visible, directly show project cards
		if (certCards[0].style.display === "none") {
			projCards.forEach((card) => {
				card.style.display = "flex";
				setTimeout(() => {
					card.style.opacity = "1";
				}, 50);
			});
		}
	}
});

document.addEventListener("DOMContentLoaded", function () {
	const banner = document.getElementById("cookie-banner");
	const acceptBtn = document.getElementById("accept-cookies");
	const declineBtn = document.getElementById("decline-cookies");

	// Mostra il banner se non è stato ancora fatto una scelta
	if (!localStorage.getItem("cookiePreference")) {
		setTimeout(() => banner.classList.add("show"), 1000);
	}

	// Accetta i cookie
	acceptBtn.addEventListener("click", function () {
		localStorage.setItem("cookiePreference", "accepted");
		banner.classList.remove("show");
		enableTrackingCookies();
	});

	// Rifiuta i cookie
	declineBtn.addEventListener("click", function () {
		localStorage.setItem("cookiePreference", "declined");
		banner.classList.remove("show");
		disableTrackingCookies();
	});

	// Blocca i cookie se l'utente li ha rifiutati
	if (localStorage.getItem("cookiePreference") === "declined") {
		disableTrackingCookies();
	} else if (localStorage.getItem("cookiePreference") === "accepted") {
		enableTrackingCookies();
	}
});

// Funzione per bloccare Google Analytics & Tracking
function disableTrackingCookies() {
	window["ga-disable-UA-XXXXX-Y"] = true;
	console.log("❌ Tracking disabilitato");
}

// Funzione per attivare Google Analytics & Tracking
function enableTrackingCookies() {
	console.log("✅ Tracking attivato");
	(function (i, s, o, g, r, a, m) {
		i["GoogleAnalyticsObject"] = r;
		(i[r] =
			i[r] ||
			function () {
				(i[r].q = i[r].q || []).push(arguments);
			}),
			(i[r].l = 1 * new Date());
		(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
		a.async = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m);
	})(
		window,
		document,
		"script",
		"https://www.google-analytics.com/analytics.js",
		"ga"
	);

	ga("create", "UA-XXXXX-Y", "auto");
	ga("send", "pageview");
}

// Funzione per riaprire il banner e modificare la scelta
function showBanner() {
	document.getElementById("cookie-banner").classList.add("show");
}

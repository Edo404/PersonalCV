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

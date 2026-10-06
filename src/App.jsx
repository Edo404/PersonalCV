import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import CookieBanner from "./components/CookieBanner";
import { useLanguage } from "./i18n/LanguageContext";

export default function App() {
	const { t } = useLanguage();

	return (
		<>
			<Header />
			<main>
				<Hero />
				<About />
				<Resume />
				<Projects />
				<Contact />
			</main>
			<CookieBanner />
			<footer>
				<p>{t("footer")}</p>
			</footer>
		</>
	);
}

import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import CookieBanner from "./components/CookieBanner";

export default function App() {
	return (
		<>
			<Header />
			<Hero />
			<About />
			<Projects />
			<Contact />
			<CookieBanner />
			<footer>
				<p>&copy; 2025 Edoardo Gamurrini. All Rights Reserved.</p>
			</footer>
		</>
	);
}

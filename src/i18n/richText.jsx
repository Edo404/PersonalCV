// Turns "**bold**" segments of a dictionary string into <strong> elements
export function renderBold(text) {
	return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

// Verifies the two dictionaries and the card data are complete in both languages
import it from "../src/i18n/it.js";
import en from "../src/i18n/en.js";
import { items } from "../src/data/items.js";

const errors = [];
const keysOf = (obj, prefix = "") =>
	Object.entries(obj).flatMap(([key, value]) =>
		value && typeof value === "object" && !Array.isArray(value) ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`]
	);
// Tags are checked separately: English labels fall back to the tag key itself
const uiKeys = (dict) => keysOf(dict).filter((key) => !key.startsWith("tags."));

const itKeys = uiKeys(it);
const enKeys = uiKeys(en);
for (const key of itKeys) if (!enKeys.includes(key)) errors.push(`missing in en: ${key}`);
for (const key of enKeys) if (!itKeys.includes(key)) errors.push(`missing in it: ${key}`);

for (const tag of new Set(items.flatMap((item) => item.tags))) {
	if (!(tag in it.tags)) errors.push(`missing Italian label for tag: ${tag}`);
}
for (const item of items) {
	for (const lang of ["it", "en"]) {
		if (!item.description?.[lang]) errors.push(`missing ${lang} description: ${item.title}`);
	}
}

if (errors.length) {
	console.error(errors.join("\n"));
	process.exit(1);
}
console.log(`i18n OK: ${itKeys.length} keys, ${items.length} items`);

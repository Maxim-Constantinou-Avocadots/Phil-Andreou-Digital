import ui from "../locales/el-ui.json";
import shared from "../locales/el-static.json";

export const isGreek = document.documentElement.lang === "el";
export const locale = isGreek ? "el-CY" : "en-GB";
const messages = { ...shared, ...ui };

export function tr(value) {
  if (!isGreek || typeof value !== "string") return value;
  if (Object.hasOwn(messages, value)) return messages[value];
  const key = value.trim();
  if (Object.hasOwn(messages, key)) return value.replace(key, messages[key]);
  const limits = [
    [/^Enter less than (\d+) characters?\.$/, n => `Χρησιμοποιήστε λιγότερους από ${n} χαρακτήρες.`],
    [/^Enter at least (\d+) characters?\.$/, n => `Συμπληρώστε τουλάχιστον ${n} χαρακτήρες.`],
    [/^Enter exactly (\d+) characters?\.$/, n => `Συμπληρώστε ακριβώς ${n} χαρακτήρες.`],
    [/^Enter between (\d+) and (\d+) characters\.$/, (a, b) => `Συμπληρώστε από ${a} έως ${b} χαρακτήρες.`]
  ];
  for (const [pattern, format] of limits) {
    const match = key.match(pattern);
    if (match) return format(...match.slice(1));
  }
  return value;
}

export function localPath(path) {
  if (!isGreek || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/el/")) return path;
  if (path === "/" || path.startsWith("/#")) return "/el/index.html" + path.slice(1);
  return "/el" + path;
}

export function errorText(value) {
  if (!value) return value;
  const translated = tr(value);
  return isGreek && translated === value && /[A-Za-z]/.test(value) && !/[\u0370-\u03ff]/.test(value)
    ? "Δεν ήταν δυνατή η ολοκλήρωση του αιτήματος. Ελέγξτε τα στοιχεία σας και δοκιμάστε ξανά."
    : translated;
}

export function translatedField(field) {
  if (!isGreek) return field;
  return {
    ...field,
    label: tr(field.label),
    placeholder: tr(field.placeholder),
    description: tr(field.description),
    explanationText: tr(field.explanationText),
    buttonText: tr(field.buttonText),
    choices: field.choices.map(choice => ({ ...choice, label: tr(choice.label) })),
    otherOption: field.otherOption ? { ...field.otherOption, label: tr(field.otherOption.label), placeholder: tr(field.otherOption.placeholder) } : field.otherOption,
    addressParts: field.addressParts?.map(part => ({ ...part, label: tr(part.label) }))
  };
}

export function dateLabel(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function metaLine(post) {
  return [dateLabel(post.dateISO), post.minutesToRead > 0 ? isGreek ? `${post.minutesToRead} ${post.minutesToRead === 1 ? "λεπτό" : "λεπτά"} ανάγνωσης` : `${post.minutesToRead} min read` : ""].filter(Boolean).join(" · ");
}

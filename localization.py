"""Authored English/Greek routes and build-time localization. No browser text replacement."""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
import json
import re

ROOT = Path(__file__).parent
EL = json.loads((ROOT / "locales/el-static.json").read_text())
SITE_URL = "https://phil-andreou-digit-1-avocadots-1409.wix-site-host.com"
TRANSLATED_ATTRIBUTES = {"alt", "aria-label", "data-alt", "data-caption"}


def greek_path(path):
    return "/el/index.html" if path == "/" else "/el" + path


def translate(text):
    normalized = " ".join(text.split())
    return EL.get(normalized, text)


class GreekHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output = []
        self.stack = []
        self.skip = 0
        self.missing = set()

    def start(self, tag, attrs, closed=False):
        original = self.get_starttag_text()
        attributes = dict(attrs)
        in_header_actions = any("header-actions" in item.get("class", "").split() for _, item in self.stack)
        if not self.skip and tag != "svg":
            for key, value in attrs:
                if value is None:
                    continue
                new = value
                if key == "lang" and tag == "html":
                    new = "el"
                elif key in TRANSLATED_ATTRIBUTES:
                    new = translate(value)
                elif key == "content" and tag == "meta" and (
                    attributes.get("name") == "description" or attributes.get("property") in {"og:title", "og:description"}
                ):
                    new = translate(value)
                elif key == "href" and value.startswith("/") and not value.startswith("//"):
                    if not value.startswith(("/assets/", "/favicon.", "/js/")):
                        pathname, separator, fragment = value.partition("#")
                        new = greek_path(pathname or "/") + (separator + fragment if separator else "")
                if new != value:
                    pattern = r"(\b" + re.escape(key) + r"\s*=\s*)([\"'])(.*?)\2"
                    original = re.sub(pattern, lambda m: m[1] + m[2] + escape(new, quote=True) + m[2], original, count=1)
            if tag == "button" and "data-quote" in attributes and in_header_actions:
                original = original[:-1] + ' aria-label="Ζητήστε προσφορά">'
        self.output.append(original)
        if tag in {"svg", "script", "style"}:
            self.skip += 1
        if not closed and tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "use", "stop"}:
            self.stack.append((tag, attributes))

    def handle_starttag(self, tag, attrs):
        self.start(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self.start(tag, attrs, True)

    def handle_endtag(self, tag):
        self.output.append(f"</{tag}>")
        if tag in {"svg", "script", "style"}:
            self.skip -= 1
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        if self.skip or not data.strip():
            self.output.append(data)
            return
        text = " ".join(data.split())
        translated = EL.get(text)
        if translated is None:
            if re.search("[A-Za-z]", text):
                self.missing.add(text)
            translated = text
        if text == "Get a quote" and any("header-actions" in item.get("class", "").split() for _, item in self.stack):
            translated = "Προσφορά"
        leading = data[:len(data) - len(data.lstrip())]
        trailing = data[len(data.rstrip()):]
        self.output.append(leading + escape(translated, quote=False) + trailing)

    def handle_entityref(self, name):
        self.output.append("&" + name + ";")

    def handle_charref(self, name):
        self.output.append("&#" + name + ";")

    def handle_decl(self, declaration):
        self.output.append("<!" + declaration + ">")

    def handle_comment(self, comment):
        self.output.append("<!--" + comment + "-->")


def language_selector(path, lang, placement):
    en = "/" if path == "index.html" else "/" + path
    el = greek_path(en)
    compact = placement == "desktop"
    label = {"desktop": "Website language", "mobile": "Menu language", "footer": "Footer language"}[placement]
    if lang == "el":
        label = {"desktop": "Γλώσσα ιστοτόπου", "mobile": "Γλώσσα μενού", "footer": "Γλώσσα υποσέλιδου"}[placement]
    links = []
    for target, href, name in [("en", en, "EN" if compact else "English"), ("el", el, "ΕΛ" if compact else "Ελληνικά")]:
        current = ' aria-current="true"' if target == lang else ""
        links.append(f'<a href="{href}" lang="{target}" hreflang="{target}" data-language="{target}"{current}>{name}</a>')
    return f'<div class="language-selector language-selector-{placement}" role="group" aria-label="{label}">' + "".join(links) + "</div>"


def add_language_controls(html, path, lang):
    # Insert before the desktop nav closes, inside the hamburger, and beside footer navigation.
    marker = '</nav><div class="header-actions">'
    assert html.count(marker) == 1
    html = html.replace(marker, language_selector(path, lang, "desktop") + marker, 1)
    marker = '<div class="mobile-menu-footer">'
    assert html.count(marker) == 1
    html = html.replace(marker, marker + language_selector(path, lang, "mobile"), 1)
    marker = '<a href="#top">'
    assert html.count(marker) == 1
    html = html.replace(marker, language_selector(path, lang, "footer") + marker, 1)
    en = "/" if path == "index.html" else "/" + path
    alternates = "".join(f'<link rel="alternate" hreflang="{code}" href="{SITE_URL}{url}">' for code, url in [("en", en), ("el", greek_path(en)), ("x-default", en)])
    locale = "el_CY" if lang == "el" else "en_GB"
    additions = alternates + f'<meta property="og:locale" content="{locale}">'
    if lang == "el":
        additions += ''.join(f'<link rel="preload" href="/assets/fonts/google-sans-greek-{weight}.woff" as="font" type="font/woff" crossorigin>' for weight in [400, 500])
    return html.replace("</head>", additions + "</head>", 1)


def write_localized_pages(output, services, projects):
    english_pages = [path for path in output.rglob("*.html") if path.relative_to(output).parts[0] != "el"]
    missing = set()
    for path in english_pages:
        relative = path.relative_to(output).as_posix()
        original = path.read_text()
        parser = GreekHTML()
        parser.feed(original)
        missing.update(parser.missing)
        greek = add_language_controls("".join(parser.output), relative, "el")
        destination = output / "el" / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(greek)
        path.write_text(add_language_controls(original, relative, "en"))
    if missing:
        raise ValueError("Missing Greek page translations: " + repr(sorted(missing)))
    localized_services = [{**service, "name": translate(service["name"]), "intro": translate(service["intro"]), "alt": translate(service["alt"])} for service in services]
    localized_projects = [{**project, **{key: translate(project[key]) for key in ["title", "category", "description", "detail"]}} for project in projects]
    (output / "assets/content.el.json").write_text(json.dumps({"services": localized_services, "projects": localized_projects}, ensure_ascii=False))

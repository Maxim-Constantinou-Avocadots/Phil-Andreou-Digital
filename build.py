"""Build the Phil Andreou Digital frontend for Wix Headless hosting."""
from pathlib import Path
from html import escape
import json
import hashlib
from page_content import POLICIES, UPDATED
from localization import write_localized_pages

ROOT=Path(__file__).parent
OUT=ROOT/"dist"
EMAIL="digitalprinting@phil-andreou.com"
MAP="https://www.google.com/maps/search/?api=1&query=Phil+Andreou+Digital+Printing+Alpeon+4+Ypsonas+Cyprus"
from service_content import SERVICES, SERVICE_ALIASES
PROJECTS=[
 dict(id="signage",title="A bigger kind of presence",category="Acrylics Products",image="hero.webp",service="acrylics-products",description="A study in scale, colour and physical presence. Sculptural red lettering turns an architectural space into a brand moment.",detail="An illustrative direction for dimensional signage and acrylic fabrication, rather than a completed client project. Final materials and installation would be developed around an actual brief."),
 dict(id="exhibition",title="Space to stand out",category="Exhibition & Display Solutions",image="exhibition.webp",service="exhibition-display-solutions",description="A bold blue environment designed around one idea: give a brand a space of its own.",detail="An illustrative exhibition concept exploring structure, colour and display. It demonstrates a creative direction rather than a completed client commission."),
 dict(id="print",title="Colour, at any scale",category="Large Format Printing Solutions",image="print.webp",service="large-format-printing",description="A close look at the moment an idea becomes ink, material and something you can hold.",detail="A generated production concept used to show this website’s visual direction. It is not a photograph of the company’s actual machinery.")
]

def icon(name="arrow",cls=""):
 paths={"arrow":'<path d="M5 12h14m-7-7 7 7-7 7"/>',"diagonal":'<path d="M7 17 17 7M7 7h10v10"/>',"down":'<path d="m7 10 5 5 5-5"/>',"plus":'<path d="M5 12h14M12 5v14"/>',"close":'<path d="m6 6 12 12M6 18 18 6"/>',"menu":'<path d="M4 7h16M4 12h16M4 17h16"/>',"check":'<path d="m5 12 4 4L19 6"/>',"copy":'<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V4H4v12h4"/>'}
 return f'<svg class="icon {cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths[name]}</svg>'
def quote(label="Get a quote",service="",cls="button primary"):
 return f'<button class="{cls}" type="button" data-quote="{escape(service)}">{label}{icon("diagonal")}</button>'
def link(label,href,cls="button secondary"):
 return f'<a class="{cls}" href="{href}">{label}{icon()}</a>'
def image(name,alt,cls="",loading="lazy"):
 return f'<img class="{cls}" src="/assets/images/{name}" alt="{escape(alt)}" width="1600" height="1000" loading="{loading}" decoding="async">'
def logo():
 svg=(OUT/"assets/images/phil-andreou-logo.svg").read_text()
 return svg.replace('<svg ','<svg class="brand-logo" ').replace('role="img" aria-label="Phil. Andreou Digital Printing Services"','aria-hidden="true" focusable="false"')
def header(service=""):
 menu="".join(f'<a href="/services/{s["slug"]}.html"><span>{s["name"]}</span>{icon("diagonal")}</a>' for s in SERVICES)
 mobile=f'''<nav class="mobile-nav" id="mobile-menu" aria-label="Mobile navigation" hidden><div class="mobile-menu-inner"><div class="mobile-nav-primary"><a class="mobile-nav-link" href="/#work">Our work {icon("diagonal")}</a><details class="mobile-services"><summary aria-controls="mobile-services-panel">Services {icon("plus")}</summary><div class="mobile-services-panel" id="mobile-services-panel"><div class="mobile-services-clip"><div class="mobile-services-links">{menu}<a class="mobile-services-all" href="/services.html">View all services {icon("arrow")}</a></div></div></div></details><a class="mobile-nav-link" href="/about.html">About {icon("diagonal")}</a><a class="mobile-nav-link" href="/blog.html">Blog {icon("diagonal")}</a><a class="mobile-nav-link" href="/contact.html">Contact {icon("diagonal")}</a></div><div class="mobile-menu-footer">{quote("Discuss your project",service,"button primary mobile-menu-quote")}<div class="mobile-menu-contact"><a href="tel:+35725865270">+357 25 865270</a><p>Ypsonas, Limassol</p></div></div></div></nav>'''
 return f'''<a class="skip" href="#main">Skip to content</a><header class="site-header" id="top"><a href="/" class="brand-link" aria-label="Phil Andreou Digital home">{logo()}</a><nav class="desktop-nav" aria-label="Main navigation"><details class="nav-services"><summary>Services {icon("down")}</summary><div class="service-menu">{menu}<a href="/services.html">All services {icon()}</a></div></details><a href="/#work">Our work</a><a href="/about.html">About</a><a href="/blog.html">Blog</a><a href="/contact.html">Contact</a></nav><div class="header-actions">{quote(service=service,cls="button ink")}<button class="menu-toggle icon-button" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span class="menu-toggle-lines" aria-hidden="true"><span></span><span></span></span></button></div>{mobile}</header>'''
def footer(service=""):
 services="".join(f'<a href="/services/{s["slug"]}.html">{s["name"]}</a>' for s in SERVICES)
 return f'''<footer class="site-footer" id="footer"><div class="footer-grid"><div class="footer-brand"><a class="brand-link" href="/" aria-label="Phil Andreou Digital home">{logo()}</a><p>Printing, acrylic products and displays.<br>Made physical in Cyprus.</p></div><nav class="footer-nav" aria-label="Footer navigation"><h2>Explore</h2><a href="/#work">Our work</a><a href="/about.html">About us</a><a href="/blog.html">Blog</a><a href="/contact.html">Contact</a><button type="button" data-quote="{escape(service)}">Get a quote</button></nav><nav class="footer-nav" aria-label="Footer services"><h2>Services</h2>{services}</nav><div class="footer-contact"><h2>Contact</h2><a href="tel:+35725865270" class="footer-phone">+357 25 865270</a><a href="mailto:{EMAIL}" class="footer-email">digitalprinting@<wbr>phil-andreou.com</a><a href="{MAP}" class="footer-address">Alpeon 4, Agios Sylas Industrial Zone<br>4193 Ypsonas, Limassol, Cyprus</a></div></div><div class="footer-bottom"><p>© 2026 Phil. Andreou Digital Printing Ltd.</p><nav class="footer-legal" aria-label="Legal information"><a href="/privacy.html">Privacy policy</a><a href="/cookies.html">Cookie policy</a></nav><a href="#top">Back to top {icon("diagonal")}</a></div></footer>'''
def dialogs(quote_enabled=True):
 module_version=hashlib.sha256((OUT/"assets/interactive/quote-form.js").read_bytes()).hexdigest()[:10]
 markup=f'''<dialog id="quote-dialog" class="quote-dialog" aria-labelledby="quote-title" data-module="/assets/interactive/quote-form.js?v={module_version}"><button class="dialog-close icon-button" aria-label="Close quote form" data-close>{icon("close")}</button><div id="quote-app"><h2 id="quote-title" tabindex="-1">Let’s make<br>something real.</h2><p class="dialog-intro" role="status">Loading your enquiry form…</p></div></dialog><dialog id="project-dialog" class="project-dialog" aria-labelledby="project-title"><button class="dialog-close icon-button" aria-label="Close concept study" data-close>{icon("close")}</button><img id="project-image" alt=""><div class="project-dialog-copy"><p class="concept-label">Concept study</p><h2 id="project-title"></h2><p id="project-description"></p><p id="project-detail"></p><a id="project-service" class="button secondary" href="/services.html">Explore this service {icon()}</a></div></dialog>'''
 return markup if quote_enabled else markup[markup.index('<dialog id="project-dialog"'):]

def head(title,description,interactive=None):
 css_version=hashlib.sha256((OUT/"assets/style.css").read_bytes()).hexdigest()[:10]
 js_version=hashlib.sha256((OUT/"assets/site.js").read_bytes()).hexdigest()[:10]
 extra=""
 if interactive:
  version=hashlib.sha256((OUT/f"assets/interactive/{interactive}.js").read_bytes()).hexdigest()[:10]
  css_hash=hashlib.sha256((OUT/f"assets/interactive/{interactive}.css").read_bytes()).hexdigest()[:10]
  extra=f'<link rel="stylesheet" href="/assets/interactive/{interactive}.css?v={css_hash}"><script type="module" src="/assets/interactive/{interactive}.js?v={version}"></script>'
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)}</title><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#f3f1e9"><meta name="robots" content="noindex,nofollow"><meta property="og:title" content="{escape(title)}"><meta property="og:description" content="{escape(description)}"><meta property="og:type" content="website"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/google-sans-400.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="/assets/fonts/google-sans-500.woff" as="font" type="font/woff" crossorigin>{extra}<link rel="stylesheet" href="/assets/style.css?v={css_version}"><script src="/assets/site.js?v={js_version}" defer></script></head><body>'''
def contact():
 return f'''<section class="contact-section section" id="contact"><div class="contact-photo reveal">{image("studio.webp","Phil Andreou company premises in Ypsonas, Limassol")}<p class="image-caption">Our home in Ypsonas, Limassol</p></div><div class="contact-copy"><h2 class="reveal">Come and see<br>where it happens.</h2><p class="reveal">Talk materials, explore the possibilities and plan your next project with our team.</p><address class="reveal">Alpeon 4, Agios Sylas Industrial Zone<br>4193 Ypsonas, Limassol, Cyprus</address><div class="contact-actions reveal">{link("Get directions",MAP)}<a class="contact-phone" href="tel:+35725865270">+357 25 865270 {icon("diagonal")}</a></div></div></section>'''
def cta(service=""):
 return f'''<section class="closing-section section"><div><h2 class="reveal">Have something<br>big in mind?</h2><p class="reveal">Tell us what you’re creating.<br>We’ll help you bring it to life.</p></div><div class="closing-action reveal">{quote(service=service,cls="button paper")}</div></section>'''
def project_card(p):
 return f'''<article class="work-card reveal" role="listitem"><button class="project-image-button" type="button" data-project="{p['id']}" aria-label="Explore {escape(p['title'])}, a concept study">{image(p['image'],p['description'])}<span class="project-open">{icon("diagonal")}</span><span class="image-tag">Concept study</span></button><div class="work-caption"><h3>{p['title']}</h3><p>{p['category']}</p></div></article>'''
def home():
 cards="".join(project_card(p) for p in PROJECTS)
 accordion="".join(f'''<details class="service-item" data-image="{s["image"]}" data-alt="{s["alt"]}" data-caption="{'Company website artwork' if s['artwork'] else 'Company premises, Ypsonas'}" data-artwork="{str(s['artwork']).lower()}" {"open" if i==0 else ""}><summary id="service-toggle-{s["slug"]}" aria-controls="service-panel-{s["slug"]}">{s["name"]}{icon("plus")}</summary><div class="service-panel" id="service-panel-{s["slug"]}" role="region" aria-labelledby="service-toggle-{s["slug"]}"><div class="service-panel-inner"><div class="service-description"><p>{s["intro"]}</p><a class="button secondary light" href="/services/{s["slug"]}.html">Explore service {icon()}</a></div></div></div></details>''' for i,s in enumerate(SERVICES))
 body=f'''<main id="main"><section class="hero section"><div class="hero-copy"><div><h1 class="reveal">Ideas, made<br>physical.</h1><p class="hero-description reveal">Printing, acrylic products, exhibition and display solutions. Produced and installed in Cyprus.</p><div class="hero-actions reveal">{quote()}{link("View our work","#work","button secondary light")}</div></div><a class="hero-location" href="#contact">Based in Ypsonas, Limassol {icon("diagonal")}</a></div><figure class="hero-media reveal">{image("hero.webp","Illustrative concept of oversized sculptural red lettering in an architectural courtyard",loading="eager")}<figcaption>Illustrative signage concept</figcaption></figure></section>
 <section class="work-section section" id="work"><div class="section-heading"><h2 class="reveal">Made to<br>be seen.</h2><div class="section-intro reveal"><p>Big statements. Thoughtful details.<br>A few possibilities for your next project.</p><p class="concept-note">The following are illustrative concept studies.</p></div></div><div class="work-grid" role="list" aria-label="Project concepts">{cards}</div><div class="work-invitation reveal"><h3>Your next<br>big statement.</h3><p>A place, a product, an idea.<br>Let’s make it impossible to miss.</p>{quote("Discuss your project",cls="button secondary")}</div></section>
 <section class="services-section section" id="services"><div class="section-heading"><h2 class="reveal">Find your<br>format.</h2><p class="section-intro reveal">A world of materials.<br>One team to bring it together.</p></div><div class="services-layout"><div class="service-list reveal">{accordion}</div><figure class="service-visual reveal"><div class="service-image-frame">{image(SERVICES[0]["image"],SERVICES[0]["alt"],cls="is-current artwork")}</div><figcaption><span>{SERVICES[0]["name"]}</span><span id="service-image-caption">Company website artwork</span></figcaption></figure></div></section>
 <section class="about-section section" id="about"><div class="section-heading"><h2 class="reveal">Creative thinking.<br>Production expertise.</h2><p class="section-intro reveal">From a first sketch to a finished installation, there’s a craft to making ideas real.</p></div><div class="about-layout"><div class="about-image reveal">{image("print.webp","Illustrative concept of large-format graphic production")}<p class="image-caption">Illustrative production concept</p></div><div class="about-content"><p class="about-statement reveal">We turn brands into things you can see, touch and experience.</p><p class="reveal">Based in Ypsonas, Limassol, Phil Andreou Digital brings together digital printing, acrylic production, exhibition displays and installation. We work across materials and dimensions to make the physical side of your brand feel considered.</p><div class="material-list reveal"><span>Print</span><span>Acrylic</span><span>PVC</span><span>Foam board</span><span>Display systems</span></div>{quote("Talk to our team",cls="button secondary reveal")}</div></div></section>
 <section class="process-section section"><div class="process-heading"><h2 class="reveal">From idea<br>to installation.</h2><p class="reveal">A clear path from “what if”<br>to “there it is”.</p></div><div class="process-list"><article class="reveal"><h3>Discuss.</h3><p>Tell us about your idea, your space and what you need it to do. We’ll talk through materials and practical details.</p>{icon("down")}</article><article class="reveal"><h3>Produce.</h3><p>Your concept takes shape through print and fabrication, with the dimensions and finish your brief calls for.</p>{icon("down")}</article><article class="reveal"><h3>Install.</h3><p>Bring the finished work into place with installation support from our technical team.</p>{icon("check")}</article></div></section>{contact()}{cta()}</main>'''
 return head("Phil Andreou Digital | Ideas, made physical.","Large Format Printing Solutions, signage, acrylic products, exhibition displays and vehicle graphics in Cyprus. Discuss your next project with Phil Andreou Digital.")+header()+body+footer()+dialogs()+'</body></html>'
def services_page():
 rows="".join(f'''<article class="service-directory-row reveal"><a class="service-directory-image {'artwork' if s['artwork'] else ''}" href="/services/{s['slug']}.html" aria-label="Explore {escape(s['name'])}">{image(s['image'],s['alt'])}</a><div class="service-directory-copy"><h2>{escape(s['name'])}</h2><p>{escape(s['intro'])}</p><div>{link("Explore service",f"/services/{s['slug']}.html","button primary")}</div></div></article>''' for s in SERVICES)
 body=f'''<main id="main" class="services-directory"><section class="services-directory-hero section"><h1 class="reveal">Our services.</h1><p class="reveal">Printing products, acrylic products,<br>exhibition and display solutions.</p></section><section class="service-directory-list section" aria-label="Our four services">{rows}</section>{cta()}</main>'''
 return head("Services | Phil Andreou Digital","Large Format Printing Solutions, Exhibition & Display Solutions, Acrylics Products, Installations & Services.")+header()+body+footer()+dialogs()+'</body></html>'

def service_page(s):
 related="".join(f'<a class="related-service" href="/services/{x["slug"]}.html"><span>{escape(x["name"])}</span>{icon("diagonal")}</a>' for x in SERVICES if x["slug"]!=s["slug"])
 body=f'''<main id="main" class="faithful-service-page"><section class="faithful-service-hero section"><a class="button tertiary back-services" href="/services.html">{icon("arrow","back-icon")} All services</a><h1 class="faithful-service-title">{s['headline']}</h1><div class="faithful-service-layout"><div class="faithful-service-copy"><p>{escape(s['intro'])}</p>{quote(service=s['name'])}</div><figure class="faithful-service-image {'artwork' if s['artwork'] else ''}">{image(s['image'],s['alt'],loading="eager")}<figcaption>{'Exhibition and display artwork' if s['slug']=='exhibition-display-solutions' else 'Large-format printing artwork' if s['slug']=='large-format-printing' else 'Acrylic products artwork' if s['slug']=='acrylics-products' else 'Our premises in Ypsonas, Limassol'}</figcaption></figure></div></section><section class="faithful-related section"><h2 class="reveal">Our other<br>services.</h2><nav class="related-list reveal" aria-label="Other services">{related}</nav></section>{cta(s['name'])}</main>'''
 return head(s['name']+" | Phil Andreou Digital",s['intro'])+header(s['name'])+body+footer(s['name'])+dialogs()+'</body></html>'

def blog_page(post=False):
 title="Article | Phil Andreou Digital" if post else "From the studio | Phil Andreou Digital"
 description="Read the latest articles from Phil Andreou Digital."
 hero="" if post else '<header class="blog-intro section"><p class="blog-eyebrow">The Phil Andreou Digital blog</p><div><h1>From the studio</h1><p>News, ideas and articles <br>from our team.</p></div></header>'
 view="post" if post else "feed"
 body=f'<main id="main" class="blog-page">{hero}<div class="blog-content section" id="blog-app" data-view="{view}"><p class="blog-initial-loading" role="status">Loading {"article" if post else "articles"}…</p></div><noscript><p class="section blog-no-script">Please enable JavaScript to read our latest articles.</p></noscript>{cta()}</main>'
 return head(title,description,interactive="blog")+header()+body+footer()+dialogs()+'</body></html>'
def about_page():
 body=f'''<main id="main" class="company-page">
 <section class="company-hero section"><div class="company-hero-copy"><h1 class="reveal">You name it.<br><span>We print it.</span></h1><p class="reveal">We’re Phil Andreou Digital Printing Services Ltd. A Cyprus printing company bringing experience, technology and creative thinking to your brief.</p><div class="company-actions reveal">{link("Talk to our team","/contact.html","button primary")}<a class="company-jump" href="#our-story">Get to know us {icon("down")}</a></div></div><figure class="company-photo reveal"><img src="/assets/images/about-premises.jpg" alt="The glass-fronted Phil Andreou premises in Ypsonas, Limassol" width="700" height="400" fetchpriority="high" decoding="async"><figcaption>Our home in Ypsonas, Limassol.</figcaption></figure></section>
 <section class="company-story section" id="our-story"><h2 class="reveal">A world<br>of possibilities.</h2><div class="company-story-copy"><p class="company-statement reveal">Different materials.<br>Different dimensions.<br>The same care.</p><p class="reveal">Our work spans a wide range of digital printing products and services. We bring new ideas and production expertise together to help turn each customer’s requirements into a finished result.</p></div></section>
 <section class="company-production section"><div class="company-production-heading"><h2 class="reveal">Technology.<br>With purpose.</h2><p class="reveal">Our large-format division uses a range of printing machines to suit different sizes, resolutions and applications. The aim is simple: the right production approach for your project.</p></div><div class="company-principles"><article class="reveal"><h3>Your material.</h3><p>Printing across a broad range of materials and dimensions, with quality at the heart of the process.</p></article><article class="reveal"><h3>Your specifications.</h3><p>Production planned around your brief, required quantities and time frames.</p></article></div><div class="company-service-links reveal">{link("Large Format Printing Solutions","/services/large-format-printing.html","button secondary light")}{link("Acrylics Products","/services/acrylics-products.html","button secondary light")}</div></section>
 <section class="company-team section"><h2 class="reveal">People who<br>know print.</h2><div><p class="company-statement reveal">Experience behind<br>every project.</p><p class="reveal">Our team brings professional training, specialist knowledge and careers spent in digital and print production. That collective experience helps us manage jobs of different scales, including briefs that call for something out of the ordinary.</p>{link("Contact the team","/contact.html","button primary reveal")}</div></section>
 </main>'''
 nav=header().replace('<a href="/about.html">About</a>','<a href="/about.html" aria-current="page">About</a>')
 return head("About us | Phil Andreou Digital","Meet Phil Andreou Digital Printing Services Ltd. Discover our people, printing technology and approach to projects in Cyprus.")+nav+body+footer()+dialogs()+'</body></html>'

def contact_page():
 module_version=hashlib.sha256((OUT/"assets/interactive/quote-form.js").read_bytes()).hexdigest()[:10]
 body=f'''<main id="main" class="contact-page">
 <section class="contact-hero section"><div><h1 class="reveal">Contact us.</h1><p class="reveal">Print, signage or a space to transform.<br>Let’s talk about what you have in mind.</p><a class="button primary reveal" href="#enquiry">Start your enquiry {icon("diagonal")}</a></div><div class="contact-direct reveal"><p>Talk to the team in Ypsonas, Limassol.</p><a href="tel:+35725865270">+357 25 865270 {icon("diagonal")}</a><a class="contact-email" href="mailto:{EMAIL}">digitalprinting@<wbr>phil-andreou.com {icon("diagonal")}</a></div></section>
 <section class="contact-body section" aria-label="Enquiries and location"><aside class="contact-location"><figure class="contact-location-photo reveal">{image("studio.webp","Phil Andreou company premises in Ypsonas, Limassol",loading="eager")}<figcaption>Our home in Ypsonas.</figcaption></figure><div class="contact-address reveal"><h2>Come and see<br>where it happens.</h2><address>Alpeon 4, Agios Sylas Industrial Zone<br>4193 Ypsonas, Limassol, Cyprus</address><a class="button ink" href="{MAP}" target="_blank" rel="noopener noreferrer">Get directions {icon("diagonal")}</a><p>Planning a visit? Call ahead so we can arrange the right person to meet you.</p></div><div class="contact-brief reveal"><h2>A few details<br>go a long way.</h2><ul><li>What you want to make</li><li>Approximate size and quantity</li><li>Where it will be used</li><li>When you need it</li></ul><p>Still working it out? Tell us what you know. We’ll help with the next step.</p></div></aside><section class="contact-form-panel" id="enquiry" aria-labelledby="quote-title"><div id="quote-app" data-inline="true" data-module="/assets/interactive/quote-form.js?v={module_version}"><h2 id="quote-title">Tell us about<br>your idea.</h2><p class="dialog-intro" role="status">Loading your enquiry form…</p></div><noscript><p>Please enable JavaScript to use the enquiry form, or email <a href="mailto:{EMAIL}">{EMAIL}</a>.</p></noscript></section></section>
 </main>'''
 nav=header().replace('<a href="/contact.html">Contact</a>','<a href="/contact.html" aria-current="page">Contact</a>')
 return head("Contact us | Phil Andreou Digital","Contact Phil Andreou Digital in Ypsonas, Limassol. Discuss printing, signage and display projects, call the team or send an enquiry.")+nav+body+footer()+dialogs(quote_enabled=False)+'</body></html>'

def policy_page(key):
 policy=POLICIES[key]
 toc="".join(f'<a href="#{slug}">{escape(title)}{icon("down")}</a>' for slug,title,_ in policy["sections"])
 sections="".join(f'<section id="{slug}"><h2>{escape(title)}</h2>{content}</section>' for slug,title,content in policy["sections"])
 other="cookies" if key=="privacy" else "privacy"
 other_title="Cookie policy" if key=="privacy" else "Privacy policy"
 body=f'''<main id="main" class="policy-page"><header class="policy-hero section"><h1>{escape(policy["title"])}</h1><div><p>{escape(policy["intro"])}</p><p class="policy-date">Last updated <time datetime="2026-11-05">{UPDATED}</time></p></div></header><div class="policy-layout section"><aside class="policy-sidebar"><nav class="policy-contents" aria-label="On this page"><h2>On this page</h2>{toc}</nav><a class="button secondary" href="/{other}.html">{other_title} {icon()}</a></aside><article class="policy-copy" aria-label="{escape(policy["title"].rstrip('.'))}">{sections}<div class="policy-contact"><h2>Let’s clear things up.</h2><p>Have a question about this page or your information? Our team can help.</p><a class="button primary" href="/contact.html">Contact the team {icon("diagonal")}</a></div></article></div></main>'''
 return head(f"{policy['title'].rstrip('.')} | Phil Andreou Digital",policy["intro"])+header()+body+footer()+dialogs()+'</body></html>'

def not_found_page():
 body=f'''<main id="main" class="not-found-page section"><div><h1>Page not<br>found.</h1><p>The page you’re looking for may have moved. Let’s get you back to the right place.</p><div class="not-found-actions">{link("Back to home","/","button primary")}{link("Contact us","/contact.html","button secondary light")}</div></div><p class="error-code" aria-label="Error 404">404</p></main>'''
 return head("Page not found | Phil Andreou Digital","Find your way back to Phil Andreou Digital. Explore our services or contact the team.")+header()+body+footer()+dialogs()+'</body></html>'

def build():
 OUT.mkdir(exist_ok=True)
 (OUT/"index.html").write_text(home())
 (OUT/"blog").mkdir(exist_ok=True)
 (OUT/"blog.html").write_text(blog_page())
 (OUT/"blog/post.html").write_text(blog_page(post=True))
 (OUT/"contact.html").write_text(contact_page())
 (OUT/"about.html").write_text(about_page())
 (OUT/"services.html").write_text(services_page())
 for key in POLICIES:
  (OUT/f'{key}.html').write_text(policy_page(key))
 for s in SERVICES:
  folder=OUT/"services";folder.mkdir(parents=True,exist_ok=True)
  (folder/f'{s["slug"]}.html').write_text(service_page(s))
 for previous,current in SERVICE_ALIASES.items():
  service=next(s for s in SERVICES if s['slug']==current)
  (OUT/f'services/{previous}.html').write_text(service_page(service))
 # An obsolete standalone category now displays the correct service overview.
 (OUT/'services/vehicle-graphics.html').write_text(services_page())
 (OUT/"assets"/"content.json").write_text(json.dumps(dict(services=SERVICES,projects=PROJECTS),ensure_ascii=False))
 (OUT/"favicon.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 7 60 32 8 57Z" fill="#d42721"/></svg>')
 (OUT/"404.html").write_text(not_found_page())
 (OUT/"not-found.html").write_text(not_found_page())
 write_localized_pages(OUT, SERVICES, PROJECTS)
 print("Built homepage, About, Services overview, 4 service pages, Wix Blog, Contact, Privacy, Cookies and 404 pages.")
if __name__=="__main__":build()

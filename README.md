# Phil Andreou Digital — Wix Headless

The complete print and production website is hosted on the existing Wix Headless site. Wix hosts the frontend and supplies the Forms and Blog backend. The website has no dependency on ChatGPT Sites at runtime.

Live website: https://phil-andreou-digit-1-avocadots-1409.wix-site-host.com

Dashboard: https://manage.wix.com/dashboard/a3116e4c-3826-4acb-a8bd-72028284651a

## Source control and ongoing updates

Repository: https://github.com/Maxim-Constantinou-Avocadots/Phil-Andreou-Digital

GitHub is the canonical history for the frontend source, translations, original assets and compiled `dist/` output. Wix remains the live hosting and business backend. Every website implementation change must be built, committed and pushed to GitHub, then published to the existing Wix site. Record successful releases with their source commit and Wix upload ID in [DEPLOYMENTS.md](DEPLOYMENTS.md). The standing instructions are in [AGENTS.md](AGENTS.md).

GitHub Actions runs `npm ci`, rebuilds the website, checks shared JavaScript syntax, verifies tracked build output is current, and retains the build as a downloadable artifact for each successful run. It does not deploy to Wix automatically: publication currently uses the authenticated Wix integration. No deployment secrets or owner keys are stored here. Wix dashboard content and form submissions remain Wix-managed and are not copied into this public repository.

To work locally:

```sh
git clone https://github.com/Maxim-Constantinou-Avocadots/Phil-Andreou-Digital.git
cd Phil-Andreou-Digital
npm ci
npm run build
```

The tracked `dist/assets/style.css` and `dist/assets/site.js` are authored source files as well as deployment assets; do not delete or ignore the whole `dist/` directory. `wix/forms-plan.json` is a planning reference only; do not run it as a form reseed or replace existing records.

## Wix project

- Site ID: `a3116e4c-3826-4acb-a8bd-72028284651a`
- Public OAuth client ID: `36d515cd-302a-4ce5-8b8a-77ff6e040c8b`
- Enquiry form ID: `1f454f88-143d-4254-ab65-f00f4d7be7f5`

The OAuth client ID is public. No owner API keys, client secrets, or visitor tokens are included in the project. The shipped Wix client obtains, persists and refreshes anonymous visitor tokens in each visitor’s browser.

## Build and publish

Use Node 24 or later and Python 3:

```sh
npm ci
npm run build
```

The deployment root is `dist/`. Package its contents with `index.html` at the archive root and publish through the authenticated Wix Headless upload tool to the site ID above. This is the site’s Wix-hosted frontend, not an embed, redirect, or external preview link.

Wix static hosting serves actual files. All navigation targets are emitted files:

- Home: `/`
- About us: `/about.html`
- Services overview: `/services.html`
- Services: `/services/large-format-printing.html`, `/services/exhibition-display-solutions.html`, `/services/acrylics-products.html`, `/services/installations-services.html`
- Blog: `/blog.html`
- Article: `/blog/post.html?slug=...`
- Contact: `/contact.html`
- Privacy: `/privacy.html`
- Cookies: `/cookies.html`
- Branded error-page design: `/not-found.html`

Edit shared HTML and business content in `build.py`, general styling and interactions in `dist/assets/style.css` and `dist/assets/site.js`, and the form and Blog surfaces in `src/`. The esbuild script bundles the React surfaces and official Ricos article viewer. Form code loads when an enquiry opens; the rich article viewer loads only on articles. The original Wix REST adapters, stores, DTOs and TypeScript sources are retained in `dist/js/wix/`.

## Forms and Blog

The form renders its live Wix schema. Owner fields, validation rules, required indicators, choices, closed settings and confirmation settings remain authoritative. Service-page quote actions select the matching live choice. Visitors review and edit before the final Send enquiry button creates a Wix Forms submission. A success message appears only after Wix confirms creation. Email and phone fields carry Wix CRM contact mappings. No duplicate form was created for this deployment.

The Blog reads the existing published Wix posts, with real media, author, metadata, related posts, category filters and pagination. The official Ricos viewer retains headings, lists and inline images. Likes and comments run as the current visitor and follow Wix permissions and moderation. The public API does not expose the Blog’s site-wide comments switch. View totals display existing metrics; this implementation does not increment them.

The three existing posts concern digital marketing and SEO. They have been preserved, and their content needs editorial review for this printing and signage business. No posts or business records were reseeded.

Manage enquiries and content from the same Wix dashboard:

- https://manage.wix.com/dashboard/a3116e4c-3826-4acb-a8bd-72028284651a/wix-forms/form/1f454f88-143d-4254-ab65-f00f4d7be7f5/submissions
- https://manage.wix.com/dashboard/a3116e4c-3826-4acb-a8bd-72028284651a/blog/posts

## Design and assets

Preserves the current split hero, smoothly expanding three-card project grid, slim header, clean footer and mobile navigation. The official client logo is a real path-based SVG, without embedded raster data or live fonts. The red signage, blue exhibition and printer photos are labelled illustrative concepts. The premises photograph and vehicle graphics example come from the company website. No unverified customers, case studies, testimonials or business metrics were added.

The preview remains noindex while the business reviews its content and concept imagery. Domain connection is a separate launch step. The existing company domain has not been changed.

## Validation

### Contact and utility pages

Added branded Contact, Privacy and Cookie pages using the existing Google Sans, paper, ink and red visual system. Navigation now points to the dedicated Contact page; the footer links both policy pages across the website. Body text and form inputs remain 16px. The Contact page provides direct call/email links, the company premises photo and address, external directions, project-brief guidance, and the existing Wix Forms enquiry form rendered inline. Header/footer quote actions focus this same form instead of creating a second form. Initial loading does not autofocus or open the mobile keyboard.

The shared form still uses the live owner schema. Required-field validation, keyboard service selection, review, edit retention, and focusing the inline form were verified on the live Wix site. No real enquiry was submitted or notification sent. Other pages retain the quote dialog; the final submission continues through the existing Wix form store.

Privacy and Cookie pages use a responsive contents list, anchored sections, readable 16px copy and real reference links. Desktop and phone screenshots and tablet layout measurements were checked; contents navigation and footer routing worked without horizontal overflow. The browser's final tablet Contact capture and last error-page screenshot could not be completed after the browser capture connection stopped responding. Earlier form, Contact, and policy checks completed successfully; no standalone browser inspector was run.

The notice text is a company-review draft for the current website, not a claim of legal compliance. Before the company-domain launch, confirm the registered controller name, operational retention rules, all processors and any additional analytics/advertising tools. No optional tracking or generic cookie-consent banner was added. Opening hours were not invented. Policy text is maintained in `page_content.py`.

Reference material checked on 5 November 2026:

- Existing company site: https://www.philandreoudigital.com/ and https://www.philandreoudigital.com/contact-us/
- European Commission, information for individuals: https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en
- European Commission, cookies policy: https://commission.europa.eu/cookies-policy_en
- Wix Data Processing Agreement: https://www.wix.com/about/privacy-dpa-users
- Cyprus Commissioner, complaints: https://www.gov.cy/dataprotection/en/information-for-the-public/lodge-a-complaint/

The updated branded error design is emitted at both `/404.html` and `/not-found.html`. Live browser testing confirmed that Wix overrides `/404.html` with its own 404 screen despite the file existing in the published bundle. `/not-found.html` is a separately published design, not a verified automatic missing-URL fallback. Connecting the branded design to missing routes requires a hosting-routing solution before it can be claimed as the site's custom 404 handler. Do not replace the entire hosting stack solely to hide this limitation.

Publication used guarded selective patches, preserving unrelated live page content and all Wix business data. The company domain and existing noindex setting remain unchanged.

### Find your format accordion

Service panels now transition between zero and full grid rows over 360ms, with coordinated icon and surface feedback. Native details stay open during their closing transition, then close after it completes. Selecting another service interrupts the previous transition safely. Collapsed panel links become inert immediately; the summary exposes its expanded state and controls a labelled region. Without JavaScript, the native details controls still work.

Service preview images decode before a 280ms crossfade in a fixed frame. Request identifiers discard stale image loads when visitors switch quickly. Outgoing images are removed after the fade. Reduced-motion preferences skip the panel travel and image fade.

Live Wix checks on 4 November 2026 covered all five services, repeated switching, Enter and Space activation, tabbing into the selected service link, and navigation to the correct service page. Screenshots at 1440, 768 and 390px showed the existing layout intact, 16px body copy, no horizontal overflow, and one selected panel. Mobile service actions remain 56px high. Publication replaced only the accordion markup, shared CSS and interaction script, plus cache-version references; other live markup and Wix business data were preserved.

### Body text and Blog cards

The base text token is 16px on desktop, tablet and mobile. Regular descriptions, form copy and rich article paragraphs use this token. Headlines retain their type hierarchy. Blog excerpts are 16px; card titles are 26px on a wide desktop and 24px on phones. The cards use 2:1 images, two-line excerpts, a distinct light surface, and filled red Read article actions aligned at the bottom. Each entire card remains one accessible link with the article title in its label.

Live Wix measurements on 4 November 2026 confirmed 16px body, excerpt and rich article text. At the same desktop viewport the first card decreased from 661.6px to 520px high. The action areas measure 47px high. Checks at 1440, 768 and 390px found no horizontal overflow; covers loaded, and the Read article action opened the correct Wix post. The publication patched only the shared stylesheet, Blog entry module and their cache-version references, preserving other live files and all business data.

Validate all direct page URLs on Wix hosting after upload, including the service pages and article links. Check live Wix form schema loading and service preselection, validation, review/edit retention, mobile navigation, article rich content, and the project grid’s animation. Avoid creating real enquiries or comments merely as test records; notification delivery has not been tested.

Verified on Wix hosting on 4 November 2026: all five direct service URLs, the homepage, live Blog feed with three published posts, full Ricos article content, mobile navigation, service preselection, required-field validation, review/edit retention, and no overflow at 390px. The dashboard now shows the Wix-hosted frontend URL and marks Create new frontend & publish complete. No real enquiry or comment was sent.


### About Us page — 6 November 2026

Added `/about.html` from the original company About page at https://www.philandreoudigital.com/about/. The copy is edited into a company introduction, production capabilities and team section, preserving the original message without repeating the team paragraph. The old fixed “17 years” figure is omitted rather than guessed forward. No founding date, awards or customer statistics have been invented. The signature “You name it. We print it!” is retained in the hero. The original premises photograph (`offices-1.jpg`) is included as `assets/images/about-premises.jpg`, with its original bytes preserved. The original generic team stock photo and old blue process graphic were not used.

Shared desktop, mobile and footer About links now open the dedicated page. The homepage About section remains in place. The new page uses the existing SVG logo, Google Sans typography, paper, ink and red palette, enquiry dialog and contact route. Regular body text is 16px. The page uses source-backed content, not a CMS collection, and needs no new Wix apps or backend data.

The production build completed; esbuild emitted only the existing upstream Ricos CSS charset warnings. About HTML lint reported zero failures and warnings. Native Wix publication added the page and original photo, and patched only shared About links and stylesheet references in existing pages. Saved-file verification confirmed the page title, current-page navigation, original photo, homepage section preservation and noindex. Live browser screenshots were checked at 1440, 768 and 390px; body and regular copy measured 16px, actions were at least 48px high and there was no horizontal overflow. Existing enquiry submission/notification delivery was not tested with a real enquiry. No standalone inspector was run; browser measurements and screenshots were used for responsive QA.

The About page mobile navigation was opened and its About link returned to the dedicated page. The quote dialog loaded the existing live Wix form schema. Enter on the in-page link reached the story anchor, and the main Contact action opened `/contact.html`. No form was submitted.


### Client service taxonomy correction — 6 November 2026

The original Services page is authoritative. The new site now uses its exact names, order and descriptions: Large Format Printing Solutions; Exhibition & Display Solutions; Acrylics Products; Installations & Services. The previous five-category structure, altered names, invented application lists and FAQ content were removed. `service_content.py` owns the original source copy, with source URL provenance. No spelling or grammar edits have been made to those descriptions. Earlier validation notes referring to five services describe the superseded build.

Added a dedicated Services overview and corrected all desktop/mobile/footer navigation, homepage accordion, concept-study categories and links, About service links, metadata and static content JSON. The four service details show the original descriptions and source website artwork; the generated service imagery has been replaced by source imagery while the labelled homepage concept studies remain. The image bytes were copied from the original site's observed image URLs without re-encoding. Older modified route names now serve corrected category content as aliases; the old vehicle-graphics page displays the four-service overview rather than an invented fifth category.

Updated the same Wix enquiry form to the four canonical service labels and values, retaining the “Not sure yet” helper choice. Form field IDs, field target, other fields, validation settings other than the option enum, step layout and form ID were preserved. Existing submissions were not changed or created. The saved schema was read back to verify exact labels and field/layout preservation. The active revision after the update is 2.

The build completed with the existing upstream Ricos CSS charset warnings. The five new service HTML pages passed source lint with zero failures or warnings; all internal build links resolve. Native Wix selective publication preserved unrelated live markup and assets; saved-file checks confirmed the four service names, original descriptions, canonical pages and obsolete category replacement.

Live browser QA after the service correction: the overview was measured and visually checked at 1440, 768 and 390px, with all four source images loaded, 16px body copy and no horizontal overflow. All four service detail routes were verified on mobile; the longer titles occupy two lines. A desktop and a mobile detail screenshot were checked. The mobile menu lists exactly the four services, and navigated to Acrylics Products. Quote actions preselected the exact Large Format Printing Solutions and Acrylics Products choices; the dropdown shows the four exact labels plus Not sure yet. No enquiry was submitted. The homepage exposes four accordion panels; rapid switching keeps one expanded panel, collapsed links inert, and the existing 360ms grid transition. Standalone browser inspector not run; connected-browser DOM measurements, live interactions and screenshots were used.


### Mobile navigation redesign — 6 November 2026

Replaced the plain always-expanded mobile navigation with a full-height ink-coloured menu, larger paper-coloured links, staggered entrance animation, a morphing hamburger/close control, red project-enquiry action and phone/location row. The original logo, slim header, four approved services, routes and 16px supporting copy remain. The Services disclosure starts collapsed, opens via click/tap or Enter/Space, and animates interruptibly using grid rows. Its links become inert and aria-hidden immediately on collapse; native details stay open only while the closing transition completes. Exact names are still generated from `service_content.py`.

The menu locks background scrolling, makes the page main/footer inert, contains keyboard focus within the header/menu controls, returns focus on Escape/close and clears state on the desktop breakpoint. Existing enquiry buttons retain both modal and inline form behaviour. Reduced-motion CSS removes the menu and disclosure animations; close timers also honour the preference. No dependencies or assets were added. Bottom spacing reserves room for the native Wix badge and safe-area inset.

Selective native Wix publication changed only the shared header, stylesheet, interaction script and their version references on 18 HTML files. Source assertions proved that all other page content was preserved. Services data, Blog modules and business records were unchanged. Build and JavaScript syntax checks passed, with only the existing upstream Ricos charset warnings. Navigation HTML/script source lint reported zero failures and warnings.

Live browser QA covered 390×844, 320×568, 768×1024, 667×375 landscape and the 1440px desktop breakpoint. The final mobile/tablet screenshots were visually checked. Menus have no horizontal overflow; the long first service name wraps on a 320px phone at 16px and every service target is at least 56px high. The menu scrolls independently in short/expanded views and the document remains still. The contact row clears the native badge at the bottom. Enter/Space toggle the Services disclosure; Escape restores the menu button, background interaction and document scrolling. Forward/reverse Tab wrap between the header brand and final menu contact link. Reopening resets Services to collapsed. Desktop resizing hides the overlay and restores the existing desktop dropdown.

An Acrylics Products link reached the canonical detail page. The menu's project button opened the existing Wix enquiry dialog and preselected Acrylics Products while preserving the four exact choices plus Not sure yet. No enquiry was submitted. Temporary viewport overrides were reset after QA. Standalone browser inspector was not run; connected-browser measurements, interactions and screenshots were used.

The Contact menu action was also verified: it closed the overlay, restored background interaction, scrolled to and focused the same inline Wix form, and created no second quote dialog. Rapid close/reopen left the menu open with Services reset to collapsed; no stale close timer hid it.


### English / Greek localization — 6 November 2026

Added a complete Greek frontend at `/el/index.html`, with all 18 existing HTML routes mirrored under `/el/`. English URLs remain unchanged. Desktop navigation has a compact EN/ΕΛ selector; the mobile selector is inside the hamburger menu; both languages also have a footer selector. Switching preserves the equivalent route, article query and anchor. Each page exposes its document language, localized metadata and English/Greek alternate links. The preview remains noindex.

`localization.py` builds Greek pages from authored English templates using `locales/el-static.json`; missing static translations fail the build. `src/i18n.js` and `locales/el-ui.json` localize live form labels, choices, validation, review, confirmation and Blog interface text. The four services retain their approved meaning, order and canonical English form values. Visitor-entered text and backend records are not translated or changed. Google Sans Greek subsets were added with their OFL license, preserving the existing type family and 16px body token.

`locales/el-blog.json` contains authored Greek translations of all three current published posts, including 177 text/image-caption blocks. Posts remain live Wix records. The frontend checks their original title, excerpt and content blocks before applying translations; new or edited posts require updated translations. A post without a matching translation displays an explicit Greek English-only notice. The existing digital marketing/SEO subject matter still needs client editorial review for this printing business.

Build and shared-script syntax checks passed. An HTML audit covered all 36 language routes, their document languages, three paired selector groups and internal linked files. Live checks covered the Greek homepage at 1440 and 390px; About at 768px; the Services overview at 1440px; Large Format detail at 320px; mobile menu and footer selectors; Greek form validation, review and edit retention; service preselection with canonical English values; all three Greek Blog card titles; and a full Greek Ricos article with localized media controls. English switching retained the same article slug. No horizontal overflow was measured in the tested views. No real enquiry, like or comment was submitted.


### Mobile footer cleanup — 6 November 2026

The footer now uses one full-width reading column at 600px and below, with separated Explore, Services and Contact groups. Service names no longer compete in narrow side-by-side columns. The quote action is a full-width red button; legal links have their own rows; the language selector uses a balanced two-option row. Shared spacing, 44–48px navigation targets and extra bottom/safe-area space keep the footer readable in English and Greek. Desktop and tablet grid rules are preserved. No copy, route, service, form or Blog data was changed.

The build passed, and the scoped stylesheet detector reported no findings. Source assertions confirmed every one of the 36 HTML pages changed only its stylesheet cache reference. Publication used a guarded stylesheet patch, preserving all other deployed markup and assets.

Live browser checks confirmed the Greek footer at 390px and English footer at 320px have one reading column, no horizontal overflow, no clipped link text, and no navigation targets below 44px. The footer language control switched correctly to the equivalent English homepage. Desktop retained its four-column grid. Browser screenshots were inspected; no real enquiry was sent.


### Project viewer refinement — 6 November 2026

Project previews use a large image beside a readable details panel on desktop, with a persistent close toolbar and stacked mobile reading layout. Concept-study labelling and the existing copy/service destinations remain intact. Previous/next controls browse the three studies without closing the viewer and announce the new title to assistive technology.

Opening uses an image flight from the selected card into the viewer, a restrained panel reveal and a quicker closing animation. Image decoding, request counters and cancellation protect repeated interactions. Escape, outside click, native dialog focus containment/return and reduced motion remain supported. The viewer has a red scrollbar; page scrollbars use the site's paper/ink palette. No animation dependency was added.

Validation: build, JavaScript syntax, unique viewer IDs and internal file links passed across all 36 language routes. Scoped source lint and the style/motion detector reported no findings. Live screenshots were inspected for the 1440px English desktop viewer and 390px Greek phone viewer; 320px phone and 768px tablet measurements found no horizontal overflow. Body text remains 16px and viewer controls are at least 48px high. Previous/next navigation, correct images/service destinations, Escape close, focus return, reopening without stale flight images and forward/reverse Tab containment were checked. The tablet screenshot request timed out; tablet layout and keyboard measurements completed. Reduced-motion branches were inspected in source; no browser preference emulation or standalone inspector was run.

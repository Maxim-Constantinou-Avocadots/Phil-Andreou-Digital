# Phil Andreou Digital

This is a Wix Headless website. The user explicitly requires the frontend to be published on Wix hosting, not ChatGPT Sites.

- Existing Wix site ID: `a3116e4c-3826-4acb-a8bd-72028284651a`. Reuse it; do not create another site.
- Public OAuth client ID: `36d515cd-302a-4ce5-8b8a-77ff6e040c8b`.
- Existing enquiry form: `1f454f88-143d-4254-ab65-f00f4d7be7f5`.
- Build with `npm ci` and `npm run build`. Publish the contents of `dist/` through Wix's authenticated Headless upload flow.
- Wix static hosting serves `/` and real files. Service links must point to `/services/<slug>.html`, the Blog index to `/blog.html`, and articles to `/blog/post.html?slug=...`.
- Preserve the brand, official path-based SVG logo, responsive layouts, project-grid animation, and working Wix Forms and Blog integrations.
- Keep base text and regular body copy at 16px across all breakpoints. Blog cards use compact images and titles, distinct light surfaces, and filled red Read article actions.
- Keep the Find your format accordion's interruptible grid transitions, native details fallback, keyboard controls, and decoded image crossfades. Collapsed panels must remain outside the tab order.
- Contact is `/contact.html`, with the existing Wix form embedded inline. Keep its review-before-send flow, no autofocus on initial page load, and header quote actions focusing the same form. Other pages retain the quote dialog.
- Privacy and Cookie pages are `/privacy.html` and `/cookies.html`; keep them linked in the footer. Policy copy in `page_content.py` describes the current implementation and needs business/legal review before launch.
- Wix currently overrides `/404.html` with its native error screen. The branded design is also emitted at `/not-found.html`; do not claim it is the automatic missing-route fallback until hosting routing is configured and verified.
- Use the installed Wix skills and documented API contracts. Do not reseed or replace existing business data.
- The company domain is outside this preview deployment. Do not change domain settings without a user request.

- About us is `/about.html`, built from the original company About content and premises photograph. Keep desktop, mobile and footer About links pointing there; preserve the separate homepage About section. Avoid carrying the old fixed “17 years” claim forward without confirmation.

## Authoritative services

The client requires the exact four service categories and original descriptions from https://www.philandreoudigital.com/services/:

- Large Format Printing Solutions
- Exhibition & Display Solutions
- Acrylics Products
- Installations & Services

Use `service_content.py` as the single source for names, order, descriptions, routes and source artwork. Do not rename, merge, split, invent or extend services, subservices, benefits or FAQ answers without explicit client approval. Vehicle graphics appears as a product on the old homepage but must not become a fifth service category. The active Wix enquiry dropdown must show the same four services, plus the non-service “Not sure yet” choice. Do not reseed the form or alter historical enquiries.

Services overview: `/services.html`. Canonical details: `/services/large-format-printing.html`, `/services/exhibition-display-solutions.html`, `/services/acrylics-products.html`, `/services/installations-services.html`. Old modified service URLs serve corrected content as compatibility aliases; `/services/vehicle-graphics.html` serves the overview. They are not separate services.

## Mobile navigation

The mobile menu is a fixed ink-coloured overlay below the slim header, with large navigation links, a red quote action, phone/location row and an animated hamburger/close icon. The Services disclosure must start collapsed on every menu opening, preserve the exact four service names/order from `service_content.py`, and use its smooth grid transition with immediate inert/aria-hidden updates. Keep native `details` semantics, Enter/Space support, Escape close, focus containment/return, background inertness, scroll locking and resize cleanup. Reserve bottom spacing for the native Wix badge and safe area. Desktop navigation stays separate. All quote actions must preserve the existing modal/inline form behaviour.

## English and Greek

English routes remain at the root; Greek mirrors them under `/el/`. Use `/el/index.html` for the Greek homepage because Wix serves explicit files. `localization.py` builds all 18 Greek pages and adds language selectors to desktop navigation, the mobile menu footer, and the site footer. Preserve same-page switching, including Blog slug/query and anchor. Mobile selectors belong inside the hamburger overlay, never in the narrow header.

Maintain natural Greek in `locales/el-static.json`, form/Blog UI in `locales/el-ui.json`, and the current published Blog translations in `locales/el-blog.json`. Service translations must preserve the four approved services and descriptions; live Wix form choice values stay in English while labels display Greek. Do not translate visitor-entered text, alter field targets, reseed records, or submit real test enquiries.

`src/blog-localization.js` validates source title, excerpt and content blocks before applying a saved translation. Newly added or edited posts need an authored translation; otherwise the Greek article explicitly says it is currently available in English. Existing seeded marketing/SEO posts still need editorial review for this printing business. Greek font subsets use the same Google Sans family; preserve `dist/assets/fonts/OFL-GoogleSans.txt`. Rebuild after translation edits.

## Mobile footer

At 600px and below, preserve the single-column footer with full-width service links, separated navigation/contact groups, a full-width quote action and a two-option language row. Keep legal links on distinct rows, touch targets at least 44px, and bottom/safe-area spacing for the native Wix badge. Avoid squeezing long English/Greek service names into adjacent narrow columns. Desktop and tablet retain their existing grid.

## Mandatory GitHub and Wix workflow

The user requires every website change to be saved in GitHub and published to Wix. The canonical source repository is https://github.com/Maxim-Constantinou-Avocadots/Phil-Andreou-Digital, default branch `main`. Reuse this repository and the existing Wix site; never create replacements. This instruction persists for every future implementation task.

1. Start from the latest repository head. Inspect and preserve other contributors’ work.
2. Edit source, run `npm run build`, and include the updated tracked `dist/` output. Run checks appropriate to the change.
3. Commit descriptive changes and push to the repository. Do not use force pushes or rewrite shared history. If branch protection requires a PR, follow it and report the status accurately.
4. Publish the matching build or guarded selective patch to the existing Wix Headless site through its authenticated tools. Preserve unrelated live files and all Wix business data.
5. Confirm both the GitHub commit/ref and Wix publication. Record the source commit, Wix upload ID, date and result in `DEPLOYMENTS.md`, then push that deployment-log update. Do not call a website change complete if only one destination succeeded; explicitly report any unsynced state.

GitHub Actions validates pushes and pull requests and archives the build. It does not automatically publish to Wix or import dashboard edits into GitHub. Publishing currently uses the authenticated Wix integration available in this project conversation; do not invent a GitHub-to-Wix deployment connection or commit credentials. Wix-managed form submissions, live Blog records and other business data stay in Wix. The repo tracks frontend source, translations, assets and compiled output.

No duplicated Library source archives are required now that this project is backed by GitHub. Existing archives are historical backups; continue development from GitHub.

The connected GitHub integration can write commits even when the local Git CLI has no push credentials. In that case, use its blob/tree/commit/ref APIs with an expected branch-head lease, verify the resulting tree against the local Git tree, then fetch and align the local branch only after confirming identical trees. Never request or commit personal access tokens just to bypass missing CLI authentication.

## Project viewer

Preserve the image-led project dialog, fixed close toolbar, desktop details panel and mobile stacked scrolling layout. Concept studies must remain clearly labelled. Keep decoded shared-image opening motion, cancellation of stale/closing transitions, previous/next study navigation, title announcements, Escape/outside-click close, focus return and reduced-motion support. Project animation effects must be cancelled after completion so filled effects never leave a reopened dialog invisible. Keep branded thin scrollbars and 16px body copy.

## Work grid after dialog close

Retain focus return to the opener. Grid expansion must use `:focus-visible` for keyboard focus, and only when no work card is hovered. Never use unconditional `:focus-within` expansion: it pins the last-opened card after the modal closes and overrides pointer hover on other cards. Keep pointer hover on all three cards and the 700ms grid transition. The work heading is capped at 64px, flows naturally, and shares the card grid with 16px supporting copy; preserve its scoped tablet/mobile reflow.

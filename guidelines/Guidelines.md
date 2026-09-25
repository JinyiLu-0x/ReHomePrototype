# ReHome — Design guidelines

## Current refinement baseline (stages 2 and 3)

These refinements take precedence over older layout directions below. Preserve the stage-one BrandMark and short navigation labels.

- Public content uses a shared 1200px container, compact copy, warm furniture photography and white reading surfaces. About must not use negative margins. Use pale oak for the closing donation strip, with a forest-green action; avoid a brown button on a large green background.
- Staff content is capped at 1320px. Use compact tables, 48px furniture thumbnails, quiet row actions and concise primary/secondary text. Keep detailed information in drawers.
- On narrow screens, scroll tables horizontally rather than hiding status or action columns. Dialogs support Escape, focus containment and focus restoration.
- Preserve all existing frontend donation, review, request and allocation interactions. No backend, database or real authentication is added.
- The original SVG at `public/images/bookcase-preview.svg` is explicitly an illustrative preview, not a donor photograph. Replace it only with an appropriate image of a single freestanding bookcase that may be used in the project.

> **These rules are authoritative for all Parts (1–4) of the prototype.**
> Reread this file before each Part begins. Do not override with earlier instructions.

---

## Scope

Interactive frontend prototype. Mock records and shared local state only. No database, backend, API or real authentication. Preserve all working interactions.

---

## Brand reference

Neptune's green interiors paired with oak and pale stone. Skagerak's natural wood and practical furniture character. Interpreted as a welcoming community service — not luxury positioning.

---

## Palette

| Token | Hex | Use |
|---|---|---|
| Canvas | `#F8F8F4` | Page field (body background) |
| White | `#FFFFFF` | Reading surfaces — panels, cards, forms |
| Forest | `#284C40` | Primary actions, selected navigation |
| Forest dark | `#1E3830` | Hover on forest elements |
| Sage | `#E6ECE5` | Sidebar, quiet section backgrounds |
| Walnut | `#70513C` | Small warm details, task dots |
| Oak | `#C49A6C` | Warm accent, bar fills, icons |
| Charcoal | `#29332E` | All body text |
| Muted | `#4D5C55` | Secondary text, labels, captions |
| Stone | `#DDE1D9` | All borders and dividers |
| Stone dark | `#C8CFC6` | Hover borders |

**Rules:**
- Light surfaces (white + canvas) cover most of the screen.
- Forest gives structure. Wood tones and furniture photos give warmth.
- Do not use full-page sage, uniformly green panels or decorative brown text.
- Oak is for small accents only — bar fills, warm dots, icon backgrounds.
- Walnut is for small detail text only, not body copy.

---

## Typography

- **Source Sans 3** throughout (body and headings).
- **Lora** only for the brand mark letter "R" — nowhere else.
- Body: 15–16px, weight 400–500.
- Page titles: 28px, weight 600.
- Section / panel headings: 14–15px, weight 600.
- Labels and captions: 11–12px.
- No italic body copy, no decorative text styles.

---

## Photography

- Natural daylight furniture: wood, woven fabric, ordinary reusable pieces.
- Photos should feel honest and domestic, not styled or aspirational.
- Do not use forest overlays, dark colour washes, gradients or decorative textures over images.
- Images may be used contained (clipped to a card shape) or as clean thumbnail strips.

---

## Layout and components

- Sidebar: sage `#E6ECE5`, 228px, persistent at ≥1024px.
- Nav items: 40px tall, 20px icons. Active state: forest fill, white text.
- Nav badge: forest background, white text on inactive; semi-transparent on active.
- Panels / cards: white, 1px stone border, 8px radius.
- Topbar: white, 56px, stone border bottom.
- Page field: canvas `#F8F8F4`.
- Primary button: forest, white text, 6px radius.
- Filter tabs active: forest fill.
- Moderate radii (6–8px), consistent stone borders, minimal shadow.
- No decorative gradients, fake textures or oversized marketing sections.

---

## Content rules

- Brief page titles (28px) with no supporting subtitle line unless essential.
- Panel heads: short heading only; inline link for navigation.
- Lists and rows: show primary info inline; secondary on demand.
- Concise button labels; no instructional text in normal flows.
- Errors and required field markers are always visible.

---

## Status pills

| State | Colour |
|---|---|
| Available / Completed | Forest-tinted green |
| On hold / Open | Oak-tinted amber |
| Urgent / Action needed | Soft red |
| Allocated / In progress | Muted blue |
| Declined / Neutral | Stone grey |

---

## Demo data note

All names, organisations and records are fictional and used for demonstration only. Do not present fictional numbers as verified operational statistics.

---

## Parts checklist

- [x] Part 1 — Palette, typography, surfaces and layout applied to existing screens
- [x] Part 2 — Components and public/caseworker pages complete
- [x] Part 3 — Staff pages complete (P6–P10)
- [x] Part 4 — Connected interactions, validation, conflict state, accessibility
- [x] Stage 1 — Public home page, top navigation, updated palette rules
- [x] Stage 2 — Dedicated sign-in page, password show/hide, demo access dialog, avatar fix
- [x] Stage 3 — Purposeful imagery, photo-matched inventory, donation form tightened, offer table thumbnails, offer drawer photo + compact donor grid, "2 business days" removed
- [x] Stage 4 — Consistency and workflow check (see below)
- [x] Refinement 1 — Identity and navigation (see below)

---

## Refinement 1 completed — identity and navigation

### Brand mark
- `BrandMark` component: custom SVG armchair silhouette, `viewBox="0 0 28 28"`, stroke-based, single `currentColor` stroke. Chair back has a gabled (house-shaped) peak at top; two horizontal armrests extend left and right; vertical sides drop to a seat rail; two short legs.
- `BrandMark({ size, color })` props — used at 26px in public nav, 24px in sidebar, 22px in footer.
- All instances of the tilted R tile (`.brand-mark` + `.brand-mark span`) replaced.
- Lora font import retained for potential body use but no longer used in the brand mark.

### Wordmark rule
- Logo in nav: mark + **"ReHome"** only (no "Furniture Collective" sub-line).
- Full name "ReHome Furniture Collective" appears only in footer and accessible `aria-label` on the logo button.
- `.brand-wordmark` class: 700 weight, Source Sans 3, forest color in nav context, ink in sidebar.

### Public navigation
- Logo (mark + wordmark) is the home link; "Home" nav item removed.
- Nav: **About** (scrolls to `#about`), **Donate furniture** (forest CTA button style `.pub-nav-donate`).
- **Sign in** is a quiet secondary text link (no border, muted color, subtle hover) — `.pub-nav-signin` revised.
- `.pub-nav-signin-active` now applies `color: var(--ink)` only — no green fill block on a public link.
- Mobile (≤640px): `.pub-nav-links` and `.pub-nav-donate` hidden; Sign in persists at right.

### Sidebar / authenticated workspace
- "MENU" caption (`nav-caption`) removed.
- Staff nav labels shortened: "Overview", "Offers", "Inventory", "Requests".
- `side-impact` widget (allocation count + demo disclaimer) removed from sidebar.
- Sign out moved into user-card row — icon-only button (`.user-signout`) at far right.
- `.nav-signout` class removed.

### Repeated logos removed
- Donate form header: brand mark removed; now renders `<h1 class="donate-top-h1">` + `<p class="donate-top-sub">` directly.
- Sign-in page: `signin-page-brand` block removed (PubNav already shows the logo above).
- Footer: brand mark updated to `BrandMark` at 22px, `rgba(255,255,255,0.7)`.

### Colour roles
- Forest `#284C40` — brand mark, nav Donate CTA, workspace primary actions, filter tabs active.
- Walnut `#70513C` — homepage CTAs (`.pub-cta`) and step numbers on pale-oak surface.
- White — reading surfaces (panels, forms, cards, modals, topbar).
- Pale oak `#EEE4D7` — How it works section background, hero photo wrap.
- **Never brown on dark green**: final CTA section button uses `.pub-cta-on-forest` — white background, forest text, pale-oak hover.

---

## Stage 3 completed — imagery and detail screens

### Image improvements
- `photos` object extended: `bookcase`, `drawers`, `coffee`, `bed` added as distinct item-matched Unsplash photos
- All `initialItems` and `initialOffers` photo assignments corrected — no image reuse across mismatched item types
- Homepage furniture types grid updated: Bedroom → `photos.bed`, Storage → `photos.bookcase`; copy updated to "examples of typical donation types"
- Donation form: oversized banner photo removed; compact "Example" thumbnail added beside upload control with tip text

### Copy changes
- All four "within 2 business days" instances replaced with "Our team will review your offer and contact you about next steps."

### Offer table
- 44×33px 4:3 thumbnail column added as first column; multi-item offers show `+N` badge overlay

### Offer review drawer
- Full-width 16:7 photo shown at top of drawer when image is available
- Donor details replaced from stacked `sheet-spec` list with compact two-column `sheet-donor-grid`
- Section padding tightened

### New CSS (Stage 3)
- `.photo-upload-row`, `.photo-example-wrap`, `.photo-tip-text` — donation form upload row
- `.offer-thumb-wrap`, `.offer-thumb`, `.offer-thumb-count` — offer table thumbnails
- `.review-offer-photo` — offer drawer header photo
- `.sheet-donor-grid`, `.sheet-donor-cell`, `.sheet-donor-full` — compact two-column donor detail grid

---

## Stage 4 completed — consistency and workflow check

### Dashboard metric correction
- "Items to assess" tile renamed to **"Accepted items"**
- Count now calculated from offers with status `"Accepted"` or `"Collection arranged"` (sum of `offer.items.length`)
- Tile navigates to Donation offers filtered to "Accepted"

### Request lists — privacy and clarity
- Dashboard "Recent requests" activity rows: now show `r.id — r.itemName/items` as primary label; client name removed from list view
- Allocations table: "Client" column renamed to "Request" and shows `a.requestId` instead of client name
- Allocation modal: "Client" summary row replaced with "Request" showing `reviewRequest.id`; "Items requested" renamed to "Furniture requested" with full item name
- Detail sheets (request, allocation) retain full context for operational use; only list views changed

### Data consistency
- `RH-0380` (upholstered armchair) corrected from `"Reserved"` to `"Available"` — no matching allocation or request existed
- `RQ-0288` (double bed frame request) wired to `RH-0371` (`itemId`, `itemName`) — enabling the allocation flow for that request

### Preserved workflows
- Offer acceptance → "To assess" items (not directly Available) ✓
- Caseworker request submission does not reserve the item ✓
- Staff allocation requires item to be Available; conflict if already Allocated ✓
- `markComplete` cascades: allocation → Completed, item → Collected, request → Fulfilled ✓
- Dashboard counts derive from live in-memory state ✓

---

## Stage 1 completed — public journey and brand

### Layout change
- `role === "public"` renders `<div class="shell-public">` — no sidebar, no auth topbar
- `role === "caseworker" | "staff"` renders `<div class="shell-auth">` — unchanged sidebar + topbar
- Public layout is a vertical flex column: `PubNav` sticky at top, then page sections full-width
- Auth `<main>` gets `margin-left: var(--sidebar-w)` via `.shell-auth main` rule

### Public top navigation (`PubNav` component)
- Sticky white header, 58px, forest-green forest border bottom
- Brand mark + "ReHome / Furniture Collective" text (links to `view === "home"`)
- Nav links: Home (active state), About ReHome (scrolls to `#about`), Donate furniture
- Sign in button: forest outline, forest fill on hover — opens `signinOpen` modal
- Nav links hidden at ≤640px (mobile); sign in button persists

### View type update
- `"home"` added to `View` type
- Default `view` state changed from `"donate"` to `"home"`
- `signOut` handler now routes back to `"home"` instead of `"donate"`

### Homepage (`view === "home"`)
Five sections:
1. **Hero** — split grid 1fr 1fr; walnut CTA; hero photo `photo-1772797583328` (natural light living room); tall 4:5 photo aspect ratio
2. **About ReHome** — `id="about"` for anchor nav; white bg; split with dining photo `photo-1772442363851`
3. **How it works** — `background: var(--oak-pale)` (#EEE4D7); 3 steps with numbered walnut circles; vertical dividers between columns
4. **What we accept** — white bg; 4-column grid with existing furniture photos; category + description label
5. **Final CTA** — `background: var(--forest)` with walnut CTA button; forest-dark footer below

### Palette additions (Stage 1)
- `--oak-pale: #EEE4D7` — pale oak; used for How it works section background
- `--walnut2: #5a3f2e` — darker walnut; hover state for `.pub-cta` buttons
- **Walnut (`#70513C`)** is now primary colour for all public CTA buttons and `pub-eyebrow` section labels
- **Forest (`#284C40`)** remains for nav accents (active links, sign in hover, final CTA section background)
- White and canvas cover reading surfaces as before
- Sage is NOT used on any public homepage section (reserved for auth sidebar only)

### New CSS classes (Stage 1)
- `.shell-public` / `.shell-auth` — conditional app shell variants
- `.pub-nav` / `.pub-nav-inner` / `.pub-brand` / `.pub-nav-links` / `.pub-nav-link` / `.pub-nav-signin` — public top nav
- `.pub-cta` / `.pub-cta-lg` — walnut public CTA button (primary variant for public pages)
- `.pub-eyebrow` — walnut uppercase section label (replaces `.eyebrow` on public pages)
- `.pub-page-wrap` — public donate page centered wrapper (replaces old `.donate-page` canvas)
- `.home-page` — public home page container
- `.hero` / `.hero-copy` / `.hero-heading` / `.hero-intro` / `.hero-photo-wrap` / `.hero-photo`
- `.about-section` / `.about-inner` / `.about-heading` / `.about-body` / `.about-photo-wrap` / `.about-photo`
- `.steps-section` / `.steps-inner` / `.steps-heading` / `.steps-grid` / `.step` / `.step-num` / `.step-divider`
- `.types-section` / `.types-inner` / `.types-heading` / `.types-sub` / `.types-grid` / `.type-card` / `.type-photo-wrap` / `.type-info` / `.types-note`
- `.pub-cta-section` / `.pub-cta-inner` — forest-bg final CTA section
- `.pub-footer` / `.pub-footer-inner` / `.pub-footer-brand` / `.pub-footer-note` / `.brand-mark-sm`

### Photos used (Stage 1)
- `photos.hero` — `photo-1772797583328` — modern living room, natural light, wooden accents (hero right panel)
- `photos.dining` — `photo-1772442363851` — sunlit dining set (About section right panel)
- Existing `photos.sofa`, `photos.table`, `photos.chair`, `photos.room` reused in furniture types grid

---

## Part 2 completed — pages and components

### Component system (all in `src/App.tsx` + `src/index.css`)
- **Field** — `.d-field` / `.d-label` / `.d-input` / `.d-req` / `.d-opt` with focus ring
- **Button** — `.primary` (existing) / `.small-primary` / `.row-button` + new `.add-item-btn` / `.donate-item-remove`
- **Badge / Pill** — `.pill` with tones: `green`, `orange`, `red`, `blue`, `grey`
- **Contact toggle** — `.contact-toggle` pill-style button group (email / phone)
- **Radio group** — `.radio-group` / `.radio-label` with `accent-color: var(--forest)`
- **Dimensions row** — `.dim-row` / `.dim-label` / `.dim-input` (W × D × H in a row)
- **Sheet** — `.sheet-layer` / `.sheet-scrim` / `.sheet` right-side drawer with animation
- **EmptyState** — `.empty` / `.empty-icon` (existing, preserved)
- **Furniture card** — `.furniture-card` with `.furniture-photo-wrap` (4:3 aspect ratio) and fallback

### P1 — Donate furniture (`view === "donate"`)
- Multi-section form: contact details (name, email OR phone toggle, suburb, drop-off radio)
- Availability and access notes (optional)
- Repeating item blocks (type, condition, description, dimensions W×D×H, safe-to-move, concerns, photo preview)
- Add / remove item sections; at least one item required on submit
- Confirmation screen with offer reference, "what happens next" steps, and "Submit another" action

### P2 — Sign in modal (`signinOpen`)
- Proper email + password fields (labeled, with autocomplete attributes)
- Inline error message when email not matched
- Divider then "Demo access" section with all three demo accounts
- Email matching: `claire@rehome.org.au`, `aisha@northside.org.au`, `tom@bridge.org.au`

### P3 — Available furniture (`view === "cw-furniture"`)
- 3-column furniture grid; 4:3 photo aspect ratio; sage fallback + sofa icon on error
- Category filter tabs (All + dynamic categories from available items)
- Search input (same `search` state as global search)
- Card shows: category, name, condition, dimensions

### P4 — Item detail / request (Sheet overlay from P3 cards)
- Full-width 4:3 photo; item ID, category, condition, dimensions, colour, material, description
- Request form: client reference (initials only), household suburb, priority notes, pickup/delivery constraints, urgency radio
- Caseworker name and agency shown as read-only context
- On submit: confirmation with reference, no reservation ("Pending" status, item stays Available)
- "View my requests" navigates to P5

### P5 — My requests (`view === "cw-requests"`)
- Own requests only (filtered by `currentUser.name`)
- Status pill: Pending (blue) / Open (orange) / Allocated (green)
- Expandable rows: chevron button rotates on expand/collapse
- Expanded content: item, suburb, priority notes, constraints, outcome
- "New request" button remains in page heading

---

## Part 3 completed — staff pages and data model

### New types (Part 3)
- `OfferStatus`: `"Awaiting review" | "Under review" | "Accepted" | "Declined" | "Collection arranged"`
- `InventoryStatus`: `"To assess" | "Available" | "On hold" | "Allocated"` (added "To assess")
- `RequestStatus`: `"Open" | "Pending" | "Under review" | "Allocated" | "Closed"` (added "Under review", "Closed")
- `OfferItem` interface: `{ type, description, condition, dimensions, safeToMove, concerns }`
- `Offer` expanded: full donor contact (`contact`, `contactMethod`), drop-off (`canDropOff`, `availability`, `access`), `items: OfferItem[]`, review metadata (`reviewNotes`, `reviewer`, `reviewedAt`)
- `Item` expanded: `concerns: string`, `sourceOfferId: string`
- `Allocation` expanded: `confirmedBy: string`, `confirmedAt: string`

### P6 — Overview (`view === "dashboard"`)
- Five linked stat tiles in `.overview-stats` grid; each navigates to filtered view
- Counts: offers awaiting review, items to assess, available items, open requests, completed allocations
- Two activity panels below: recent offers (opens review sheet) + recent requests (opens detail sheet)

### P7 — Donation offers (`view === "offers"`)
- Searchable/filterable data table: `.data-table` with ref, donor, suburb, date, item count, status, Review action
- Filter tabs: All / Awaiting / In review / Accepted / Declined / Arranged
- Row click or "Review" button opens P8 offer review sheet

### P8 — Offer review (sheet over P7)
- `reviewOffer` state — right-side sheet (`.sheet-wide`, 560px)
- Full donor contact, suburb, drop-off availability, access notes
- All offered items listed (`.offer-items-list` / `.offer-item-row`) with condition, dimensions, safe-to-move, concerns
- `.status-btn-group` for status transitions (5 statuses)
- Review notes textarea + `.reviewer-info` strip showing previous reviewer
- On Accept (if first accept): creates items with `status: "To assess"` and `sourceOfferId` — NOT Available
- Info callout warns staff: items must be manually marked Available from P9

### P9 — Inventory (`view === "inventory"`)
- Searchable/filterable data table: item, category, condition, location, status, source offer, Details button
- Filter tabs: All / To assess / Available / On hold / Allocated
- Item detail sheet: `editItem` state — shows all metadata, editable description + movement concerns
- "Mark Available" button visible only when `status === "To assess"`; sets status + location "Bay —"

### P10 — Requests & allocations (`view === "req-alloc"`)
- Two tabs: Requests + Allocations (`.reqalloc-tabs`)
- Requests table: request ID, item requested, caseworker, agency, submitted, status, Review/View action
- Request detail sheet: `reqDetail` state — shows all context fields, priority notes, constraints, outcome
- Sheet actions: "Mark under review", "Approve & allocate" (opens allocation modal), decline with note → Closed
- Allocations table: reference, client, item, caseworker, date, confirmedBy/At, status, "Mark complete"

### New CSS (Part 3)
- `.data-table`, `.muted-cell`, `.table-actions`, `.sub` — staff table pattern
- `.overview-stats`, `.overview-stat`, `.overview-stat-num`, `.overview-stat-label` — 5-tile linked counts
- `.overview-activity`, `.activity-row`, `.activity-row-info` — dashboard activity panels
- `.sheet-wide` — 560px wide sheet for offer review
- `.status-btn-group`, `.status-btn`, `.status-btn.active` — offer status selector
- `.reviewer-info` — reviewer attribution strip
- `.offer-items-list`, `.offer-item-row`, `.offer-item-meta` — offered items in review sheet
- `.review-action-row`, `.decline-btn`, `.req-outcome-box` — request action UI

---

## Part 4 completed — connected interactions and polish

### Status vocabulary (final)
- `OfferStatus`: `"Submitted" | "Under review" | "Accepted" | "Declined" | "Collection arranged"`
- `InventoryStatus`: `"To assess" | "Available" | "Reserved" | "Allocated" | "Collected" | "Unavailable"`
- `RequestStatus`: `"Submitted" | "Under review" | "Approved" | "Fulfilled" | "Closed"`

### End-to-end flows implemented
1. **Donation** — P1 form (with validation) → new Offer appears in P7 as "Submitted" → staff reviews in P8 → accept creates "To assess" items in P9 → staff marks items Available → item appears in P3 caseworker catalogue
2. **Request** — caseworker browses P3 (with validation) → submits request → appears in P5 (own requests) and P10 (all requests)
3. **Allocation** — staff reviews P10 request → opens allocation modal → selects item → item marked Allocated, request marked Approved, allocation record created
4. **Completion** — staff marks allocation complete → item marked Collected, request marked Fulfilled, dashboard counts update

### Conflict scenario seeded
- RQ-0291 (Client A. Mercer, urgent) and RQ-0290 (Client J. Wilson, standard) both request RH-0382 (sand sofa)
- Allocating RQ-0291 marks sofa Allocated; RQ-0290 allocation modal shows conflict banner "This item has already been allocated." — confirm button disabled for that item; staff must select a different item or close the request

### Allocation cascade
- `Allocation` interface extended: `itemId?: string`, `requestId?: string`
- `markComplete(id)` → sets `completed: true`, item → "Collected" + location "Delivered", request → "Fulfilled" with dated outcome

### Form validation (P1 and P4)
- P1 donate: name, contact (email or phone), suburb, drop-off radio, at least one item with type + condition
- P4 request: client reference, suburb required
- Errors shown inline with `<span class="field-error">` and `role="alert"`, field border via `.input-error`
- Form values preserved on error — no reset

### Accessibility improvements
- `.sr-only` utility class for screen-reader-only labels on table action column headers
- `aria-label` on all icon-only buttons (close, menu, notifications, expand/collapse)
- `aria-pressed` on filter tab buttons and status button groups
- `aria-current="page"` on active nav item
- `aria-live="polite"` and `role="status"` on toast; `role="alert"` on inline errors and conflict banner
- `autoFocus` on first input in request sheet and sign-in modal
- `@media (prefers-reduced-motion: reduce)` suppresses all animations and transitions

### New CSS (Part 4)
- `.conflict-banner` — red-tinted alert box for allocation conflict
- `.field-error` — inline validation error with icon
- `.input-error` — red border state for invalid inputs
- `.toast-error` — dark red toast variant for error notifications
- `.sr-only` — standard visually-hidden utility
- `@media (prefers-reduced-motion: reduce)` — disables all CSS animations

---

## Remaining prototype assumptions

1. **No real authentication** — sign in accepts any listed demo email; passwords are not checked. All demo users are accessible via the sign-in modal without credentials.
2. **No persistence** — all state resets on page reload. Records exist only for the current session.
3. **No real-time updates** — multiple browser tabs do not share state. The "shared state across demo roles" described in the brief means different users can be simulated by switching sign-in within a single session.
4. **No logistics or collection scheduling** — "Collection arranged" is a manual status only; no dates, contacts or routing are generated.
5. **Item photos are static Unsplash images** — donor-uploaded photos in P1 are previewed locally but not stored; the offer record retains the fallback image URL after submission.
6. **Allocation conflict is seeded, not automatic** — the conflict scenario is demonstrated via seed data (two requests for RH-0382). Any newly submitted caseworker requests do not automatically target the same item unless the item ID happens to match.
7. **Dashboard counts are computed from in-memory state** — they update correctly within a session but do not represent historical or aggregate operational data.
8. **No notification delivery** — "caseworker notified" text in outcomes is UI copy only; no emails or messages are sent.
9. **Reference numbers are sequential but not guaranteed unique across sessions** — new offers, requests and allocations append to in-memory arrays starting from a fixed offset.
10. **Item location is manually maintained** — "Bay A3" etc. are illustrative; no warehouse map or assignment logic exists.

---

### Data model additions (Part 2)
- `Item` extended with: `dimensions`, `description`, `colour`, `material`
- `Request` extended with: `itemId?`, `itemName?`, `suburb?`, `priorityNotes?`, `constraints?`, `outcome?`
- `Request.status` expanded: `"Open" | "Allocated" | "Pending"`
- `DemoUser` extended with `email` field for form-based sign in
- `DonateFormItem` interface for multi-item donate form state
- 8 items total in `initialItems` (was 6), all with full metadata

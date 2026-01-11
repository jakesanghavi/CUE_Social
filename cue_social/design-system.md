Progress update: TODO plan created and first step set to in-progress. Next I'll present the design system, component application guidance, and an incremental, file-by-file rollout plan.

Design System

Color Palette:

Primary: #6C8CFF (soft tech blue)
Primary-Variant: #516EF7
Accent: #8AF6C1 (muted mint)
Secondary: #A78BFF (lavender)
Background: #0F1115 (dark neutral)
Surface: #14161A (card background)
Muted Surface: #101113
Text Primary: #E6EEF8
Text Secondary: #AAB6C6
Border/Divider: rgba(255,255,255,0.06)
Error: #FF6B6B
Use these with CSS variables for semantic usage: --color-bg, --color-surface, --color-primary, --color-accent, --color-text, etc.
Typography:

System stack using Inter as primary with fallback: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto.
Headline weight: 600; UI weight: 500; body: 400.
Suggested scale: --fs-xxl: 32px, --fs-xl: 24px, --fs-lg: 20px, --fs-md: 16px, --fs-sm: 14px, --fs-xs: 12px.
Spacing Scale (base 4px):

1:4px, 2:8px, 3:12px, 4:16px, 5:20px, 6:24px, 8:32px, 10:40px.
Expose as --space-1, --space-2, etc.
Radii & Depth:

Radii: --radius-sm:6px, --radius-md:12px, --radius-lg:16px.
Shadows (subtle): --shadow-low: 0 2px 6px rgba(7,8,12,0.6), --shadow-medium: 0 8px 24px rgba(7,8,12,0.55).
Accessibility tokens:

Focus outline: --focus: 2px solid rgba(108,140,255,0.28)
Provide --elevated-contrast variants if needed for small text.
Tokens (implementation):

Add a single source file src/styles/design-tokens.css that exports :root { --color-..., --fs-..., --space-... }.
Import this at the top of src/index.css so all existing CSS can reference variables without renaming classes.
Component Patterns

Buttons:

Create 3 variants: primary (filled), ghost (transparent), outline.
Use --radius-md, spacing tokens, and --shadow-low for pressed/elevated states.
Ensure min-height 40px, 12px horizontal padding, and accessible contrast.
Cards (deck & card preview):

Use --color-surface with subtle border and --shadow-low; padding: var(--space-4); border-radius: --radius-md.
Add card--compact modifier for dense lists; keep same markup but different token spacing.
Inputs & Search:

Dark surface with 1px soft border, inner padding --space-3, placeholder color --text-secondary.
On focus use --focus outline and lift shadow.
Navbar / Top bar:

Semi-opaque backdrop (blur optional) using backdrop-filter: blur(6px) over --color-bg at 60% opacity; keep height 64px with consistent horizontal gutters.
Modals & Overlays:

Centered surface using --shadow-medium and --radius-lg; overlay: rgba(0,0,0,0.6) with focus trap rules.
Micro-interactions:

Use short transitions: transition: background-color 140ms cubic-bezier(.2,.9,.2,1), transform 120ms; for buttons, cards.
How to apply across pages & components

Global base: Update src/index.css to import the tokens file and set base font sizing, body background --color-bg, and default link/button styles. This ensures every page picks up the theme immediately.
Component styles: For each file in src/component_styles/ replace hard-coded colors/spacings with variables. Keep existing class names exactly to avoid breaking JS. Example: replace background: #111 with background: var(--color-surface).
React components: Avoid changing JSX class names. Let CSS changes handle look. If components inline-style colors exist, prefer leaving these untouched unless they override visual tokens — then migrate those inline values to variables and update where safe.
Utilities: Add a small utility file (e.g., [src/styles/utilities.css](src/styles/utilities.css)) for layout helpers such as .container, .grid, .gap-4 that map to tokens — optional, not required.
Incremental, file-by-file rollout (safe, zero-breaking)

Branch & scope: Create a ui/modernize branch. Work in small PRs targeting one file or logical group per PR (max ~200 lines changed).
Step 0 — Tokens & base: (single PR) Add [src/styles/design-tokens.css](src/styles/design-tokens.css) and update [src/index.css](src/index.css) to import it. No changes to component files. This gives instant variables for later changes.
Step 1 — Low-risk components: Restyle purely presentational components first: Navbar.js, Pill.js, SearchBar.js. Edit corresponding CSS in src/component_styles/ to use tokens. Test visually.
Step 2 — Shared primitives: Buttons, inputs, modals — update CSS files and add utility classes. Re-run UI flows (login, upload) to ensure no functional regressions.
Step 3 — Cards & Decks: Update deck preview styles per tokens. Because these are data-rich, update styles only (no markup).
Step 4 — Pages: Tackle Home, DeckList, DeckPage, Profile in isolated PRs, each containing their page CSS changes and small responsive adjustments.
Step 5 — Accessibility pass: After each PR run contrast checks and keyboard/ARIA tests, update tokens for any failing contrast.
Developer workflow & checks

Visual diffs: Use simple screenshot diffs (per-PR) or Storybook if available. If not, rely on small screenshots and QA reviews.
Testing: Manually test flows for components that change (search, create deck, login). Use git feature-branch per PR.
Rollback: Keep PRs small so reverting one PR is safe.
Commits: One logical change per commit (tokens add → imports update → component restyles).
Concrete file suggestions (no renames)

Add: [src/styles/design-tokens.css](src/styles/design-tokens.css) containing variables.
Update: [src/index.css](src/index.css) to import tokens and set body { background: var(--color-bg); color: var(--color-text); }.
Edit: files in src/component_styles/ (e.g., src/component_styles/home.css) replacing literal colors/spacings with var(--...). Do this one stylesheet at a time.
Accessibility & performance

Contrast: Target AA for normal text and AAA for headings where possible.
Fonts: Self-host or use a fast CDN (preconnect) for Inter. Use font-display: swap.
Bundle: No JS changes required; pure CSS changes avoid runtime cost. Defer animations to will-change for heavy elements.
Would you like me to:

(A) generate the initial design-tokens.css and patch src/index.css to import it now, or
(B) produce exact token values and a ready-to-apply patch for one sample component (Navbar or Home) so you can review the visual direction?
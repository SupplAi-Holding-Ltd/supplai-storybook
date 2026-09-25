# Scratchpad — Radian-inspired DS upgrades

## Background and Motivation
Light Storybook sidebar (Radian-like) with Hugeicons for Foundation + Introduction; keep search/settings.

**New (Executor):** Build Stepper + Storybook docs. Functional reference = Radian Stepper; visuals = supplai tokens. No Stepper/Wizard exists. Custom React context (no new primitive lib). Composable API. Reuse Progress, Spinner, Button patterns, local form fields. Meta: `Components/Stepper`.

**Prior (awaiting verify):** Spinner docs page.

## High-level Task Breakdown — Stepper
1. [x] Implement Stepper primitives + CSS (H/V, states, controlled/uncontrolled).
2. [x] Demos: default, complete, controls, title, description, icons, progress, vertical, linear, form, loading, disabled, mobile, completion.
3. [x] `Stepper.mdx` + Specs (Accordion format) + API/a11y/guidelines.
4. [x] Lint + build-storybook; user verify.

### Success criteria
- Interactive Stepper with inactive/active/completed/loading/disabled; Progress sync; form validation; a11y (`aria-current`, completed labels); build succeeds.

## Project Status Board
- [x] Tasks 1–4
- [x] Task 5 — Light sidebar + Hugeicons
- [x] Banner docs page
- [ ] Accordion docs page — *awaiting manual verify*
- [ ] Accordion Introduction card
- [ ] Alert docs page — *awaiting manual verify*
- [ ] Badge docs page — *awaiting manual verify*
- [ ] Breadcrumb docs page — *awaiting manual verify*
- [ ] Calendar docs page — *awaiting manual verify*
- [ ] Checkbox docs page — *awaiting manual verify*
- [ ] Collapsible docs page — *awaiting manual verify*
- [ ] Context Menu docs page — *awaiting manual verify*
- [ ] Currency Input docs page — *awaiting manual verify*
- [ ] Drawer docs page — *awaiting manual verify*
- [ ] File Upload docs page — *awaiting manual verify*
- [ ] Hover Card docs page — *awaiting manual verify*
- [ ] OTP Field docs page — *awaiting manual verify*
- [ ] Pagination docs page — *awaiting manual verify*
- [ ] Phone Input docs page — *awaiting manual verify*
- [ ] Popover docs page — *awaiting manual verify*
- [ ] Progress docs page — *awaiting manual verify*
- [ ] Radio Group docs page — *awaiting manual verify*
- [ ] Select docs page — *awaiting manual verify*
- [ ] Skeleton docs page — *awaiting manual verify*
- [ ] Slider docs page — *awaiting manual verify*
- [ ] Spinner docs page — *awaiting manual verify*
- [ ] **Stepper docs page** — *awaiting manual verify*

## Current Status / Progress Tracking
Executor — Stepper (awaiting manual verify):
- Custom React-context Stepper (no new deps); composable API matching functional reference.
- Files: `Steppers.tsx`, `Steppers.css`, `Stepper.mdx` under **Components → Stepper**.
- Examples: default, complete, controls, title/description/icon, Progress sync, vertical, controlled/uncontrolled, linear/non-linear, disabled, loading (Spinner), error composition, multi-step form + validation, completion, compact mobile, dynamic, forceMount.
- Reuses Progress + Spinner; Previous/Next are Button composition; form uses local fields (no RHF).
- Storybook build succeeded.

## Executor's Feedback or Assistance Requests
Please manually verify **Components → Stepper**:
1. Default / complete / control buttons / title / description / icon / Progress / vertical
2. Linear lock vs non-linear click; disabled Verification step
3. Loading demo (Spinner in indicator + status text)
4. Multi-step form: invalid email blocks Next; values persist on Previous
5. Compact mobile header + completion Finish flow
Confirm when OK so Planner can mark complete.

## Lessons
- Storybook has no official per-item icon API; use `sidebar.renderLabel` + hide default SVG with `:has(.sb-nav-label)` / `svg:not(.sb-nav-icon)`.
- Demo `*-btn:hover` light fills must exclude `*-btn--primary`, and primary needs its own `:hover` (darker blue + white text). Otherwise white labels become invisible on the light hover background.
- Prefer dark manager theme with original `supplailogo.svg`; light wordmark only if sidebar is light.
- Double icons = default docs glyph still visible — hide every SVG except `.sb-nav-icon`.
- In SB 10, `data-nodetype` lives on the LeafNode `<a>`, while `.sidebar-item` is the outer `LeafNodeStyleWrapper` div — selectors must target `a[data-nodetype='document']`, not `.sidebar-item[data-nodetype='document'] > a`.
- Manual time picker: closed by default; opens only on clock icon click. Dropdown uses Brand Blue — never leave it always-expanded, never use native OS `type=time` picker.
- Extract interactive demos to `.tsx` + `.css` (not MDX) to avoid Storybook JSX scope / spread issues.
- Nested `<label>` is invalid — use span-only checkbox (or `decorative`) when wrapping in card/menu labels.
- Do not mention Radian UI in user-facing Storybook descriptions; keep inspiration internal only.
- Unify docs page title/desc via `.storybook/global.css` `[class$="-header"]` rules with !important.
- Currency Input: prefer `Intl` + custom separators over `react-currency-input-field` when the project has no currency dependency; keep unformatted decimal strings for form values; use `bare` for select/external chrome.
- Drawer: use `vaul` for snap points / swipe / a11y; style panels with Modal tokens; isolate `shouldScaleBackground` with `[data-vaul-drawer-wrapper]` inside the demo so Storybook chrome is untouched; portals in the docs iframe do not cover the manager sidebar.
- File Upload: no dropzone lib needed for Storybook DS — composable context + native input; simulate progress locally and label it as demo; revoke object URLs on remove; validate accept/size/count on both picker and drop.
- Hover Card: use `@radix-ui/react-hover-card` for delays/collision/focus; style as white floating panel (like Context Menu), not dark Tooltip; disabled = omit Trigger wrapper, not a non-interactive Trigger child.
- OTP Field: use `@radix-ui/react-one-time-password-field`; length = number of Input children; keep value as string; wrap onComplete with dedupe; visual groups via margin, not nested wrappers that break Input collection.
- Pagination: no lib needed — `getPageItems` for ellipsis; keep UI 1-based; page-size changes should re-clamp current page from the first visible index; hide optional middle items under 640px.
- Popover: use `@radix-ui/react-popover`; style like Hover Card (white panel); default `modal={false}`; nested dialog demos use `modal`; emoji demos stay dependency-free (no frimousse/emoji-mart) unless product later requires them.
- Progress: use `@radix-ui/react-progress` with `translateX` indicator; sizes sm/md/lg = 4/6/8px (File Upload track = sm); indeterminate = `value={null}`; keep timers only in demos.
- Radio Group: use `@radix-ui/react-radio-group`; size inherits from root; Radio Cards via composition + `:has([data-state=checked])`; menu radios use Context Menu primitives, not form RadioGroup.
- Select: use `@radix-ui/react-select` with popper + portal; trigger heights sm/md/lg = 32/36/40 like Text Input; `indicator={null}` means default check; rich items need `textValue` for typeahead; keep secondary/`description` **outside** `ItemText` so Radix does not portal it into the fixed-height trigger.
- Skeleton: keep a single CSS pulse primitive; compositions live in stories; announce on a region (`aria-busy`), hide individual blocks; respect `prefers-reduced-motion`.
- Slider: use `@radix-ui/react-slider`; sizes align Progress track (4/6/8) with larger thumbs + hit padding; stepper/input/tooltip are composition; Tooltip package not ready — tip bubble uses Tooltips.mdx tokens.
- Specs cards: Accordion is the reference — 3-col grid, 8px radius, label 11px/700/0.06em/#94A3B8 uppercase, value 13px/600/#0F172A. Enforced globally via `.storybook/global.css` `[class*="-spec-*"]` rules.
- Spinner: SVG/CSS only (no animation libs); `currentColor`; semantic sizes; overlays/loading state stay in compositions; `announce={false}` when visible text already says loading; reduced-motion uses opacity pulse, not silence.
- Stepper: custom React context (no new Radix/lib); `completed || step < activeStep` for completed; `loading` only when active; linear lock via `disabled` on future steps (app-level); Progress/Previous-Next are composition; do not install react-hook-form solely to mirror reference.

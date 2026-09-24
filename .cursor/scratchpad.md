# Scratchpad — Radian-inspired DS upgrades

## Background and Motivation
Light Storybook sidebar (Radian-like) with Hugeicons for Foundation + Introduction; keep search/settings.

## High-level Task Breakdown
1–4. [done] Intro, tokens, CodePanel, Intro terminal.
5. [done — awaiting user verify] Light manager theme + Hugeicons sidebar labels for Foundation/Intro.

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

## Current Status / Progress Tracking
Executor — Phone Input (awaiting manual verify):
- Implemented `PhoneInputs.tsx` / `PhoneInputs.css` with `react-international-phone` (`usePhoneInput`, FlagImage, E.164).
- Docs: `PhoneInput.mdx` under Components/Form Methods/Phone Input; Form Methods index card added.
- ESLint clean on PhoneInputs; `npm run build-storybook` succeeded (PhoneInput chunk present).

## Executor's Feedback or Assistance Requests
Please manually verify **Components → Form Methods → Phone Input** in Storybook:
1. Live playground (country, allowlist/exclude, sizes, disabled/readonly/error)
2. Country selector search + restricted/excluded lists
3. E.164 meta display + formatting / no-formatting
4. Validation + form submit
5. OTP flow (demo code `123456`)
Confirm when OK so Planner can mark the task complete.

## Lessons
- Storybook has no official per-item icon API; use `sidebar.renderLabel` + hide default SVG with `:has(.sb-nav-label)` / `svg:not(.sb-nav-icon)`.
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

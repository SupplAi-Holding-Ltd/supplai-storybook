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

## Current Status / Progress Tracking
Executor — Checkbox:
- Replaced stub `Components/Form Methods/Checkbox` with full `Components/Checkbox` page
- Files: `Checkbox.mdx`, `Checkboxes.tsx`, `Checkboxes.css`
- Radian-aligned examples: playground, size, checked, disabled, indeterminate, group, custom card, setup list, dropdown menu, form
- Supplai Brand Blue `#4169E1` checked/indeterminate fill; Manrope; 12px panel radii

## Executor's Feedback or Assistance Requests
Please verify **Components → Checkbox** against https://radianui.com/docs/components/checkbox
Confirm sizes, indeterminate select-all, card/setup/menu/form demos, and Brand Blue checked state.

## Lessons
- Storybook has no official per-item icon API; use `sidebar.renderLabel` + hide default SVG with `:has(.sb-nav-label)` / `svg:not(.sb-nav-icon)`.
- Prefer dark manager theme with original `supplailogo.svg`; light wordmark only if sidebar is light.
- Double icons = default docs glyph still visible — hide every SVG except `.sb-nav-icon`.
- In SB 10, `data-nodetype` lives on the LeafNode `<a>`, while `.sidebar-item` is the outer `LeafNodeStyleWrapper` div — selectors must target `a[data-nodetype='document']`, not `.sidebar-item[data-nodetype='document'] > a`.
- Manual time picker: closed by default; opens only on clock icon click. Dropdown uses Brand Blue — never leave it always-expanded, never use native OS `type=time` picker.
- Extract interactive demos to `.tsx` + `.css` (not MDX) to avoid Storybook JSX scope / spread issues.
- Nested `<label>` is invalid — use span-only checkbox (or `decorative`) when wrapping in card/menu labels.

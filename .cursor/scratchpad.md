# Scratchpad — Radian-inspired DS upgrades

## Background and Motivation
Light Storybook sidebar (Radian-like) with Hugeicons for Foundation + Introduction; keep search/settings.

## High-level Task Breakdown
1–4. [done] Intro, tokens, CodePanel, Intro terminal.
5. [done — awaiting user verify] Light manager theme + Hugeicons sidebar labels for Foundation/Intro.

## Project Status Board
- [x] Tasks 1–4
- [x] Task 5 — Light sidebar + Hugeicons *(awaiting manual verify)*

## Current Status / Progress Tracking
Executor — Banner:
- Added `src/stories/components/Banners.mdx` (Components/Banner)
- Radian-aligned: variants, colors, primary/success/error, floating, promo
- Supplai tokens; CodePanel playground; linked from Introduction

## Executor's Feedback or Assistance Requests
Refresh Components → Banner and compare with https://radianui.com/docs/components/banner

## Lessons
- Storybook has no official per-item icon API; use `sidebar.renderLabel` + hide default SVG with `:has(.sb-nav-label)` / `svg:not(.sb-nav-icon)`.
- Prefer dark manager theme with original `supplailogo.svg`; light wordmark only if sidebar is light.
- Double icons = default docs glyph still visible — hide every SVG except `.sb-nav-icon`.
- In SB 10, `data-nodetype` lives on the LeafNode `<a>`, while `.sidebar-item` is the outer `LeafNodeStyleWrapper` div — selectors must target `a[data-nodetype='document']`, not `.sidebar-item[data-nodetype='document'] > a`.

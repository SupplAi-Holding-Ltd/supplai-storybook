# Scratchpad — Colors Page Hex Tweaks

## Background and Motivation
Colors + Accessibility updates, then Button docs Semantic section layout: neat aligned table without row divider lines.

## High-level Task Breakdown
1–11. [done] Colors / Accessibility updates.
12. [done — awaiting user verify] Semantic Buttons as borderless CSS grid table (aligned columns).
   - Success: no horizontal rules; Filled/Outlined/Tonal/Ghost/Disabled columns line up; labels at bottom.

## Project Status Board
- [x] Tasks 1–11 — prior updates
- [x] Task 12 — Semantic buttons table layout *(awaiting manual verify)*

## Current Status / Progress Tracking
Executor — Task 12 done in `Button.mdx`: single `bd-semantic-table` grid with `display: contents` rows; removed `border-bottom`.

## Executor's Feedback or Assistance Requests
Please verify Storybook → Button → Semantic Buttons.

## Lessons
- Semantic button matrix: use one CSS grid + `display: contents` on rows so columns share widths; avoid per-row flex + borders.
- After palette hex changes, update Contrast Check and Color Blindness Simulator hardcoded colors.

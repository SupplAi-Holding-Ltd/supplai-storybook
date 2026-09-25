import React, { useEffect, useId, useState } from "react";
import "./Spinners.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type SpinnerVariant = "default" | "simple" | "activity" | "wave";
export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type SpinnerProps = {
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  className?: string;
  /** Accessible name when Spinner is the sole loading cue. */
  "aria-label"?: string;
  /**
   * When true (default), Spinner is a live status region.
   * Set false when adjacent visible text already announces loading.
   */
  announce?: boolean;
};

const SIZE_PX: Record<SpinnerSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};

/* ── Spinner ──────────────────────────────────────────────────────────── */

export function Spinner({
  variant = "default",
  size = "md",
  className,
  "aria-label": ariaLabel = "Loading",
  announce = true,
}: SpinnerProps) {
  const classes = ["spn", `spn--${variant}`, `spn--${size}`, className ?? ""]
    .filter(Boolean)
    .join(" ");

  const a11y = announce
    ? ({ role: "status", "aria-label": ariaLabel } as const)
    : ({ "aria-hidden": true } as const);

  if (variant === "activity") {
    return (
      <span className={classes} {...a11y}>
        <span className="spn__dots">
          <span className="spn__dot" />
          <span className="spn__dot" />
          <span className="spn__dot" />
        </span>
      </span>
    );
  }

  if (variant === "wave") {
    return (
      <span className={classes} {...a11y}>
        <span className="spn__bars">
          <span className="spn__bar" />
          <span className="spn__bar" />
          <span className="spn__bar" />
        </span>
      </span>
    );
  }

  const stroke = size === "xs" || size === "sm" ? 2 : 2.25;
  const r = 10;
  const c = 2 * Math.PI * r;
  const dash = variant === "simple" ? c * 0.72 : c * 0.65;

  return (
    <span className={classes} {...a11y}>
      <svg
        className="spn__svg"
        viewBox="0 0 24 24"
        width={SIZE_PX[size]}
        height={SIZE_PX[size]}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="spn__track"
          cx="12"
          cy="12"
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
        />
        <circle
          className="spn__arc"
          cx="12"
          cy="12"
          r={r}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`}
          strokeDashoffset={c * 0.08}
          transform="rotate(-90 12 12)"
        />
      </svg>
    </span>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────── */

export const SPINNER_CODE = `// Spinner · supplai Design System
import { Spinner } from './Spinner';

<Spinner />
<Spinner variant="simple" size="lg" />
<Spinner variant="activity" aria-label="Syncing" />

// Colour via currentColor / parent text colour
<span style={{ color: '#4169E1' }}><Spinner /></span>
`;

function Demo({
  children,
  row,
}: {
  children: React.ReactNode;
  row?: boolean;
}) {
  return (
    <div className={`spn-demo${row ? " spn-demo--row" : ""}`}>{children}</div>
  );
}

/* ── Playground ───────────────────────────────────────────────────────── */

export function SpinnerPlayground() {
  const [variant, setVariant] = useState<SpinnerVariant>("default");
  const [size, setSize] = useState<SpinnerSize>("md");

  return (
    <div className="spn-play">
      <div className="spn-play-preview">
        <Spinner variant={variant} size={size} aria-label="Loading preview" />
      </div>
      <div className="spn-play-controls">
        <div>
          <div className="spn-ctrl-label">Variant</div>
          <div className="spn-chip-row">
            {(["default", "simple", "activity", "wave"] as SpinnerVariant[]).map(
              (v) => (
                <button
                  key={v}
                  type="button"
                  className={`spn-chip${variant === v ? " spn-chip--on" : ""}`}
                  onClick={() => setVariant(v)}
                >
                  {v}
                </button>
              ),
            )}
          </div>
        </div>
        <div>
          <div className="spn-ctrl-label">Size</div>
          <div className="spn-chip-row">
            {(["xs", "sm", "md", "lg", "xl"] as SpinnerSize[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`spn-chip${size === s ? " spn-chip--on" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function DefaultDemo() {
  return (
    <Demo row>
      <Spinner aria-label="Loading" />
    </Demo>
  );
}

export function VariantsDemo() {
  return (
    <Demo>
      <div className="spn-variant-row">
        {(
          [
            ["default", "Default"],
            ["simple", "Simple"],
            ["activity", "Activity"],
            ["wave", "Wave"],
          ] as const
        ).map(([v, label]) => (
          <div key={v} className="spn-variant-item spn-color--primary">
            <Spinner variant={v} size="lg" aria-label={label} />
            <span className="spn-cap">{label}</span>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function ColorsDemo() {
  return (
    <Demo>
      <div className="spn-color-row">
        {(
          [
            ["foreground", "Foreground"],
            ["muted", "Muted"],
            ["primary", "Primary"],
            ["success", "Success"],
            ["warning", "Warning"],
            ["error", "Error"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className={`spn-color-item spn-color--${key}`}>
            <Spinner size="lg" aria-label={`${label} spinner`} />
            <span className="spn-cap">{label}</span>
          </div>
        ))}
      </div>
      <p className="spn-note">
        Product code should prefer <code>currentColor</code> / parent text colour rather
        than a colour prop.
      </p>
    </Demo>
  );
}

export function SizesDemo() {
  return (
    <Demo>
      <div className="spn-size-row spn-color--primary">
        {(
          [
            ["xs", "16"],
            ["sm", "20"],
            ["md", "24"],
            ["lg", "32"],
            ["xl", "40"],
          ] as const
        ).map(([size, px]) => (
          <div key={size} className="spn-size-item">
            <Spinner size={size} aria-label={`Size ${size}`} />
            <span className="spn-cap">
              {size} · {px}
            </span>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function InlineDemo() {
  return (
    <Demo>
      <div className="spn-inline">
        <Spinner size="sm" announce={false} />
        <span>Syncing workspace…</span>
      </div>
      <div className="spn-inline" style={{ color: "#64748B" }}>
        <span>Loading records</span>
        <Spinner size="sm" announce={false} />
      </div>
    </Demo>
  );
}

export function ButtonDemo() {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!saving) return;
    const t = window.setTimeout(() => setSaving(false), 1800);
    return () => window.clearTimeout(t);
  }, [saving]);

  return (
    <Demo>
      <div className="spn-actions">
        <button
          type="button"
          className="spn-btn"
          disabled={saving}
          aria-busy={saving || undefined}
          onClick={() => setSaving(true)}
        >
          {saving ? (
            <>
              <Spinner size="sm" announce={false} />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
        <button
          type="button"
          className="spn-btn spn-btn--icon"
          disabled={saving}
          aria-label={saving ? "Saving" : "Save"}
          aria-busy={saving || undefined}
          onClick={() => setSaving(true)}
        >
          {saving ? (
            <Spinner size="sm" announce={false} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8.5l3 3 7-7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <p className="spn-note">
        Fixed <code>min-width</code> keeps the primary button stable while loading. Loading
        state belongs to the Button composition — not Spinner.
      </p>
    </Demo>
  );
}

export function BadgesDemo() {
  return (
    <Demo>
      <div className="spn-badge-row">
        <span className="spn-badge spn-badge--primary">
          <Spinner size="xs" announce={false} />
          Syncing
        </span>
        <span className="spn-badge spn-badge--success">
          <Spinner size="xs" announce={false} />
          Updating
        </span>
        <span className="spn-badge spn-badge--warning">
          <Spinner size="xs" announce={false} />
          Processing
        </span>
        <span className="spn-badge spn-badge--neutral">
          <Spinner size="xs" announce={false} />
          Checking
        </span>
      </div>
    </Demo>
  );
}

export function InputGroupDemo() {
  return (
    <Demo>
      <div className="spn-field">
        <label className="spn-label" htmlFor="spn-search">
          Search records
        </label>
        <div className="spn-input-wrap">
          <input
            id="spn-search"
            className="spn-input"
            defaultValue="invoice"
            aria-describedby="spn-search-hint"
          />
          <span className="spn-input-affix">
            <Spinner size="sm" aria-label="Searching" />
          </span>
        </div>
        <span id="spn-search-hint" className="spn-hint">
          Searching…
        </span>
      </div>
    </Demo>
  );
}

export function ValidationDemo() {
  const [value, setValue] = useState("john.smith");
  const [phase, setPhase] = useState<"idle" | "checking" | "ok">("idle");
  const id = useId();

  useEffect(() => {
    if (phase !== "checking") return;
    const t = window.setTimeout(() => setPhase("ok"), 1400);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <Demo>
      <div className="spn-field">
        <label className="spn-label" htmlFor={id}>
          Username
        </label>
        <div className="spn-input-wrap">
          <input
            id={id}
            className="spn-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setPhase("idle");
            }}
            aria-describedby={`${id}-hint`}
          />
          <span
            className={`spn-input-affix${phase === "ok" ? " spn-input-affix--ok" : ""}`}
          >
            {phase === "checking" ? (
              <Spinner size="sm" aria-label="Checking availability" />
            ) : phase === "ok" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8.5l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
        </div>
        <span
          id={`${id}-hint`}
          className={`spn-hint${phase === "ok" ? " spn-hint--ok" : ""}`}
        >
          {phase === "checking"
            ? "Checking availability…"
            : phase === "ok"
              ? "Username is available."
              : "Enter a username, then check."}
        </span>
      </div>
      <div className="spn-actions">
        <button
          type="button"
          className="spn-btn spn-btn--ghost"
          disabled={phase === "checking" || !value.trim()}
          onClick={() => setPhase("checking")}
        >
          Check availability
        </button>
      </div>
    </Demo>
  );
}

export function CardOverlayDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <Demo>
      <div
        className="spn-card"
        aria-busy={loading || undefined}
        aria-live="polite"
      >
        <h3>Dashboard Overview</h3>
        <p className="spn-card-desc">Monthly revenue and user statistics</p>
        <div className="spn-card-stats">
          <div>
            <span className="spn-stat-label">Revenue</span>
            <span className="spn-stat-value">$12,450</span>
          </div>
          <div>
            <span className="spn-stat-label">Users</span>
            <span className="spn-stat-value">1,234</span>
          </div>
        </div>
        {loading ? (
          <div className="spn-overlay">
            <Spinner size="lg" announce={false} />
            <span>Updating</span>
          </div>
        ) : null}
      </div>
      <div className="spn-actions">
        <button
          type="button"
          className="spn-btn spn-btn--ghost"
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Start loading
        </button>
        <button
          type="button"
          className="spn-btn spn-btn--ghost"
          onClick={() => setLoading(false)}
          disabled={!loading}
        >
          Stop loading
        </button>
      </div>
      <p className="spn-note">
        Overlay is a Card composition — not a Spinner prop. Region uses{" "}
        <code>aria-busy</code>.
      </p>
    </Demo>
  );
}

export function SectionLoaderDemo() {
  return (
    <Demo>
      <div className="spn-section-box" role="status" aria-label="Loading records">
        <Spinner size="lg" announce={false} />
        <span>Loading records</span>
      </div>
    </Demo>
  );
}

export function TransitionDemo() {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (phase !== "loading") return;
    const t = window.setTimeout(() => setPhase("done"), 1600);
    return () => window.clearTimeout(t);
  }, [phase]);

  return (
    <Demo>
      {phase === "done" ? (
        <div className="spn-status-ok" role="status">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 8.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Saved
        </div>
      ) : (
        <button
          type="button"
          className="spn-btn"
          disabled={phase === "loading"}
          aria-busy={phase === "loading" || undefined}
          onClick={() => setPhase("loading")}
        >
          {phase === "loading" ? (
            <>
              <Spinner size="sm" announce={false} />
              Saving…
            </>
          ) : (
            "Save settings"
          )}
        </button>
      )}
      {phase === "done" ? (
        <button
          type="button"
          className="spn-btn spn-btn--ghost"
          onClick={() => setPhase("idle")}
        >
          Reset
        </button>
      ) : null}
    </Demo>
  );
}

export function TableRefreshDemo() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!refreshing) return;
    const t = window.setTimeout(() => setRefreshing(false), 2000);
    return () => window.clearTimeout(t);
  }, [refreshing]);

  return (
    <Demo>
      <div className="spn-table-bar">
        <strong>Records</strong>
        {refreshing ? (
          <span className="spn-refresh">
            <Spinner size="sm" announce={false} />
            Refreshing
          </span>
        ) : (
          <button
            type="button"
            className="spn-btn spn-btn--ghost"
            onClick={() => setRefreshing(true)}
          >
            Refresh
          </button>
        )}
      </div>
      <p className="spn-note">
        Background refresh keeps existing content visible — prefer Skeleton for first load.
      </p>
    </Demo>
  );
}

export function CompareDemo() {
  return (
    <div className="spn-compare">
      <div className="spn-compare-card">
        <h3>Spinner</h3>
        <p>
          Active work with unknown percentage — actions, compact waits, background refresh.
        </p>
      </div>
      <div className="spn-compare-card">
        <h3>Progress</h3>
        <p>Measurable completion (upload %, batch counts). Prefer when the number helps.</p>
      </div>
      <div className="spn-compare-card">
        <h3>Skeleton</h3>
        <p>Initial load when layout structure is known — tables, cards, lists, profiles.</p>
      </div>
    </div>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Variants", "default · simple · activity · wave"],
    ["Sizes", "xs 16 · sm 20 · md 24 · lg 32 · xl 40"],
    ["Colour", "currentColor"],
    ["Motion", "CSS keyframes"],
    ["Reduced motion", "Opacity pulse"],
    ["A11y", "role=status · aria-label"],
  ];
  return (
    <div className="spn-specs-grid">
      {rows.map(([label, value]) => (
        <div key={label} className="spn-spec-card">
          <span className="spn-spec-label">{label}</span>
          <span className="spn-spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

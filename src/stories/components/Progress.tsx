/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, { useEffect, useId, useRef, useState } from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import "./Progress.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "default" | "success" | "warning" | "error";

export type ProgressProps = {
  /** Current value. Omit or pass `null` / `undefined` for indeterminate. */
  value?: number | null;
  /** Maximum value (default 100). */
  max?: number;
  /** Minimum value used for percentage math (default 0). */
  min?: number;
  size?: ProgressSize;
  variant?: ProgressVariant;
  className?: string;
  /** Extra class on the fill indicator. */
  indicatorClassName?: string;
  /** Accessible name when no visible label is associated. */
  "aria-label"?: string;
  /** Id of visible labelling element. */
  "aria-labelledby"?: string;
  /** Custom accessible value text, e.g. "65 percent complete". */
  getValueLabel?: (value: number, max: number) => string;
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

export function clampProgress(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function progressPercent(
  value: number | null | undefined,
  min = 0,
  max = 100,
): number | null {
  if (value == null) return null;
  const span = max - min;
  if (span <= 0) return 0;
  const clamped = clampProgress(value, min, max);
  return ((clamped - min) / span) * 100;
}

/* ── Progress ─────────────────────────────────────────────────────────── */

export function Progress({
  value,
  max = 100,
  min = 0,
  size = "md",
  variant = "default",
  className,
  indicatorClassName,
  getValueLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ProgressProps) {
  const indeterminate = value == null;
  const safeMax = max > min ? max : min + 1;
  const pct = progressPercent(value, min, safeMax);
  const clamped =
    value == null ? undefined : clampProgress(value, min, safeMax);

  // Radix expects 0–max with valuemin 0; map custom min into that range.
  const radixValue = indeterminate
    ? null
    : ((clamped as number) - min);

  const radixMax = safeMax - min;
  const translate = indeterminate ? undefined : `translateX(-${100 - (pct ?? 0)}%)`;

  return (
    <RadixProgress.Root
      className={[
        "pg-root",
        `pg-root--${size}`,
        variant !== "default" ? `pg-root--${variant}` : "",
        indeterminate ? "pg-root--indeterminate" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      value={indeterminate ? null : radixValue}
      max={radixMax}
      getValueLabel={
        getValueLabel
          ? (v, m) => getValueLabel(v + min, m + min)
          : indeterminate
            ? undefined
            : (v, m) => `${Math.round((v / m) * 100)}%`
      }
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      <RadixProgress.Indicator
        className={["pg-indicator", indicatorClassName ?? ""].filter(Boolean).join(" ")}
        style={indeterminate ? undefined : { transform: translate }}
      />
    </RadixProgress.Root>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

export const PROGRESS_CODE = `// Progress · supplai Design System
import { Progress } from './Progress';

<Progress value={50} />

// Indeterminate
<Progress value={null} aria-label="Preparing workspace" />

// Built on @radix-ui/react-progress · value / max / size / variant / indicatorClassName
`;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function ProgressPlayground() {
  const [value, setValue] = useState(50);
  const [size, setSize] = useState<ProgressSize>("md");
  const [variant, setVariant] = useState<ProgressVariant>("default");
  const [indeterminate, setIndeterminate] = useState(false);
  const labelId = useId();

  return (
    <div className="pg-play">
      <div className="pg-play-preview">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={labelId}>
              Progress
            </p>
            <p className="pg-percent">
              {indeterminate ? "—" : `${Math.round(value)}%`}
            </p>
          </div>
          <Progress
            value={indeterminate ? null : value}
            size={size}
            variant={variant}
            aria-labelledby={labelId}
          />
        </div>
      </div>
      <div className="pg-play-controls">
        <div className="pg-play-row">
          <span className="pg-play-label">Value</span>
          <input
            className="pg-range"
            type="range"
            min={0}
            max={100}
            step={1}
            value={value}
            disabled={indeterminate}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-label="Progress value"
          />
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Size</span>
          {(["sm", "md", "lg"] as ProgressSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`pg-chip${size === s ? " pg-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Variant</span>
          {(["default", "success", "warning", "error"] as ProgressVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`pg-chip${variant === v ? " pg-chip--on" : ""}`}
              onClick={() => setVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="pg-play-row">
          <span className="pg-play-label">Mode</span>
          <button
            type="button"
            className={`pg-chip${!indeterminate ? " pg-chip--on" : ""}`}
            onClick={() => setIndeterminate(false)}
          >
            determinate
          </button>
          <button
            type="button"
            className={`pg-chip${indeterminate ? " pg-chip--on" : ""}`}
            onClick={() => setIndeterminate(true)}
          >
            indeterminate
          </button>
        </div>
      </div>
    </div>
  );
}

export function BasicDemo() {
  const [value, setValue] = useState(50);
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Progress
            </p>
            <p className="pg-percent">{value}%</p>
          </div>
          <Progress value={value} aria-labelledby={id} />
        </div>
        <input
          className="pg-range"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label="Adjust basic progress"
        />
        <div className="pg-actions">
          {[0, 25, 50, 75, 100].map((n) => (
            <button
              key={n}
              type="button"
              className={`pg-chip${value === n ? " pg-chip--on" : ""}`}
              onClick={() => setValue(n)}
            >
              {n}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PercentageDemo() {
  const value = 64;
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Installing update
            </p>
            <p className="pg-percent">{value}%</p>
          </div>
          <Progress value={value} aria-labelledby={id} />
        </div>
      </div>
    </div>
  );
}

export function LabelDemo() {
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <p className="pg-label" id={id}>
            Uploading documents
          </p>
          <Progress value={45} aria-labelledby={id} />
        </div>
      </div>
    </div>
  );
}

export function LabelPercentDemo() {
  const value = 75;
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Uploading documents
            </p>
            <p className="pg-percent">{value}%</p>
          </div>
          <Progress value={value} aria-labelledby={id} />
        </div>
      </div>
    </div>
  );
}

export function DownloadingDemo() {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [value, setValue] = useState(0);
  const totalFiles = 1247;
  const totalBytes = 2.4 * 1024 * 1024 * 1024;
  const files = Math.min(totalFiles, Math.round((value / 100) * totalFiles));
  const bytes = Math.min(totalBytes, (value / 100) * totalBytes);
  const id = useId();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running || paused) {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
      return;
    }
    timer.current = window.setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setRunning(false);
          return 100;
        }
        return Math.min(100, v + 1 + Math.floor(Math.random() * 2));
      });
    }, 180);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running, paused]);

  return (
    <div className="pg-demo">
      <div className="pg-card">
        <h3 className="pg-card-title">Workspace Setup</h3>
        <p className="pg-card-desc">Setting up your development environment</p>
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Progress
            </p>
            <p className="pg-percent">{Math.round(value)}%</p>
          </div>
          <Progress
            value={value}
            aria-labelledby={id}
            getValueLabel={(v) =>
              `Downloading workspace files, ${Math.round(v)} percent complete`
            }
          />
          <p className="pg-status">
            {value >= 100
              ? "Download complete"
              : paused
                ? "Paused"
                : running
                  ? "Downloading files…"
                  : "Ready to start (simulated)"}
          </p>
        </div>
        <div className="pg-card-meta">
          <div>
            <span className="pg-meta-label">Files processed</span>
            <span className="pg-meta-value">
              {files.toLocaleString()} / {totalFiles.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="pg-meta-label">Size</span>
            <span className="pg-meta-value">
              {formatBytes(bytes)} / {formatBytes(totalBytes)}
            </span>
          </div>
        </div>
        <div className="pg-actions" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            disabled={running && !paused}
            onClick={() => {
              if (value >= 100) setValue(0);
              setPaused(false);
              setRunning(true);
            }}
          >
            {value >= 100 ? "Restart" : "Start download"}
          </button>
          <button
            type="button"
            className="pg-btn"
            disabled={!running || value >= 100}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            className="pg-btn pg-btn--ghost"
            onClick={() => {
              setRunning(false);
              setPaused(false);
              setValue(0);
            }}
          >
            Reset
          </button>
        </div>
        <p className="pg-note" style={{ marginTop: 12 }}>
          Simulated download for Storybook — no network request.
        </p>
      </div>
    </div>
  );
}

type UploadRow = {
  name: string;
  size: number;
  progress: number;
  status: "waiting" | "uploading" | "completed" | "failed";
};

const INITIAL_UPLOADS: UploadRow[] = [
  { name: "Draft_Proposal.pdf", size: 25 * 1024 * 1024, progress: 0, status: "waiting" },
  { name: "Brand_Guidelines.fig", size: 12 * 1024 * 1024, progress: 0, status: "waiting" },
  { name: "fail-sample.zip", size: 8 * 1024 * 1024, progress: 0, status: "waiting" },
];

export function FileUploadProgressDemo() {
  const [files, setFiles] = useState<UploadRow[]>(INITIAL_UPLOADS);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => {
      window.clearInterval(t);
      window.clearTimeout(t);
    });
    timers.current = [];
  };

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => {
        window.clearInterval(t);
        window.clearTimeout(t);
      });
    };
  }, []);

  const start = () => {
    clearTimers();
    const reset = INITIAL_UPLOADS.map((f) => ({ ...f }));
    setFiles(reset);
    reset.forEach((file, index) => {
      const timeoutId = window.setTimeout(() => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "uploading", progress: 0 } : f,
          ),
        );
        const tick = window.setInterval(() => {
          setFiles((prev) =>
            prev.map((f, i) => {
              if (i !== index || f.status !== "uploading") return f;
              const next = Math.min(100, f.progress + 8 + Math.floor(Math.random() * 10));
              if (next >= 100) {
                window.clearInterval(tick);
                if (f.name.includes("fail")) {
                  return { ...f, progress: 72, status: "failed" };
                }
                return { ...f, progress: 100, status: "completed" };
              }
              return { ...f, progress: next };
            }),
          );
        }, 220);
        timers.current.push(tick);
      }, index * 400);
      timers.current.push(timeoutId);
    });
  };

  return (
    <div className="pg-demo">
      <div className="pg-file-list">
        {files.map((f) => {
          const loaded = (f.progress / 100) * f.size;
          const variant: ProgressVariant =
            f.status === "failed"
              ? "error"
              : f.status === "completed"
                ? "success"
                : "default";
          return (
            <div className="pg-file" key={f.name}>
              <div className="pg-field-row">
                <p className="pg-file-name">{f.name}</p>
                <p className="pg-percent">
                  {f.status === "waiting" ? "—" : `${Math.round(f.progress)}%`}
                </p>
              </div>
              <p className="pg-file-meta">
                {formatBytes(loaded)} / {formatBytes(f.size)}
              </p>
              <Progress
                value={f.status === "waiting" ? 0 : f.progress}
                variant={variant}
                size="sm"
                aria-label={`${f.name} upload progress`}
                getValueLabel={(v) =>
                  f.status === "failed"
                    ? `${f.name} upload failed`
                    : `Uploading ${f.name}, ${Math.round(v)} percent complete`
                }
              />
              <p
                className={`pg-status${
                  f.status === "completed"
                    ? " pg-status--success"
                    : f.status === "failed"
                      ? " pg-status--error"
                      : ""
                }`}
              >
                {f.status === "waiting" && "Waiting…"}
                {f.status === "uploading" && "Uploading…"}
                {f.status === "completed" && "Upload complete"}
                {f.status === "failed" && "Upload failed — retry or remove"}
              </p>
            </div>
          );
        })}
        <div className="pg-actions">
          <button type="button" className="pg-btn pg-btn--primary" onClick={start}>
            Simulate uploads
          </button>
        </div>
        <p className="pg-note">
          Storybook simulation only — integrates the Progress component (not a real upload).
        </p>
      </div>
    </div>
  );
}

export function DeterminateDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <p className="pg-status">
          Determinate — known total work. Example: importing records at 65%.
        </p>
        <Progress value={65} aria-label="Importing records" />
      </div>
    </div>
  );
}

export function IndeterminateDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <p className="pg-label">Preparing workspace…</p>
          <Progress value={null} aria-label="Preparing workspace" />
          <p className="pg-status">No percentage — activity without a known total.</p>
        </div>
      </div>
    </div>
  );
}

export function SizesDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        {([
          ["sm", "Small · 4px"],
          ["md", "Medium · 6px"],
          ["lg", "Large · 8px"],
        ] as const).map(([size, label]) => (
          <div className="pg-field" key={size}>
            <p className="pg-label">{label}</p>
            <Progress value={60} size={size} aria-label={label} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ValuesDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        {[0, 25, 50, 75, 100].map((v) => (
          <div className="pg-value-row" key={v}>
            <span className="pg-value-caption">{v}%</span>
            <Progress value={v} aria-label={`${v} percent`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompleteDemo() {
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Upload complete
            </p>
            <p className="pg-percent">100%</p>
          </div>
          <Progress value={100} variant="success" aria-labelledby={id} />
          <p className="pg-status pg-status--success">File uploaded successfully</p>
        </div>
      </div>
    </div>
  );
}

export function SemanticDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label">Storage usage</p>
            <p className="pg-percent">72%</p>
          </div>
          <Progress value={72} aria-label="Storage usage 72 percent" />
          <p className="pg-status">Default / informational</p>
        </div>
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label">Approaching limit</p>
            <p className="pg-percent">85%</p>
          </div>
          <Progress value={85} variant="warning" aria-label="Storage warning 85 percent" />
          <p className="pg-status pg-status--warning">Warning — free up space soon</p>
        </div>
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label">Limit exceeded</p>
            <p className="pg-percent">100%</p>
          </div>
          <Progress value={100} variant="error" aria-label="Storage limit exceeded" />
          <p className="pg-status pg-status--error">Error — quota reached</p>
        </div>
      </div>
    </div>
  );
}

export function CardDemo() {
  const used = 7.2;
  const total = 10;
  const pct = Math.round((used / total) * 100);
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-card">
        <h3 className="pg-card-title">Storage</h3>
        <p className="pg-card-desc">
          {used} GB of {total} GB used
        </p>
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Used capacity
            </p>
            <p className="pg-percent">{pct}%</p>
          </div>
          <Progress
            value={pct}
            variant={pct >= 90 ? "error" : pct >= 75 ? "warning" : "default"}
            aria-labelledby={id}
          />
        </div>
      </div>
    </div>
  );
}

export function MultipleDemo() {
  const items = [
    { name: "Design-system.fig", value: 82 },
    { name: "Research.pdf", value: 52 },
    { name: "Images.zip", value: 100 },
  ];
  return (
    <div className="pg-demo">
      <div className="pg-stack pg-stack--wide">
        <p className="pg-label">Uploading files</p>
        {items.map((item) => (
          <div className="pg-field" key={item.name}>
            <div className="pg-field-row">
              <p className="pg-label">{item.name}</p>
              <p className="pg-percent">{item.value}%</p>
            </div>
            <Progress
              value={item.value}
              size="sm"
              variant={item.value >= 100 ? "success" : "default"}
              aria-label={`${item.name} ${item.value}%`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ControlledDemo() {
  const [value, setValue] = useState(45);
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Progress: {value}%
            </p>
            <p className="pg-percent">{value}%</p>
          </div>
          <Progress value={value} aria-labelledby={id} />
        </div>
        <div className="pg-actions">
          <button
            type="button"
            className="pg-btn"
            onClick={() => setValue((v) => clampProgress(v - 10, 0, 100))}
          >
            −10
          </button>
          <button
            type="button"
            className="pg-btn"
            onClick={() => setValue((v) => clampProgress(v + 10, 0, 100))}
          >
            +10
          </button>
          <button type="button" className="pg-btn" onClick={() => setValue(0)}>
            Reset
          </button>
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            onClick={() => setValue(100)}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}

export function SimulatedDemo() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!running || paused) return;
    const t = window.setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          setRunning(false);
          return 100;
        }
        return v + 1;
      });
    }, 120);
    return () => window.clearInterval(t);
  }, [running, paused]);

  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Simulated task
            </p>
            <p className="pg-percent">{value}%</p>
          </div>
          <Progress value={value} aria-labelledby={id} />
        </div>
        <div className="pg-actions">
          <button
            type="button"
            className="pg-btn pg-btn--primary"
            disabled={running && !paused}
            onClick={() => {
              if (value >= 100) setValue(0);
              setPaused(false);
              setRunning(true);
            }}
          >
            Start
          </button>
          <button
            type="button"
            className="pg-btn"
            disabled={!running || value >= 100}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            className="pg-btn pg-btn--ghost"
            onClick={() => {
              setRunning(false);
              setPaused(false);
              setValue(0);
            }}
          >
            Reset
          </button>
        </div>
        <p className="pg-note">Timer lives in the demo — Progress stays presentational.</p>
      </div>
    </div>
  );
}

export function CustomIndicatorDemo() {
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <p className="pg-status">
          <code>indicatorClassName</code> targets the fill — keep colours within design tokens.
        </p>
        <Progress
          value={55}
          aria-label="Custom indicator"
          indicatorClassName="pg-indicator--demo-gradient"
          className="pg-root--demo"
        />
      </div>
      <style>{`
        .pg-indicator--demo-gradient {
          background: linear-gradient(90deg, #4169E1 0%, #519E8A 100%) !important;
        }
      `}</style>
    </div>
  );
}

export function CustomRangeDemo() {
  const value = 50;
  const min = 0;
  const max = 200;
  const pct = progressPercent(value, min, max);
  const id = useId();
  return (
    <div className="pg-demo">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              Custom range (min 0 · max 200 · value 50)
            </p>
            <p className="pg-percent">{Math.round(pct ?? 0)}%</p>
          </div>
          <Progress value={value} min={min} max={max} aria-labelledby={id} />
          <p className="pg-status">Visible fill = 25% of the track.</p>
        </div>
      </div>
    </div>
  );
}

export function RtlDemo() {
  const id = useId();
  return (
    <div className="pg-demo" dir="rtl">
      <div className="pg-stack">
        <div className="pg-field">
          <div className="pg-field-row">
            <p className="pg-label" id={id}>
              التقدم
            </p>
            <p className="pg-percent">60%</p>
          </div>
          <Progress value={60} className="pg-root--rtl" aria-labelledby={id} />
          <p className="pg-status">RTL container — fill origin follows writing direction.</p>
        </div>
      </div>
    </div>
  );
}

export function CompareDemo() {
  return (
    <div className="pg-demo" style={{ padding: 0, overflow: "auto" }}>
      <table className="pg-compare">
        <thead>
          <tr>
            <th>Component</th>
            <th>Use when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Progress</td>
            <td>Measurable completion (upload, download, import, install).</td>
          </tr>
          <tr>
            <td>Spinner</td>
            <td>Short unknown-duration wait; compact loading cue.</td>
          </tr>
          <tr>
            <td>Skeleton</td>
            <td>Content structure is loading — not task completion.</td>
          </tr>
          <tr>
            <td>Stepper</td>
            <td>Position in a multi-step workflow (stages, not percentage).</td>
          </tr>
          <tr>
            <td>Slider</td>
            <td>User-adjustable value — never use Progress as a control.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="pg-specs-grid">
      <div className="pg-spec-card">
        <span className="pg-spec-label">Heights</span>
        <span className="pg-spec-value">sm 4 · md 6 · lg 8</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Radius</span>
        <span className="pg-spec-value">999px</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Track</span>
        <span className="pg-spec-value">#E2E8F0</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Fill</span>
        <span className="pg-spec-value">Brand Blue</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Motion</span>
        <span className="pg-spec-value">translateX</span>
      </div>
      <div className="pg-spec-card">
        <span className="pg-spec-label">Engine</span>
        <span className="pg-spec-value">@radix-ui/react-progress</span>
      </div>
    </div>
  );
}

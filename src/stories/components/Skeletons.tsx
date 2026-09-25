import React, { useState } from "react";
import "./Skeletons.css";

/* ── Skeleton primitive ───────────────────────────────────────────────── */

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Disable pulse animation */
  animate?: boolean;
  /** Circular shape (avatars) */
  circle?: boolean;
  /** Larger radius (cards / media) */
  rounded?: boolean;
  width?: number | string;
  height?: number | string;
};

export function Skeleton({
  className,
  style,
  animate = true,
  circle = false,
  rounded = false,
  width,
  height,
  "aria-hidden": ariaHidden = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        "sk",
        animate ? "sk--animate" : "",
        circle ? "sk--circle" : "",
        rounded ? "sk--rounded" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: width ?? style?.width,
        height: height ?? style?.height,
        ...style,
      }}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}

export const SKELETON_CODE = `// Skeleton · supplai Design System
import { Skeleton } from './Skeleton';

<Skeleton style={{ width: '100%', height: 16 }} />

// Circle avatar
<Skeleton circle width={40} height={40} />

// Composition — keep layout shift low by matching final sizes
<div className="sk-row">
  <Skeleton circle width={40} height={40} />
  <div className="sk-col">
    <Skeleton width="70%" height={14} />
    <Skeleton width="45%" height={12} />
  </div>
</div>

// CSS pulse · respects prefers-reduced-motion · no JS timers in the primitive
`;

function Demo({
  children,
  stack,
}: {
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <div className={`sk-demo${stack ? " sk-demo--stack" : ""}`}>{children}</div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function SkeletonPlayground() {
  const [w, setW] = useState(240);
  const [h, setH] = useState(16);
  const [circle, setCircle] = useState(false);
  const [animate, setAnimate] = useState(true);

  return (
    <div className="sk-play">
      <div className="sk-play-preview">
        <Skeleton
          width={circle ? h : w}
          height={h}
          circle={circle}
          animate={animate}
        />
      </div>
      <div className="sk-play-controls">
        <div className="sk-play-row">
          <span className="sk-play-label">Width</span>
          {[120, 180, 240, "100%"].map((v) => (
            <button
              key={String(v)}
              type="button"
              className={`sk-chip${w === v || (v === "100%" && w === "100%") ? " sk-chip--on" : ""}`}
              onClick={() => setW(v === "100%" ? "100%" : (v as number))}
            >
              {v === "100%" ? "full" : `${v}px`}
            </button>
          ))}
        </div>
        <div className="sk-play-row">
          <span className="sk-play-label">Height</span>
          {[8, 12, 16, 24, 40].map((v) => (
            <button
              key={v}
              type="button"
              className={`sk-chip${h === v ? " sk-chip--on" : ""}`}
              onClick={() => setH(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="sk-play-row">
          <span className="sk-play-label">Options</span>
          <button
            type="button"
            className={`sk-chip${circle ? " sk-chip--on" : ""}`}
            onClick={() => setCircle((c) => !c)}
          >
            circle
          </button>
          <button
            type="button"
            className={`sk-chip${animate ? " sk-chip--on" : ""}`}
            onClick={() => setAnimate((a) => !a)}
          >
            animate
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <Demo>
      <Skeleton width="100%" height={40} style={{ maxWidth: 320 }} />
    </Demo>
  );
}

export function TextDemo() {
  return (
    <Demo stack>
      <div className="sk-stack">
        <Skeleton width="100%" height={14} />
        <Skeleton width="88%" height={14} />
        <Skeleton width="62%" height={14} />
      </div>
    </Demo>
  );
}

export function HeadingParagraphDemo() {
  return (
    <Demo stack>
      <div className="sk-stack" role="status" aria-busy="true" aria-label="Loading article">
        <Skeleton width="42%" height={22} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="96%" height={14} />
        <Skeleton width="70%" height={14} />
      </div>
    </Demo>
  );
}

export function AvatarDemo() {
  return (
    <Demo>
      <Skeleton circle width={32} height={32} />
      <Skeleton circle width={40} height={40} />
      <Skeleton circle width={48} height={48} />
      <Skeleton circle width={64} height={64} />
    </Demo>
  );
}

export function AvatarTextDemo() {
  return (
    <Demo>
      <div className="sk-row" style={{ width: "100%", maxWidth: 320 }}>
        <Skeleton circle width={40} height={40} />
        <div className="sk-col">
          <Skeleton width="72%" height={14} />
          <Skeleton width="48%" height={12} />
        </div>
      </div>
    </Demo>
  );
}

export function DropdownMenuSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-menu" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <div className="sk-menu-item" key={i}>
            <Skeleton width={16} height={16} rounded />
            <Skeleton width={i === 2 ? "55%" : i === 4 ? "40%" : "78%"} height={12} />
          </div>
        ))}
      </div>
      <p className="sk-note">Composition only — not an interactive menu.</p>
    </Demo>
  );
}

export function TableRowSkeletonDemo() {
  return (
    <Demo stack>
      <table className="sk-table" aria-hidden>
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Name</th>
            <th style={{ width: "38%" }}>Email</th>
            <th style={{ width: "20%" }}>Role</th>
            <th style={{ width: "20%" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Skeleton width="70%" height={12} /></td>
            <td><Skeleton width="85%" height={12} /></td>
            <td><Skeleton width="60%" height={12} /></td>
            <td><Skeleton width="50%" height={12} /></td>
          </tr>
        </tbody>
      </table>
    </Demo>
  );
}

export function MultiColumnTableSkeletonDemo() {
  const rows = [0, 1, 2, 3, 4];
  return (
    <Demo stack>
      <div className="sk-region" role="status" aria-busy="true" aria-label="Loading table data">
        <table className="sk-table" aria-hidden>
          <thead>
            <tr>
              <th style={{ width: "18%" }}>SKU</th>
              <th style={{ width: "34%" }}>Product</th>
              <th style={{ width: "16%" }}>Qty</th>
              <th style={{ width: "16%" }}>Status</th>
              <th style={{ width: "16%" }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <td><Skeleton width="80%" height={12} /></td>
                <td><Skeleton width={r % 2 === 0 ? "90%" : "75%"} height={12} /></td>
                <td><Skeleton width="50%" height={12} /></td>
                <td><Skeleton width="65%" height={12} /></td>
                <td><Skeleton width={24} height={24} rounded /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Demo>
  );
}

export function DividedListSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-list" role="status" aria-busy="true" aria-label="Loading list">
        {[0, 1, 2].map((i) => (
          <div className="sk-list-item" key={i} aria-hidden>
            <Skeleton circle width={36} height={36} />
            <div className="sk-col">
              <Skeleton width={i === 1 ? "62%" : "78%"} height={14} />
              <Skeleton width={i === 2 ? "40%" : "52%"} height={12} />
            </div>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function ThumbnailListSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-list" role="status" aria-busy="true" aria-label="Loading media list">
        {[0, 1, 2].map((i) => (
          <div className="sk-list-item" key={i} aria-hidden>
            <Skeleton className="sk-thumb" width={56} height={56} rounded />
            <div className="sk-col">
              <Skeleton width={i === 1 ? "70%" : "85%"} height={14} />
              <Skeleton width="55%" height={12} />
              <Skeleton width="30%" height={10} />
            </div>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function SocialPostSkeletonDemo() {
  return (
    <Demo>
      <div
        className="sk-post"
        role="status"
        aria-busy="true"
        aria-label="Loading post"
      >
        <div className="sk-row" aria-hidden>
          <Skeleton circle width={40} height={40} />
          <div className="sk-col">
            <Skeleton width="48%" height={14} />
            <Skeleton width="28%" height={12} />
          </div>
        </div>
        <div className="sk-stack sk-stack--tight" style={{ marginTop: 14 }} aria-hidden>
          <Skeleton width="100%" height={14} />
          <Skeleton width="92%" height={14} />
          <Skeleton width="64%" height={14} />
        </div>
        <Skeleton className="sk-media" rounded style={{ marginTop: 14 }} aria-hidden />
        <div className="sk-row" style={{ marginTop: 14 }} aria-hidden>
          <Skeleton width={48} height={12} />
          <Skeleton width={48} height={12} />
          <Skeleton width={48} height={12} />
        </div>
      </div>
    </Demo>
  );
}

export function GallerySkeletonDemo() {
  return (
    <Demo>
      <div
        className="sk-gallery"
        role="status"
        aria-busy="true"
        aria-label="Loading gallery"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="sk-gallery-item" rounded aria-hidden />
        ))}
      </div>
    </Demo>
  );
}

export function CardSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-card" role="status" aria-busy="true" aria-label="Loading card">
        <div className="sk-stack" aria-hidden>
          <Skeleton width="55%" height={16} />
          <Skeleton width="100%" height={12} />
          <Skeleton width="88%" height={12} />
          <Skeleton width="40%" height={32} rounded style={{ marginTop: 8 }} />
        </div>
      </div>
    </Demo>
  );
}

export function DashboardSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-card" style={{ maxWidth: 240 }} role="status" aria-busy="true" aria-label="Loading metric">
        <div className="sk-stack" aria-hidden>
          <Skeleton width="40%" height={12} />
          <Skeleton width="70%" height={28} />
          <Skeleton width="35%" height={12} />
        </div>
      </div>
    </Demo>
  );
}

export function ProfileSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-card" role="status" aria-busy="true" aria-label="Loading profile">
        <div className="sk-row" aria-hidden>
          <Skeleton circle width={64} height={64} />
          <div className="sk-col" style={{ justifyContent: "center" }}>
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
            <Skeleton width="50%" height={12} />
          </div>
        </div>
        <div className="sk-stack" style={{ marginTop: 16 }} aria-hidden>
          <Skeleton width="100%" height={12} />
          <Skeleton width="95%" height={12} />
          <Skeleton width="80%" height={12} />
        </div>
      </div>
    </Demo>
  );
}

export function FormSkeletonDemo() {
  return (
    <Demo>
      <div className="sk-form" role="status" aria-busy="true" aria-label="Loading form">
        {[0, 1].map((i) => (
          <div className="sk-form-field" key={i} aria-hidden>
            <Skeleton width="30%" height={12} />
            <Skeleton width="100%" height={36} />
          </div>
        ))}
        <Skeleton width={120} height={36} rounded aria-hidden />
      </div>
    </Demo>
  );
}

export function ImageSkeletonDemo() {
  return (
    <Demo>
      <div style={{ width: 120 }}>
        <Skeleton width="100%" style={{ aspectRatio: "1" }} rounded />
        <p className="sk-note" style={{ marginTop: 8 }}>1:1</p>
      </div>
      <div style={{ width: 160 }}>
        <Skeleton width="100%" style={{ aspectRatio: "4/3" }} rounded />
        <p className="sk-note" style={{ marginTop: 8 }}>4:3</p>
      </div>
      <div style={{ width: 220 }}>
        <Skeleton width="100%" style={{ aspectRatio: "16/9" }} rounded />
        <p className="sk-note" style={{ marginTop: 8 }}>16:9</p>
      </div>
    </Demo>
  );
}

export function ShapesDemo() {
  return (
    <div className="sk-demo sk-demo--stack">
      <div className="sk-shapes">
        <div className="sk-shape-card">
          <span className="sk-shape-label">Rectangle</span>
          <Skeleton width={80} height={24} style={{ borderRadius: 2 }} />
        </div>
        <div className="sk-shape-card">
          <span className="sk-shape-label">Rounded</span>
          <Skeleton width={80} height={24} rounded />
        </div>
        <div className="sk-shape-card">
          <span className="sk-shape-label">Circle</span>
          <Skeleton circle width={40} height={40} />
        </div>
        <div className="sk-shape-card">
          <span className="sk-shape-label">Short line</span>
          <Skeleton width={48} height={12} />
        </div>
        <div className="sk-shape-card">
          <span className="sk-shape-label">Long line</span>
          <Skeleton width="100%" height={12} />
        </div>
        <div className="sk-shape-card">
          <span className="sk-shape-label">Image</span>
          <Skeleton width={80} height={56} rounded />
        </div>
      </div>
    </div>
  );
}

export function TransitionDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <Demo stack>
      <div className="sk-actions">
        <button
          type="button"
          className={`sk-btn${loading ? " sk-btn--primary" : ""}`}
          onClick={() => setLoading(true)}
        >
          Show loading
        </button>
        <button
          type="button"
          className={`sk-btn${!loading ? " sk-btn--primary" : ""}`}
          onClick={() => setLoading(false)}
        >
          Show content
        </button>
      </div>
      <div
        className="sk-card"
        role={loading ? "status" : undefined}
        aria-busy={loading || undefined}
        aria-label={loading ? "Loading profile card" : undefined}
      >
        {loading ? (
          <div className="sk-row" aria-hidden>
            <Skeleton circle width={40} height={40} />
            <div className="sk-col">
              <Skeleton width="65%" height={14} />
              <Skeleton width="90%" height={12} />
              <Skeleton width="80%" height={12} />
            </div>
          </div>
        ) : (
          <div className="sk-loaded sk-row">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#4169E1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              AW
            </div>
            <div>
              <h3>Alex Wilson</h3>
              <p>Product designer · Auckland warehouse tooling and inventory flows.</p>
            </div>
          </div>
        )}
      </div>
      <p className="sk-note">Toggle to compare Skeleton vs final layout — sizes should stay close.</p>
    </Demo>
  );
}

export function CompareDemo() {
  return (
    <div className="sk-demo" style={{ padding: 0, overflow: "auto" }}>
      <table className="sk-compare">
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Use when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Skeleton</td>
            <td>Layout is known; content is still loading — reduce layout shift.</td>
          </tr>
          <tr>
            <td>Spinner</td>
            <td>Compact unknown wait or an isolated action (save, submit).</td>
          </tr>
          <tr>
            <td>Progress</td>
            <td>Measurable completion (upload %, records processed).</td>
          </tr>
          <tr>
            <td>Empty state</td>
            <td>Loading finished and there is nothing to show.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="sk-specs-grid">
      <div className="sk-spec-card">
        <span className="sk-spec-label">Surface</span>
        <span className="sk-spec-value">#E2E8F0</span>
      </div>
      <div className="sk-spec-card">
        <span className="sk-spec-label">Radius</span>
        <span className="sk-spec-value">6px · 12px · full</span>
      </div>
      <div className="sk-spec-card">
        <span className="sk-spec-label">Motion</span>
        <span className="sk-spec-value">CSS pulse 1.6s</span>
      </div>
      <div className="sk-spec-card">
        <span className="sk-spec-label">Reduced motion</span>
        <span className="sk-spec-value">Static · opacity 0.7</span>
      </div>
      <div className="sk-spec-card">
        <span className="sk-spec-label">A11y</span>
        <span className="sk-spec-value">aria-hidden blocks</span>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import * as RadixHoverCard from "@radix-ui/react-hover-card";
import "./HoverCards.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type HoverCardSide = "top" | "right" | "bottom" | "left";
export type HoverCardAlign = "start" | "center" | "end";

export type HoverCardProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
};

export type HoverCardContentProps = React.ComponentPropsWithoutRef<
  typeof RadixHoverCard.Content
> & {
  width?: number | string;
  showArrow?: boolean;
};

/* ── Primitives ───────────────────────────────────────────────────────── */

export function HoverCard({
  children,
  open,
  defaultOpen,
  onOpenChange,
  openDelay = 200,
  closeDelay = 200,
}: HoverCardProps) {
  return (
    <RadixHoverCard.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      {children}
    </RadixHoverCard.Root>
  );
}

export function HoverCardTrigger({
  children,
  asChild = true,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixHoverCard.Trigger> & {
  asChild?: boolean;
}) {
  return (
    <RadixHoverCard.Trigger asChild={asChild} className={className} {...props}>
      {children}
    </RadixHoverCard.Trigger>
  );
}

export function HoverCardContent({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  width,
  showArrow = true,
  style,
  ...props
}: HoverCardContentProps) {
  return (
    <RadixHoverCard.Portal>
      <RadixHoverCard.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={`hc-content ${className ?? ""}`}
        style={{
          ...(width !== undefined
            ? ({ ["--hc-width" as string]: typeof width === "number" ? `${width}px` : width } as React.CSSProperties)
            : null),
          ...style,
        }}
        {...props}
      >
        {children}
        {showArrow ? <RadixHoverCard.Arrow className="hc-arrow" width={12} height={6} /> : null}
      </RadixHoverCard.Content>
    </RadixHoverCard.Portal>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

function HcAvatar({
  src,
  initials = "?",
  size = "md",
  alt = "",
}: {
  src?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  alt?: string;
}) {
  return (
    <span
      className={`hc-avatar${size === "lg" ? " hc-avatar--lg" : size === "sm" ? " hc-avatar--sm" : ""}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt || initials}
    >
      {src ? <img src={src} alt={alt} /> : initials}
    </span>
  );
}

const DEMO_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces";
const DEMO_THUMB =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=640&h=360&fit=crop";

export const HOVER_CARD_CODE = `// Hover Card · supplai Design System
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';

<HoverCard openDelay={200} closeDelay={200}>
  <HoverCardTrigger asChild>
    <a href="#profile" className="hc-link">@alex</a>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="center">
    <p className="hc-title">Alex Morgan</p>
    <p className="hc-desc">Product designer · Auckland</p>
  </HoverCardContent>
</HoverCard>

// Built on @radix-ui/react-hover-card · openDelay / closeDelay / side / align / open
`;

function DemoShell({
  children,
  tall,
  note,
}: {
  children: React.ReactNode;
  tall?: boolean;
  note?: string;
}) {
  return (
    <div className={`hc-demo${tall ? " hc-demo--tall" : ""}`}>
      {children}
      {note ? <p className="hc-note">{note}</p> : null}
    </div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function HoverCardPlayground() {
  const [side, setSide] = useState<HoverCardSide>("bottom");
  const [align, setAlign] = useState<HoverCardAlign>("center");
  const [openDelay, setOpenDelay] = useState(200);
  const [closeDelay, setCloseDelay] = useState(200);
  const [width, setWidth] = useState(280);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="hc-play">
      <div className="hc-play-preview">
        {disabled ? (
          <span className="hc-link hc-link--disabled" aria-disabled="true">
            Hover Me (disabled)
          </span>
        ) : (
          <HoverCard
            open={open}
            onOpenChange={setOpen}
            openDelay={openDelay}
            closeDelay={closeDelay}
          >
            <HoverCardTrigger asChild>
              <button type="button" className="hc-link">
                Hover Me
              </button>
            </HoverCardTrigger>
            <HoverCardContent side={side} align={align} width={width}>
              <p className="hc-title">Playground card</p>
              <p className="hc-desc">
                {side} · {align} · open {openDelay}ms · close {closeDelay}ms · {width}px
              </p>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      <div className="hc-play-controls">
        <div className="hc-play-row">
          <span className="hc-play-label">Side</span>
          {(["top", "right", "bottom", "left"] as HoverCardSide[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`hc-chip${side === s ? " hc-chip--on" : ""}`}
              onClick={() => setSide(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="hc-play-row">
          <span className="hc-play-label">Align</span>
          {(["start", "center", "end"] as HoverCardAlign[]).map((a) => (
            <button
              key={a}
              type="button"
              className={`hc-chip${align === a ? " hc-chip--on" : ""}`}
              onClick={() => setAlign(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="hc-play-row">
          <span className="hc-play-label">Open delay</span>
          {[0, 200, 700].map((d) => (
            <button
              key={d}
              type="button"
              className={`hc-chip${openDelay === d ? " hc-chip--on" : ""}`}
              onClick={() => setOpenDelay(d)}
            >
              {d}ms
            </button>
          ))}
        </div>
        <div className="hc-play-row">
          <span className="hc-play-label">Close delay</span>
          {[0, 200, 500].map((d) => (
            <button
              key={d}
              type="button"
              className={`hc-chip${closeDelay === d ? " hc-chip--on" : ""}`}
              onClick={() => setCloseDelay(d)}
            >
              {d}ms
            </button>
          ))}
        </div>
        <div className="hc-play-row">
          <span className="hc-play-label">Width</span>
          {[240, 280, 360].map((w) => (
            <button
              key={w}
              type="button"
              className={`hc-chip${width === w ? " hc-chip--on" : ""}`}
              onClick={() => setWidth(w)}
            >
              {w}px
            </button>
          ))}
        </div>
        <div className="hc-play-row">
          <span className="hc-play-label">Options</span>
          <button
            type="button"
            className={`hc-chip${disabled ? " hc-chip--on" : ""}`}
            onClick={() => {
              setDisabled((v) => !v);
              setOpen(false);
            }}
          >
            Disabled
          </button>
          <span className="hc-state">open: {String(open)}</span>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <DemoShell note="Hover the link — card stays open while you move into it.">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#default" className="hc-link" onClick={(e) => e.preventDefault()}>
            Hover Me
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="hc-title">Hello! I am a hover card.</p>
          <p className="hc-desc">
            Richer than a tooltip — useful for short previews without a click.
          </p>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function ProfileDemo() {
  return (
    <DemoShell tall>
      <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
        Message from{" "}
        <HoverCard openDelay={150} closeDelay={250}>
          <HoverCardTrigger asChild>
            <a href="#alex" className="hc-link" onClick={(e) => e.preventDefault()}>
              @alex.morgan
            </a>
          </HoverCardTrigger>
          <HoverCardContent width={300}>
            <div className="hc-profile">
              <HcAvatar src={DEMO_AVATAR} alt="Alex Morgan" size="lg" />
              <div className="hc-profile-body">
                <p className="hc-profile-name">Alex Morgan</p>
                <p className="hc-profile-handle">@alex.morgan · Product Design</p>
                <p className="hc-profile-bio">
                  Designs procurement flows for supplai. Based in Auckland. Coffee enthusiast.
                </p>
                <div className="hc-profile-stats">
                  <span>Team Design</span>
                  <span>Joined Mar 2023</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </p>
    </DemoShell>
  );
}

export function AvatarTriggerDemo() {
  return (
    <DemoShell>
      <HoverCard>
        <HoverCardTrigger asChild>
          <button type="button" className="hc-avatar-trigger" aria-label="Alex Morgan profile">
            <HcAvatar src={DEMO_AVATAR} alt="" size="md" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" width={260}>
          <div className="hc-profile">
            <HcAvatar src={DEMO_AVATAR} alt="" size="sm" />
            <div className="hc-profile-body">
              <p className="hc-profile-name">Alex Morgan</p>
              <p className="hc-profile-handle">Online · Design</p>
              <p className="hc-profile-bio">Hover the avatar to preview the profile.</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function LinkPreviewDemo() {
  return (
    <DemoShell tall>
      <p style={{ margin: 0, fontSize: 14, color: "#374151", maxWidth: 420, textAlign: "center" }}>
        Read the{" "}
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href="https://example.com/docs/supply-chain"
              className="hc-link"
              onClick={(e) => e.preventDefault()}
            >
              Supply chain guide
            </a>
          </HoverCardTrigger>
          <HoverCardContent width={300}>
            <img className="hc-thumb" src={DEMO_THUMB} alt="" />
            <p className="hc-title">Supply chain guide</p>
            <p className="hc-desc">
              How teams track POs, shipments, and exceptions across suppliers.
            </p>
            <p className="hc-meta">Docs · 8 min read</p>
          </HoverCardContent>
        </HoverCard>{" "}
        before onboarding a new vendor.
      </p>
    </DemoShell>
  );
}

export function RichContentDemo() {
  return (
    <DemoShell tall>
      <HoverCard closeDelay={300}>
        <HoverCardTrigger asChild>
          <a href="#shipment" className="hc-link" onClick={(e) => e.preventDefault()}>
            Shipment #4821
          </a>
        </HoverCardTrigger>
        <HoverCardContent width={320}>
          <p className="hc-title">Shipment #4821</p>
          <p className="hc-desc">In transit · Auckland → Wellington · ETA Fri 14:00</p>
          <div className="hc-profile-stats">
            <span>Carrier: NZ Couriers</span>
            <span>12 line items</span>
          </div>
          <div className="hc-actions">
            <a
              className="hc-btn hc-btn--primary"
              href="#track"
              onClick={(e) => e.preventDefault()}
            >
              Track
            </a>
            <a className="hc-btn" href="#details" onClick={(e) => e.preventDefault()}>
              Details
            </a>
          </div>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function ClickableLinksDemo() {
  return (
    <DemoShell
      tall
      note="Move into the card and activate a link — closeDelay keeps it open. Prefer Popover for forms or persistent UI."
    >
      <HoverCard closeDelay={400}>
        <HoverCardTrigger asChild>
          <button type="button" className="hc-link">
            Related resources
          </button>
        </HoverCardTrigger>
        <HoverCardContent width={280}>
          <p className="hc-title">Related resources</p>
          <p className="hc-desc">Links stay reachable while the pointer is over the card.</p>
          <div className="hc-actions">
            <a
              className="hc-btn hc-btn--primary"
              href="https://example.com/api"
              target="_blank"
              rel="noreferrer"
            >
              API docs
            </a>
            <a
              className="hc-btn"
              href="https://example.com/changelog"
              target="_blank"
              rel="noreferrer"
            >
              Changelog
            </a>
          </div>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function PlacementDemo() {
  const sides: HoverCardSide[] = ["top", "right", "bottom", "left"];
  return (
    <DemoShell tall>
      {sides.map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              {side}
            </button>
          </HoverCardTrigger>
          <HoverCardContent side={side}>
            <p className="hc-title">Side: {side}</p>
            <p className="hc-desc">Collision handling flips when space runs out.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </DemoShell>
  );
}

export function AlignmentDemo() {
  const aligns: HoverCardAlign[] = ["start", "center", "end"];
  return (
    <DemoShell tall>
      {aligns.map((align) => (
        <HoverCard key={align}>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              align {align}
            </button>
          </HoverCardTrigger>
          <HoverCardContent side="bottom" align={align} width={220}>
            <p className="hc-title">Align {align}</p>
            <p className="hc-desc">Relative to the trigger edge.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </DemoShell>
  );
}

export function OpenDelayDemo() {
  return (
    <DemoShell note="Compare timing — rapid sweeps should not flash every card.">
      {[
        { d: 0, label: "Immediate (0ms)" },
        { d: 200, label: "Short (200ms)" },
        { d: 700, label: "Long (700ms)" },
      ].map(({ d, label }) => (
        <HoverCard key={d} openDelay={d} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              {label}
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="hc-title">openDelay={d}</p>
            <p className="hc-desc">Real delay from Radix Hover Card.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </DemoShell>
  );
}

export function CloseDelayDemo() {
  return (
    <DemoShell note="Higher closeDelay makes it easier to reach the card from the trigger.">
      {[
        { d: 0, label: "Close 0ms" },
        { d: 200, label: "Close 200ms" },
        { d: 500, label: "Close 500ms" },
      ].map(({ d, label }) => (
        <HoverCard key={d} openDelay={100} closeDelay={d}>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              {label}
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="hc-title">closeDelay={d}</p>
            <p className="hc-desc">Move into this card before it disappears.</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </DemoShell>
  );
}

export function CustomWidthDemo() {
  return (
    <DemoShell>
      <HoverCard>
        <HoverCardTrigger asChild>
          <button type="button" className="hc-link">
            Narrow (240px)
          </button>
        </HoverCardTrigger>
        <HoverCardContent width={240}>
          <p className="hc-title">Narrow card</p>
          <p className="hc-desc">Uses --hc-width with max-width clamp for small viewports.</p>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <button type="button" className="hc-link">
            Wide (360px)
          </button>
        </HoverCardTrigger>
        <HoverCardContent width={360}>
          <p className="hc-title">Wide card</p>
          <p className="hc-desc">
            More room for metadata, avatars, and short paragraphs without feeling like a dialog.
          </p>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <HoverCard open={open} onOpenChange={setOpen} openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              Controlled trigger
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="hc-title">Controlled</p>
            <p className="hc-desc">Parent owns open / onOpenChange.</p>
          </HoverCardContent>
        </HoverCard>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="hc-btn" onClick={() => setOpen(true)}>
            Open
          </button>
          <button type="button" className="hc-btn" onClick={() => setOpen(false)}>
            Close
          </button>
          <span className="hc-state">open: {String(open)}</span>
        </div>
      </div>
    </DemoShell>
  );
}

export function DisabledDemo() {
  return (
    <DemoShell note="Disabled trigger is not wrapped in HoverCardTrigger — it cannot open.">
      <span className="hc-link hc-link--disabled" aria-disabled="true">
        Unavailable profile
      </span>
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#ok" className="hc-link" onClick={(e) => e.preventDefault()}>
            Available profile
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="hc-title">Available</p>
          <p className="hc-desc">This one opens normally.</p>
        </HoverCardContent>
      </HoverCard>
    </DemoShell>
  );
}

export function ScrollContainerDemo() {
  return (
    <div className="hc-demo hc-demo--scroll">
      <div className="hc-scroll-inner">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button type="button" className="hc-link">
              Hover inside scroll area
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="hc-title">Portaled content</p>
            <p className="hc-desc">
              Rendered in a portal so it is not clipped by overflow:auto. Scroll the box and
              reopen near edges to see collision handling.
            </p>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}

export function CombinedDemo() {
  return <HoverCardPlayground />;
}

export function CompareDemo() {
  return (
    <div className="hc-compare">
      <div className="hc-compare-card">
        <h3>Tooltip</h3>
        <p>Brief label or hint — no interactive content. Keep under ~60 characters.</p>
      </div>
      <div className="hc-compare-card">
        <h3>Hover Card</h3>
        <p>Richer previews (profiles, links). Pointer can move into the card; not for forms.</p>
      </div>
      <div className="hc-compare-card">
        <h3>Popover</h3>
        <p>Click-activated, persistent UI — menus, filters, short forms.</p>
      </div>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="hc-specs-grid">
      <div className="hc-spec-card">
        <span className="hc-spec-label">Surface</span>
        <span className="hc-spec-value">#FFFFFF · 12px</span>
      </div>
      <div className="hc-spec-card">
        <span className="hc-spec-label">Shadow</span>
        <span className="hc-spec-value">Floating menu elevation</span>
      </div>
      <div className="hc-spec-card">
        <span className="hc-spec-label">Default width</span>
        <span className="hc-spec-value">280px</span>
      </div>
      <div className="hc-spec-card">
        <span className="hc-spec-label">Offset</span>
        <span className="hc-spec-value">8px</span>
      </div>
      <div className="hc-spec-card">
        <span className="hc-spec-label">Delays</span>
        <span className="hc-spec-value">open/close 200ms</span>
      </div>
      <div className="hc-spec-card">
        <span className="hc-spec-label">Engine</span>
        <span className="hc-spec-value">Radix Hover Card</span>
      </div>
    </div>
  );
}

import React, { useId, useState } from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import "./Calendars.css";
import "./Popovers.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

export type PopoverProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, interacts with outside content are blocked (Radix modal). */
  modal?: boolean;
};

export type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof RadixPopover.Content
> & {
  width?: number | string;
  showArrow?: boolean;
};

/* ── Primitives ───────────────────────────────────────────────────────── */

export function Popover({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
}: PopoverProps) {
  return (
    <RadixPopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      {children}
    </RadixPopover.Root>
  );
}

export function PopoverTrigger({
  children,
  asChild = true,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixPopover.Trigger> & {
  asChild?: boolean;
}) {
  return (
    <RadixPopover.Trigger asChild={asChild} className={className} {...props}>
      {children}
    </RadixPopover.Trigger>
  );
}

export function PopoverAnchor({
  children,
  asChild = true,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixPopover.Anchor> & {
  asChild?: boolean;
}) {
  return (
    <RadixPopover.Anchor asChild={asChild} {...props}>
      {children}
    </RadixPopover.Anchor>
  );
}

export function PopoverClose({
  children,
  asChild = false,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixPopover.Close> & {
  asChild?: boolean;
}) {
  return (
    <RadixPopover.Close asChild={asChild} className={className} {...props}>
      {children}
    </RadixPopover.Close>
  );
}

export function PopoverContent({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  avoidCollisions = true,
  width,
  showArrow = false,
  style,
  ...props
}: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        avoidCollisions={avoidCollisions}
        className={`po-content ${className ?? ""}`}
        style={{
          ...(width !== undefined
            ? ({
                ["--po-width" as string]:
                  typeof width === "number" ? `${width}px` : width,
              } as React.CSSProperties)
            : null),
          ...style,
        }}
        {...props}
      >
        {children}
        {showArrow ? (
          <RadixPopover.Arrow className="po-arrow" width={12} height={6} />
        ) : null}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M3 3l8 8M11 3L3 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.86-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.56 1.7 1.7 0 0 0-1.86.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.86 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1 1.7 1.7 0 0 0-.34-1.86l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.86.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.86-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.86V9c0 .69.4 1.3 1 1.56H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEMO_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces";
const DEMO_THUMB =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=640&h=360&fit=crop";

const EMOJI_LIGHT = [
  "😀",
  "😊",
  "😍",
  "🤔",
  "😎",
  "🥳",
  "😢",
  "😡",
  "👍",
  "👎",
  "👏",
  "🙌",
  "❤️",
  "🔥",
  "✅",
  "🎉",
  "📦",
  "🚚",
  "⭐",
  "💡",
  "📌",
  "🔔",
  "📎",
  "🗂️",
];

const EMOJI_CATEGORIES: Record<string, string[]> = {
  Smileys: ["😀", "😊", "😍", "🤔", "😎", "🥳", "😢", "😡", "😴", "🤯"],
  Gestures: ["👍", "👎", "👏", "🙌", "🤝", "✌️", "👋", "💪"],
  Objects: ["📦", "🚚", "⭐", "💡", "📌", "🔔", "📎", "🗂️", "📅", "✉️"],
  Symbols: ["❤️", "🔥", "✅", "🎉", "❗", "❓", "💯", "✨"],
};

export const POPOVER_CODE = `// Popover · supplai Design System
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover';

<Popover>
  <PopoverTrigger asChild>
    <button type="button">Open</button>
  </PopoverTrigger>
  <PopoverContent side="bottom" align="center" sideOffset={8}>
    <p className="po-title">Dimensions</p>
    <p className="po-desc">Set the dimensions for the layer.</p>
    <PopoverClose aria-label="Close">×</PopoverClose>
  </PopoverContent>
</Popover>

// Built on @radix-ui/react-popover · open / modal / side / align / sideOffset
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
    <div className={`po-demo${tall ? " po-demo--tall" : ""}`}>
      {children}
      {note ? <p className="po-note">{note}</p> : null}
    </div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function PopoverPlayground() {
  const [side, setSide] = useState<PopoverSide>("bottom");
  const [align, setAlign] = useState<PopoverAlign>("center");
  const [sideOffset, setSideOffset] = useState(8);
  const [width, setWidth] = useState(288);
  const [modal, setModal] = useState(false);
  const [avoid, setAvoid] = useState(true);
  const [open, setOpen] = useState(false);

  return (
    <div className="po-play">
      <div className="po-play-preview">
        <Popover open={open} onOpenChange={setOpen} modal={modal}>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn po-btn--primary">
              Open Popover
            </button>
          </PopoverTrigger>
          <PopoverContent
            side={side}
            align={align}
            sideOffset={sideOffset}
            avoidCollisions={avoid}
            width={width}
          >
            <p className="po-title">Playground</p>
            <p className="po-desc">
              {side} · {align} · offset {sideOffset}px · {width}px
              {modal ? " · modal" : ""} · collisions {avoid ? "on" : "off"}
            </p>
          </PopoverContent>
        </Popover>
        <span className="po-meta">open: {String(open)}</span>
      </div>
      <div className="po-play-controls">
        <div className="po-play-row">
          <span className="po-play-label">Side</span>
          {(["top", "right", "bottom", "left"] as PopoverSide[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`po-chip${side === s ? " po-chip--on" : ""}`}
              onClick={() => setSide(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="po-play-row">
          <span className="po-play-label">Align</span>
          {(["start", "center", "end"] as PopoverAlign[]).map((a) => (
            <button
              key={a}
              type="button"
              className={`po-chip${align === a ? " po-chip--on" : ""}`}
              onClick={() => setAlign(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="po-play-row">
          <span className="po-play-label">Side offset</span>
          {[0, 4, 8, 16, 24].map((n) => (
            <button
              key={n}
              type="button"
              className={`po-chip${sideOffset === n ? " po-chip--on" : ""}`}
              onClick={() => setSideOffset(n)}
            >
              {n}px
            </button>
          ))}
        </div>
        <div className="po-play-row">
          <span className="po-play-label">Width</span>
          {[220, 288, 360].map((n) => (
            <button
              key={n}
              type="button"
              className={`po-chip${width === n ? " po-chip--on" : ""}`}
              onClick={() => setWidth(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="po-play-row">
          <span className="po-play-label">Options</span>
          <button
            type="button"
            className={`po-chip${modal ? " po-chip--on" : ""}`}
            onClick={() => setModal((v) => !v)}
          >
            modal
          </button>
          <button
            type="button"
            className={`po-chip${avoid ? " po-chip--on" : ""}`}
            onClick={() => setAvoid((v) => !v)}
          >
            collision
          </button>
          <button
            type="button"
            className={`po-chip${open ? " po-chip--on" : ""}`}
            onClick={() => setOpen((v) => !v)}
          >
            toggle open
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Open Popover
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="po-title">Dimensions</p>
          <p className="po-desc">
            Set width, height, and alignment for this layer. Interactive content
            stays available until you dismiss.
          </p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function PlacementDemo() {
  return (
    <DemoShell tall>
      {(["top", "right", "bottom", "left"] as PopoverSide[]).map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn">
              {side}
            </button>
          </PopoverTrigger>
          <PopoverContent side={side}>
            <p className="po-title">Side: {side}</p>
            <p className="po-desc">Flips when space is tight.</p>
          </PopoverContent>
        </Popover>
      ))}
    </DemoShell>
  );
}

export function AlignmentDemo() {
  return (
    <DemoShell tall>
      {(["start", "center", "end"] as PopoverAlign[]).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn" style={{ minWidth: 140 }}>
              Align {align}
            </button>
          </PopoverTrigger>
          <PopoverContent align={align} side="bottom">
            <p className="po-title">Align: {align}</p>
            <p className="po-desc">Relative to the wider trigger.</p>
          </PopoverContent>
        </Popover>
      ))}
    </DemoShell>
  );
}

export function OffsetDemo() {
  const [offset, setOffset] = useState(8);
  return (
    <DemoShell tall note={`sideOffset = ${offset}px`}>
      <div className="po-play-row" style={{ width: "100%", justifyContent: "center" }}>
        {[0, 4, 8, 16, 32].map((n) => (
          <button
            key={n}
            type="button"
            className={`po-chip${offset === n ? " po-chip--on" : ""}`}
            onClick={() => setOffset(n)}
          >
            {n}px
          </button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn po-btn--primary">
            Offset demo
          </button>
        </PopoverTrigger>
        <PopoverContent sideOffset={offset}>
          <p className="po-title">Custom offset</p>
          <p className="po-desc">Spacing from the trigger edge.</p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function TriggersDemo() {
  return (
    <DemoShell tall>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Text button
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="po-title">Text trigger</p>
          <p className="po-desc">Standard button via asChild.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-icon-btn" aria-label="Settings">
            <SettingsIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent width={240}>
          <p className="po-title">Icon trigger</p>
          <p className="po-desc">Icon button with accessible name.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-avatar-trigger" aria-label="Alex Morgan profile">
            <span className="po-avatar">
              <img src={DEMO_AVATAR} alt="" />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="po-rich-row">
            <span className="po-avatar">
              <img src={DEMO_AVATAR} alt="" />
            </span>
            <div>
              <p className="po-title">Alex Morgan</p>
              <p className="po-desc">Product designer · Auckland</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <a href="#settings" className="po-btn" onClick={(e) => e.preventDefault()}>
            Custom link
          </a>
        </PopoverTrigger>
        <PopoverContent>
          <p className="po-title">Custom trigger</p>
          <p className="po-desc">Any focusable element with asChild.</p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function RichContentDemo() {
  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Shipment details
          </button>
        </PopoverTrigger>
        <PopoverContent width={320}>
          <div className="po-rich">
            <img className="po-thumb" src={DEMO_THUMB} alt="" />
            <div>
              <p className="po-title">PO-48291 · Auckland DC</p>
              <p className="po-desc">
                Out for delivery. Expected window 2:00–4:00 PM NZST.
              </p>
              <p className="po-meta">Carrier · supplai Logistics</p>
            </div>
            <div className="po-actions" style={{ marginTop: 0 }}>
              <button type="button" className="po-btn po-btn--ghost">
                Track
              </button>
              <button type="button" className="po-btn po-btn--primary">
                Share
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function FormDemo() {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("25px");
  const [status, setStatus] = useState("");
  const wId = useId();
  const hId = useId();

  return (
    <DemoShell>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Edit dimensions
          </button>
        </PopoverTrigger>
        <PopoverContent width={300} onOpenAutoFocus={(e) => e.preventDefault()}>
          <p className="po-title">Dimensions</p>
          <p className="po-desc">Set the dimensions for the layer.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!width.trim() || !height.trim()) {
                setStatus("Both fields are required.");
                return;
              }
              setStatus(`Saved ${width} × ${height}.`);
              setOpen(false);
            }}
          >
            <div className="po-field">
              <label className="po-label" htmlFor={wId}>
                Width
              </label>
              <input
                id={wId}
                className="po-input"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="po-field">
              <label className="po-label" htmlFor={hId}>
                Height
              </label>
              <input
                id={hId}
                className="po-input"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                autoComplete="off"
              />
            </div>
            {status ? (
              <p
                className={`po-hint${status.startsWith("Saved") ? " po-hint--success" : " po-hint--error"}`}
                role="status"
              >
                {status}
              </p>
            ) : null}
            <div className="po-actions">
              <PopoverClose asChild>
                <button type="button" className="po-btn po-btn--ghost">
                  Cancel
                </button>
              </PopoverClose>
              <button type="submit" className="po-btn po-btn--primary">
                Save
              </button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function InteractiveControlsDemo() {
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(false);
  const [channel, setChannel] = useState("email");
  const [priority, setPriority] = useState("normal");
  const [volume, setVolume] = useState(40);

  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Notification prefs
          </button>
        </PopoverTrigger>
        <PopoverContent width={300}>
          <p className="po-title">Preferences</p>
          <p className="po-desc">Controls keep state while the popover is open.</p>
          <div className="po-control-list">
            <label className="po-check">
              <input
                type="checkbox"
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
              Push notifications
            </label>
            <div className="po-switch">
              <span>Weekly digest</span>
              <button
                type="button"
                className="po-switch-track"
                data-on={digest}
                role="switch"
                aria-checked={digest}
                onClick={() => setDigest((v) => !v)}
              >
                <span className="po-switch-thumb" />
              </button>
            </div>
            <label className="po-radio">
              <input
                type="radio"
                name="po-channel"
                checked={channel === "email"}
                onChange={() => setChannel("email")}
              />
              Email
            </label>
            <label className="po-radio">
              <input
                type="radio"
                name="po-channel"
                checked={channel === "sms"}
                onChange={() => setChannel("sms")}
              />
              SMS
            </label>
            <div className="po-field" style={{ marginTop: 0 }}>
              <label className="po-label" htmlFor="po-priority">
                Priority
              </label>
              <select
                id="po-priority"
                className="po-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="po-field" style={{ marginTop: 0 }}>
              <label className="po-label" htmlFor="po-volume">
                Volume · {volume}
              </label>
              <input
                id="po-volume"
                className="po-slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function EmojiLightDemo() {
  const [picked, setPicked] = useState("😊");
  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn" aria-label="Pick emoji">
            {picked} Add reaction
          </button>
        </PopoverTrigger>
        <PopoverContent width={280}>
          <p className="po-title">Quick reactions</p>
          <p className="po-desc">Lightweight grid — no extra package.</p>
          <div className="po-emoji-grid" role="listbox" aria-label="Emojis">
            {EMOJI_LIGHT.map((e) => (
              <PopoverClose key={e} asChild>
                <button
                  type="button"
                  className="po-emoji-btn"
                  data-selected={picked === e}
                  role="option"
                  aria-selected={picked === e}
                  onClick={() => setPicked(e)}
                >
                  {e}
                </button>
              </PopoverClose>
            ))}
          </div>
          <p className="po-picked">Selected: {picked}</p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function EmojiExpandedDemo() {
  const [cat, setCat] = useState("Smileys");
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState("");
  const list = (EMOJI_CATEGORIES[cat] ?? []).filter(
    (e) => !q || e.includes(q) || cat.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            {picked || "🙂"} Browse emoji
          </button>
        </PopoverTrigger>
        <PopoverContent width={300}>
          <p className="po-title">Emoji picker</p>
          <p className="po-desc">Categories + search (demo, no emoji-mart).</p>
          <input
            className="po-input po-emoji-search"
            type="search"
            placeholder="Filter category…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filter emoji categories"
          />
          <div className="po-emoji-cats">
            {Object.keys(EMOJI_CATEGORIES).map((c) => (
              <button
                key={c}
                type="button"
                className={`po-chip${cat === c ? " po-chip--on" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="po-emoji-grid" role="listbox" aria-label={cat}>
            {list.map((e) => (
              <button
                key={e}
                type="button"
                className="po-emoji-btn"
                data-selected={picked === e}
                role="option"
                aria-selected={picked === e}
                onClick={() => setPicked(e)}
              >
                {e}
              </button>
            ))}
          </div>
          {picked ? <p className="po-picked">Selected: {picked}</p> : null}
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function CalendarDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  return (
    <DemoShell tall>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            {selected ? format(selected, "PPP") : "Pick a date"}
          </button>
        </PopoverTrigger>
        <PopoverContent width={320} className="po-cal-wrap" align="start">
          <div className="cld-shell">
            <DayPicker
              animate
              navLayout="around"
              showOutsideDays
              mode="single"
              selected={selected}
              onSelect={(d) => {
                setSelected(d);
                if (d) setOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell>
      <button type="button" className="po-btn po-btn--ghost" onClick={() => setOpen(true)}>
        Open externally
      </button>
      <button type="button" className="po-btn po-btn--ghost" onClick={() => setOpen(false)}>
        Close externally
      </button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn po-btn--primary">
            Controlled trigger
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="po-title">Controlled</p>
          <p className="po-desc">open={String(open)} — synced with external buttons.</p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function CloseButtonDemo() {
  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            With close
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="po-content-head">
            <p className="po-title">Share link</p>
            <PopoverClose className="po-close" aria-label="Close">
              <CloseIcon />
            </PopoverClose>
          </div>
          <p className="po-desc">Explicit dismiss via PopoverClose.</p>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function DismissalDemo() {
  const [lockOutside, setLockOutside] = useState(false);
  return (
    <DemoShell tall note="Toggle “lock outside” to keep open on outside click (Escape still works).">
      <button
        type="button"
        className={`po-chip${lockOutside ? " po-chip--on" : ""}`}
        onClick={() => setLockOutside((v) => !v)}
      >
        lock outside click
      </button>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Dismissal options
          </button>
        </PopoverTrigger>
        <PopoverContent
          onPointerDownOutside={
            lockOutside
              ? (e) => {
                  e.preventDefault();
                }
              : undefined
          }
          onInteractOutside={
            lockOutside
              ? (e) => {
                  e.preventDefault();
                }
              : undefined
          }
        >
          <div className="po-content-head">
            <p className="po-title">Stay focused</p>
            <PopoverClose className="po-close" aria-label="Close">
              <CloseIcon />
            </PopoverClose>
          </div>
          <p className="po-desc">
            Outside click {lockOutside ? "blocked" : "closes"} · Escape closes · Close button
            closes.
          </p>
          <label className="po-check" style={{ marginTop: 10 }}>
            <input type="checkbox" defaultChecked />
            Internal interaction does not dismiss
          </label>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function ScrollableDemo() {
  return (
    <DemoShell>
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn">
            Long content
          </button>
        </PopoverTrigger>
        <PopoverContent width={300}>
          <p className="po-title">Release notes</p>
          <div className="po-scroll-body">
            {Array.from({ length: 8 }, (_, i) => (
              <p key={i}>
                Update {i + 1}: Improved inventory sync, faster pick-lists, and clearer exception
                messaging for warehouse operators.
              </p>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function CustomWidthDemo() {
  return (
    <DemoShell>
      {[220, 288, 360].map((w) => (
        <Popover key={w}>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn">
              {w}px
            </button>
          </PopoverTrigger>
          <PopoverContent width={w}>
            <p className="po-title">Width {w}</p>
            <p className="po-desc">
              Compact and wider layouts share the same surface tokens and padding.
            </p>
          </PopoverContent>
        </Popover>
      ))}
    </DemoShell>
  );
}

export function DialogNestDemo() {
  return (
    <div className="po-demo">
      <div className="po-dialog-backdrop">
        <div className="po-dialog" role="dialog" aria-labelledby="po-dialog-title">
          <p className="po-dialog-title" id="po-dialog-title">
            Project settings
          </p>
          <p className="po-dialog-body">
            Open a Popover from inside this dialog. Dismissing the Popover should leave the dialog
            open.
          </p>
          <Popover modal>
            <PopoverTrigger asChild>
              <button type="button" className="po-btn">
                More options
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="po-title">Nested popover</p>
              <p className="po-desc">Portaled above dialog chrome · Escape closes popover first.</p>
              <PopoverClose asChild>
                <button type="button" className="po-btn po-btn--primary" style={{ marginTop: 12 }}>
                  Done
                </button>
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <div className="po-dialog-actions">
            <button type="button" className="po-btn po-btn--ghost">
              Cancel
            </button>
            <button type="button" className="po-btn po-btn--primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrollContainerDemo() {
  return (
    <div className="po-demo po-demo--scroll">
      <div className="po-scroll-inner">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn po-btn--primary">
              Open in scroll area
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="po-title">Portaled content</p>
            <p className="po-desc">Not clipped by parent overflow — scroll the container.</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function ResponsiveDemo() {
  return (
    <DemoShell note="Resize the Storybook viewport — content clamps to viewport width.">
      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="po-btn po-responsive">
            Responsive popover
          </button>
        </PopoverTrigger>
        <PopoverContent width="min(360px, calc(100vw - 32px))" className="po-responsive">
          <p className="po-title">Fits the screen</p>
          <p className="po-desc">
            Placement adapts with collision handling. Controls stay tappable on touch devices.
          </p>
          <div className="po-actions">
            <PopoverClose asChild>
              <button type="button" className="po-btn po-btn--primary">
                Got it
              </button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </DemoShell>
  );
}

export function AnchorDemo() {
  return (
    <DemoShell tall note="Trigger is separate from the anchor box used for positioning.">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <Popover>
          <PopoverAnchor asChild>
            <div
              style={{
                width: 160,
                height: 48,
                borderRadius: 8,
                border: "1px dashed #CBD5E1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748B",
              }}
            >
              Anchor
            </div>
          </PopoverAnchor>
          <PopoverTrigger asChild>
            <button type="button" className="po-btn">
              Open near anchor
            </button>
          </PopoverTrigger>
          <PopoverContent side="top">
            <p className="po-title">PopoverAnchor</p>
            <p className="po-desc">Positions against the anchor, not the trigger.</p>
          </PopoverContent>
        </Popover>
      </div>
    </DemoShell>
  );
}

export function CompareDemo() {
  return (
    <div className="po-demo" style={{ display: "block", padding: 0, overflow: "auto" }}>
      <table className="po-compare">
        <thead>
          <tr>
            <th>Component</th>
            <th>Use when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Popover</td>
            <td>Click-activated interactive content (forms, pickers, settings).</td>
          </tr>
          <tr>
            <td>Tooltip</td>
            <td>Short non-interactive hints.</td>
          </tr>
          <tr>
            <td>Hover Card</td>
            <td>Richer previews on hover/focus without a durable modal session.</td>
          </tr>
          <tr>
            <td>Dropdown Menu</td>
            <td>Structured lists of actions or commands.</td>
          </tr>
          <tr>
            <td>Dialog</td>
            <td>Focused workflows that need more space or modality.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="po-specs-grid">
      <div className="po-spec-card">
        <span className="po-spec-label">Radius</span>
        <span className="po-spec-value">12px</span>
      </div>
      <div className="po-spec-card">
        <span className="po-spec-label">Default offset</span>
        <span className="po-spec-value">8px</span>
      </div>
      <div className="po-spec-card">
        <span className="po-spec-label">Surface</span>
        <span className="po-spec-value">White + slate border</span>
      </div>
      <div className="po-spec-card">
        <span className="po-spec-label">Focus</span>
        <span className="po-spec-value">Brand Blue ring</span>
      </div>
      <div className="po-spec-card">
        <span className="po-spec-label">Engine</span>
        <span className="po-spec-value">@radix-ui/react-popover</span>
      </div>
      <div className="po-spec-card">
        <span className="po-spec-label">Default modal</span>
        <span className="po-spec-value">false</span>
      </div>
    </div>
  );
}

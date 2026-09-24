import React, { useEffect, useState } from "react";
import { Drawer as VaulDrawer } from "vaul";
import "./Drawers.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type DrawerVariant = "default" | "float" | "rounded";
export type DrawerDirection = "top" | "bottom" | "left" | "right";
export type DrawerBackdrop = "overlay" | "blur" | "none";

export type DrawerRootProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: DrawerVariant;
  direction?: DrawerDirection;
  backdrop?: DrawerBackdrop;
  /** Show drag handle */
  handle?: boolean;
  /** Allow drag / swipe to dismiss (vaul dismissible) */
  dismissible?: boolean;
  /** Only the handle initiates drag */
  handleOnly?: boolean;
  shouldScaleBackground?: boolean;
  setBackgroundColorOnScale?: boolean;
  modal?: boolean;
  snapPoints?: (number | string)[];
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snap: number | string | null) => void;
  fadeFromIndex?: number;
  closeThreshold?: number;
};

type Ctx = {
  variant: DrawerVariant;
  direction: DrawerDirection;
  backdrop: DrawerBackdrop;
  handle: boolean;
};

const DrawerCtx = React.createContext<Ctx>({
  variant: "default",
  direction: "right",
  backdrop: "overlay",
  handle: false,
});

/* ── Primitives ───────────────────────────────────────────────────────── */

export function Drawer({
  children,
  open,
  defaultOpen,
  onOpenChange,
  variant = "default",
  direction = "right",
  backdrop = "overlay",
  handle = false,
  dismissible = true,
  handleOnly = false,
  shouldScaleBackground = false,
  setBackgroundColorOnScale = true,
  modal = true,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  fadeFromIndex,
  closeThreshold,
}: DrawerRootProps) {
  return (
    <DrawerCtx.Provider value={{ variant, direction, backdrop, handle }}>
      <VaulDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        direction={direction}
        dismissible={dismissible}
        handleOnly={handleOnly}
        shouldScaleBackground={shouldScaleBackground}
        setBackgroundColorOnScale={setBackgroundColorOnScale}
        modal={modal}
        snapPoints={snapPoints}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        fadeFromIndex={fadeFromIndex}
        closeThreshold={closeThreshold}
      >
        {children}
      </VaulDrawer.Root>
    </DrawerCtx.Provider>
  );
}

export function DrawerTrigger({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Trigger> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <VaulDrawer.Trigger asChild {...props}>
        {children}
      </VaulDrawer.Trigger>
    );
  }
  return (
    <VaulDrawer.Trigger className={className ?? "drw-btn drw-btn--outline"} {...props}>
      {children}
    </VaulDrawer.Trigger>
  );
}

export function DrawerClose({
  children,
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Close> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <VaulDrawer.Close asChild {...props}>
        {children}
      </VaulDrawer.Close>
    );
  }
  return (
    <VaulDrawer.Close className={className ?? "drw-btn drw-btn--ghost"} {...props}>
      {children}
    </VaulDrawer.Close>
  );
}

export function DrawerOverlay({ className }: { className?: string }) {
  const { backdrop } = React.useContext(DrawerCtx);
  if (backdrop === "none") {
    return (
      <VaulDrawer.Overlay
        className={`drw-overlay drw-overlay--none ${className ?? ""}`}
      />
    );
  }
  return (
    <VaulDrawer.Overlay
      className={`drw-overlay${backdrop === "blur" ? " drw-overlay--blur" : ""} ${className ?? ""}`}
    />
  );
}

export function DrawerContent({
  children,
  className,
  showClose = true,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Content> & { showClose?: boolean }) {
  const { variant, direction, handle } = React.useContext(DrawerCtx);
  const isSide = direction === "left" || direction === "right";
  const variantClass =
    variant === "float"
      ? "drw-content--float"
      : variant === "rounded"
        ? "drw-content--rounded"
        : "";

  return (
    <VaulDrawer.Portal>
      <DrawerOverlay />
      <VaulDrawer.Content
        className={[
          "drw-content",
          `drw-content--${direction}`,
          variantClass,
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {handle && (
          <VaulDrawer.Handle
            className={isSide ? "drw-handle drw-handle--side" : "drw-handle"}
          />
        )}
        {showClose && (
          <VaulDrawer.Close
            className="drw-icon-btn"
            aria-label="Close"
            style={{
              position: "absolute",
              top: handle && !isSide ? 28 : 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </VaulDrawer.Close>
        )}
        {children}
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
}

export function DrawerHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`drw-header-bar ${className ?? ""}`}>{children}</div>;
}

export function DrawerTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <VaulDrawer.Title className={`drw-title ${className ?? ""}`}>{children}</VaulDrawer.Title>
  );
}

export function DrawerDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <VaulDrawer.Description className={`drw-description ${className ?? ""}`}>
      {children}
    </VaulDrawer.Description>
  );
}

export function DrawerBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`drw-body ${className ?? ""}`}>{children}</div>;
}

export function DrawerFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`drw-footer ${className ?? ""}`}>{children}</div>;
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeaderBlock({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <DrawerHeader>
      <div className="drw-header-text" style={{ paddingRight: 28 }}>
        <DrawerTitle>{title}</DrawerTitle>
        {description ? <DrawerDescription>{description}</DrawerDescription> : null}
      </div>
    </DrawerHeader>
  );
}

/* ── Code sample ──────────────────────────────────────────────────────── */

export const DRAWER_CODE = `// Drawer · supplai Design System
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from './Drawer';

<Drawer variant="default" direction="right" backdrop="overlay" handle={false}>
  <DrawerTrigger>Open drawer</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Drawer title</DrawerTitle>
      <DrawerDescription>Short supporting description.</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>Main content</DrawerBody>
    <DrawerFooter>
      <DrawerClose>Cancel</DrawerClose>
      <button type="button">Save</button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

// Built on vaul · props: variant, direction, backdrop, handle,
// dismissible, snapPoints, shouldScaleBackground, open / onOpenChange
`;

/* ── Shared shell ─────────────────────────────────────────────────────── */

function DemoShell({ children }: { children: React.ReactNode }) {
  return <div className="drw-demo">{children}</div>;
}

function SampleBody() {
  return (
    <p style={{ margin: 0 }}>
      Use drawers for filters, settings, detail panels, and mobile flows that should stay in
      context without navigating away.
    </p>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function DrawerPlayground() {
  const [variant, setVariant] = useState<DrawerVariant>("default");
  const [direction, setDirection] = useState<DrawerDirection>("right");
  const [backdrop, setBackdrop] = useState<DrawerBackdrop>("overlay");
  const [handle, setHandle] = useState(false);
  const [dismissible, setDismissible] = useState(true);

  return (
    <div className="drw-play">
      <div className="drw-play-preview">
        <Drawer
          variant={variant}
          direction={direction}
          backdrop={backdrop}
          handle={handle}
          dismissible={dismissible}
        >
          <DrawerTrigger className="drw-btn drw-btn--primary">Open playground drawer</DrawerTrigger>
          <DrawerContent>
            <HeaderBlock
              title="Playground drawer"
              description={`${variant} · ${direction} · ${backdrop}${handle ? " · handle" : ""}`}
            />
            <DrawerBody>
              <SampleBody />
              {!dismissible && (
                <p className="drw-note">Drag-to-dismiss is off — use Close or Escape.</p>
              )}
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
              <button type="button" className="drw-btn drw-btn--primary">
                Confirm
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="drw-play-controls">
        <div className="drw-play-row">
          <span className="drw-play-label">Variant</span>
          {(["default", "float", "rounded"] as DrawerVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`drw-chip${variant === v ? " drw-chip--on" : ""}`}
              onClick={() => setVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="drw-play-row">
          <span className="drw-play-label">Direction</span>
          {(["left", "right", "top", "bottom"] as DrawerDirection[]).map((d) => (
            <button
              key={d}
              type="button"
              className={`drw-chip${direction === d ? " drw-chip--on" : ""}`}
              onClick={() => setDirection(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="drw-play-row">
          <span className="drw-play-label">Backdrop</span>
          {(["overlay", "blur", "none"] as DrawerBackdrop[]).map((b) => (
            <button
              key={b}
              type="button"
              className={`drw-chip${backdrop === b ? " drw-chip--on" : ""}`}
              onClick={() => setBackdrop(b)}
            >
              {b}
            </button>
          ))}
        </div>
        <div className="drw-play-row">
          <span className="drw-play-label">Options</span>
          <button
            type="button"
            className={`drw-chip${handle ? " drw-chip--on" : ""}`}
            onClick={() => setHandle((v) => !v)}
          >
            Handle
          </button>
          <button
            type="button"
            className={`drw-chip${dismissible ? " drw-chip--on" : ""}`}
            onClick={() => setDismissible((v) => !v)}
          >
            Drag dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <DemoShell>
      <Drawer variant="default" direction="right" backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--primary">Open drawer</DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="This is a drawer header"
            description="This is a drawer description message."
          />
          <DrawerBody>
            <SampleBody />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close Drawer</DrawerClose>
            <button type="button" className="drw-btn drw-btn--primary">
              Submit Action
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function VariantsDemo() {
  return (
    <DemoShell>
      <div className="drw-demo-row">
        {(["default", "float", "rounded"] as DrawerVariant[]).map((variant) => (
          <Drawer key={variant} variant={variant} direction="right" backdrop="overlay">
            <DrawerTrigger className="drw-btn drw-btn--outline">
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </DrawerTrigger>
            <DrawerContent>
              <HeaderBlock
                title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} variant`}
                description={
                  variant === "float"
                    ? "Inset from the viewport edges with a full rounded panel."
                    : variant === "rounded"
                      ? "Stronger radius on the exposed edge."
                      : "Flush to the viewport edge."
                }
              />
              <DrawerBody>
                <SampleBody />
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </DemoShell>
  );
}

export function PlacementDemo() {
  const dirs: DrawerDirection[] = ["left", "right", "top", "bottom"];
  return (
    <DemoShell>
      <div className="drw-demo-row">
        {dirs.map((direction) => (
          <Drawer key={direction} direction={direction} variant="default" backdrop="overlay">
            <DrawerTrigger className="drw-btn drw-btn--outline">
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </DrawerTrigger>
            <DrawerContent>
              <HeaderBlock
                title={`${direction.charAt(0).toUpperCase() + direction.slice(1)} drawer`}
                description="Enters and exits from this edge."
              />
              <DrawerBody>
                <SampleBody />
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </DemoShell>
  );
}

export function BackdropDemo() {
  const items: { backdrop: DrawerBackdrop; label: string }[] = [
    { backdrop: "overlay", label: "Overlay" },
    { backdrop: "blur", label: "Blur" },
    { backdrop: "none", label: "None" },
  ];
  return (
    <DemoShell>
      <div className="drw-demo-row">
        {items.map(({ backdrop, label }) => (
          <Drawer key={backdrop} direction="right" backdrop={backdrop} variant="default">
            <DrawerTrigger className="drw-btn drw-btn--outline">{label}</DrawerTrigger>
            <DrawerContent>
              <HeaderBlock
                title={`${label} backdrop`}
                description={
                  backdrop === "none"
                    ? "Transparent scrim — outside pointer events pass through the overlay layer."
                    : backdrop === "blur"
                      ? "Dimmed + blurred underlying content."
                      : "Standard dimmed overlay."
                }
              />
              <DrawerBody>
                <SampleBody />
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
      <p className="drw-note">
        Backdrop look and dismiss-on-outside are related but separate — use <code>dismissible</code>{" "}
        to control drag/outside dismiss where supported.
      </p>
    </DemoShell>
  );
}

export function HandleDemo() {
  return (
    <DemoShell>
      <Drawer direction="bottom" variant="rounded" handle backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--primary">Open with handle</DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="Drag handle"
            description="Grab the handle (or panel) and drag down to dismiss."
          />
          <DrawerBody>
            <SampleBody />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function SwipeDemo() {
  return (
    <DemoShell>
      <Drawer direction="bottom" variant="default" handle backdrop="overlay" dismissible>
        <DrawerTrigger className="drw-btn drw-btn--primary">Swipe to close</DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="Swipe to dismiss"
            description="Drag the panel downward past the threshold to close."
          />
          <DrawerBody>
            <p style={{ margin: 0 }}>
              Scroll this list without closing the drawer — drag from the handle or empty chrome to
              dismiss.
            </p>
            <ul style={{ margin: "12px 0 0", paddingLeft: 18 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <li key={i}>Scrollable row {i + 1}</li>
              ))}
            </ul>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function NonDraggableDemo() {
  return (
    <DemoShell>
      <Drawer direction="right" dismissible={false} backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--outline">Non-draggable</DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="Drag disabled"
            description="Cannot swipe away — use Close, Escape, or the X control."
          />
          <DrawerBody>
            <SampleBody />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--primary">Close drawer</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function SnapPointsDemo() {
  const snaps = [0.3, 0.55, 1] as const;
  const [snap, setSnap] = useState<number | string | null>(snaps[0]);

  return (
    <DemoShell>
      <Drawer
        direction="bottom"
        variant="rounded"
        handle
        backdrop="overlay"
        snapPoints={[...snaps]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        fadeFromIndex={1}
      >
        <DrawerTrigger className="drw-btn drw-btn--primary">Open snap drawer</DrawerTrigger>
        <DrawerContent
          style={
            typeof snap === "number" && snap === 1
              ? { height: "100%" }
              : { height: typeof snap === "number" ? `${snap * 100}%` : snap ?? undefined }
          }
        >
          <HeaderBlock
            title="Snap points"
            description={`Active: ${snap === 1 ? "full" : typeof snap === "number" ? `${Math.round(snap * 100)}%` : String(snap)}`}
          />
          <DrawerBody>
            <p style={{ margin: "0 0 12px" }}>
              Drag between 30%, 55%, and full height. Internal scrolling works at larger snaps.
            </p>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} style={{ margin: "0 0 8px" }}>
                Content block {i + 1}
              </p>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="drw-note">Configure via <code>snapPoints</code> and <code>activeSnapPoint</code>.</p>
    </DemoShell>
  );
}

export function BackgroundScaleDemo() {
  return (
    <DemoShell>
      <div className="drw-scale-frame">
        <div data-vaul-drawer-wrapper="">
          <div className="drw-scale-inner">
            <div className="drw-scale-card">
              Page content behind the drawer. Opening scales this wrapper slightly so focus shifts
              to the panel — scoped to this preview, not the Storybook chrome.
            </div>
            <Drawer
              direction="bottom"
              variant="rounded"
              handle
              backdrop="overlay"
              shouldScaleBackground
            >
              <DrawerTrigger className="drw-btn drw-btn--primary">
                Open with background scale
              </DrawerTrigger>
              <DrawerContent>
                <HeaderBlock
                  title="Background scaling"
                  description="Requires a [data-vaul-drawer-wrapper] ancestor around app content."
                />
                <DrawerBody>
                  <SampleBody />
                </DrawerBody>
                <DrawerFooter>
                  <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export function ScrollableDemo() {
  return (
    <DemoShell>
      <Drawer direction="right" variant="default" backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--outline">Scrollable body</DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="Scrollable drawer"
            description="Header and footer stay put while the body scrolls."
          />
          <DrawerBody>
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i} style={{ margin: "0 0 10px" }}>
                Paragraph {i + 1}. Long form content, activity feeds, and filter lists belong here.
              </p>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Cancel</DrawerClose>
            <button type="button" className="drw-btn drw-btn--primary">
              Save
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function FormDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("buyer");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setError("");
    setOpen(false);
  };

  return (
    <DemoShell>
      <Drawer open={open} onOpenChange={setOpen} direction="right" variant="float" backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--primary">Edit profile</DrawerTrigger>
        <DrawerContent showClose>
          <HeaderBlock
            title="Edit profile"
            description="Form fields use Text Input chrome inside the drawer."
          />
          <DrawerBody>
            <div className="drw-field">
              <label className="drw-label" htmlFor="drw-name">
                Full name
              </label>
              <input
                id="drw-name"
                className="drw-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Alex Morgan"
              />
              {error ? (
                <span style={{ fontSize: 12, color: "#D13145", fontWeight: 600 }}>{error}</span>
              ) : null}
            </div>
            <div className="drw-field">
              <label className="drw-label" htmlFor="drw-role">
                Role
              </label>
              <select
                id="drw-role"
                className="drw-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="buyer">Buyer</option>
                <option value="supplier">Supplier</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="drw-field">
              <label className="drw-label" htmlFor="drw-notes">
                Notes
              </label>
              <textarea
                id="drw-notes"
                className="drw-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional context…"
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Cancel</DrawerClose>
            <button type="button" className="drw-btn drw-btn--primary" onClick={save}>
              Save changes
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoShell>
      <div className="drw-demo-row">
        <button type="button" className="drw-btn drw-btn--primary" onClick={() => setOpen(true)}>
          Open (controlled)
        </button>
        <button type="button" className="drw-btn drw-btn--ghost" onClick={() => setOpen(false)}>
          Close (controlled)
        </button>
        <span className="drw-note" style={{ margin: 0 }}>
          open: {String(open)}
        </span>
      </div>
      <Drawer open={open} onOpenChange={setOpen} direction="right" backdrop="overlay">
        <DrawerContent>
          <HeaderBlock
            title="Controlled drawer"
            description="Parent state owns open / onOpenChange."
          />
          <DrawerBody>
            <SampleBody />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DemoShell>
  );
}

export function ResponsiveDemo() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const direction: DrawerDirection = isMobile ? "bottom" : "right";

  return (
    <DemoShell>
      <Drawer direction={direction} variant={isMobile ? "rounded" : "default"} handle={isMobile} backdrop="overlay">
        <DrawerTrigger className="drw-btn drw-btn--outline">
          Responsive ({isMobile ? "bottom" : "right"})
        </DrawerTrigger>
        <DrawerContent>
          <HeaderBlock
            title="Responsive drawer"
            description="≤767px → bottom sheet; larger → right side panel (matches common DS breakpoints)."
          />
          <DrawerBody>
            <SampleBody />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose className="drw-btn drw-btn--ghost">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <p className="drw-note">Resize the viewport or Storybook preview to switch placement.</p>
    </DemoShell>
  );
}

export function CombinedDemo() {
  return <DrawerPlayground />;
}

export function SpecsDemo() {
  return (
    <div className="drw-specs-grid">
      <div className="drw-spec-card">
        <span className="drw-spec-label">Surface</span>
        <span className="drw-spec-value">#FFFFFF</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Radius</span>
        <span className="drw-spec-value">12px · rounded 20px</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Overlay</span>
        <span className="drw-spec-value">rgba(15,23,42,0.45)</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Shadow</span>
        <span className="drw-spec-value">Modal elevation</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Width (side)</span>
        <span className="drw-spec-value">min(100vw, 360px)</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Engine</span>
        <span className="drw-spec-value">vaul</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">Accent</span>
        <span className="drw-spec-value">Brand Blue #4169E1</span>
      </div>
      <div className="drw-spec-card">
        <span className="drw-spec-label">A11y</span>
        <span className="drw-spec-value">Dialog · focus trap · Escape</span>
      </div>
    </div>
  );
}

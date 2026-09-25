import React, { createContext, useContext, useId, useState } from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "./ContextMenus";
import "./RadioGroups.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type RadioSize = "sm" | "md" | "lg";
export type RadioOrientation = "vertical" | "horizontal";

type SizeCtx = { size: RadioSize };
const RadioSizeContext = createContext<SizeCtx>({ size: "md" });

export type RadioGroupProps = {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: RadioOrientation;
  size?: RadioSize;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  id?: string;
};

export type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
  size?: RadioSize;
  id?: string;
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
};

/* ── Primitives ───────────────────────────────────────────────────────── */

export function RadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  name,
  orientation = "vertical",
  size = "md",
  className,
  id,
  ...a11y
}: RadioGroupProps) {
  return (
    <RadioSizeContext.Provider value={{ size }}>
      <RadixRadio.Root
        id={id}
        className={[
          "rg-group",
          `rg-group--${orientation}`,
          disabled ? "rg-group--disabled" : "",
          a11y["aria-invalid"] === true || a11y["aria-invalid"] === "true"
            ? "rg-group--error"
            : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
        orientation={orientation}
        {...a11y}
      >
        {children}
      </RadixRadio.Root>
    </RadioSizeContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  disabled = false,
  size: sizeProp,
  id: idProp,
  className,
  label,
  description,
  children,
}: RadioGroupItemProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { size: ctxSize } = useContext(RadioSizeContext);
  const size = sizeProp ?? ctxSize;
  const descId = description ? `${id}-desc` : undefined;
  const hasCopy = Boolean(label || description || children);

  const control = (
    <RadixRadio.Item
      id={id}
      value={value}
      disabled={disabled}
      className="rg-item-control"
      aria-describedby={descId}
    >
      <RadixRadio.Indicator className="rg-indicator">
        <span className="rg-dot" />
      </RadixRadio.Indicator>
    </RadixRadio.Item>
  );

  if (!hasCopy) {
    return (
      <span
        className={[
          "rg-item",
          `rg-item--${size}`,
          disabled ? "rg-item--disabled" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {control}
      </span>
    );
  }

  return (
    <label
      className={[
        "rg-item",
        `rg-item--${size}`,
        disabled ? "rg-item--disabled" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      htmlFor={id}
    >
      {control}
      <span className="rg-item-text">
        {label ? <span className="rg-item-label">{label}</span> : null}
        {description ? (
          <span className="rg-item-desc" id={descId}>
            {description}
          </span>
        ) : null}
        {children}
      </span>
    </label>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────── */

export const RADIO_GROUP_CODE = `// Radio Group · supplai Design System
import { RadioGroup, RadioGroupItem } from './RadioGroup';

<RadioGroup defaultValue="all" size="md" orientation="vertical">
  <RadioGroupItem value="all" label="All new messages" />
  <RadioGroupItem value="mentions" label="Direct messages and mentions" />
  <RadioGroupItem value="none" label="Nothing" />
</RadioGroup>

// Built on @radix-ui/react-radio-group · value / defaultValue / orientation / size
`;

function DemoShell({
  children,
  stack,
}: {
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <div className={`rg-demo${stack ? " rg-demo--stack" : ""}`}>{children}</div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function RadioPlayground() {
  const [value, setValue] = useState("all");
  const [size, setSize] = useState<RadioSize>("md");
  const [orientation, setOrientation] = useState<RadioOrientation>("vertical");
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const legendId = useId();

  return (
    <div className="rg-play">
      <div className="rg-play-preview">
        <p className="rg-legend" id={legendId}>
          Notifications{required ? " *" : ""}
        </p>
        <RadioGroup
          value={value}
          onValueChange={setValue}
          size={size}
          orientation={orientation}
          disabled={disabled}
          required={required}
          aria-labelledby={legendId}
        >
          <RadioGroupItem value="all" label="All new messages" />
          <RadioGroupItem value="mentions" label="Direct messages and mentions" />
          <RadioGroupItem value="none" label="Nothing" />
        </RadioGroup>
        <p className="rg-meta">Selected: {value}</p>
      </div>
      <div className="rg-play-controls">
        <div className="rg-play-row">
          <span className="rg-play-label">Size</span>
          {(["sm", "md", "lg"] as RadioSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`rg-chip${size === s ? " rg-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="rg-play-row">
          <span className="rg-play-label">Orientation</span>
          {(["vertical", "horizontal"] as RadioOrientation[]).map((o) => (
            <button
              key={o}
              type="button"
              className={`rg-chip${orientation === o ? " rg-chip--on" : ""}`}
              onClick={() => setOrientation(o)}
            >
              {o}
            </button>
          ))}
        </div>
        <div className="rg-play-row">
          <span className="rg-play-label">Flags</span>
          <button
            type="button"
            className={`rg-chip${disabled ? " rg-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            disabled
          </button>
          <button
            type="button"
            className={`rg-chip${required ? " rg-chip--on" : ""}`}
            onClick={() => setRequired((v) => !v)}
          >
            required
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Notifications</legend>
        <RadioGroup defaultValue="all" aria-label="Notifications">
          <RadioGroupItem value="all" label="All new messages" />
          <RadioGroupItem value="mentions" label="Direct messages and mentions" />
          <RadioGroupItem value="none" label="Nothing" />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function SizesDemo() {
  return (
    <DemoShell stack>
      {(["sm", "md", "lg"] as RadioSize[]).map((size) => (
        <fieldset className="rg-fieldset" key={size}>
          <legend className="rg-legend">
            {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
          </legend>
          <RadioGroup defaultValue={size} size={size} aria-label={`Size ${size}`}>
            <RadioGroupItem value={size} label={size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"} />
          </RadioGroup>
        </fieldset>
      ))}
    </DemoShell>
  );
}

export function LabelledDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Preferred contact method</legend>
        <RadioGroup defaultValue="email">
          <RadioGroupItem value="email" label="Email" />
          <RadioGroupItem value="phone" label="Phone" />
          <RadioGroupItem value="sms" label="SMS" />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function HintDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Notification preference</legend>
        <RadioGroup defaultValue="important">
          <RadioGroupItem
            value="all"
            label="All notifications"
            description="Receive every account notification."
          />
          <RadioGroupItem
            value="important"
            label="Important only"
            description="Only receive important account updates."
          />
          <RadioGroupItem
            value="none"
            label="None"
            description="Do not send notifications."
          />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function DisabledGroupDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Notifications (group disabled)</legend>
        <RadioGroup defaultValue="all" disabled>
          <RadioGroupItem value="all" label="All new messages" />
          <RadioGroupItem value="mentions" label="Direct messages and mentions" />
          <RadioGroupItem value="none" label="Nothing" />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function DisabledItemDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Select Your ARM Chip</legend>
        <RadioGroup defaultValue="m3">
          <RadioGroupItem value="m3" label="M3" />
          <RadioGroupItem value="m3-pro" label="M3 Pro" />
          <RadioGroupItem value="m3-max" label="M3 Max" />
          <RadioGroupItem value="m4" label="M4" />
          <RadioGroupItem value="m4-pro" label="M4 Pro" />
          <RadioGroupItem
            value="m4-max"
            disabled
            label={
              <>
                M4 Max <span className="rg-badge">Out of Stock</span>
              </>
            }
          />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function HorizontalDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Plan</legend>
        <RadioGroup defaultValue="monthly" orientation="horizontal">
          <RadioGroupItem value="monthly" label="Monthly" />
          <RadioGroupItem value="quarterly" label="Quarterly" />
          <RadioGroupItem value="annual" label="Annual" />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function VerticalDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Theme</legend>
        <RadioGroup defaultValue="system" orientation="vertical">
          <RadioGroupItem value="system" label="System" />
          <RadioGroupItem value="light" label="Light" />
          <RadioGroupItem value="dark" label="Dark" />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [value, setValue] = useState("email");
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Preferred contact</legend>
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioGroupItem value="email" label="Email" />
          <RadioGroupItem value="phone" label="Phone" />
          <RadioGroupItem value="sms" label="SMS" />
        </RadioGroup>
      </fieldset>
      <p className="rg-meta">Selected value: {value}</p>
      <div className="rg-actions">
        <button type="button" className="rg-btn rg-btn--ghost" onClick={() => setValue("email")}>
          Reset
        </button>
      </div>
    </DemoShell>
  );
}

export function UncontrolledDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Billing (defaultValue = monthly)</legend>
        <RadioGroup defaultValue="monthly">
          <RadioGroupItem value="monthly" label="Monthly" />
          <RadioGroupItem value="quarterly" label="Quarterly" />
          <RadioGroupItem value="yearly" label="Yearly" />
        </RadioGroup>
      </fieldset>
      <p className="rg-note">
        Use <code>defaultValue</code> for uncontrolled; <code>value</code> +{" "}
        <code>onValueChange</code> for controlled.
      </p>
    </DemoShell>
  );
}

function RadioCardItem({
  value,
  title,
  description,
  price,
  disabled,
}: {
  value: string;
  title: string;
  description: string;
  price?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const { size } = useContext(RadioSizeContext);
  return (
    <label
      className={`rg-card${disabled ? " rg-card--disabled" : ""}`}
      htmlFor={id}
    >
      <span className={`rg-item rg-item--${size}`} style={{ display: "contents" }}>
        <RadixRadio.Item
          id={id}
          value={value}
          disabled={disabled}
          className="rg-item-control"
          style={{ marginTop: 2 }}
        >
          <RadixRadio.Indicator className="rg-indicator">
            <span className="rg-dot" />
          </RadixRadio.Indicator>
        </RadixRadio.Item>
      </span>
      <span className="rg-item-text">
        <span className="rg-card-title">{title}</span>
        <span className="rg-card-desc">{description}</span>
        {price ? <span className="rg-card-price">{price}</span> : null}
      </span>
    </label>
  );
}

export function RadioCardDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Choose your default view</legend>
        <RadioGroup defaultValue="overview" className="rg-cards rg-cards--2">
          <RadioCardItem
            value="overview"
            title="Overview"
            description="Get a quick summary of your account and activity."
          />
          <RadioCardItem
            value="projects"
            title="Projects"
            description="Focus on your active projects and ongoing work."
          />
          <RadioCardItem
            value="inbox"
            title="Inbox"
            description="Jump straight to your latest notifications."
          />
          <RadioCardItem
            value="calendar"
            title="Calendar"
            description="Upcoming events and deadlines."
          />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function RichCardDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Choose a subscription</legend>
        <RadioGroup defaultValue="pro" className="rg-cards">
          <RadioCardItem
            value="basic"
            title="Basic"
            description="Essential features for small teams."
            price="$10 / month"
          />
          <RadioCardItem
            value="pro"
            title="Pro"
            description="Advanced tools and analytics."
            price="$25 / month"
          />
          <RadioCardItem
            value="enterprise"
            title="Enterprise"
            description="Custom requirements and support."
            price="Contact sales"
          />
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function MenuRadioDemo() {
  const [mode, setMode] = useState("comfortable");
  return (
    <DemoShell stack>
      <p className="rg-note">
        Menu radios use Context Menu radio primitives (not form RadioGroup) for correct menu
        semantics — same pattern as a Dropdown Menu radio group.
      </p>
      <ContextMenu>
        <ContextMenuTrigger>
          <button type="button" className="rg-btn">
            Right-click · View mode ({mode})
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View mode</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={mode} onValueChange={setMode}>
            <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dense">Dense</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="rg-meta">Selected: {mode}</p>
    </DemoShell>
  );
}

export function RequiredFormDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const errId = useId();
  const legendId = useId();

  return (
    <DemoShell stack>
      <form
        className="rg-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value) {
            setError("Choose one option before submitting.");
            setStatus("");
            return;
          }
          setError("");
          setStatus(`Submitted: ${value}`);
        }}
      >
        <fieldset className="rg-fieldset">
          <legend className="rg-legend rg-legend--required" id={legendId}>
            Preferred contact method
          </legend>
          <RadioGroup
            value={value || undefined}
            onValueChange={(v) => {
              setValue(v);
              setError("");
            }}
            required
            aria-labelledby={legendId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errId : undefined}
          >
            <RadioGroupItem value="email" label="Email" />
            <RadioGroupItem value="phone" label="Phone" />
            <RadioGroupItem value="sms" label="SMS" />
          </RadioGroup>
          {error ? (
            <p className="rg-hint rg-hint--error" id={errId} role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="rg-hint rg-hint--success" role="status">
              {status}
            </p>
          ) : null}
        </fieldset>
        <div className="rg-actions">
          <button type="submit" className="rg-btn rg-btn--primary">
            Submit
          </button>
        </div>
      </form>
    </DemoShell>
  );
}

export function FormDemo() {
  const [value, setValue] = useState("m3");
  const [status, setStatus] = useState("");

  return (
    <DemoShell stack>
      <form
        className="rg-form"
        onSubmit={(e) => {
          e.preventDefault();
          setStatus(`Chip reserved: ${value}`);
        }}
      >
        <fieldset className="rg-fieldset">
          <legend className="rg-legend">Select Your ARM Chip</legend>
          <RadioGroup value={value} onValueChange={setValue} name="chip">
            <RadioGroupItem value="m3" label="M3" />
            <RadioGroupItem value="m3-pro" label="M3 Pro" />
            <RadioGroupItem value="m3-max" label="M3 Max" />
            <RadioGroupItem value="m4" label="M4" />
            <RadioGroupItem value="m4-pro" label="M4 Pro" />
            <RadioGroupItem
              value="m4-max"
              disabled
              label={
                <>
                  M4 Max <span className="rg-badge">Out of Stock</span>
                </>
              }
            />
          </RadioGroup>
        </fieldset>
        <div className="rg-actions">
          <button type="submit" className="rg-btn rg-btn--primary">
            Submit
          </button>
        </div>
        {status ? (
          <p className="rg-hint rg-hint--success" role="status">
            {status}
          </p>
        ) : (
          <p className="rg-note">Local Storybook submit — no backend.</p>
        )}
      </form>
    </DemoShell>
  );
}

export function ErrorDemo() {
  const errId = useId();
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend rg-legend--required">Choose a payment frequency</legend>
        <RadioGroup
          aria-invalid
          aria-describedby={errId}
          aria-label="Payment frequency"
        >
          <RadioGroupItem value="monthly" label="Monthly" />
          <RadioGroupItem value="quarterly" label="Quarterly" />
          <RadioGroupItem value="yearly" label="Yearly" />
        </RadioGroup>
        <p className="rg-hint rg-hint--error" id={errId} role="alert">
          Choose a billing frequency.
        </p>
      </fieldset>
    </DemoShell>
  );
}

export function StatesDemo() {
  return (
    <div className="rg-demo rg-demo--stack">
      <div className="rg-states">
        <div className="rg-state-card">
          <span className="rg-state-label">Unselected</span>
          <RadioGroup>
            <RadioGroupItem value="a" label="Option" />
          </RadioGroup>
        </div>
        <div className="rg-state-card">
          <span className="rg-state-label">Selected</span>
          <RadioGroup defaultValue="a">
            <RadioGroupItem value="a" label="Option" />
          </RadioGroup>
        </div>
        <div className="rg-state-card">
          <span className="rg-state-label">Disabled</span>
          <RadioGroup disabled defaultValue="a">
            <RadioGroupItem value="a" label="Option" />
          </RadioGroup>
        </div>
        <div className="rg-state-card">
          <span className="rg-state-label">Item disabled</span>
          <RadioGroup defaultValue="b">
            <RadioGroupItem value="a" disabled label="Unavailable" />
            <RadioGroupItem value="b" label="Available" />
          </RadioGroup>
        </div>
        <div className="rg-state-card">
          <span className="rg-state-label">Error context</span>
          <RadioGroup aria-invalid aria-label="Error sample">
            <RadioGroupItem value="a" label="Option" />
          </RadioGroup>
        </div>
      </div>
      <p className="rg-note">Hover and focus the controls above to inspect interaction states.</p>
    </div>
  );
}

export function LongLabelDemo() {
  return (
    <DemoShell stack>
      <fieldset className="rg-fieldset">
        <legend className="rg-legend">Email preferences</legend>
        <RadioGroup defaultValue="weekly">
          <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 12 }}>
            <RadioGroupItem
              value="weekly"
              label="Send me account activity summaries and important security updates by email every week."
            />
            <RadioGroupItem
              value="critical"
              label="Only send critical security alerts and password-reset messages."
            />
            <RadioGroupItem value="none" label="Do not send email notifications." />
          </div>
        </RadioGroup>
      </fieldset>
    </DemoShell>
  );
}

export function CompareDemo() {
  return (
    <div className="rg-demo" style={{ padding: 0, overflow: "auto" }}>
      <table className="rg-compare">
        <thead>
          <tr>
            <th>Component</th>
            <th>Use when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Radio Group</td>
            <td>Exactly one choice from a small, visible set.</td>
          </tr>
          <tr>
            <td>Checkbox</td>
            <td>Zero, one, or many independent selections.</td>
          </tr>
          <tr>
            <td>Select</td>
            <td>Many options; a compact field is preferable.</td>
          </tr>
          <tr>
            <td>Segmented control</td>
            <td>Switching views, modes, or filters in the UI chrome.</td>
          </tr>
          <tr>
            <td>Menu radio</td>
            <td>Mutually exclusive choices inside a menu (not a form).</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="rg-specs-grid">
      <div className="rg-spec-card">
        <span className="rg-spec-label">Sizes</span>
        <span className="rg-spec-value">sm 14 · md 16 · lg 20</span>
      </div>
      <div className="rg-spec-card">
        <span className="rg-spec-label">Selected</span>
        <span className="rg-spec-value">Brand Blue fill</span>
      </div>
      <div className="rg-spec-card">
        <span className="rg-spec-label">Focus</span>
        <span className="rg-spec-value">2px Brand Blue ring</span>
      </div>
      <div className="rg-spec-card">
        <span className="rg-spec-label">Default orientation</span>
        <span className="rg-spec-value">vertical</span>
      </div>
      <div className="rg-spec-card">
        <span className="rg-spec-label">Engine</span>
        <span className="rg-spec-value">@radix-ui/react-radio-group</span>
      </div>
    </div>
  );
}

import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import * as RadixSelect from "@radix-ui/react-select";
import "./Selects.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type SelectSize = "sm" | "md" | "lg";
export type IndicatorPosition = "left" | "right";

type SelectCtxValue = {
  size: SelectSize;
  indicatorPosition: IndicatorPosition;
  indicator: React.ReactNode | null;
  error?: boolean;
};

const SelectCtx = createContext<SelectCtxValue>({
  size: "md",
  indicatorPosition: "right",
  indicator: null,
  error: false,
});

export type SelectProps = {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  size?: SelectSize;
  indicatorPosition?: IndicatorPosition;
  indicator?: React.ReactNode | null;
  error?: boolean;
};

/* ── Icons ────────────────────────────────────────────────────────────── */

function ChevronIcon() {
  return (
    <svg className="sel-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.2L6.4 11.1L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Primitives ───────────────────────────────────────────────────────── */

export function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  required,
  name,
  size = "md",
  indicatorPosition = "right",
  indicator = null,
  error = false,
}: SelectProps) {
  const ctx = useMemo(
    () => ({ size, indicatorPosition, indicator, error }),
    [size, indicatorPosition, indicator, error],
  );

  return (
    <SelectCtx.Provider value={ctx}>
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
        required={required}
        name={name}
      >
        {children}
      </RadixSelect.Root>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
  size: sizeProp,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: {
  children: React.ReactNode;
  className?: string;
  size?: SelectSize;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
}) {
  const { size: ctxSize, error } = useContext(SelectCtx);
  const size = sizeProp ?? ctxSize;

  return (
    <RadixSelect.Trigger
      id={id}
      className={[
        "sel-trigger",
        `sel-trigger--${size}`,
        error ? "sel-trigger--error" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid ?? (error || undefined)}
    >
      <span className="sel-trigger-value">{children}</span>
      <RadixSelect.Icon asChild>
        <span>
          <ChevronIcon />
        </span>
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}

export function SelectValue({
  placeholder,
  children,
}: {
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return <RadixSelect.Value placeholder={placeholder}>{children}</RadixSelect.Value>;
}

export function SelectContent({
  children,
  className,
  position = "popper",
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Content>) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={`sel-content ${className ?? ""}`}
        position={position}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectScrollUpButton />
        <RadixSelect.Viewport className="sel-viewport">{children}</RadixSelect.Viewport>
        <SelectScrollDownButton />
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

export function SelectItem({
  children,
  className,
  value,
  disabled,
  textValue,
  description,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSelect.Item> & {
  /** Menu-only secondary line — not shown in the trigger */
  description?: React.ReactNode;
}) {
  const { indicatorPosition, indicator } = useContext(SelectCtx);
  const mark = indicator === null ? <CheckIcon /> : indicator;

  return (
    <RadixSelect.Item
      className={[
        "sel-item",
        description ? "sel-item--rich" : "",
        `sel-item--indicator-${indicatorPosition}`,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      value={value}
      disabled={disabled}
      textValue={textValue}
      {...props}
    >
      <RadixSelect.ItemIndicator className="sel-indicator">{mark}</RadixSelect.ItemIndicator>
      <span className="sel-item-main">
        {/* ItemText is portaled into the trigger — keep description menu-only */}
        <RadixSelect.ItemText>
          <span className="sel-item-label-row">{children}</span>
        </RadixSelect.ItemText>
        {description ? (
          <span className="sel-item-secondary">{description}</span>
        ) : null}
      </span>
    </RadixSelect.Item>
  );
}

export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <RadixSelect.Group>{children}</RadixSelect.Group>;
}

export function SelectLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RadixSelect.Label className={`sel-group-label ${className ?? ""}`}>
      {children}
    </RadixSelect.Label>
  );
}

export function SelectSeparator({ className }: { className?: string }) {
  return <RadixSelect.Separator className={`sel-separator ${className ?? ""}`} />;
}

export function SelectScrollUpButton() {
  return (
    <RadixSelect.ScrollUpButton className="sel-scroll-btn">
      <ChevronUpIcon />
    </RadixSelect.ScrollUpButton>
  );
}

export function SelectScrollDownButton() {
  return (
    <RadixSelect.ScrollDownButton className="sel-scroll-btn">
      <ChevronDownIcon />
    </RadixSelect.ScrollDownButton>
  );
}

/* ── Shared ───────────────────────────────────────────────────────────── */

export const SELECT_CODE = `// Select · supplai Design System
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';

<Select defaultValue="designer" size="md">
  <SelectTrigger>
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="designer">Designer</SelectItem>
    <SelectItem value="developer">Developer</SelectItem>
  </SelectContent>
</Select>

// Built on @radix-ui/react-select · value / size / indicatorPosition / popper
`;

function Field({
  label,
  required,
  hint,
  error,
  children,
  wide,
  htmlFor,
}: {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: boolean;
  children: React.ReactNode;
  wide?: boolean;
  htmlFor?: string;
}) {
  return (
    <div className={`sel-field${wide ? " sel-field--wide" : ""}`}>
      {label ? (
        <label
          className={`sel-label${required ? " sel-label--required" : ""}`}
          htmlFor={htmlFor}
        >
          {label}
        </label>
      ) : null}
      {children}
      {hint ? (
        <span className={`sel-hint${error ? " sel-hint--error" : ""}`}>{hint}</span>
      ) : null}
    </div>
  );
}

function Demo({
  children,
  stack,
}: {
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <div className={`sel-demo${stack ? " sel-demo--stack" : ""}`}>{children}</div>
  );
}

const COUNTRIES = [
  "Australia",
  "Brazil",
  "Canada",
  "Denmark",
  "France",
  "Germany",
  "Japan",
  "Nepal",
  "New Zealand",
  "Singapore",
  "United Kingdom",
  "United States",
];

const TIMEZONES = [
  "Pacific/Auckland",
  "Australia/Sydney",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Pacific/Honolulu",
];

/* ── Demos ────────────────────────────────────────────────────────────── */

export function SelectPlayground() {
  const [value, setValue] = useState("designer");
  const [size, setSize] = useState<SelectSize>("md");
  const [indicatorPosition, setPos] = useState<IndicatorPosition>("right");
  const [disabled, setDisabled] = useState(false);
  const [customIndicator, setCustom] = useState(false);
  const id = useId();

  return (
    <div className="sel-play">
      <div className="sel-play-preview">
        <Field label="Role" htmlFor={id}>
          <Select
            value={value}
            onValueChange={setValue}
            size={size}
            indicatorPosition={indicatorPosition}
            indicator={customIndicator ? <DotIcon /> : null}
            disabled={disabled}
          >
            <SelectTrigger id={id} aria-labelledby={undefined}>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
              <SelectItem value="researcher">Researcher</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <p className="sel-meta">Selected: {value || "—"}</p>
      </div>
      <div className="sel-play-controls">
        <div className="sel-play-row">
          <span className="sel-play-label">Size</span>
          {(["sm", "md", "lg"] as SelectSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`sel-chip${size === s ? " sel-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="sel-play-row">
          <span className="sel-play-label">Indicator</span>
          {(["left", "right"] as IndicatorPosition[]).map((p) => (
            <button
              key={p}
              type="button"
              className={`sel-chip${indicatorPosition === p ? " sel-chip--on" : ""}`}
              onClick={() => setPos(p)}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={`sel-chip${customIndicator ? " sel-chip--on" : ""}`}
            onClick={() => setCustom((v) => !v)}
          >
            custom (dot)
          </button>
        </div>
        <div className="sel-play-row">
          <span className="sel-play-label">Flags</span>
          <button
            type="button"
            className={`sel-chip${disabled ? " sel-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            disabled
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Role" htmlFor={id}>
        <Select>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="pm">Product Manager</SelectItem>
            <SelectItem value="researcher">Researcher</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function PlaceholderDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Country" htmlFor={id}>
        <Select>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nz">New Zealand</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
            <SelectItem value="jp">Japan</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function SizesDemo() {
  return (
    <Demo stack>
      {(["sm", "md", "lg"] as SelectSize[]).map((size) => (
        <Field key={size} label={size.toUpperCase()}>
          <Select defaultValue="designer" size={size}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      ))}
      <p className="sel-note">Heights: sm 32 · md 36 · lg 40 — aligned with Text Input / Phone Input.</p>
    </Demo>
  );
}

export function BadgeDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Status" htmlFor={id}>
        <Select defaultValue="active">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" textValue="Active">
              <span className="sel-status-dot" aria-hidden />
              Active
              <span className="sel-badge">Recommended</span>
            </SelectItem>
            <SelectItem value="pending" textValue="Pending">
              <span className="sel-status-dot sel-status-dot--pending" aria-hidden />
              Pending
            </SelectItem>
            <SelectItem value="archived" textValue="Archived">
              <span className="sel-status-dot sel-status-dot--archived" aria-hidden />
              Archived
              <span className="sel-badge sel-badge--neutral">Legacy</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function AvatarDemo() {
  const id = useId();
  const people = [
    {
      value: "jamie",
      name: "Jamie Wilson",
      role: "Product Designer",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    },
    {
      value: "maya",
      name: "Maya Chen",
      role: "Developer",
      initials: "MC",
      bg: "#2F50C1",
    },
    {
      value: "alex",
      name: "Alex Smith",
      role: "Product Manager",
      initials: "AS",
      bg: "#519E8A",
    },
  ];

  return (
    <Demo>
      <Field label="Assignee" htmlFor={id} wide>
        <Select defaultValue="jamie">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {people.map((p) => (
              <SelectItem
                key={p.value}
                value={p.value}
                textValue={p.name}
                description={p.role}
              >
                <span className="sel-avatar" style={p.bg ? { background: p.bg } : undefined}>
                  {p.src ? <img src={p.src} alt="" /> : p.initials}
                </span>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function CustomIndicatorDemo() {
  return (
    <Demo>
      <Field label="Priority (dot indicator)">
        <Select defaultValue="medium" indicator={<DotIcon />}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function IndicatorPositionDemo() {
  return (
    <Demo>
      <Field label="Indicator left">
        <Select defaultValue="a" indicatorPosition="left">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Indicator right">
        <Select defaultValue="a" indicatorPosition="right">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function DisabledSelectDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Country" htmlFor={id}>
        <Select defaultValue="nz" disabled>
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nz">New Zealand</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function DisabledOptionDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Choose a plan" htmlFor={id}>
        <Select defaultValue="pro">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Professional</SelectItem>
            <SelectItem value="enterprise" disabled>
              Enterprise — Contact administrator
            </SelectItem>
            <SelectItem value="legacy" disabled>
              Legacy — Unavailable
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function ControlledDemo() {
  const [role, setRole] = useState("designer");
  const id = useId();
  return (
    <Demo stack>
      <Field label="Role" htmlFor={id}>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="pm">Product Manager</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <p className="sel-meta">Current value: {role}</p>
      <div className="sel-actions">
        <button type="button" className="sel-btn sel-btn--ghost" onClick={() => setRole("designer")}>
          Reset
        </button>
        <button type="button" className="sel-btn" onClick={() => setRole("developer")}>
          Set Developer
        </button>
      </div>
    </Demo>
  );
}

export function UncontrolledDemo() {
  return (
    <Demo>
      <Field label="Role (defaultValue)">
        <Select defaultValue="designer">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="pm">Product Manager</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <p className="sel-note">
        Use <code>defaultValue</code> uncontrolled; <code>value</code> + <code>onValueChange</code>{" "}
        controlled.
      </p>
    </Demo>
  );
}

export function GroupsDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Select a location" htmlFor={id} wide>
        <Select>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Choose location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Asia Pacific</SelectLabel>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function SeparatorsDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Country" htmlFor={id}>
        <Select defaultValue="nz">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Recently used</SelectLabel>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>All countries</SelectLabel>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function TypeaheadDemo() {
  const id = useId();
  return (
    <Demo stack>
      <Field label="Country (typeahead)" htmlFor={id} wide>
        <Select>
          <SelectTrigger id={id}>
            <SelectValue placeholder="Type a letter while open…" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c.toLowerCase().replace(/\s+/g, "-")}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <p className="sel-note">
        Open the menu and type — Radix jumps to matching options (e.g. “N” → Nepal / New Zealand).
      </p>
    </Demo>
  );
}

export function LongListDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Timezone" htmlFor={id} wide>
        <Select defaultValue="pacific/auckland">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz.toLowerCase()}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function PortalScrollDemo() {
  const id = useId();
  return (
    <div className="sel-demo sel-demo--scroll">
      <div className="sel-scroll-inner">
        <Field label="Not clipped by overflow" htmlFor={id}>
          <Select defaultValue="nz">
            <SelectTrigger id={id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nz">New Zealand</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="jp">Japan</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

export function TimePickerDemo() {
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState("AM");

  return (
    <Demo stack>
      <p className="sel-label">Time</p>
      <div className="sel-time-row">
        <Field label="Hour">
          <Select value={hour} onValueChange={setHour} size="md">
            <SelectTrigger aria-label="Hour">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const h = String(i + 1).padStart(2, "0");
                return (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </Field>
        <span className="sel-time-sep">:</span>
        <Field label="Minute">
          <Select value={minute} onValueChange={setMinute}>
            <SelectTrigger aria-label="Minute">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["00", "15", "30", "45"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Period">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger aria-label="AM or PM">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <p className="sel-meta">
        Selected: {hour}:{minute} {period}
      </p>
      <p className="sel-note">Composition example — not a standalone Time Picker product component.</p>
    </Demo>
  );
}

export function IconDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Payment type" htmlFor={id}>
        <Select defaultValue="card">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card" textValue="Card">
              <span className="sel-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M2 10h20" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </span>
              Card
            </SelectItem>
            <SelectItem value="bank" textValue="Bank transfer">
              <span className="sel-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M3 10l9-6 9 6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                  <path d="M5 10v8h14v-8" stroke="currentColor" strokeWidth="1.75" />
                  <path d="M3 18h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
              Bank transfer
            </SelectItem>
            <SelectItem value="cash" textValue="Cash">
              <span className="sel-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.75" />
                </svg>
              </span>
              Cash
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function SecondaryTextDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Environment" htmlFor={id} wide>
        <Select defaultValue="staging">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="production"
              textValue="Production"
              description="Live customer-facing environment"
            >
              Production
            </SelectItem>
            <SelectItem
              value="staging"
              textValue="Staging"
              description="Internal testing environment"
            >
              Staging
            </SelectItem>
            <SelectItem
              value="development"
              textValue="Development"
              description="Local development environment"
            >
              Development
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function FormDemo() {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const id = useId();
  const errId = useId();
  const hintId = useId();

  return (
    <Demo stack>
      <form
        style={{ maxWidth: 280 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!role) {
            setError("Please select a role.");
            setStatus("");
            return;
          }
          setError("");
          setStatus(`Submitted role: ${role}`);
        }}
      >
        <Field
          label="Role"
          required
          htmlFor={id}
          hint={error || "Choose your role in the system."}
          error={Boolean(error)}
        >
          <Select
            value={role || undefined}
            onValueChange={(v) => {
              setRole(v);
              setError("");
            }}
            error={Boolean(error)}
            required
          >
            <SelectTrigger
              id={id}
              aria-describedby={error ? errId : hintId}
              aria-invalid={Boolean(error)}
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="pm">Product Manager</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {error ? (
          <span id={errId} className="sel-hint sel-hint--error" role="alert" style={{ display: "none" }}>
            {error}
          </span>
        ) : (
          <span id={hintId} style={{ display: "none" }} />
        )}
        <div className="sel-actions" style={{ marginTop: 12 }}>
          <button type="submit" className="sel-btn sel-btn--primary">
            Submit
          </button>
        </div>
        {status ? (
          <p className="sel-hint sel-hint--success" role="status">
            {status}
          </p>
        ) : (
          <p className="sel-note">Local Storybook submit — no backend.</p>
        )}
      </form>
    </Demo>
  );
}

export function ErrorDemo() {
  const id = useId();
  const errId = useId();
  return (
    <Demo>
      <Field label="Role" required htmlFor={id} hint="Please select a role." error>
        <Select error required>
          <SelectTrigger id={id} aria-describedby={errId} aria-invalid>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <span id={errId} className="sel-hint sel-hint--error" role="alert" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        Please select a role.
      </span>
    </Demo>
  );
}

export function LongValueDemo() {
  const id = useId();
  return (
    <Demo>
      <Field label="Policy" htmlFor={id} wide>
        <Select defaultValue="long">
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="long">
              Enterprise data retention and regional compliance policy for APAC warehouses
            </SelectItem>
            <SelectItem value="short">Standard retention</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </Demo>
  );
}

export function CompareDemo() {
  return (
    <div className="sel-demo" style={{ padding: 0, overflow: "auto" }}>
      <table className="sel-compare">
        <thead>
          <tr>
            <th>Component</th>
            <th>Use when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Select</td>
            <td>Choose one value for a form field from a known list.</td>
          </tr>
          <tr>
            <td>Dropdown Menu</td>
            <td>Application actions (edit, archive, delete).</td>
          </tr>
          <tr>
            <td>Combobox</td>
            <td>Large lists that need search/filtering.</td>
          </tr>
          <tr>
            <td>Radio Group</td>
            <td>Few options that should stay visible for comparison.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SpecsDemo() {
  return (
    <div className="sel-specs-grid">
      <div className="sel-spec-card">
        <span className="sel-spec-label">Heights</span>
        <span className="sel-spec-value">sm 32 · md 36 · lg 40</span>
      </div>
      <div className="sel-spec-card">
        <span className="sel-spec-label">Radius</span>
        <span className="sel-spec-value">6px trigger · 10px menu</span>
      </div>
      <div className="sel-spec-card">
        <span className="sel-spec-label">Focus</span>
        <span className="sel-spec-value">Brand Blue ring</span>
      </div>
      <div className="sel-spec-card">
        <span className="sel-spec-label">Position</span>
        <span className="sel-spec-value">popper + portal</span>
      </div>
      <div className="sel-spec-card">
        <span className="sel-spec-label">Engine</span>
        <span className="sel-spec-value">@radix-ui/react-select</span>
      </div>
    </div>
  );
}

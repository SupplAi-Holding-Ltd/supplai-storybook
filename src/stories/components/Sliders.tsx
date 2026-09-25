/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, {
  useCallback,
  useId,
  useState,
} from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import "./Sliders.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type SliderSize = "sm" | "md" | "lg";
export type SliderOrientation = "horizontal" | "vertical";

export type SliderProps = Omit<
  React.ComponentPropsWithoutRef<typeof RadixSlider.Root>,
  "orientation"
> & {
  size?: SliderSize;
  orientation?: SliderOrientation;
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

export function clampSlider(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (step <= 0) return clampSlider(value, min, max);
  const snapped = Math.round((value - min) / step) * step + min;
  const precision = String(step).includes(".")
    ? String(step).split(".")[1].length
    : 0;
  const rounded =
    precision > 0 ? Number(snapped.toFixed(precision)) : snapped;
  return clampSlider(rounded, min, max);
}

export function markPercent(value: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return 0;
  return ((clampSlider(value, min, max) - min) / span) * 100;
}

/* ── Slider ───────────────────────────────────────────────────────────── */

export function Slider({
  className,
  size = "md",
  orientation = "horizontal",
  children,
  ...props
}: SliderProps) {
  const thumbCount = React.Children.toArray(children).filter(Boolean).length;
  const valueLen = (props.value ?? props.defaultValue ?? [0]).length;
  const fallbackThumbs =
    thumbCount === 0
      ? Array.from({ length: valueLen }, (_, i) => (
          <SliderThumb key={i} aria-label={`Value ${i + 1}`} />
        ))
      : null;

  return (
    <RadixSlider.Root
      className={[
        "sld-root",
        `sld-root--${size}`,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      orientation={orientation}
      {...props}
    >
      <RadixSlider.Track className="sld-track">
        <RadixSlider.Range className="sld-range" />
      </RadixSlider.Track>
      {children ?? fallbackThumbs}
    </RadixSlider.Root>
  );
}

export function SliderThumb({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSlider.Thumb>) {
  return (
    <RadixSlider.Thumb
      className={["sld-thumb", className ?? ""].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </RadixSlider.Thumb>
  );
}

/** Thumb with a value tip (Tooltips.mdx visual tokens). */
export function SliderThumbWithTip({
  tip,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixSlider.Thumb> & {
  tip: React.ReactNode;
}) {
  return (
    <RadixSlider.Thumb
      className={["sld-thumb", className ?? ""].filter(Boolean).join(" ")}
      {...props}
    >
      <span className="sld-tip" aria-hidden="true">
        {tip}
      </span>
    </RadixSlider.Thumb>
  );
}

/* ── Marks ────────────────────────────────────────────────────────────── */

export function SliderMarks({
  min,
  max,
  marks,
}: {
  min: number;
  max: number;
  marks: Array<number | { value: number; label?: string }>;
}) {
  return (
    <div className="sld-marks" aria-hidden="true">
      {marks.map((m) => {
        const value = typeof m === "number" ? m : m.value;
        const label =
          typeof m === "number" ? String(m) : (m.label ?? String(m.value));
        const left = markPercent(value, min, max);
        return (
          <span key={value} className="sld-mark" style={{ left: `${left}%` }}>
            <span className="sld-mark-tick" />
            <span className="sld-mark-label">{label}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────── */

export const SLIDER_CODE = `// Slider · supplai Design System
import { Slider, SliderThumb } from './Slider';

<Slider defaultValue={[50]} min={0} max={100}>
  <SliderThumb aria-label="Volume" />
</Slider>

// Range
<Slider defaultValue={[25, 75]} min={0} max={100}>
  <SliderThumb aria-label="Minimum" />
  <SliderThumb aria-label="Maximum" />
</Slider>

// Built on @radix-ui/react-slider
`;

function Demo({
  children,
  row,
}: {
  children: React.ReactNode;
  row?: boolean;
}) {
  return (
    <div className={`sld-demo${row ? " sld-demo--row" : ""}`}>{children}</div>
  );
}

function Field({
  label,
  htmlFor,
  valueText,
  hint,
  error,
  wide,
  children,
}: {
  label: string;
  htmlFor?: string;
  valueText?: React.ReactNode;
  hint?: React.ReactNode;
  error?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`sld-field${wide ? " sld-field--wide" : ""}`}>
      <div className="sld-label-row">
        <label className="sld-label" htmlFor={htmlFor}>
          {label}
        </label>
        {valueText != null ? (
          <span className="sld-value">{valueText}</span>
        ) : null}
      </div>
      {children}
      {hint ? (
        <span className={`sld-hint${error ? " sld-hint--error" : ""}`}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/* ── Playground ───────────────────────────────────────────────────────── */

export function SliderPlayground() {
  const [size, setSize] = useState<SliderSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [orientation, setOrientation] =
    useState<SliderOrientation>("horizontal");
  const [value, setValue] = useState([50]);
  const id = useId();

  return (
    <div className="sld-play">
      <div className="sld-play-preview">
        <Field label="Volume" htmlFor={id} valueText={`${value[0]}%`} wide>
          <Slider
            id={id}
            size={size}
            disabled={disabled}
            orientation={orientation}
            value={value}
            onValueChange={setValue}
            min={0}
            max={100}
            step={1}
          >
            <SliderThumb aria-label="Volume" />
          </Slider>
        </Field>
      </div>
      <div className="sld-play-controls">
        <div>
          <div className="sld-ctrl-label">Size</div>
          <div className="sld-chip-row">
            {(["sm", "md", "lg"] as SliderSize[]).map((s) => (
              <button
                key={s}
                type="button"
                className={`sld-chip${size === s ? " sld-chip--on" : ""}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="sld-ctrl-label">Orientation</div>
          <div className="sld-chip-row">
            {(["horizontal", "vertical"] as SliderOrientation[]).map((o) => (
              <button
                key={o}
                type="button"
                className={`sld-chip${orientation === o ? " sld-chip--on" : ""}`}
                onClick={() => setOrientation(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="sld-ctrl-label">State</div>
          <div className="sld-chip-row">
            <button
              type="button"
              className={`sld-chip${!disabled ? " sld-chip--on" : ""}`}
              onClick={() => setDisabled(false)}
            >
              Enabled
            </button>
            <button
              type="button"
              className={`sld-chip${disabled ? " sld-chip--on" : ""}`}
              onClick={() => setDisabled(true)}
            >
              Disabled
            </button>
          </div>
        </div>
        <p className="sld-meta">Current: {value[0]}</p>
      </div>
    </div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function DefaultDemo() {
  const [value, setValue] = useState([50]);
  const id = useId();
  return (
    <Demo>
      <Field label="Volume" htmlFor={id} valueText={value[0]} wide>
        <Slider id={id} value={value} onValueChange={setValue} min={0} max={100}>
          <SliderThumb aria-label="Volume" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function StepperDemo() {
  const min = 0;
  const max = 10;
  const step = 1;
  const [value, setValue] = useState([5]);
  const v = value[0];
  const id = useId();

  return (
    <Demo>
      <Field label="Quantity" htmlFor={id} valueText={v} wide>
        <div className="sld-stepper-row">
          <button
            type="button"
            className="sld-btn"
            aria-label="Decrease"
            disabled={v <= min}
            onClick={() => setValue([snapToStep(v - step, min, max, step)])}
          >
            −
          </button>
          <Slider
            id={id}
            value={value}
            onValueChange={setValue}
            min={min}
            max={max}
            step={step}
          >
            <SliderThumb aria-label="Quantity" />
          </Slider>
          <button
            type="button"
            className="sld-btn"
            aria-label="Increase"
            disabled={v >= max}
            onClick={() => setValue([snapToStep(v + step, min, max, step)])}
          >
            +
          </button>
        </div>
      </Field>
      <p className="sld-note">
        Stepper buttons are composition — not part of the Slider primitive.
      </p>
    </Demo>
  );
}

export function VerticalDemo() {
  const [vol, setVol] = useState([70]);
  const [bass, setBass] = useState([40]);
  const [treble, setTreble] = useState([55]);

  return (
    <Demo>
      <div className="sld-vertical-row">
        {(
          [
            ["Volume", vol, setVol],
            ["Bass", bass, setBass],
            ["Treble", treble, setTreble],
          ] as const
        ).map(([label, value, setValue]) => (
          <div key={label} className="sld-vertical-item">
            <span className="sld-label">{label}</span>
            <Slider
              orientation="vertical"
              value={value}
              onValueChange={setValue}
              min={0}
              max={100}
            >
              <SliderThumb aria-label={label} />
            </Slider>
            <span className="sld-value">{value[0]}%</span>
          </div>
        ))}
      </div>
    </Demo>
  );
}

export function DisabledDemo() {
  return (
    <Demo>
      <Field
        label="Brightness"
        valueText="40"
        hint="Disabled — value is visible but not adjustable."
        wide
      >
        <Slider defaultValue={[40]} disabled min={0} max={100}>
          <SliderThumb aria-label="Brightness" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function RangeDemo() {
  const [value, setValue] = useState([250, 750]);
  return (
    <Demo>
      <Field label="Price range" valueText={`$${value[0]} – $${value[1]}`} wide>
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={1000}
          step={10}
          minStepsBetweenThumbs={1}
        >
          <SliderThumb aria-label="Minimum price" />
          <SliderThumb aria-label="Maximum price" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function PriceRangeInputsDemo() {
  const min = 0;
  const max = 1000;
  const step = 10;
  const [value, setValue] = useState([250, 750]);

  const syncFromInput = (index: 0 | 1, raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    const next = [...value] as [number, number];
    next[index] = snapToStep(n, min, max, step);
    if (index === 0 && next[0] > next[1]) next[0] = next[1];
    if (index === 1 && next[1] < next[0]) next[1] = next[0];
    setValue(next);
  };

  return (
    <Demo>
      <Field label="Price Range" valueText={`$${value[0]} – $${value[1]}`} wide>
        <Slider
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          step={step}
          minStepsBetweenThumbs={1}
        >
          <SliderThumb aria-label="Minimum price" />
          <SliderThumb aria-label="Maximum price" />
        </Slider>
        <div className="sld-input-row">
          <div className="sld-input-field">
            <span className="sld-label" id="sld-min-price">
              Min Price
            </span>
            <input
              className="sld-input sld-input--wide"
              type="number"
              min={min}
              max={max}
              step={step}
              value={value[0]}
              aria-labelledby="sld-min-price"
              onChange={(e) => syncFromInput(0, e.target.value)}
            />
          </div>
          <div className="sld-input-field">
            <span className="sld-label" id="sld-max-price">
              Max Price
            </span>
            <input
              className="sld-input sld-input--wide"
              type="number"
              min={min}
              max={max}
              step={step}
              value={value[1]}
              aria-labelledby="sld-max-price"
              onChange={(e) => syncFromInput(1, e.target.value)}
            />
          </div>
        </div>
      </Field>
      <p className="sld-note">
        Out-of-bounds input snaps to step and clamps. Thumbs cannot cross.
      </p>
    </Demo>
  );
}

export function WithInputDemo() {
  const min = 0;
  const max = 100;
  const step = 1;
  const [value, setValue] = useState([50]);
  const [draft, setDraft] = useState("50");
  const id = useId();
  const inputId = useId();

  const applyDraft = useCallback(() => {
    if (draft.trim() === "") {
      setDraft(String(value[0]));
      return;
    }
    const n = Number(draft);
    if (Number.isNaN(n)) {
      setDraft(String(value[0]));
      return;
    }
    const next = snapToStep(n, min, max, step);
    setValue([next]);
    setDraft(String(next));
  }, [draft, value, min, max, step]);

  return (
    <Demo>
      <Field label="Volume" htmlFor={id} valueText={`${value[0]}%`} wide>
        <Slider
          id={id}
          value={value}
          onValueChange={(v) => {
            setValue(v);
            setDraft(String(v[0]));
          }}
          min={min}
          max={max}
          step={step}
        >
          <SliderThumb aria-label="Volume" />
        </Slider>
        <div className="sld-input-field">
          <label className="sld-label" htmlFor={inputId}>
            Exact value
          </label>
          <input
            id={inputId}
            className="sld-input"
            type="number"
            min={min}
            max={max}
            step={step}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={applyDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyDraft();
            }}
          />
        </div>
      </Field>
      <p className="sld-note">
        Empty / invalid input reverts on blur. Out-of-range values clamp and snap
        to step.
      </p>
    </Demo>
  );
}

export function WithTooltipDemo() {
  const [value, setValue] = useState([64]);
  const [range, setRange] = useState([20, 80]);
  const id = useId();

  return (
    <Demo>
      <Field
        label="Opacity"
        htmlFor={id}
        hint="Tip uses Tooltips visual tokens (Tooltip component is still In Development)."
        wide
      >
        <Slider id={id} value={value} onValueChange={setValue} min={0} max={100}>
          <SliderThumbWithTip tip={value[0]} aria-label="Opacity" />
        </Slider>
      </Field>
      <Field
        label="Range with tips"
        valueText={`${range[0]} – ${range[1]}`}
        wide
      >
        <Slider value={range} onValueChange={setRange} min={0} max={100}>
          <SliderThumbWithTip tip={range[0]} aria-label="Minimum" />
          <SliderThumbWithTip tip={range[1]} aria-label="Maximum" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function WithMarksDemo() {
  const min = 0;
  const max = 12;
  const [value, setValue] = useState([6]);
  const marks = [0, 2, 4, 6, 8, 10, 12];
  const id = useId();

  return (
    <Demo>
      <Field
        label="Duration (Months)"
        htmlFor={id}
        valueText={`${value[0]} mo`}
        wide
      >
        <div className="sld-marks-wrap">
          <Slider
            id={id}
            value={value}
            onValueChange={setValue}
            min={min}
            max={max}
            step={1}
          >
            <SliderThumb aria-label="Duration in months" />
          </Slider>
          <SliderMarks min={min} max={max} marks={marks} />
        </div>
      </Field>
    </Demo>
  );
}

export function MarksLabelsDemo() {
  const min = 0;
  const max = 100;
  const [value, setValue] = useState([50]);
  const id = useId();

  return (
    <Demo>
      <Field label="Storage" htmlFor={id} valueText={`${value[0]} GB`} wide>
        <Slider
          id={id}
          value={value}
          onValueChange={setValue}
          min={min}
          max={max}
          step={5}
        >
          <SliderThumb aria-label="Storage" />
        </Slider>
        <div className="sld-mark-labels-only" aria-hidden="true">
          <span>0 GB</span>
          <span>50 GB</span>
          <span>100 GB</span>
        </div>
      </Field>
    </Demo>
  );
}

export function MinMaxDemo() {
  const [value, setValue] = useState([30]);
  const id = useId();
  return (
    <Demo>
      <Field
        label="Threshold"
        htmlFor={id}
        valueText={value[0]}
        hint="Minimum: 10 · Maximum: 50"
        wide
      >
        <Slider
          id={id}
          value={value}
          onValueChange={setValue}
          min={10}
          max={50}
          step={1}
        >
          <SliderThumb aria-label="Threshold" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function StepDemo() {
  const [tens, setTens] = useState([40]);
  const [halves, setHalves] = useState([2.5]);
  return (
    <Demo>
      <Field label="Step 10" valueText={tens[0]} wide>
        <Slider value={tens} onValueChange={setTens} min={0} max={100} step={10}>
          <SliderThumb aria-label="Step ten" />
        </Slider>
      </Field>
      <Field label="Step 0.5" valueText={halves[0].toFixed(1)} wide>
        <Slider
          value={halves}
          onValueChange={setHalves}
          min={0}
          max={5}
          step={0.5}
        >
          <SliderThumb aria-label="Step half" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function ControlledDemo() {
  const [value, setValue] = useState([40]);
  const id = useId();
  return (
    <Demo>
      <Field label="Controlled" htmlFor={id} valueText={value[0]} wide>
        <Slider id={id} value={value} onValueChange={setValue} min={0} max={100}>
          <SliderThumb aria-label="Controlled value" />
        </Slider>
      </Field>
      <div className="sld-actions">
        <button
          type="button"
          className="sld-btn sld-btn--ghost"
          onClick={() => setValue([0])}
        >
          Min
        </button>
        <button
          type="button"
          className="sld-btn sld-btn--ghost"
          onClick={() => setValue([50])}
        >
          50%
        </button>
        <button
          type="button"
          className="sld-btn sld-btn--ghost"
          onClick={() => setValue([100])}
        >
          Max
        </button>
        <button
          type="button"
          className="sld-btn sld-btn--ghost"
          onClick={() => setValue([40])}
        >
          Reset
        </button>
      </div>
      <p className="sld-meta">Current value: {value[0]}</p>
    </Demo>
  );
}

export function UncontrolledDemo() {
  return (
    <Demo>
      <Field
        label="Uncontrolled"
        hint="Uses defaultValue={[40]} — internal state after first render."
        wide
      >
        <Slider defaultValue={[40]} min={0} max={100}>
          <SliderThumb aria-label="Uncontrolled value" />
        </Slider>
      </Field>
    </Demo>
  );
}

export function SizesDemo() {
  return (
    <Demo>
      {(["sm", "md", "lg"] as SliderSize[]).map((size) => (
        <Field key={size} label={size.toUpperCase()} wide>
          <Slider
            size={size}
            defaultValue={[size === "sm" ? 30 : size === "md" ? 50 : 70]}
          >
            <SliderThumb aria-label={`Size ${size}`} />
          </Slider>
        </Field>
      ))}
    </Demo>
  );
}

function VolumeIcon({ loud }: { loud?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10v4h3l4 3V7L7 10H4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {loud ? (
        <path
          d="M15 9a4 4 0 010 6M17.5 7a7 7 0 010 10"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M15 10.5a2.5 2.5 0 010 3"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function VolumeDemo() {
  const [value, setValue] = useState([65]);
  const id = useId();
  return (
    <Demo>
      <Field label="Speaker volume" htmlFor={id} valueText={`${value[0]}%`} wide>
        <div className="sld-stepper-row">
          <span className="sld-icon-side">
            <VolumeIcon />
          </span>
          <Slider id={id} value={value} onValueChange={setValue} min={0} max={100}>
            <SliderThumb aria-label="Speaker volume" />
          </Slider>
          <span className="sld-icon-side">
            <VolumeIcon loud />
          </span>
        </div>
      </Field>
      <p className="sld-note">
        Icons are decorative; the thumb carries the accessible name.
      </p>
    </Demo>
  );
}

export function FormDemo() {
  const [value, setValue] = useState([250, 750]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  return (
    <Demo>
      <form
        style={{ maxWidth: 420, width: "100%" }}
        onSubmit={(e) => {
          e.preventDefault();
          const span = value[1] - value[0];
          if (span < 50) {
            setError("Selected price range is too narrow (min $50 span).");
            setStatus("");
            return;
          }
          setError("");
          setStatus(`Submitted range: $${value[0]} – $${value[1]}`);
        }}
        onReset={(e) => {
          e.preventDefault();
          setValue([250, 750]);
          setError("");
          setStatus("");
        }}
      >
        <Field
          label="Price Range"
          valueText={`$${value[0]} – $${value[1]}`}
          hint={error || "Choose a filter range, then submit."}
          error={Boolean(error)}
          wide
        >
          <Slider
            value={value}
            onValueChange={(v) => {
              setValue(v);
              if (error) setError("");
            }}
            min={0}
            max={1000}
            step={10}
            minStepsBetweenThumbs={1}
          >
            <SliderThumb aria-label="Minimum price" />
            <SliderThumb aria-label="Maximum price" />
          </Slider>
          <div className="sld-input-row">
            <div className="sld-input-field">
              <span className="sld-label">Min Price</span>
              <input
                className="sld-input sld-input--wide"
                type="number"
                value={value[0]}
                min={0}
                max={1000}
                step={10}
                onChange={(e) => {
                  const n = snapToStep(Number(e.target.value) || 0, 0, 1000, 10);
                  setValue([Math.min(n, value[1]), value[1]]);
                }}
              />
            </div>
            <div className="sld-input-field">
              <span className="sld-label">Max Price</span>
              <input
                className="sld-input sld-input--wide"
                type="number"
                value={value[1]}
                min={0}
                max={1000}
                step={10}
                onChange={(e) => {
                  const n = snapToStep(Number(e.target.value) || 0, 0, 1000, 10);
                  setValue([value[0], Math.max(n, value[0])]);
                }}
              />
            </div>
          </div>
        </Field>
        <div className="sld-actions" style={{ marginTop: 12 }}>
          <button type="reset" className="sld-btn sld-btn--ghost">
            Reset
          </button>
          <button type="submit" className="sld-btn sld-btn--primary">
            Submit
          </button>
        </div>
        {status ? (
          <p className="sld-hint sld-hint--success" role="status">
            {status}
          </p>
        ) : null}
      </form>
    </Demo>
  );
}

export function CompareDemo() {
  return (
    <div className="sld-compare">
      <div className="sld-compare-card">
        <h3>Slider</h3>
        <p>
          Interactive. User picks a value or range by position on a scale.
        </p>
      </div>
      <div className="sld-compare-card">
        <h3>Input / Number</h3>
        <p>
          Best when an exact numeric entry matters more than relative position.
        </p>
      </div>
      <div className="sld-compare-card">
        <h3>Progress</h3>
        <p>
          Presentational only. Communicates system progress — never draggable.
        </p>
      </div>
      <div className="sld-compare-card">
        <h3>Stepper</h3>
        <p>
          Discrete +/− adjustment. Combine with Slider when both modes help.
        </p>
      </div>
    </div>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Track sm / md / lg", "4 / 6 / 8 px"],
    ["Thumb sm / md / lg", "14 / 16 / 18 px"],
    ["Hit padding", "±8 px around thumb"],
    ["Track color", "#E2E8F0"],
    ["Range fill", "#4169E1"],
    ["Thumb border", "2px #4169E1"],
    ["Focus ring", "0 0 0 3px rgba(65,105,225,0.25)"],
    ["Radius", "999px track · 50% thumb"],
    ["Font", "Manrope"],
  ];
  return (
    <div className="sld-specs-grid">
      {rows.map(([label, value]) => (
        <div key={label} className="sld-spec-card">
          <span className="sld-spec-label">{label}</span>
          <span className="sld-spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

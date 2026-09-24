/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, { useId, useState } from "react";
import "./CurrencyInputs.css";

/* ── Currency presets ─────────────────────────────────────────────────── */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY" | "CNY";

export type CurrencyPreset = {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  decimals: number;
  label: string;
};

export const CURRENCY_PRESETS: Record<CurrencyCode, CurrencyPreset> = {
  USD: { code: "USD", symbol: "$", locale: "en-US", decimals: 2, label: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", decimals: 2, label: "Euro" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", decimals: 2, label: "British Pound" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN", decimals: 2, label: "Indian Rupee" },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", decimals: 0, label: "Japanese Yen" },
  CNY: { code: "CNY", symbol: "¥", locale: "zh-CN", decimals: 2, label: "Chinese Yuan" },
};

export type GroupSeparator = "," | "." | false;
export type DecimalSeparator = "." | ",";

/* ── Formatting helpers ───────────────────────────────────────────────── */

function resolveSeparators(
  locale: string,
  groupSeparator?: GroupSeparator,
  decimalSeparator?: DecimalSeparator,
): { group: string; decimal: string; useGrouping: boolean } {
  const parts = new Intl.NumberFormat(locale).formatToParts(1234567.89);
  const intlGroup = parts.find((p) => p.type === "group")?.value ?? ",";
  const intlDecimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  const useGrouping = groupSeparator !== false;
  const group =
    groupSeparator === false
      ? ""
      : groupSeparator !== undefined
        ? groupSeparator
        : intlGroup;
  const decimal = decimalSeparator ?? intlDecimal;
  return { group, decimal, useGrouping };
}

/** Unformatted amount: optional `-`, digits, `.` decimal. Empty allowed. */
export function parseCurrencyInput(text: string, decimalSep: string): string {
  if (!text) return "";
  let s = text.trim();
  const neg = s.startsWith("-");
  if (neg) s = s.slice(1);

  const escaped = decimalSep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  s = s.replace(new RegExp(`[^0-9${escaped}]`, "g"), "");

  const di = s.indexOf(decimalSep);
  if (di !== -1) {
    const intPart = s.slice(0, di).replace(new RegExp(escaped, "g"), "");
    const fracPart = s.slice(di + 1).replace(new RegExp(escaped, "g"), "");
    s = `${intPart}.${fracPart}`;
  } else {
    s = s.replace(new RegExp(escaped, "g"), "");
  }

  if (s.startsWith(".")) s = `0${s}`;
  if (s === "") return neg ? "-" : "";
  return neg ? `-${s}` : s;
}

export function formatCurrencyDisplay(
  raw: string,
  opts: {
    locale: string;
    decimals: number;
    groupSeparator?: GroupSeparator;
    decimalSeparator?: DecimalSeparator;
    padFraction?: boolean;
  },
): string {
  if (raw === "" || raw === "-") return raw === "-" ? "-" : "";

  const { group, decimal, useGrouping } = resolveSeparators(
    opts.locale,
    opts.groupSeparator,
    opts.decimalSeparator,
  );

  const neg = raw.startsWith("-");
  const body = neg ? raw.slice(1) : raw;
  const [intRaw = "0", fracRaw = ""] = body.split(".");
  const intDigits = intRaw.replace(/\D/g, "") || "0";

  let frac = fracRaw.replace(/\D/g, "");
  if (opts.decimals === 0) {
    frac = "";
  } else if (opts.padFraction) {
    frac = frac.slice(0, opts.decimals).padEnd(opts.decimals, "0");
  } else {
    frac = frac.slice(0, opts.decimals);
  }

  let intFormatted = intDigits.replace(/^0+(?=\d)/, "");
  if (intFormatted === "") intFormatted = "0";

  if (useGrouping && group) {
    intFormatted = intFormatted.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  }

  const out =
    opts.decimals === 0 || (frac === "" && !opts.padFraction)
      ? intFormatted
      : `${intFormatted}${decimal}${frac}`;

  return neg ? `-${out}` : out;
}

export function rawToNumber(raw: string): number | null {
  if (raw === "" || raw === "-" || raw === "." || raw === "-.") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function clampAndPad(raw: string, min?: number, max?: number, decimals = 2): string {
  if (raw === "" || raw === "-") return "";
  let n = rawToNumber(raw);
  if (n === null) return "";
  if (min !== undefined && n < min) n = min;
  if (max !== undefined && n > max) n = max;
  if (decimals <= 0) return String(Math.trunc(n));
  return n.toFixed(decimals);
}

function applyStep(
  raw: string,
  step: number,
  decimals: number,
  dir: 1 | -1,
  min?: number,
  max?: number,
): string {
  const n = rawToNumber(raw) ?? 0;
  let next = n + dir * step;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  if (decimals <= 0) return String(Math.trunc(next));
  const f = 10 ** decimals;
  return (Math.round(next * f) / f).toFixed(decimals);
}

function limitFraction(raw: string, decimals: number): string {
  if (!raw.includes(".") || decimals === 0) {
    return decimals === 0 ? raw.split(".")[0] ?? raw : raw;
  }
  const [a, b = ""] = raw.split(".");
  return `${a}.${b.slice(0, decimals)}`;
}

/* ── CurrencyInput ────────────────────────────────────────────────────── */

export type CurrencyInputProps = {
  id?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  currency?: CurrencyCode;
  locale?: string;
  symbol?: string;
  showSymbol?: boolean;
  showCode?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  decimals?: number;
  groupSeparator?: GroupSeparator;
  decimalSeparator?: DecimalSeparator;
  min?: number;
  max?: number;
  step?: number;
  /** Controlled unformatted value (e.g. "1234.56") */
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  /** Omit outer field wrapper (for Input Group / select combo) */
  bare?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onValueChange?: (raw: string, meta: { float: number | null; formatted: string }) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export function CurrencyInput({
  id: idProp,
  label,
  helperText,
  error,
  errorMessage,
  currency = "USD",
  locale: localeProp,
  symbol: symbolProp,
  showSymbol = false,
  showCode = false,
  prefix,
  suffix,
  decimals: decimalsProp,
  groupSeparator,
  decimalSeparator,
  min,
  max,
  step = 1,
  value: valueProp,
  defaultValue = "",
  placeholder = "0.00",
  disabled,
  readOnly,
  required,
  name,
  className,
  bare = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  onValueChange,
  onBlur,
  onFocus,
}: CurrencyInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;

  const preset = CURRENCY_PRESETS[currency];
  const locale = localeProp ?? preset.locale;
  const symbol = symbolProp ?? preset.symbol;
  const decimals = decimalsProp ?? preset.decimals;
  const { decimal: activeDecimal } = resolveSeparators(locale, groupSeparator, decimalSeparator);

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const raw = isControlled ? valueProp! : internal;
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");

  const formatOpts = {
    locale,
    decimals,
    groupSeparator,
    decimalSeparator,
  };

  const formatted = formatCurrencyDisplay(raw, { ...formatOpts, padFraction: true });
  const display = focused ? draft : formatted === "" ? "" : formatted;

  const emit = (next: string, padFraction: boolean) => {
    if (!isControlled) setInternal(next);
    const fmt = formatCurrencyDisplay(next, { ...formatOpts, padFraction });
    onValueChange?.(next, { float: rawToNumber(next), formatted: fmt });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    const body =
      raw === "" || raw === "-" ? raw : raw.replace(".", activeDecimal);
    setDraft(body);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    let parsed = parseCurrencyInput(draft, activeDecimal);
    if (parsed === "-") parsed = "";
    parsed = limitFraction(parsed, decimals);
    const next = clampAndPad(parsed, min, max, decimals);
    emit(next, true);
    setDraft("");
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const escaped = activeDecimal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`^-?[0-9${escaped}]*$`);
    if (text !== "" && !re.test(text)) return;
    if ((text.match(new RegExp(escaped, "g")) || []).length > 1) return;

    let nextText = text;
    const di = nextText.indexOf(activeDecimal);
    if (di !== -1 && decimals === 0) {
      nextText = nextText.slice(0, di);
    } else if (di !== -1) {
      const frac = nextText.slice(di + 1);
      if (frac.length > decimals) {
        nextText = nextText.slice(0, di + 1 + decimals);
      }
    }

    setDraft(nextText);
    let parsed = parseCurrencyInput(nextText, activeDecimal);
    if (parsed === "-") {
      emit("", false);
      return;
    }
    parsed = limitFraction(parsed, decimals);
    emit(parsed, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const base = focused ? parseCurrencyInput(draft, activeDecimal) : raw;
    const next = applyStep(
      base === "-" || base === "" ? "0" : base,
      step,
      decimals,
      e.key === "ArrowUp" ? 1 : -1,
      min,
      max,
    );
    emit(next, true);
    setDraft(next.replace(".", activeDecimal));
  };

  const leading = prefix ?? (showSymbol ? symbol : null);
  const trailing = suffix ?? (showCode ? currency : null);
  const wrapMod =
    leading && trailing
      ? "ci-wrap--both"
      : leading
        ? "ci-wrap--prefix"
        : trailing
          ? "ci-wrap--suffix"
          : "";

  const describedBy =
    [ariaDescribedBy, helperText && !error ? hintId : null, error && errorMessage ? errId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const currencyA11y = `${preset.label} (${currency})`;

  const control = (
    <>
      <div className={`ci-wrap ${wrapMod}`}>
        {leading != null && (
          <span className="ci-prefix" aria-hidden="true">
            {leading}
          </span>
        )}
        <input
          id={id}
          name={name}
          type="text"
          inputMode={decimals === 0 ? "numeric" : "decimal"}
          autoComplete="off"
          className={`ci-input${error ? " ci-input--error" : ""}`}
          value={display}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel ?? (label ? undefined : currencyA11y)}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {trailing != null && (
          <span className="ci-suffix" aria-hidden="true">
            {trailing}
          </span>
        )}
      </div>
      <span className="sr-only">{currencyA11y}</span>
    </>
  );

  if (bare) {
    return <div className={className}>{control}</div>;
  }

  return (
    <div className={`ci-field ${className ?? ""}`}>
      {label && (
        <label className="ci-label" htmlFor={id}>
          {label}
          {required ? " *" : ""}
        </label>
      )}
      {control}
      {error && errorMessage && (
        <span className="ci-hint ci-hint--error" id={errId} role="alert">
          {errorMessage}
        </span>
      )}
      {!error && helperText && (
        <span className="ci-hint" id={hintId}>
          {helperText}
        </span>
      )}
    </div>
  );
}

/* ── Code sample ──────────────────────────────────────────────────────── */

export const CURRENCY_INPUT_CODE = `// Currency Input · supplai Design System
import { CurrencyInput } from './CurrencyInput';

// Unformatted value stays in state ("1234.56"); display is formatted.
function Example() {
  const [raw, setRaw] = React.useState('1250.00');

  return (
    <CurrencyInput
      label="Amount"
      currency="USD"
      showSymbol
      showCode
      value={raw}
      onValueChange={(next) => setRaw(next)}
      placeholder="0.00"
    />
  );
}

// Key props: currency, locale, decimals, groupSeparator, decimalSeparator,
// min, max, step, showSymbol, showCode, disabled, readOnly, error, errorMessage
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

function DemoShell({ children }: { children: React.ReactNode }) {
  return <div className="ci-demo">{children}</div>;
}

export function CurrencyPlayground() {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [raw, setRaw] = useState("1250");
  const [showSymbol, setShowSymbol] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [decimals, setDecimals] = useState<number | "preset">("preset");
  const preset = CURRENCY_PRESETS[currency];
  const d = decimals === "preset" ? preset.decimals : decimals;

  return (
    <div className="cip-wrap">
      <div className="cip-preview">
        <CurrencyInput
          label="Amount"
          currency={currency}
          decimals={d}
          showSymbol={showSymbol}
          showCode={showCode}
          value={raw}
          onValueChange={(v) => setRaw(v)}
          disabled={disabled}
          readOnly={readOnly}
          placeholder="0.00"
        />
      </div>
      <div className="cip-controls">
        <div className="cip-row">
          <span className="cip-label">Currency</span>
          {(Object.keys(CURRENCY_PRESETS) as CurrencyCode[]).map((c) => (
            <button
              key={c}
              type="button"
              className={`cip-chip${currency === c ? " cip-chip--on" : ""}`}
              onClick={() => setCurrency(c)}
            >
              {CURRENCY_PRESETS[c].symbol} {c}
            </button>
          ))}
        </div>
        <div className="cip-row">
          <span className="cip-label">Decimals</span>
          {(["preset", 0, 2, 4] as const).map((n) => (
            <button
              key={String(n)}
              type="button"
              className={`cip-chip${decimals === n ? " cip-chip--on" : ""}`}
              onClick={() => setDecimals(n)}
            >
              {n === "preset" ? "Preset" : String(n)}
            </button>
          ))}
        </div>
        <div className="cip-row">
          <span className="cip-label">Options</span>
          <button
            type="button"
            className={`cip-chip${showSymbol ? " cip-chip--on" : ""}`}
            onClick={() => setShowSymbol((v) => !v)}
          >
            Symbol
          </button>
          <button
            type="button"
            className={`cip-chip${showCode ? " cip-chip--on" : ""}`}
            onClick={() => setShowCode((v) => !v)}
          >
            Code
          </button>
          <button
            type="button"
            className={`cip-chip${disabled ? " cip-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </button>
          <button
            type="button"
            className={`cip-chip${readOnly ? " cip-chip--on" : ""}`}
            onClick={() => setReadOnly((v) => !v)}
          >
            Read-only
          </button>
        </div>
        <div className="cip-row">
          <span className="cip-label">Values</span>
          <span className="ci-hint ci-hint--meta">
            raw: {JSON.stringify(raw)} · fmt:{" "}
            {formatCurrencyDisplay(raw, {
              locale: preset.locale,
              decimals: d,
              padFraction: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  const [v, setV] = useState("");
  return (
    <DemoShell>
      <CurrencyInput
        label="Amount"
        currency="USD"
        showSymbol
        value={v}
        onValueChange={setV}
        placeholder="Enter amount"
        helperText="Formats on blur with US grouping."
      />
    </DemoShell>
  );
}

export function CurrenciesDemo() {
  const codes = Object.keys(CURRENCY_PRESETS) as CurrencyCode[];
  const [vals, setVals] = useState<Record<CurrencyCode, string>>(() =>
    Object.fromEntries(codes.map((c) => [c, c === "JPY" ? "1250" : "1250.00"])) as Record<
      CurrencyCode,
      string
    >,
  );
  return (
    <DemoShell>
      <div className="ci-grid-2">
        {codes.map((c) => {
          const p = CURRENCY_PRESETS[c];
          return (
            <CurrencyInput
              key={c}
              label={`${p.label} (${c})`}
              currency={c}
              showSymbol
              value={vals[c]}
              onValueChange={(next) => setVals((s) => ({ ...s, [c]: next }))}
              placeholder={p.decimals === 0 ? "0" : "0.00"}
              helperText={`Locale ${p.locale} · ${p.decimals} dp`}
            />
          );
        })}
      </div>
    </DemoShell>
  );
}

export function GroupSeparatorsDemo() {
  const [a, setA] = useState("1000000");
  const [b, setB] = useState("1000000");
  const [c, setC] = useState("1000000");
  return (
    <DemoShell>
      <div className="ci-grid-2">
        <CurrencyInput
          label="Comma grouping"
          currency="USD"
          groupSeparator=","
          decimalSeparator="."
          showSymbol
          value={a}
          onValueChange={setA}
          helperText="1,000,000"
        />
        <CurrencyInput
          label="Period grouping"
          currency="EUR"
          locale="de-DE"
          groupSeparator="."
          decimalSeparator=","
          showSymbol
          value={b}
          onValueChange={setB}
          helperText="1.000.000"
        />
        <CurrencyInput
          label="No grouping"
          currency="USD"
          groupSeparator={false}
          decimalSeparator="."
          showSymbol
          value={c}
          onValueChange={setC}
          helperText="1000000"
        />
      </div>
    </DemoShell>
  );
}

export function DecimalSeparatorsDemo() {
  const [a, setA] = useState("1234.56");
  const [b, setB] = useState("1234.56");
  return (
    <DemoShell>
      <div className="ci-grid-2">
        <CurrencyInput
          label="Period decimal"
          currency="USD"
          groupSeparator=","
          decimalSeparator="."
          showSymbol
          value={a}
          onValueChange={setA}
          helperText="1234.56"
        />
        <CurrencyInput
          label="Comma decimal"
          currency="EUR"
          locale="de-DE"
          groupSeparator="."
          decimalSeparator=","
          showSymbol
          value={b}
          onValueChange={setB}
          helperText="1234,56"
        />
      </div>
    </DemoShell>
  );
}

export function DecimalPrecisionDemo() {
  const [a, setA] = useState("12.34");
  const [b, setB] = useState("12.3456");
  const [c, setC] = useState("12");
  return (
    <DemoShell>
      <div className="ci-grid-2">
        <CurrencyInput
          label="2 decimal places"
          currency="USD"
          decimals={2}
          showSymbol
          value={a}
          onValueChange={setA}
        />
        <CurrencyInput
          label="4 decimal places"
          currency="USD"
          decimals={4}
          showSymbol
          value={b}
          onValueChange={setB}
          helperText="Entry capped at 4 digits; no mid-type rounding."
        />
        <CurrencyInput
          label="0 decimal places"
          currency="JPY"
          decimals={0}
          showSymbol
          value={c}
          onValueChange={setC}
          placeholder="0"
        />
      </div>
    </DemoShell>
  );
}

export function StepDemo() {
  const [v, setV] = useState("10.00");
  return (
    <DemoShell>
      <CurrencyInput
        label="Adjust with ↑ / ↓"
        currency="USD"
        showSymbol
        step={0.5}
        min={0}
        max={100}
        value={v}
        onValueChange={setV}
        helperText="Step 0.50 · min 0 · max 100"
      />
    </DemoShell>
  );
}

export function MinMaxDemo() {
  const [v, setV] = useState("500");
  const n = rawToNumber(v);
  const over = n !== null && n > 9999;
  const under = n !== null && n < 0;
  return (
    <DemoShell>
      <CurrencyInput
        label="Budget (max 9,999)"
        currency="USD"
        showSymbol
        min={0}
        max={9999}
        value={v}
        onValueChange={setV}
        error={over || under}
        errorMessage={
          over
            ? "Amount cannot exceed 9,999."
            : under
              ? "Amount cannot be negative."
              : undefined
        }
        helperText={!over && !under ? "Clamped on blur; live validation while editing." : undefined}
      />
    </DemoShell>
  );
}

export function PrefixSymbolsDemo() {
  const items: CurrencyCode[] = ["USD", "EUR", "GBP", "INR"];
  const [vals, setVals] = useState(
    Object.fromEntries(items.map((c) => [c, "99.00"])) as Record<string, string>,
  );
  return (
    <DemoShell>
      <div className="ci-grid-2">
        {items.map((code) => (
          <CurrencyInput
            key={code}
            label={CURRENCY_PRESETS[code].label}
            currency={code}
            showSymbol
            value={vals[code]}
            onValueChange={(next) => setVals((s) => ({ ...s, [code]: next }))}
          />
        ))}
      </div>
    </DemoShell>
  );
}

export function SuffixCodesDemo() {
  const items: CurrencyCode[] = ["USD", "EUR", "GBP", "INR"];
  const [vals, setVals] = useState(
    Object.fromEntries(items.map((c) => [c, "250.00"])) as Record<string, string>,
  );
  return (
    <DemoShell>
      <div className="ci-grid-2">
        {items.map((code) => (
          <CurrencyInput
            key={code}
            label={`${CURRENCY_PRESETS[code].symbol} amount ${code}`}
            currency={code}
            showSymbol
            showCode
            value={vals[code]}
            onValueChange={(next) => setVals((s) => ({ ...s, [code]: next }))}
          />
        ))}
      </div>
    </DemoShell>
  );
}

export function ExternalSymbolsDemo() {
  const [a, setA] = useState("45.00");
  const [b, setB] = useState("45.00");
  return (
    <DemoShell>
      <div className="ci-demo-row">
        <div className="ci-field" style={{ maxWidth: 360 }}>
          <label className="ci-label" htmlFor="ci-ext-sym">
            External symbol
          </label>
          <div className="ci-external">
            <span className="ci-external-tag" aria-hidden="true">
              $
            </span>
            <CurrencyInput
              id="ci-ext-sym"
              bare
              currency="USD"
              value={a}
              onValueChange={setA}
              aria-label="Amount in US dollars"
            />
          </div>
        </div>
        <div className="ci-field" style={{ maxWidth: 360 }}>
          <label className="ci-label" htmlFor="ci-ext-code">
            External code
          </label>
          <div className="ci-external">
            <CurrencyInput
              id="ci-ext-code"
              bare
              currency="EUR"
              value={b}
              onValueChange={setB}
              aria-label="Amount in euros"
            />
            <span className="ci-external-tag" aria-hidden="true">
              EUR
            </span>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export function CurrencySelectDemo() {
  const [code, setCode] = useState<CurrencyCode>("USD");
  const [raw, setRaw] = useState("199.99");
  const preset = CURRENCY_PRESETS[code];

  return (
    <DemoShell>
      <div className="ci-field" style={{ maxWidth: 380 }}>
        <label className="ci-label" htmlFor="ci-sel-amt">
          Price with currency
        </label>
        <div className="ci-combo">
          <select
            className="ci-combo-select"
            aria-label="Currency"
            value={code}
            onChange={(e) => setCode(e.target.value as CurrencyCode)}
          >
            {(Object.keys(CURRENCY_PRESETS) as CurrencyCode[]).map((c) => (
              <option key={c} value={c}>
                {CURRENCY_PRESETS[c].symbol} {c}
              </option>
            ))}
          </select>
          <CurrencyInput
            id="ci-sel-amt"
            bare
            currency={code}
            showCode
            value={raw}
            onValueChange={setRaw}
            aria-label={`Amount in ${preset.label}`}
            placeholder={preset.decimals === 0 ? "0" : "0.00"}
          />
        </div>
        <span className="ci-hint">
          Changing currency updates symbol and formatting — amount is preserved (no FX conversion).
        </span>
        <span className="ci-hint ci-hint--meta">raw: {JSON.stringify(raw)}</span>
      </div>
    </DemoShell>
  );
}

export function DisabledReadonlyDemo() {
  return (
    <DemoShell>
      <div className="ci-grid-2">
        <CurrencyInput
          label="Disabled"
          currency="USD"
          showSymbol
          defaultValue="42.00"
          disabled
        />
        <CurrencyInput
          label="Read-only"
          currency="EUR"
          showSymbol
          defaultValue="42.00"
          readOnly
          helperText="Focusable; value cannot be edited."
        />
      </div>
    </DemoShell>
  );
}

export function ValidationDemo() {
  const [v, setV] = useState("");
  const [touched, setTouched] = useState(false);
  const n = rawToNumber(v);
  const requiredErr = touched && v === "";
  const maxErr = n !== null && n > 500;
  const invalid = requiredErr || maxErr;

  return (
    <DemoShell>
      <CurrencyInput
        label="Offer price"
        currency="USD"
        showSymbol
        showCode
        required
        max={500}
        value={v}
        onValueChange={setV}
        onBlur={() => setTouched(true)}
        error={invalid}
        errorMessage={
          requiredErr
            ? "Amount is required."
            : maxErr
              ? "Offer cannot exceed $500.00."
              : undefined
        }
        helperText={!invalid ? "Required · maximum 500.00" : undefined}
      />
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [raw, setRaw] = useState("1234.5");
  const fmt = formatCurrencyDisplay(raw, {
    locale: "en-US",
    decimals: 2,
    padFraction: true,
  });
  return (
    <DemoShell>
      <CurrencyInput
        label="Controlled amount"
        currency="USD"
        showSymbol
        value={raw}
        onValueChange={setRaw}
      />
      <div className="ci-demo-row">
        <span className="ci-hint ci-hint--meta">unformatted: {JSON.stringify(raw)}</span>
        <span className="ci-hint ci-hint--meta">formatted: {JSON.stringify(fmt)}</span>
        <span className="ci-hint ci-hint--meta">float: {String(rawToNumber(raw))}</span>
      </div>
      <div className="cip-row">
        <button type="button" className="cip-chip" onClick={() => setRaw("0.00")}>
          Set 0
        </button>
        <button type="button" className="cip-chip" onClick={() => setRaw("9999.99")}>
          Set 9999.99
        </button>
        <button type="button" className="cip-chip" onClick={() => setRaw("")}>
          Clear
        </button>
      </div>
    </DemoShell>
  );
}

export function CombinedDemo() {
  const [code, setCode] = useState<CurrencyCode>("USD");
  const [raw, setRaw] = useState("250");
  const [decimals, setDecimals] = useState(2);
  const [touched, setTouched] = useState(false);
  const preset = CURRENCY_PRESETS[code];
  const n = rawToNumber(raw);
  const dp = code === "JPY" ? 0 : decimals;
  const err = touched && (raw === "" || (n !== null && (n < 1 || n > 9999)));

  return (
    <DemoShell>
      <div className="ci-field" style={{ maxWidth: 400 }}>
        <label className="ci-label" htmlFor="ci-combined">
          Invoice total *
        </label>
        <div className="ci-combo">
          <select
            className="ci-combo-select"
            aria-label="Currency"
            value={code}
            onChange={(e) => setCode(e.target.value as CurrencyCode)}
          >
            {(Object.keys(CURRENCY_PRESETS) as CurrencyCode[]).map((c) => (
              <option key={c} value={c}>
                {CURRENCY_PRESETS[c].symbol} {c}
              </option>
            ))}
          </select>
          <CurrencyInput
            id="ci-combined"
            bare
            currency={code}
            decimals={dp}
            showCode
            min={1}
            max={9999}
            step={1}
            value={raw}
            onValueChange={setRaw}
            onBlur={() => setTouched(true)}
            error={err}
            aria-label={`Invoice total in ${preset.label}`}
            placeholder={dp === 0 ? "0" : "0.00"}
          />
        </div>
        {err ? (
          <span className="ci-hint ci-hint--error" role="alert">
            Enter an amount between 1 and 9,999.
          </span>
        ) : (
          <span className="ci-hint">
            Select currency · ↑/↓ to step · 1–9999 · controlled raw value
          </span>
        )}
      </div>
      <div className="cip-row">
        <span className="cip-label">Precision</span>
        {[0, 2, 4].map((d) => (
          <button
            key={d}
            type="button"
            className={`cip-chip${decimals === d ? " cip-chip--on" : ""}`}
            onClick={() => setDecimals(d)}
            disabled={code === "JPY"}
          >
            {d} dp
          </button>
        ))}
      </div>
      <span className="ci-hint ci-hint--meta">
        raw: {JSON.stringify(raw)} · {preset.symbol} · {code}
      </span>
    </DemoShell>
  );
}

export function SpecsDemo() {
  return (
    <div className="ci-specs-grid">
      <div className="ci-spec-card">
        <span className="ci-spec-label">Height</span>
        <span className="ci-spec-value">36px</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Radius</span>
        <span className="ci-spec-value">6px</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Border</span>
        <span className="ci-spec-value">1px #D1D5DB</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Focus</span>
        <span className="ci-spec-value">Brand Blue ring</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Error</span>
        <span className="ci-spec-value">#D13145</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Value</span>
        <span className="ci-spec-value">Unformatted decimal string</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">Formatting</span>
        <span className="ci-spec-value">Intl + custom separators</span>
      </div>
      <div className="ci-spec-card">
        <span className="ci-spec-label">A11y</span>
        <span className="ci-spec-value">Label · aria-invalid · ↑/↓ step</span>
      </div>
    </div>
  );
}

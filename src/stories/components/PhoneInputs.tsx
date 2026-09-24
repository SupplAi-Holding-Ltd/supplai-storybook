/* eslint-disable react-refresh/only-export-components -- story module exports helpers + demos */
import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlagImage,
  defaultCountries,
  getActiveFormattingMask,
  parseCountry,
  usePhoneInput,
  type CountryData,
  type CountryIso2,
  type ParsedCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { OTPField } from "./OTPFields";
import "./PhoneInputs.css";

/* ── Helpers ──────────────────────────────────────────────────────────── */

export type PhoneSize = "sm" | "md" | "lg";

export function filterCountryList(
  onlyCountries?: CountryIso2[],
  excludeCountries?: CountryIso2[],
): CountryData[] {
  let list = defaultCountries;
  if (onlyCountries?.length) {
    const set = new Set(onlyCountries.map((c) => c.toLowerCase()));
    list = list.filter((c) => set.has(parseCountry(c).iso2));
  }
  if (excludeCountries?.length) {
    const set = new Set(excludeCountries.map((c) => c.toLowerCase()));
    list = list.filter((c) => !set.has(parseCountry(c).iso2));
  }
  return list;
}

/** Heuristic completeness from country mask — not carrier reachability. */
export function isPhoneComplete(phone: string, country: ParsedCountry): boolean {
  if (!phone || phone === `+${country.dialCode}`) return false;
  const mask = getActiveFormattingMask({
    phone,
    country,
    defaultMask: "............",
  });
  const required = (mask.match(/\./g) || []).length;
  if (required === 0) return phone.replace(/\D/g, "").length >= country.dialCode.length + 6;
  const national = phone
    .replace(new RegExp(`^\\+?${country.dialCode}`), "")
    .replace(/\D/g, "");
  return national.length >= required;
}

function countryMatches(c: ParsedCountry, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    c.name.toLowerCase().includes(s) ||
    c.iso2.toLowerCase().includes(s) ||
    c.dialCode.includes(s.replace(/^\+/, ""))
  );
}

/* ── PhoneInput ───────────────────────────────────────────────────────── */

export type PhoneInputProps = {
  id?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  defaultCountry?: CountryIso2;
  /** E.164 controlled value e.g. +14155552671 */
  value?: string;
  onChange?: (data: {
    phone: string;
    inputValue: string;
    country: ParsedCountry;
  }) => void;
  onlyCountries?: CountryIso2[];
  excludeCountries?: CountryIso2[];
  preferredCountries?: CountryIso2[];
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  size?: PhoneSize;
  disableFormatting?: boolean;
  forceDialCode?: boolean;
  className?: string;
  /** Hide searchable dropdown search field */
  hideSearch?: boolean;
};

export function PhoneInput({
  id: idProp,
  label,
  helperText,
  error,
  errorMessage,
  defaultCountry = "us",
  value,
  onChange,
  onlyCountries,
  excludeCountries,
  preferredCountries,
  disabled,
  readOnly,
  placeholder = "Phone number",
  name,
  size = "md",
  disableFormatting = false,
  forceDialCode = true,
  className,
  hideSearch = false,
}: PhoneInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;

  const countries = useMemo(
    () => filterCountryList(onlyCountries, excludeCountries),
    [onlyCountries, excludeCountries],
  );

  const safeDefault = useMemo(() => {
    const iso = defaultCountry.toLowerCase() as CountryIso2;
    const allowed = countries.map((c) => parseCountry(c).iso2);
    if (allowed.includes(iso)) return iso;
    return (allowed[0] ?? "us") as CountryIso2;
  }, [defaultCountry, countries]);

  const { inputValue, country, setCountry, handlePhoneValueChange, inputRef } =
    usePhoneInput({
      defaultCountry: safeDefault,
      value,
      countries,
      preferredCountries,
      forceDialCode,
      disableFormatting,
      onChange,
    });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const parsedList = useMemo(() => {
    const preferred = new Set((preferredCountries ?? []).map((c) => c.toLowerCase()));
    const items = countries.map(parseCountry).filter((c) => countryMatches(c, query));
    items.sort((a, b) => {
      const ap = preferred.has(a.iso2) ? 0 : 1;
      const bp = preferred.has(b.iso2) ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.name.localeCompare(b.name);
    });
    return items;
  }, [countries, query, preferredCountries]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open && !hideSearch) {
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open, hideSearch]);

  const toggleOpen = () => {
    if (disabled || readOnly) return;
    if (open) {
      setOpen(false);
      return;
    }
    setHighlight(0);
    setQuery("");
    setOpen(true);
  };

  const selectCountry = (iso2: CountryIso2) => {
    setCountry(iso2, { focusOnInput: true });
    setOpen(false);
  };

  const describedBy =
    [helperText && !error ? hintId : null, error && errorMessage ? errId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={`ph-field ${className ?? ""}`}>
      {label ? (
        <label className="ph-label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div
        ref={rootRef}
        className={[
          "ph-control",
          `ph-control--${size}`,
          focused ? "ph-control--focused" : "",
          error ? "ph-control--error" : "",
          disabled ? "ph-control--disabled" : "",
          readOnly ? "ph-control--readonly" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          className="ph-country-btn"
          disabled={disabled || readOnly}
          aria-label={`Country: ${country.name}. Dial code +${country.dialCode}`}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={toggleOpen}
        >
          <FlagImage iso2={country.iso2} size="18px" />
          <span className="ph-dial">+{country.dialCode}</span>
          <span className="ph-chevron" aria-hidden>
            ▾
          </span>
        </button>
        <input
          id={id}
          ref={inputRef}
          name={name}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          className="ph-input"
          value={inputValue}
          onChange={handlePhoneValueChange}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {open && (
          <div className="ph-dropdown" role="listbox" aria-label="Select country">
            {!hideSearch && (
              <input
                ref={searchRef}
                className="ph-search"
                type="search"
                placeholder="Search country or code…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlight((h) => Math.min(h + 1, Math.max(0, parsedList.length - 1)));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const c = parsedList[highlight];
                    if (c) selectCountry(c.iso2);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
              />
            )}
            <ul className="ph-list">
              {parsedList.length === 0 ? (
                <li className="ph-empty">No countries match</li>
              ) : (
                parsedList.map((c, i) => (
                  <li key={c.iso2}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.iso2 === country.iso2}
                      className={`ph-option${i === highlight ? " ph-option--active" : ""}`}
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => selectCountry(c.iso2)}
                    >
                      <FlagImage iso2={c.iso2} size="18px" />
                      <span className="ph-option-name">{c.name}</span>
                      <span className="ph-option-dial">+{c.dialCode}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && errorMessage ? (
        <span className="ph-hint ph-hint--error" id={errId} role="alert">
          {errorMessage}
        </span>
      ) : helperText ? (
        <span className="ph-hint" id={hintId}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

/* ── Code ─────────────────────────────────────────────────────────────── */

export const PHONE_INPUT_CODE = `// Phone Input · supplai Design System
import { PhoneInput } from './PhoneInput';

<PhoneInput
  label="Phone number"
  defaultCountry="nz"
  value={phone}
  onChange={({ phone }) => setPhone(phone)}
/>

// phone is E.164 (+64211234567). Display formatting via react-international-phone.
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

function DemoShell({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return <div className={`ph-demo${wide ? " ph-demo--wide" : ""}`}>{children}</div>;
}

export function PhonePlayground() {
  const [phone, setPhone] = useState("");
  const [display, setDisplay] = useState("");
  const [country, setCountryIso] = useState("us");
  const [defaultCountry, setDefaultCountry] = useState<CountryIso2>("us");
  const [size, setSize] = useState<PhoneSize>("md");
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState<"all" | "only" | "exclude">("all");

  const only =
    mode === "only" ? (["au", "nz", "us", "gb"] as CountryIso2[]) : undefined;
  const exclude =
    mode === "exclude" ? (["us", "np", "it", "gb"] as CountryIso2[]) : undefined;

  return (
    <div className="ph-play">
      <div className="ph-play-preview">
        <PhoneInput
          key={`${defaultCountry}-${mode}`}
          label="Phone number"
          defaultCountry={defaultCountry}
          value={phone}
          onChange={({ phone: p, inputValue, country: c }) => {
            setPhone(p);
            setDisplay(inputValue);
            setCountryIso(c.iso2);
          }}
          onlyCountries={only}
          excludeCountries={exclude}
          size={size}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          errorMessage={error ? "Enter a valid phone number." : undefined}
        />
        <span className="ph-meta">
          display: {JSON.stringify(display)} · e164: {JSON.stringify(phone)} · {country}
        </span>
      </div>
      <div className="ph-play-controls">
        <div className="ph-play-row">
          <span className="ph-play-label">Default</span>
          {(["us", "nz", "np", "gb", "au"] as CountryIso2[]).map((c) => (
            <button
              key={c}
              type="button"
              className={`ph-chip${defaultCountry === c ? " ph-chip--on" : ""}`}
              onClick={() => {
                setDefaultCountry(c);
                setPhone("");
                setDisplay("");
              }}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="ph-play-row">
          <span className="ph-play-label">Countries</span>
          {(
            [
              ["all", "All"],
              ["only", "AU/NZ/US/GB"],
              ["exclude", "Exclude US/NP/IT/GB"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`ph-chip${mode === k ? " ph-chip--on" : ""}`}
              onClick={() => {
                setMode(k);
                setPhone("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ph-play-row">
          <span className="ph-play-label">Size</span>
          {(["sm", "md", "lg"] as PhoneSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`ph-chip${size === s ? " ph-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ph-play-row">
          <span className="ph-play-label">Options</span>
          <button
            type="button"
            className={`ph-chip${disabled ? " ph-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </button>
          <button
            type="button"
            className={`ph-chip${readOnly ? " ph-chip--on" : ""}`}
            onClick={() => setReadOnly((v) => !v)}
          >
            Read-only
          </button>
          <button
            type="button"
            className={`ph-chip${error ? " ph-chip--on" : ""}`}
            onClick={() => setError((v) => !v)}
          >
            Error
          </button>
          <button type="button" className="ph-chip" onClick={() => { setPhone(""); setDisplay(""); }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export function DefaultDemo() {
  return (
    <DemoShell>
      <PhoneInput label="Phone number" defaultCountry="us" helperText="Select a country and enter your number." />
    </DemoShell>
  );
}

export function CountriesDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="International number"
        defaultCountry="us"
        preferredCountries={["us", "gb", "au", "nz", "np", "in", "jp"]}
        helperText="Try US, GB, AU, NZ, NP, IN, JP — formatting updates with the country."
      />
    </DemoShell>
  );
}

export function DefaultCountryDemo() {
  return (
    <DemoShell>
      <PhoneInput label="United States" defaultCountry="us" />
      <PhoneInput label="New Zealand" defaultCountry="nz" />
      <PhoneInput label="Nepal" defaultCountry="np" />
    </DemoShell>
  );
}

export function SelectorDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Country selector"
        defaultCountry="au"
        helperText="Opens a searchable list with flag, name, and dial code."
      />
    </DemoShell>
  );
}

export function SearchableDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Searchable countries"
        defaultCountry="gb"
        helperText="Search by name, ISO code, or dialling code."
      />
    </DemoShell>
  );
}

export function RestrictedDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Restricted list"
        defaultCountry="nz"
        onlyCountries={["au", "nz", "us", "gb"]}
        helperText="Only Australia, New Zealand, United States, and United Kingdom."
      />
    </DemoShell>
  );
}

export function ExcludedDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Excluded countries"
        defaultCountry="au"
        excludeCountries={["us", "np", "it", "gb"]}
        helperText="US, Nepal, Italy, and UK are not selectable."
      />
    </DemoShell>
  );
}

export function FormattingDemo() {
  const [display, setDisplay] = useState("");
  return (
    <DemoShell>
      <PhoneInput
        label="Live formatting"
        defaultCountry="us"
        onChange={({ inputValue }) => setDisplay(inputValue)}
        helperText="Spaces and parentheses follow the selected country mask."
      />
      <span className="ph-meta">formatted: {JSON.stringify(display)}</span>
    </DemoShell>
  );
}

export function E164Demo() {
  const [phone, setPhone] = useState("");
  const [display, setDisplay] = useState("");
  return (
    <DemoShell>
      <PhoneInput
        label="Display vs E.164"
        defaultCountry="us"
        value={phone}
        onChange={({ phone: p, inputValue }) => {
          setPhone(p);
          setDisplay(inputValue);
        }}
      />
      <span className="ph-meta">display: {display || "—"}</span>
      <span className="ph-meta">e164: {phone || "—"}</span>
      <p className="ph-note">
        Submit E.164 to APIs. Formatting characters are display-only. Incomplete numbers are still
        strings, not validated reachability.
      </p>
    </DemoShell>
  );
}

export function SizesDemo() {
  return (
    <DemoShell>
      <PhoneInput label="Small" size="sm" defaultCountry="nz" />
      <PhoneInput label="Medium" size="md" defaultCountry="nz" />
      <PhoneInput label="Large" size="lg" defaultCountry="nz" />
    </DemoShell>
  );
}

export function DisabledDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Disabled"
        defaultCountry="us"
        value="+14155552671"
        disabled
      />
    </DemoShell>
  );
}

export function ReadOnlyDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Read-only"
        defaultCountry="nz"
        value="+64211234567"
        readOnly
        helperText="Visible and selectable; not editable."
      />
    </DemoShell>
  );
}

export function ValidationDemo() {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<ParsedCountry | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const empty = phone === "" || (country && phone === `+${country.dialCode}`);
  const complete = country ? isPhoneComplete(phone, country) : false;
  const showEmpty = touched && empty;
  const showIncomplete = touched && !empty && !complete;
  const showInvalid = submitted && !empty && !complete;
  const showOk = submitted && complete;
  const error = showEmpty || showIncomplete || showInvalid;

  let message: string | undefined;
  if (showEmpty) message = "Phone number is required.";
  else if (showIncomplete || showInvalid) message = "Enter a complete phone number for the selected country.";

  return (
    <DemoShell>
      <form
        className="ph-panel"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          setSubmitted(true);
        }}
      >
        <h3 className="ph-panel-title">Contact phone</h3>
        <p className="ph-panel-desc">
          Validation uses country formatting masks — not carrier lookup.
        </p>
        <PhoneInput
          label="Mobile"
          defaultCountry="nz"
          value={phone}
          onChange={({ phone: p, country: c }) => {
            setPhone(p);
            setCountry(c);
            setSubmitted(false);
          }}
          error={error}
          errorMessage={error ? message : undefined}
          helperText={!error && !showOk ? "Include area / mobile prefix as required." : undefined}
        />
        {showOk ? (
          <span className="ph-hint ph-hint--success" role="status">
            Looks complete for {country?.name}.
          </span>
        ) : null}
        <button type="submit" className="ph-btn ph-btn--primary">
          Submit
        </button>
      </form>
    </DemoShell>
  );
}

export function ErrorStateDemo() {
  return (
    <DemoShell>
      <PhoneInput
        label="Phone"
        defaultCountry="us"
        value="+14155"
        error
        errorMessage="That number looks incomplete."
      />
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [phone, setPhone] = useState("+14155552671");
  return (
    <DemoShell>
      <PhoneInput
        label="Controlled"
        defaultCountry="us"
        value={phone}
        onChange={({ phone: p }) => setPhone(p)}
      />
      <div className="ph-actions">
        <button type="button" className="ph-btn ph-btn--ghost" onClick={() => setPhone("")}>
          Clear
        </button>
        <button
          type="button"
          className="ph-btn ph-btn--outline"
          onClick={() => setPhone("+64211234567")}
        >
          Set NZ demo
        </button>
        <span className="ph-meta">{phone || "(empty)"}</span>
      </div>
    </DemoShell>
  );
}

export function FormDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<ParsedCountry | null>(null);
  const [msg, setMsg] = useState("");

  return (
    <DemoShell wide>
      <form
        className="ph-panel"
        style={{ maxWidth: 480 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !email.trim()) {
            setMsg("Name and email are required.");
            return;
          }
          if (!country || !isPhoneComplete(phone, country)) {
            setMsg("Enter a complete phone number.");
            return;
          }
          setMsg(`Demo submit OK — ${name}, ${email}, ${phone}`);
        }}
      >
        <h3 className="ph-panel-title">Signup</h3>
        <p className="ph-panel-desc">Local demo only — nothing is sent to a server.</p>
        <div className="ph-field">
          <label className="ph-label" htmlFor="ph-name">
            Full name
          </label>
          <input
            id="ph-name"
            className="ph-native-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
          />
        </div>
        <div className="ph-field">
          <label className="ph-label" htmlFor="ph-email">
            Email
          </label>
          <input
            id="ph-email"
            className="ph-native-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
          />
        </div>
        <PhoneInput
          label="Phone"
          defaultCountry="nz"
          value={phone}
          onChange={({ phone: p, country: c }) => {
            setPhone(p);
            setCountry(c);
            setMsg("");
          }}
          name="phone"
        />
        <button type="submit" className="ph-btn ph-btn--primary">
          Continue
        </button>
        {msg ? (
          <span className={`ph-hint${msg.startsWith("Demo") ? " ph-hint--success" : " ph-hint--error"}`}>
            {msg}
          </span>
        ) : null}
      </form>
    </DemoShell>
  );
}

export function OtpFlowDemo() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<ParsedCountry | null>(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  if (step === "otp") {
    return (
      <DemoShell>
        <div className="ph-panel">
          <h3 className="ph-panel-title">Enter verification code</h3>
          <p className="ph-panel-desc">
            Simulated SMS to {phone}. Use demo code <strong>123456</strong> — no real message is sent.
          </p>
          <OTPField
            length={6}
            value={otp}
            onValueChange={setOtp}
            validationType="numeric"
            size={40}
            aria-label="Verification code"
          />
          <div className="ph-actions">
            <button
              type="button"
              className="ph-btn ph-btn--primary"
              disabled={otp.length < 6}
              onClick={() =>
                setStatus(otp === "123456" ? "Verified (demo)." : "Incorrect code.")
              }
            >
              Verify
            </button>
            <button
              type="button"
              className="ph-btn ph-btn--ghost"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setStatus("");
              }}
            >
              Back
            </button>
          </div>
          {status ? (
            <span
              className={`ph-hint${status.startsWith("Verified") ? " ph-hint--success" : " ph-hint--error"}`}
              role="status"
            >
              {status}
            </span>
          ) : null}
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell>
      <div className="ph-panel">
        <h3 className="ph-panel-title">Verify your phone</h3>
        <p className="ph-panel-desc">Phone Input → OTP Field (simulated).</p>
        <PhoneInput
          label="Mobile number"
          defaultCountry="nz"
          value={phone}
          onChange={({ phone: p, country: c }) => {
            setPhone(p);
            setCountry(c);
          }}
        />
        <button
          type="button"
          className="ph-btn ph-btn--primary"
          onClick={() => {
            if (!country || !isPhoneComplete(phone, country)) {
              setStatus("Enter a complete number first.");
              return;
            }
            setStatus("");
            setStep("otp");
          }}
        >
          Send code
        </button>
        {status ? <span className="ph-hint ph-hint--error">{status}</span> : null}
      </div>
    </DemoShell>
  );
}

export function NoFormattingDemo() {
  const [phone, setPhone] = useState("");
  return (
    <DemoShell>
      <PhoneInput
        label="No formatting"
        defaultCountry="us"
        disableFormatting
        value={phone}
        onChange={({ phone: p }) => setPhone(p)}
        helperText="Digits only in the field; E.164 still available."
      />
      <span className="ph-meta">{phone}</span>
    </DemoShell>
  );
}

export function SpecsDemo() {
  return (
    <div className="ph-specs-grid">
      <div className="ph-spec-card">
        <span className="ph-spec-label">Height</span>
        <span className="ph-spec-value">sm 32 · md 36 · lg 40</span>
      </div>
      <div className="ph-spec-card">
        <span className="ph-spec-label">Radius</span>
        <span className="ph-spec-value">6px</span>
      </div>
      <div className="ph-spec-card">
        <span className="ph-spec-label">Focus</span>
        <span className="ph-spec-value">Brand Blue ring</span>
      </div>
      <div className="ph-spec-card">
        <span className="ph-spec-label">Value</span>
        <span className="ph-spec-value">E.164 string</span>
      </div>
      <div className="ph-spec-card">
        <span className="ph-spec-label">Engine</span>
        <span className="ph-spec-value">react-international-phone</span>
      </div>
      <div className="ph-spec-card">
        <span className="ph-spec-label">Autofill</span>
        <span className="ph-spec-value">autocomplete=tel</span>
      </div>
    </div>
  );
}

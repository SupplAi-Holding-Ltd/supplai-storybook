import React, { useEffect, useRef, useState } from "react";
import {
  OneTimePasswordField as RadixOTP,
  OneTimePasswordFieldInput as RadixOTPInput,
  OneTimePasswordFieldHiddenInput as RadixOTPHidden,
  type InputValidationType,
  type OneTimePasswordFieldProps,
} from "@radix-ui/react-one-time-password-field";
import "./OTPFields.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type OTPSize = 28 | 32 | 36 | 40 | 44 | 48 | 56;
export type OTPValidation = InputValidationType;

const SIZE_FONT: Record<OTPSize, number> = {
  28: 12,
  32: 13,
  36: 14,
  40: 15,
  44: 16,
  48: 17,
  56: 18,
};

export type OTPFieldProps = Omit<OneTimePasswordFieldProps, "children"> & {
  length?: number;
  size?: OTPSize;
  /** Visual error styling on slots */
  error?: boolean;
  /** Render slots in groups, e.g. [3, 3] for 6 digits */
  groups?: number[];
  className?: string;
  children?: React.ReactNode;
  /** Fires once when value length reaches `length` with a new complete string */
  onComplete?: (value: string) => void;
};

/* ── Primitives ───────────────────────────────────────────────────────── */

export function OTPField({
  length = 6,
  size = 40,
  error = false,
  groups,
  className,
  children,
  onComplete,
  onValueChange,
  value,
  defaultValue,
  validationType = "numeric",
  type = "text",
  ...props
}: OTPFieldProps) {
  const lastComplete = useRef<string | null>(null);
  const font = SIZE_FONT[size] ?? 15;

  const handleChange = (next: string) => {
    onValueChange?.(next);
    if (next.length === length) {
      if (lastComplete.current !== next) {
        lastComplete.current = next;
        onComplete?.(next);
      }
    } else {
      lastComplete.current = null;
    }
  };

  const groupBreaks = new Set<number>();
  if (groups && groups.reduce((a, b) => a + b, 0) === length) {
    let offset = 0;
    groups.forEach((count, gi) => {
      if (gi > 0) groupBreaks.add(offset);
      offset += count;
    });
  }

  const slots = Array.from({ length }, (_, i) => (
    <RadixOTPInput
      key={i}
      index={i}
      className={`otp-slot${error ? " otp-slot--error" : ""}`}
      style={groupBreaks.has(i) ? { marginLeft: 12 } : undefined}
    />
  ));

  return (
    <RadixOTP
      className={`otp-root ${className ?? ""}`}
      style={
        {
          ["--otp-size" as string]: `${size}px`,
          ["--otp-font" as string]: `${font}px`,
          ["--otp-gap" as string]: size <= 32 ? "6px" : "8px",
        } as React.CSSProperties
      }
      validationType={validationType}
      type={type}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleChange}
      {...props}
    >
      {children ?? (
        <>
          {slots}
          <OTPHiddenInput />
        </>
      )}
    </RadixOTP>
  );
}

export function OTPInput({
  className,
  error,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixOTPInput> & { error?: boolean }) {
  return (
    <RadixOTPInput
      className={`otp-slot${error ? " otp-slot--error" : ""} ${className ?? ""}`}
      {...props}
    />
  );
}

export function OTPHiddenInput(
  props: React.ComponentPropsWithoutRef<typeof RadixOTPHidden>,
) {
  return <RadixOTPHidden {...props} />;
}

/* Re-export validation type for docs */
export type { InputValidationType };

/* ── Field chrome helper ──────────────────────────────────────────────── */

function FieldChrome({
  label,
  hint,
  errorMessage,
  successMessage,
  htmlFor,
  children,
}: {
  label?: string;
  hint?: string;
  errorMessage?: string;
  successMessage?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="otp-field-wrap">
      {label ? (
        <label className="otp-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {errorMessage ? (
        <span className="otp-hint otp-hint--error" role="alert">
          {errorMessage}
        </span>
      ) : successMessage ? (
        <span className="otp-hint otp-hint--success" role="status">
          {successMessage}
        </span>
      ) : hint ? (
        <span className="otp-hint">{hint}</span>
      ) : null}
    </div>
  );
}

/* ── Code sample ──────────────────────────────────────────────────────── */

export const OTP_FIELD_CODE = `// OTP Field · supplai Design System
import { OTPField, OTPHiddenInput, OTPInput } from './OTPField';

<OTPField
  length={6}
  size={40}
  validationType="numeric"
  onComplete={(code) => console.log(code)}
>
  {/* default: renders length slots + hidden input */}
</OTPField>

// Or compose manually:
<OTPField length={6} validationType="numeric">
  <OTPInput index={0} />
  <OTPInput index={1} />
  …
  <OTPHiddenInput name="otp" />
</OTPField>

// Built on @radix-ui/react-one-time-password-field
`;

/* ── Demos ────────────────────────────────────────────────────────────── */

function DemoShell({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return <div className={`otp-demo${center ? " otp-demo--center" : ""}`}>{children}</div>;
}

export function OTPPlayground() {
  const [length, setLength] = useState(6);
  const [size, setSize] = useState<OTPSize>(40);
  const [validationType, setValidationType] = useState<OTPValidation>("numeric");
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");
  const [masked, setMasked] = useState(false);

  return (
    <div className="otp-play">
      <div className="otp-play-preview">
        <OTPField
          key={`${length}-${validationType}-${masked}`}
          length={length}
          size={size}
          validationType={validationType}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          type={masked ? "password" : "text"}
          value={value}
          onValueChange={setValue}
        />
        <span className="otp-hint otp-hint--meta">value: {JSON.stringify(value)}</span>
      </div>
      <div className="otp-play-controls">
        <div className="otp-play-row">
          <span className="otp-play-label">Length</span>
          {[4, 6, 8].map((n) => (
            <button
              key={n}
              type="button"
              className={`otp-chip${length === n ? " otp-chip--on" : ""}`}
              onClick={() => {
                setLength(n);
                setValue("");
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="otp-play-row">
          <span className="otp-play-label">Size</span>
          {([28, 32, 36, 40, 44, 48] as OTPSize[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`otp-chip${size === s ? " otp-chip--on" : ""}`}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="otp-play-row">
          <span className="otp-play-label">Validation</span>
          {(["numeric", "alpha", "alphanumeric"] as OTPValidation[]).map((v) => (
            <button
              key={v}
              type="button"
              className={`otp-chip${validationType === v ? " otp-chip--on" : ""}`}
              onClick={() => {
                setValidationType(v);
                setValue("");
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="otp-play-row">
          <span className="otp-play-label">Options</span>
          <button
            type="button"
            className={`otp-chip${disabled ? " otp-chip--on" : ""}`}
            onClick={() => setDisabled((v) => !v)}
          >
            Disabled
          </button>
          <button
            type="button"
            className={`otp-chip${readOnly ? " otp-chip--on" : ""}`}
            onClick={() => setReadOnly((v) => !v)}
          >
            Read-only
          </button>
          <button
            type="button"
            className={`otp-chip${error ? " otp-chip--on" : ""}`}
            onClick={() => setError((v) => !v)}
          >
            Error
          </button>
          <button
            type="button"
            className={`otp-chip${masked ? " otp-chip--on" : ""}`}
            onClick={() => setMasked((v) => !v)}
          >
            Masked
          </button>
          <button type="button" className="otp-chip" onClick={() => setValue("")}>
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
      <FieldChrome
        label="Verification code"
        hint="Enter the 6-digit code sent to your device."
      >
        <OTPField length={6} size={40} validationType="numeric" aria-label="Verification code" />
      </FieldChrome>
    </DemoShell>
  );
}

export function SizesDemo() {
  const sizes: OTPSize[] = [28, 32, 36, 40, 44, 48];
  return (
    <DemoShell>
      <div className="otp-sizes-grid">
        {sizes.map((size) => (
          <div key={size} className="otp-size-row">
            <span className="otp-size-label">{size}px</span>
            <OTPField length={6} size={size} validationType="numeric" aria-label={`OTP ${size}px`} />
          </div>
        ))}
      </div>
      <p className="otp-note">
        Radian also documents 56px — available via <code>size=&#123;56&#125;</code>. Default maps to
        Text Input–adjacent 36–40px.
      </p>
    </DemoShell>
  );
}

export function NumericDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Numeric code" hint="Digits 0–9 only. Letters are rejected.">
        <OTPField length={6} validationType="numeric" size={40} aria-label="Numeric OTP" />
      </FieldChrome>
    </DemoShell>
  );
}

export function AlphaDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Alphabetic code" hint="Letters only — casing preserved as typed.">
        <OTPField length={6} validationType="alpha" size={40} aria-label="Alphabetic OTP" />
      </FieldChrome>
    </DemoShell>
  );
}

export function AlphanumericDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Alphanumeric code" hint="Letters and digits.">
        <OTPField length={6} validationType="alphanumeric" size={40} aria-label="Alphanumeric OTP" />
      </FieldChrome>
    </DemoShell>
  );
}

export function LengthDemo() {
  return (
    <DemoShell>
      <FieldChrome label="4-character PIN">
        <OTPField length={4} size={40} validationType="numeric" aria-label="4 digit PIN" />
      </FieldChrome>
      <FieldChrome label="6-character code">
        <OTPField length={6} size={40} validationType="numeric" aria-label="6 digit code" />
      </FieldChrome>
      <FieldChrome label="8-character code">
        <OTPField length={8} size={36} validationType="numeric" aria-label="8 digit code" />
      </FieldChrome>
    </DemoShell>
  );
}

export function PrefilledDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Prefilled (demo)" hint="Dummy value 120456 — editable.">
        <OTPField
          length={6}
          defaultValue="120456"
          validationType="numeric"
          size={40}
          aria-label="Prefilled OTP"
        />
      </FieldChrome>
    </DemoShell>
  );
}

export function ControlledDemo() {
  const [value, setValue] = useState("");
  return (
    <DemoShell>
      <FieldChrome label="Controlled OTP" hint="Parent state owns the value.">
        <OTPField
          length={6}
          value={value}
          onValueChange={setValue}
          validationType="numeric"
          size={40}
          aria-label="Controlled OTP"
        />
      </FieldChrome>
      <div className="otp-actions">
        <button type="button" className="otp-btn otp-btn--ghost" onClick={() => setValue("")}>
          Clear
        </button>
        <button
          type="button"
          className="otp-btn otp-btn--outline"
          onClick={() => setValue("042891")}
        >
          Set 042891
        </button>
        <span className="otp-hint otp-hint--meta">value: {JSON.stringify(value)}</span>
      </div>
    </DemoShell>
  );
}

export function MaskedDemo() {
  return (
    <DemoShell>
      <FieldChrome
        label="Masked OTP"
        hint="Uses type=&quot;password&quot; on slots — preserves autofill via autocomplete one-time-code."
      >
        <OTPField
          length={6}
          type="password"
          validationType="numeric"
          size={40}
          aria-label="Masked OTP"
        />
      </FieldChrome>
    </DemoShell>
  );
}

export function GroupedDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Grouped slots" hint="Two groups of three — navigation and value stay continuous.">
        <OTPField
          length={6}
          groups={[3, 3]}
          validationType="numeric"
          size={40}
          aria-label="Grouped OTP"
        />
      </FieldChrome>
    </DemoShell>
  );
}

export function DisabledDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Disabled">
        <OTPField
          length={6}
          defaultValue="123456"
          disabled
          validationType="numeric"
          size={40}
          aria-label="Disabled OTP"
        />
      </FieldChrome>
    </DemoShell>
  );
}

export function ReadOnlyDemo() {
  return (
    <DemoShell>
      <FieldChrome label="Read-only" hint="Value visible; typing and paste blocked.">
        <OTPField
          length={6}
          defaultValue="847291"
          readOnly
          validationType="numeric"
          size={40}
          aria-label="Read-only OTP"
        />
      </FieldChrome>
    </DemoShell>
  );
}

export function ValidationDemo() {
  const DEMO_CODE = "246810";
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");

  const incomplete = value.length > 0 && value.length < 6;
  const emptyErr = touched && value.length === 0;
  const incompleteErr = touched && incomplete;
  const invalidErr = status === "bad";
  const error = emptyErr || incompleteErr || invalidErr;

  let message: string | undefined;
  if (emptyErr) message = "Enter the verification code.";
  else if (incompleteErr) message = "Enter all 6 digits.";
  else if (invalidErr) message = "That code is incorrect. Try again.";

  return (
    <DemoShell>
      <form
        className="otp-panel"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (value.length < 6) {
            setStatus("idle");
            return;
          }
          if (value === DEMO_CODE) setStatus("ok");
          else setStatus("bad");
        }}
      >
        <h3 className="otp-panel-title">Verify your email</h3>
        <p className="otp-panel-desc">
          Storybook demo — accept code <strong>{DEMO_CODE}</strong> (not a real auth check).
        </p>
        <FieldChrome
          label="6-digit code"
          errorMessage={error ? message : undefined}
          successMessage={status === "ok" ? "Code accepted." : undefined}
          hint={!error && status !== "ok" ? "Paste or type your code." : undefined}
        >
          <OTPField
            length={6}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              setStatus("idle");
            }}
            validationType="numeric"
            error={error}
            size={40}
            name="otp"
            aria-label="Verification code"
          />
        </FieldChrome>
        <div className="otp-actions">
          <button type="submit" className="otp-btn otp-btn--primary">
            Verify
          </button>
        </div>
      </form>
    </DemoShell>
  );
}

export function AutoSubmitDemo() {
  const EXPECTED = "135790";
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "ok" | "fail">("idle");

  const verify = (code: string) => {
    setPhase("loading");
    window.setTimeout(() => {
      setPhase(code === EXPECTED ? "ok" : "fail");
    }, 700);
  };

  return (
    <DemoShell>
      <FieldChrome
        label="Auto-submit on complete"
        hint={`Demo code ${EXPECTED}. Completes only when all 6 digits are entered.`}
        errorMessage={phase === "fail" ? "Verification failed. Edit and try again." : undefined}
        successMessage={phase === "ok" ? "Verified (simulated)." : undefined}
      >
        <OTPField
          length={6}
          value={value}
          onValueChange={(v) => {
            setValue(v);
            if (v.length < 6) setPhase("idle");
          }}
          onComplete={verify}
          validationType="numeric"
          disabled={phase === "loading"}
          error={phase === "fail"}
          size={40}
          aria-label="Auto-submit OTP"
        />
      </FieldChrome>
      {phase === "loading" ? <span className="otp-hint">Verifying…</span> : null}
    </DemoShell>
  );
}

export function ResendDemo() {
  const [value, setValue] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [banner, setBanner] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  return (
    <DemoShell>
      <div className="otp-panel">
        <h3 className="otp-panel-title">Enter verification code</h3>
        <p className="otp-panel-desc">
          We sent a code to ••••@example.com. This Storybook flow does not send SMS or email.
        </p>
        <FieldChrome
          label="Code"
          errorMessage={status === "bad" ? "Invalid code." : undefined}
          successMessage={status === "ok" ? "You're verified." : undefined}
        >
          <OTPField
            length={6}
            value={value}
            onValueChange={(v) => {
              setValue(v);
              setStatus("idle");
            }}
            validationType="numeric"
            error={status === "bad"}
            size={40}
            aria-label="Resend form OTP"
          />
        </FieldChrome>
        <div className="otp-actions">
          <button
            type="button"
            className="otp-btn otp-btn--primary"
            onClick={() => setStatus(value === "998877" ? "ok" : "bad")}
            disabled={value.length < 6}
          >
            Verify
          </button>
          <button
            type="button"
            className="otp-btn otp-btn--link"
            disabled={seconds > 0}
            onClick={() => {
              setValue("");
              setStatus("idle");
              setSeconds(30);
              setBanner("A new demo code was “sent”. Use 998877 to succeed.");
            }}
          >
            {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
          </button>
        </div>
        {banner ? <p className="otp-hint otp-hint--success" role="status">{banner}</p> : null}
      </div>
    </DemoShell>
  );
}

export function SpecsDemo() {
  return (
    <div className="otp-specs-grid">
      <div className="otp-spec-card">
        <span className="otp-spec-label">Default size</span>
        <span className="otp-spec-value">40×40px</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Radius</span>
        <span className="otp-spec-value">6px</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Border</span>
        <span className="otp-spec-value">1px #D1D5DB</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Focus</span>
        <span className="otp-spec-value">Brand Blue ring</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Error</span>
        <span className="otp-spec-value">#D13145</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Engine</span>
        <span className="otp-spec-value">Radix OTP Field</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Autofill</span>
        <span className="otp-spec-value">one-time-code</span>
      </div>
      <div className="otp-spec-card">
        <span className="otp-spec-label">Value</span>
        <span className="otp-spec-value">String (keeps zeros)</span>
      </div>
    </div>
  );
}

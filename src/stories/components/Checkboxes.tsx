import React from 'react';
import './Checkboxes.css';

export const CHECKBOX_CODE = `// Checkbox · supplai Design System
import { useState, useRef, useEffect } from 'react';

// size: sm | md | lg
// checked | indeterminate | disabled

function Checkbox({
  size = 'md',
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  onCheckedChange,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className={\`cb-root cb-root--\${size}\${checked ? ' cb-root--checked' : ''}\${indeterminate && !checked ? ' cb-root--indeterminate' : ''}\${disabled ? ' cb-root--disabled' : ''}\`}>
      <span className="cb-box">
        <input
          ref={ref}
          type="checkbox"
          className="cb-input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
        {/* check / dash marks */}
      </span>
      {label && <span className="cb-text"><span className="cb-label">{label}</span></span>}
    </label>
  );
}
`;

function CheckMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`cb-mark cb-mark--check ${className}`.trim()} viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function DashMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`cb-mark cb-mark--dash ${className}`.trim()} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export type CheckboxSize = 'sm' | 'md' | 'lg';

export type CheckboxProps = {
  size?: CheckboxSize;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  id?: string;
  name?: string;
  value?: string;
  /** Visual-only control (no native input) — for menus / nested labels */
  decorative?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
};

export function Checkbox({
  size = 'md',
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  id,
  name,
  value,
  decorative = false,
  onCheckedChange,
  className = '',
}: CheckboxProps) {
  const isControlled = checkedProp !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const checked = isControlled ? !!checkedProp : internal;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasCopy = Boolean(label || description);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  const toggle = (next: boolean) => {
    if (disabled || decorative) return;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  const rootClass = [
    'cb-root',
    `cb-root--${size}`,
    checked ? 'cb-root--checked' : '',
    indeterminate && !checked ? 'cb-root--indeterminate' : '',
    disabled ? 'cb-root--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const box = (
    <span className="cb-box">
      {!decorative && (
        <input
          ref={inputRef}
          id={id}
          name={name}
          value={value}
          type="checkbox"
          className="cb-input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => toggle(e.target.checked)}
          tabIndex={hasCopy ? undefined : 0}
        />
      )}
      <CheckMark />
      <DashMark />
    </span>
  );

  const copy = hasCopy ? (
    <span className="cb-text">
      {label && <span className="cb-label">{label}</span>}
      {description && <span className="cb-desc">{description}</span>}
    </span>
  ) : null;

  if (hasCopy && !decorative) {
    return (
      <label className={rootClass} htmlFor={id}>
        {box}
        {copy}
      </label>
    );
  }

  return (
    <span className={rootClass} aria-hidden={decorative ? true : undefined}>
      {box}
      {copy}
    </span>
  );
}

export function CheckboxPlayground() {
  const [size, setSize] = React.useState<CheckboxSize>('md');
  const [checked, setChecked] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  return (
    <div className="cbp-wrap">
      <div className="cbp-preview">
        <Checkbox
          size={size}
          checked={checked}
          disabled={disabled}
          indeterminate={indeterminate}
          label="Keep me signed in"
          description="Stay logged in on this device."
          onCheckedChange={(v) => {
            setChecked(v);
            setIndeterminate(false);
          }}
        />
      </div>
      <div className="cbp-controls">
        <div className="cbp-row">
          <span className="cbp-label">Size</span>
          <div className="cbp-chips">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={`cbp-chip ${size === s ? 'cbp-chip--on' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="cbp-row">
          <span className="cbp-label">State</span>
          <div className="cbp-chips">
            <button
              type="button"
              className={`cbp-chip ${checked && !indeterminate ? 'cbp-chip--on' : ''}`}
              onClick={() => {
                setChecked(true);
                setIndeterminate(false);
              }}
            >
              checked
            </button>
            <button
              type="button"
              className={`cbp-chip ${!checked && !indeterminate ? 'cbp-chip--on' : ''}`}
              onClick={() => {
                setChecked(false);
                setIndeterminate(false);
              }}
            >
              unchecked
            </button>
            <button
              type="button"
              className={`cbp-chip ${indeterminate ? 'cbp-chip--on' : ''}`}
              onClick={() => {
                setChecked(false);
                setIndeterminate(true);
              }}
            >
              indeterminate
            </button>
            <button
              type="button"
              className={`cbp-chip ${disabled ? 'cbp-chip--on' : ''}`}
              onClick={() => setDisabled((d) => !d)}
            >
              disabled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SizeDemo() {
  return (
    <div className="cb-demo">
      <Checkbox size="sm" defaultChecked label="Small" />
      <Checkbox size="md" defaultChecked label="Medium" />
      <Checkbox size="lg" defaultChecked label="Large" />
    </div>
  );
}

export function CheckedDemo() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  return (
    <div className="cb-demo cb-demo--col">
      <Checkbox checked={a} onCheckedChange={setA} label="Keep me signed in" />
      <Checkbox checked={b} onCheckedChange={setB} label="Send me product updates" />
    </div>
  );
}

export function DisabledDemo() {
  return (
    <div className="cb-demo cb-demo--col">
      <Checkbox disabled label="Disabled unchecked" />
      <Checkbox disabled defaultChecked label="Disabled checked" />
    </div>
  );
}

export function IndeterminateDemo() {
  const items = ['React', 'Vue', 'Svelte', 'Angular'];
  const [selected, setSelected] = React.useState<string[]>(['React', 'Vue']);

  const all = selected.length === items.length;
  const none = selected.length === 0;
  const indeterminate = !all && !none;

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? [...items] : []);
  };

  const toggleOne = (name: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, name] : prev.filter((x) => x !== name)));
  };

  return (
    <div className="cb-demo cb-demo--col">
      <Checkbox
        checked={all}
        indeterminate={indeterminate}
        label="Select all"
        onCheckedChange={toggleAll}
      />
      <div className="cb-group" style={{ paddingLeft: 8 }}>
        {items.map((name) => (
          <Checkbox
            key={name}
            checked={selected.includes(name)}
            label={name}
            onCheckedChange={(v) => toggleOne(name, v)}
          />
        ))}
      </div>
    </div>
  );
}

export function GroupDemo() {
  const options = ['Eating', 'Reading', 'Sleeping', 'Walking'];
  const [selected, setSelected] = React.useState<string[]>(['Reading', 'Walking']);

  return (
    <div className="cb-demo cb-demo--stack">
      <div className="cb-group">
        <p className="cb-group-title">Pick your favorite hobbies</p>
        {options.map((name) => (
          <Checkbox
            key={name}
            checked={selected.includes(name)}
            label={name}
            onCheckedChange={(v) =>
              setSelected((prev) => (v ? [...prev, name] : prev.filter((x) => x !== name)))
            }
          />
        ))}
        <div className="cb-group-actions">
          <button type="button" className="cb-btn cb-btn--ghost" onClick={() => setSelected([])}>
            Clear
          </button>
          <button type="button" className="cb-btn cb-btn--primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export function CustomCardDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="cb-demo cb-demo--stack">
      <label className={`cb-card ${on ? 'cb-card--on' : ''}`}>
        <Checkbox checked={on} onCheckedChange={setOn} />
        <span>
          <p className="cb-card-title">Allow edit access</p>
          <p className="cb-card-desc">Enable public edit access on all your docs.</p>
        </span>
      </label>
    </div>
  );
}

export function SetupDemo() {
  const rows = [
    {
      id: 'email',
      title: 'Enable email notifications',
      desc: 'Stay informed about updates and account activity.',
    },
    {
      id: 'dark',
      title: 'Use dark mode by default',
      desc: 'Automatically apply the dark theme.',
    },
    {
      id: 'workspace',
      title: 'Remember my last workspace',
      desc: 'Open the workspace you were last using.',
    },
    {
      id: 'analytics',
      title: 'Send anonymous usage analytics',
      desc: 'Help improve the product by sharing usage insights.',
    },
  ];
  const [on, setOn] = React.useState<Record<string, boolean>>({
    email: true,
    dark: false,
    workspace: true,
    analytics: false,
  });

  return (
    <div className="cb-demo cb-demo--stack">
      <div className="cb-setup">
        {rows.map((row) => (
          <label
            key={row.id}
            className={`cb-setup-row ${on[row.id] ? 'cb-setup-row--on' : ''}`}
          >
            <Checkbox
              checked={!!on[row.id]}
              onCheckedChange={(v) => setOn((prev) => ({ ...prev, [row.id]: v }))}
            />
            <span>
              <p className="cb-card-title">{row.title}</p>
              <p className="cb-card-desc">{row.desc}</p>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function MenuDemo() {
  const techs = ['Node.js', 'Svelte', 'Figma'];
  const [selected, setSelected] = React.useState<string[]>(['Node.js', 'Figma']);

  return (
    <div className="cb-demo">
      <div className="cb-menu" role="menu" aria-label="Tech stack">
        <div style={{ padding: '6px 10px 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8' }}>
          Tech stack
        </div>
        {techs.map((name) => {
          const active = selected.includes(name);
          return (
            <button
              key={name}
              type="button"
              role="menuitemcheckbox"
              aria-checked={active}
              className={`cb-menu-item ${active ? 'cb-menu-item--on' : ''}`}
              onClick={() =>
                setSelected((prev) =>
                  active ? prev.filter((x) => x !== name) : [...prev, name],
                )
              }
            >
              <Checkbox checked={active} decorative />
              {name}
            </button>
          );
        })}
        <div className="cb-menu-sep" />
        <button type="button" className="cb-menu-item" onClick={() => setSelected([])}>
          Clear selection
        </button>
      </div>
    </div>
  );
}

export function FormDemo() {
  const frameworks = ['React', 'Vue', 'Svelte', 'Angular'];
  const [selected, setSelected] = React.useState<string[]>(['React']);
  const [terms, setTerms] = React.useState(false);

  const all = selected.length === frameworks.length;
  const none = selected.length === 0;
  const indeterminate = !all && !none;

  return (
    <div className="cb-demo cb-demo--stack">
      <form
        className="cb-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <p className="cb-form-title">Which frameworks do you use?</p>
        <p className="cb-form-hint">Select all that apply.</p>
        <Checkbox
          checked={all}
          indeterminate={indeterminate}
          label="Select all"
          onCheckedChange={(v) => setSelected(v ? [...frameworks] : [])}
        />
        <div className="cb-group">
          {frameworks.map((name) => (
            <Checkbox
              key={name}
              name="framework"
              value={name}
              checked={selected.includes(name)}
              label={name}
              onCheckedChange={(v) =>
                setSelected((prev) => (v ? [...prev, name] : prev.filter((x) => x !== name)))
              }
            />
          ))}
        </div>
        <Checkbox
          checked={terms}
          onCheckedChange={setTerms}
          label="I agree to the Terms and Conditions"
        />
        <div className="cb-form-actions">
          <button
            type="button"
            className="cb-btn cb-btn--ghost"
            onClick={() => {
              setSelected([]);
              setTerms(false);
            }}
          >
            Clear
          </button>
          <button type="submit" className="cb-btn cb-btn--primary" disabled={!terms || none}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

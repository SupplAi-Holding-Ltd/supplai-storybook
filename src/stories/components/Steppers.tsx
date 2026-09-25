/* eslint-disable react-refresh/only-export-components -- story module exports primitives + demos */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Progress } from "./Progress";
import { Spinner } from "./Spinners";
import "./Steppers.css";

/* ── Types ────────────────────────────────────────────────────────────── */

export type StepperOrientation = "horizontal" | "vertical";
export type StepState = "active" | "completed" | "inactive" | "loading";

export type StepIndicators = {
  active?: React.ReactNode;
  completed?: React.ReactNode;
  inactive?: React.ReactNode;
  loading?: React.ReactNode;
};

type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: StepperOrientation;
  registerTrigger: (node: HTMLButtonElement | null) => void;
  unregisterTrigger: (node: HTMLButtonElement | null) => void;
  triggerNodes: HTMLButtonElement[];
  focusNext: (currentIdx: number) => void;
  focusPrev: (currentIdx: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  indicators: StepIndicators;
  stepsCount: number;
  registerStep: (step: number) => void;
  unregisterStep: (step: number) => void;
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

const StepperContext = createContext<StepperContextValue | null>(null);
const StepItemContext = createContext<StepItemContextValue | null>(null);

export function useStepper(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("useStepper must be used within a Stepper");
  return ctx;
}

export function useStepItem(): StepItemContextValue {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error("useStepItem must be used within a StepperItem");
  return ctx;
}

/* ── Icons ────────────────────────────────────────────────────────────── */

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
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

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14s5-4.2 5-7.5A5 5 0 0 0 3 6.5C3 9.8 8 14 8 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7h12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h5.5L13 6v7.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M9.5 2.5V6H13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Stepper root ─────────────────────────────────────────────────────── */

export type StepperProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: StepperOrientation;
  indicators?: StepIndicators;
};

export function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "horizontal",
  indicators,
  className,
  children,
  ...props
}: StepperProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [triggerNodes, setTriggerNodes] = useState<HTMLButtonElement[]>([]);
  const [registeredSteps, setRegisteredSteps] = useState<number[]>([]);
  const activeStep = value ?? uncontrolled;

  const registerTrigger = useCallback((node: HTMLButtonElement | null) => {
    setTriggerNodes((prev) => {
      if (node) return prev.includes(node) ? prev : [...prev, node];
      return prev;
    });
  }, []);

  const unregisterTrigger = useCallback((node: HTMLButtonElement | null) => {
    if (!node) return;
    setTriggerNodes((prev) => prev.filter((n) => n !== node));
  }, []);

  const registerStep = useCallback((step: number) => {
    setRegisteredSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step].sort((a, b) => a - b),
    );
  }, []);

  const unregisterStep = useCallback((step: number) => {
    setRegisteredSteps((prev) => prev.filter((s) => s !== step));
  }, []);

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) setUncontrolled(step);
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  const focusTrigger = useCallback(
    (idx: number) => {
      const node = triggerNodes[idx];
      if (node && !node.disabled) node.focus();
    },
    [triggerNodes],
  );

  const focusNext = useCallback(
    (currentIdx: number) => {
      if (!triggerNodes.length) return;
      for (let i = 1; i <= triggerNodes.length; i++) {
        const idx = (currentIdx + i) % triggerNodes.length;
        if (!triggerNodes[idx]?.disabled) {
          focusTrigger(idx);
          return;
        }
      }
    },
    [triggerNodes, focusTrigger],
  );

  const focusPrev = useCallback(
    (currentIdx: number) => {
      if (!triggerNodes.length) return;
      for (let i = 1; i <= triggerNodes.length; i++) {
        const idx = (currentIdx - i + triggerNodes.length) % triggerNodes.length;
        if (!triggerNodes[idx]?.disabled) {
          focusTrigger(idx);
          return;
        }
      }
    },
    [triggerNodes, focusTrigger],
  );

  const focusFirst = useCallback(() => {
    const idx = triggerNodes.findIndex((n) => !n.disabled);
    if (idx >= 0) focusTrigger(idx);
  }, [triggerNodes, focusTrigger]);

  const focusLast = useCallback(() => {
    for (let i = triggerNodes.length - 1; i >= 0; i--) {
      if (!triggerNodes[i]?.disabled) {
        focusTrigger(i);
        return;
      }
    }
  }, [triggerNodes, focusTrigger]);

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      activeStep,
      setActiveStep,
      orientation,
      registerTrigger,
      unregisterTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      indicators: indicators ?? {},
      stepsCount: registeredSteps.length,
      registerStep,
      unregisterStep,
    }),
    [
      activeStep,
      setActiveStep,
      orientation,
      registerTrigger,
      unregisterTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
      indicators,
      registeredSteps.length,
      registerStep,
      unregisterStep,
    ],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        className={["stp", `stp--${orientation}`, className ?? ""].filter(Boolean).join(" ")}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

/* ── Item ─────────────────────────────────────────────────────────────── */

export type StepperItemProps = React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep, registerStep, unregisterStep } = useStepper();

  useEffect(() => {
    registerStep(step);
    return () => unregisterStep(step);
  }, [step, registerStep, unregisterStep]);

  const baseState: StepState =
    completed || step < activeStep
      ? "completed"
      : activeStep === step
        ? "active"
        : "inactive";

  const isLoading = loading && step === activeStep;
  const state: StepState = isLoading ? "loading" : baseState;

  return (
    <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
      <div
        className={["stp-item", className ?? ""].filter(Boolean).join(" ")}
        data-state={state}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

/* ── Trigger ──────────────────────────────────────────────────────────── */

export type StepperTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function StepperTrigger({
  asChild = false,
  className,
  children,
  disabled: disabledProp,
  onClick,
  onKeyDown,
  ...props
}: StepperTriggerProps) {
  const { state, isLoading, isDisabled, step } = useStepItem();
  const {
    setActiveStep,
    activeStep,
    registerTrigger,
    unregisterTrigger,
    triggerNodes,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
    orientation,
  } = useStepper();
  const btnRef = useRef<HTMLButtonElement>(null);
  const disabled = disabledProp ?? isDisabled;
  const isSelected = activeStep === step;

  useEffect(() => {
    const node = btnRef.current;
    registerTrigger(node);
    return () => unregisterTrigger(node);
  }, [registerTrigger, unregisterTrigger]);

  const myIdx = useMemo(
    () => triggerNodes.findIndex((n) => n === btnRef.current),
    [triggerNodes],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const vertical = orientation === "vertical";
    switch (e.key) {
      case "ArrowRight":
        if (!vertical) {
          e.preventDefault();
          if (myIdx !== -1) focusNext(myIdx);
        }
        break;
      case "ArrowDown":
        if (vertical) {
          e.preventDefault();
          if (myIdx !== -1) focusNext(myIdx);
        }
        break;
      case "ArrowLeft":
        if (!vertical) {
          e.preventDefault();
          if (myIdx !== -1) focusPrev(myIdx);
        }
        break;
      case "ArrowUp":
        if (vertical) {
          e.preventDefault();
          if (myIdx !== -1) focusPrev(myIdx);
        }
        break;
      case "Home":
        e.preventDefault();
        focusFirst();
        break;
      case "End":
        e.preventDefault();
        focusLast();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!disabled) setActiveStep(step);
        break;
      default:
        break;
    }
  };

  const statusLabel =
    state === "completed"
      ? ", completed"
      : isLoading
        ? ", loading"
        : disabled
          ? ", unavailable"
          : isSelected
            ? ", current"
            : "";

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      "data-state": state,
      "aria-current": isSelected ? "step" : undefined,
      "aria-disabled": disabled || undefined,
      onClick: (e: React.MouseEvent) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        (children as React.ReactElement<{ onClick?: (ev: React.MouseEvent) => void }>).props
          .onClick?.(e);
        setActiveStep(step);
      },
    });
  }

  return (
    <button
      type="button"
      ref={btnRef}
      className={["stp-trigger", className ?? ""].filter(Boolean).join(" ")}
      data-state={state}
      aria-current={isSelected ? "step" : undefined}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) setActiveStep(step);
      }}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
      <span className="stp-sr-only">{statusLabel}</span>
    </button>
  );
}

/* ── Indicator / Separator / Title / Description ──────────────────────── */

export type StepperIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

export function StepperIndicator({ className, children, ...props }: StepperIndicatorProps) {
  const { state, isLoading } = useStepItem();
  const { indicators } = useStepper();

  let content = children;
  if (isLoading && indicators.loading != null) content = indicators.loading;
  else if (state === "completed" && indicators.completed != null) content = indicators.completed;
  else if (state === "active" && indicators.active != null) content = indicators.active;
  else if (state === "inactive" && indicators.inactive != null) content = indicators.inactive;

  return (
    <div
      className={["stp-indicator", className ?? ""].filter(Boolean).join(" ")}
      data-state={isLoading ? "loading" : state}
      aria-hidden="true"
      {...props}
    >
      {content}
    </div>
  );
}

export type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export function StepperSeparator({ className, ...props }: StepperSeparatorProps) {
  const { state } = useStepItem();
  return (
    <div
      className={["stp-separator", className ?? ""].filter(Boolean).join(" ")}
      data-state={state}
      role="presentation"
      {...props}
    />
  );
}

export type StepperTitleProps = React.HTMLAttributes<HTMLSpanElement>;

export function StepperTitle({ className, children, ...props }: StepperTitleProps) {
  const { state } = useStepItem();
  return (
    <span
      className={["stp-title", className ?? ""].filter(Boolean).join(" ")}
      data-state={state}
      {...props}
    >
      {children}
    </span>
  );
}

export type StepperDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export function StepperDescription({ className, children, ...props }: StepperDescriptionProps) {
  const { state } = useStepItem();
  return (
    <span
      className={["stp-description", className ?? ""].filter(Boolean).join(" ")}
      data-state={state}
      {...props}
    >
      {children}
    </span>
  );
}

/* ── Nav / Panel / Content ────────────────────────────────────────────── */

export type StepperNavProps = React.HTMLAttributes<HTMLElement>;

export function StepperNav({ className, children, ...props }: StepperNavProps) {
  const { orientation, activeStep, stepsCount } = useStepper();
  return (
    <nav
      className={["stp-nav", className ?? ""].filter(Boolean).join(" ")}
      data-orientation={orientation}
      aria-label="Progress"
      {...props}
    >
      <span className="stp-sr-only">
        Step {activeStep} of {Math.max(stepsCount, 1)}
      </span>
      {children}
    </nav>
  );
}

export type StepperPanelProps = React.HTMLAttributes<HTMLDivElement>;

export function StepperPanel({ className, children, ...props }: StepperPanelProps) {
  return (
    <div className={["stp-panel", className ?? ""].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export type StepperContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
  forceMount?: boolean;
};

export function StepperContent({
  value,
  forceMount = false,
  className,
  children,
  ...props
}: StepperContentProps) {
  const { activeStep } = useStepper();
  const isActive = value === activeStep;
  const id = useId();

  if (!forceMount && !isActive) return null;

  return (
    <div
      id={id}
      className={["stp-content", className ?? ""].filter(Boolean).join(" ")}
      data-state={isActive ? "active" : "inactive"}
      hidden={!isActive}
      aria-hidden={!isActive}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Shared demo helpers ──────────────────────────────────────────────── */

export const STEPPER_CODE = `// Stepper · supplai Design System
import {
  Stepper, StepperNav, StepperItem, StepperTrigger,
  StepperIndicator, StepperSeparator, StepperTitle,
  StepperPanel, StepperContent,
} from './Stepper';

<Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }}>
  <StepperNav>
    <StepperItem step={1}>
      <StepperTrigger>
        <StepperIndicator>1</StepperIndicator>
        <StepperTitle>Account</StepperTitle>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
  </StepperNav>
  <StepperPanel>
    <StepperContent value={1}>Account form</StepperContent>
  </StepperPanel>
</Stepper>
`;

const DEFAULT_STEPS = [
  { step: 1, title: "Account", description: "Enter your details" },
  { step: 2, title: "Details", description: "Tell us more" },
  { step: 3, title: "Review", description: "Check everything" },
  { step: 4, title: "Complete", description: "You're done" },
];

const TITLE_STEPS = [
  { step: 1, title: "Account" },
  { step: 2, title: "Profile" },
  { step: 3, title: "Review" },
];

const DESC_STEPS = [
  { step: 1, title: "Account", description: "Create your account" },
  { step: 2, title: "Profile", description: "Tell us about yourself" },
  { step: 3, title: "Review", description: "Check your information" },
];

const ICON_STEPS = [
  { step: 1, title: "Account", icon: <UserIcon /> },
  { step: 2, title: "Address", icon: <LocationIcon /> },
  { step: 3, title: "Payment", icon: <CardIcon /> },
  { step: 4, title: "Review", icon: <DocIcon /> },
];

function Field({
  label,
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div className="stp-field">
      <label className="stp-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={["stp-input", error ? "stp-input--error" : ""].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${id}-err`} className="stp-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function NavButtons({
  step,
  total,
  onPrev,
  onNext,
  nextLabel,
}: {
  step: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="stp-controls">
      <button type="button" className="stp-btn" onClick={onPrev} disabled={step <= 1}>
        Previous
      </button>
      <button type="button" className="stp-btn stp-btn--primary" onClick={onNext}>
        {nextLabel ?? (step >= total ? "Finish" : "Next")}
      </button>
    </div>
  );
}

/* ── Demos ────────────────────────────────────────────────────────────── */

export function StepperPlayground() {
  const [orientation, setOrientation] = useState<StepperOrientation>("horizontal");
  const [step, setStep] = useState(2);
  const steps = DEFAULT_STEPS;

  return (
    <div className="stp-play">
      <div className="stp-play-controls">
        <label className="stp-play-label">
          Orientation
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as StepperOrientation)}
          >
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </label>
        <label className="stp-play-label">
          Step
          <select value={step} onChange={(e) => setStep(Number(e.target.value))}>
            {steps.map((s) => (
              <option key={s.step} value={s.step}>
                {s.step} — {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Stepper
        value={step}
        onValueChange={setStep}
        orientation={orientation}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">
                Content for <strong>{item.title}</strong>
              </p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function DefaultDemo() {
  const steps = DEFAULT_STEPS;
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.description}</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function CompleteStatesDemo() {
  const steps = DEFAULT_STEPS;
  return (
    <div className="stp-demo">
      <Stepper defaultValue={3} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">
                {item.step === 3
                  ? "Steps 1–2 are completed. You are on Review."
                  : item.title}
              </p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function ControlButtonsDemo() {
  const steps = DEFAULT_STEPS;
  const [step, setStep] = useState(1);
  return (
    <div className="stp-demo">
      <Stepper
        value={step}
        onValueChange={setStep}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">
                Step {item.step}: {item.title}
              </p>
            </StepperContent>
          ))}
        </StepperPanel>
        <NavButtons
          step={step}
          total={steps.length}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => setStep((s) => Math.min(steps.length, s + 1))}
        />
      </Stepper>
    </div>
  );
}

export function TitleDemo() {
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {TITLE_STEPS.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < TITLE_STEPS.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {TITLE_STEPS.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title} content</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function DescriptionDemo() {
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {DESC_STEPS.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                  <StepperDescription>{item.description}</StepperDescription>
                </span>
              </StepperTrigger>
              {index < DESC_STEPS.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {DESC_STEPS.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.description}</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function IconDemo() {
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {ICON_STEPS.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.icon}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < ICON_STEPS.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {ICON_STEPS.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title} step</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function ProgressBarDemo() {
  const steps = DEFAULT_STEPS;
  const [step, setStep] = useState(2);
  const pct = (step / steps.length) * 100;

  return (
    <div className="stp-demo">
      <div className="stp-progress-meta">
        <span>
          Step {step} of {steps.length}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} size="sm" aria-label={`Step ${step} of ${steps.length}`} />
      <Stepper
        value={step}
        onValueChange={setStep}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title}</p>
            </StepperContent>
          ))}
        </StepperPanel>
        <NavButtons
          step={step}
          total={steps.length}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => setStep((s) => Math.min(steps.length, s + 1))}
        />
      </Stepper>
    </div>
  );
}

export function VerticalDemo() {
  const steps = DESC_STEPS;
  return (
    <div className="stp-demo">
      <Stepper
        defaultValue={2}
        orientation="vertical"
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root stp-demo-root--vertical"
      >
        <div className="stp-vertical-layout">
          <StepperNav>
            {steps.map((item, index) => (
              <StepperItem key={item.step} step={item.step}>
                <StepperTrigger>
                  <StepperIndicator>{item.step}</StepperIndicator>
                  <span className="stp-trigger-copy">
                    <StepperTitle>{item.title}</StepperTitle>
                    <StepperDescription>{item.description}</StepperDescription>
                  </span>
                </StepperTrigger>
                {index < steps.length - 1 ? <StepperSeparator /> : null}
              </StepperItem>
            ))}
          </StepperNav>
          <StepperPanel>
            {steps.map((item) => (
              <StepperContent key={item.step} value={item.step}>
                <p className="stp-panel-copy">
                  <strong>{item.title}</strong>
                  <br />
                  {item.description}
                </p>
              </StepperContent>
            ))}
          </StepperPanel>
        </div>
      </Stepper>
    </div>
  );
}

export function ControlledDemo() {
  const steps = TITLE_STEPS;
  const [step, setStep] = useState(2);
  return (
    <div className="stp-demo">
      <p className="stp-meta">
        Current step: <strong>{step}</strong>
      </p>
      <div className="stp-actions">
        <button type="button" className="stp-btn" onClick={() => setStep(1)}>
          Go to Step 1
        </button>
        <button type="button" className="stp-btn" onClick={() => setStep(3)}>
          Go to Step 3
        </button>
      </div>
      <Stepper
        value={step}
        onValueChange={setStep}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title}</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function UncontrolledDemo() {
  const steps = TITLE_STEPS;
  return (
    <div className="stp-demo">
      <p className="stp-note">
        Uses <code>defaultValue</code> — internal state. Prefer <code>value</code> +{" "}
        <code>onValueChange</code> when the parent owns the step.
      </p>
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title}</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function LinearDemo() {
  const steps = DEFAULT_STEPS;
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);

  const goNext = () => {
    const next = Math.min(steps.length, step + 1);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };

  return (
    <div className="stp-demo">
      <p className="stp-note">
        Linear: future steps stay disabled until you advance with Next. Completed steps stay
        clickable.
      </p>
      <Stepper
        value={step}
        onValueChange={(v) => {
          if (v <= maxReached) setStep(v);
        }}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step} disabled={item.step > maxReached}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title}</p>
            </StepperContent>
          ))}
        </StepperPanel>
        <NavButtons
          step={step}
          total={steps.length}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={goNext}
        />
      </Stepper>
    </div>
  );
}

export function NonLinearDemo() {
  const steps = [
    { step: 1, title: "General" },
    { step: 2, title: "Notifications" },
    { step: 3, title: "Security" },
    { step: 4, title: "Billing" },
  ];
  return (
    <div className="stp-demo">
      <p className="stp-note">Non-linear: any unlocked step is clickable.</p>
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title} settings</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function DisabledDemo() {
  const steps = [
    { step: 1, title: "Account", disabled: false },
    { step: 2, title: "Profile", disabled: false },
    { step: 3, title: "Verification", disabled: true },
    { step: 4, title: "Complete", disabled: false },
  ];
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step} disabled={item.disabled}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                  {item.disabled ? <StepperDescription>Unavailable</StepperDescription> : null}
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">
                {item.disabled ? "This step cannot be opened." : item.title}
              </p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function LoadingDemo() {
  const steps = [
    { step: 1, title: "Account" },
    { step: 2, title: "Verification" },
    { step: 3, title: "Complete" },
  ];
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(() => {
      setLoading(false);
      setDone(true);
      setStep(3);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [loading]);

  return (
    <div className="stp-demo">
      <p className="stp-note" role="status">
        {loading ? "Verifying information…" : done ? "Verification complete." : null}
      </p>
      <Stepper
        value={step}
        onValueChange={setStep}
        indicators={{
          completed: <CheckIcon />,
          loading: <Spinner size="xs" announce={false} />,
        }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem
              key={item.step}
              step={item.step}
              loading={item.step === 2 && loading}
              completed={item.step === 2 && done ? true : undefined}
            >
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          <StepperContent value={1}>
            <p className="stp-panel-copy">Account details</p>
          </StepperContent>
          <StepperContent value={2}>
            <div className="stp-loading-row">
              {loading ? <Spinner size="sm" announce={false} /> : <CheckIcon />}
              <span>{loading ? "Verifying information…" : "Verified"}</span>
            </div>
          </StepperContent>
          <StepperContent value={3}>
            <p className="stp-panel-copy">All set.</p>
          </StepperContent>
        </StepperPanel>
        <button
          type="button"
          className="stp-btn"
          onClick={() => {
            setStep(2);
            setDone(false);
            setLoading(true);
          }}
        >
          Replay verification
        </button>
      </Stepper>
    </div>
  );
}

export function ErrorStepDemo() {
  return (
    <div className="stp-demo">
      <Stepper defaultValue={2} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {[
            { step: 1, title: "Account" },
            { step: 2, title: "Payment" },
            { step: 3, title: "Complete" },
          ].map((item, index, arr) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>
                  {item.step === 2 ? (
                    <span className="stp-indicator-error" aria-hidden="true">
                      !
                    </span>
                  ) : (
                    item.step
                  )}
                </StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < arr.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          <StepperContent value={2}>
            <div className="stp-alert stp-alert--error" role="alert">
              <strong>Payment details need attention.</strong>
              <span>Check the card number and try again.</span>
            </div>
          </StepperContent>
          <StepperContent value={1}>
            <p className="stp-panel-copy">Account</p>
          </StepperContent>
          <StepperContent value={3}>
            <p className="stp-panel-copy">Complete</p>
          </StepperContent>
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function FormDemo() {
  const steps = [
    { step: 1, title: "Account" },
    { step: 2, title: "Address" },
    { step: 3, title: "Preferences" },
    { step: 4, title: "Review" },
  ];
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    postal: "",
    notify: "weekly",
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) next.name = "Enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        next.email = "Enter a valid email address.";
    }
    if (s === 2) {
      if (!form.street.trim()) next.street = "Enter a street address.";
      if (!form.city.trim()) next.city = "Enter a city.";
      if (!form.postal.trim()) next.postal = "Enter a postal code.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    if (step >= steps.length) {
      setSubmitted(true);
      return;
    }
    const next = step + 1;
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="stp-demo">
        <div className="stp-success">
          <CheckIcon />
          <div>
            <strong>Setup complete</strong>
            <p>Your account is ready.</p>
          </div>
        </div>
        <button
          type="button"
          className="stp-btn stp-btn--primary"
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setMaxReached(1);
            setForm({
              name: "",
              email: "",
              street: "",
              city: "",
              postal: "",
              notify: "weekly",
            });
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="stp-demo">
      <Stepper
        value={step}
        onValueChange={(v) => {
          if (v <= maxReached) setStep(v);
        }}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step} disabled={item.step > maxReached}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          <StepperContent value={1} forceMount>
            <div className="stp-form" hidden={step !== 1} aria-hidden={step !== 1}>
              <Field
                id="stp-name"
                label="Name *"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
              />
              <Field
                id="stp-email"
                label="Email *"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
              />
            </div>
          </StepperContent>
          <StepperContent value={2} forceMount>
            <div className="stp-form" hidden={step !== 2} aria-hidden={step !== 2}>
              <Field
                id="stp-street"
                label="Street *"
                value={form.street}
                onChange={(e) => set("street", e.target.value)}
                error={errors.street}
              />
              <Field
                id="stp-city"
                label="City *"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                error={errors.city}
              />
              <Field
                id="stp-postal"
                label="Postal code *"
                value={form.postal}
                onChange={(e) => set("postal", e.target.value)}
                error={errors.postal}
              />
            </div>
          </StepperContent>
          <StepperContent value={3} forceMount>
            <div className="stp-form" hidden={step !== 3} aria-hidden={step !== 3}>
              <fieldset className="stp-fieldset">
                <legend className="stp-label">Notification preference</legend>
                {(["daily", "weekly", "never"] as const).map((opt) => (
                  <label key={opt} className="stp-radio">
                    <input
                      type="radio"
                      name="notify"
                      value={opt}
                      checked={form.notify === opt}
                      onChange={() => set("notify", opt)}
                    />
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </label>
                ))}
              </fieldset>
            </div>
          </StepperContent>
          <StepperContent value={4}>
            <dl className="stp-summary">
              <div>
                <dt>Name</dt>
                <dd>{form.name || "—"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{form.email || "—"}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  {[form.street, form.city, form.postal].filter(Boolean).join(", ") || "—"}
                </dd>
              </div>
              <div>
                <dt>Notifications</dt>
                <dd>{form.notify}</dd>
              </div>
            </dl>
          </StepperContent>
        </StepperPanel>
        <NavButtons
          step={step}
          total={steps.length}
          onPrev={() => {
            setErrors({});
            setStep((s) => Math.max(1, s - 1));
          }}
          onNext={goNext}
          nextLabel={step >= steps.length ? "Submit" : "Next"}
        />
      </Stepper>
    </div>
  );
}

export function CompletionDemo() {
  const steps = DEFAULT_STEPS;
  const [step, setStep] = useState(4);
  const finished = step > steps.length;

  if (finished) {
    return (
      <div className="stp-demo">
        <Stepper value={4} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
          <StepperNav>
            {steps.map((item, index) => (
              <StepperItem key={item.step} step={item.step} completed>
                <StepperTrigger disabled>
                  <StepperIndicator>{item.step}</StepperIndicator>
                  <span className="stp-trigger-copy">
                    <StepperTitle>{item.title}</StepperTitle>
                  </span>
                </StepperTrigger>
                {index < steps.length - 1 ? <StepperSeparator /> : null}
              </StepperItem>
            ))}
          </StepperNav>
        </Stepper>
        <div className="stp-success">
          <CheckIcon />
          <div>
            <strong>Setup complete</strong>
            <p>
              Your account is ready. This is the process completion state — not only “step 4 is
              current”.
            </p>
          </div>
        </div>
        <button type="button" className="stp-btn stp-btn--primary" onClick={() => setStep(1)}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="stp-demo">
      <Stepper
        value={step}
        onValueChange={setStep}
        indicators={{ completed: <CheckIcon /> }}
        className="stp-demo-root"
      >
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.title}</p>
            </StepperContent>
          ))}
        </StepperPanel>
        <NavButtons
          step={step}
          total={steps.length}
          onPrev={() => setStep((s) => Math.max(1, s - 1))}
          onNext={() => {
            if (step >= steps.length) setStep(steps.length + 1);
            else setStep((s) => s + 1);
          }}
          nextLabel={step >= steps.length ? "Finish" : "Next"}
        />
      </Stepper>
    </div>
  );
}

export function CompactMobileDemo() {
  const steps = DEFAULT_STEPS;
  const [step, setStep] = useState(2);
  const current = steps.find((s) => s.step === step)!;
  const pct = (step / steps.length) * 100;

  return (
    <div className="stp-demo stp-demo--compact">
      <div className="stp-compact-header">
        <span className="stp-compact-count">
          Step {step} of {steps.length}
        </span>
        <strong className="stp-compact-title">{current.title}</strong>
        <Progress value={pct} size="sm" aria-label={`Step ${step} of ${steps.length}`} />
      </div>
      <StepperPanel>
        <p className="stp-panel-copy">{current.description}</p>
      </StepperPanel>
      <NavButtons
        step={step}
        total={steps.length}
        onPrev={() => setStep((s) => Math.max(1, s - 1))}
        onNext={() => setStep((s) => Math.min(steps.length, s + 1))}
      />
      <p className="stp-note">
        Composition pattern for narrow layouts — not a <code>mobileMode</code> prop on Stepper.
      </p>
    </div>
  );
}

export function DynamicStepsDemo() {
  const steps = [
    { step: 1, title: "Account", description: "Basic details" },
    { step: 2, title: "Profile", description: "Personal information" },
    { step: 3, title: "Confirm", description: "Almost done" },
  ];
  return (
    <div className="stp-demo">
      <Stepper defaultValue={1} indicators={{ completed: <CheckIcon /> }} className="stp-demo-root">
        <StepperNav>
          {steps.map((item, index) => (
            <StepperItem key={item.step} step={item.step}>
              <StepperTrigger>
                <StepperIndicator>{item.step}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>{item.title}</StepperTitle>
                  <StepperDescription>{item.description}</StepperDescription>
                </span>
              </StepperTrigger>
              {index < steps.length - 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          {steps.map((item) => (
            <StepperContent key={item.step} value={item.step}>
              <p className="stp-panel-copy">{item.description}</p>
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

function ForceMountPanel({ label }: { label: string }) {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTicks((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <p className="stp-panel-copy">
      {label} ticks while mounted: <strong>{ticks}</strong>
    </p>
  );
}

export function ForceMountDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="stp-demo">
      <p className="stp-note">
        <code>forceMount</code> keeps inactive panels in the DOM (hidden) so local state can
        persist. Prefer for forms/animation — not the default.
      </p>
      <Stepper value={step} onValueChange={setStep} className="stp-demo-root">
        <StepperNav>
          {[1, 2].map((s, index) => (
            <StepperItem key={s} step={s}>
              <StepperTrigger>
                <StepperIndicator>{s}</StepperIndicator>
                <span className="stp-trigger-copy">
                  <StepperTitle>Panel {s}</StepperTitle>
                </span>
              </StepperTrigger>
              {index < 1 ? <StepperSeparator /> : null}
            </StepperItem>
          ))}
        </StepperNav>
        <StepperPanel>
          <StepperContent value={1} forceMount>
            <ForceMountPanel label="Panel 1" />
          </StepperContent>
          <StepperContent value={2} forceMount>
            <ForceMountPanel label="Panel 2" />
          </StepperContent>
        </StepperPanel>
      </Stepper>
    </div>
  );
}

export function AnatomyDemo() {
  return (
    <div className="stp-anatomy">
      {[
        ["Stepper", "Root — state, orientation, indicators"],
        ["StepperNav", "Navigational list of steps"],
        ["StepperItem", "One step — step / completed / disabled / loading"],
        ["StepperTrigger", "Interactive control to select a step"],
        ["StepperIndicator", "Number, icon, check, or spinner"],
        ["StepperSeparator", "Connector between steps"],
        ["StepperTitle", "Short step name"],
        ["StepperDescription", "Supporting context"],
        ["StepperPanel", "Groups step content panels"],
        ["StepperContent", "Content for one step value"],
      ].map(([name, desc]) => (
        <div key={name} className="stp-anatomy-row">
          <code>{name}</code>
          <span>{desc}</span>
        </div>
      ))}
    </div>
  );
}

export function CompareDemo() {
  return (
    <table className="stp-api-table">
      <thead>
        <tr>
          <th>Pattern</th>
          <th>Use when</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Stepper</td>
          <td>Named stages in a workflow (checkout, onboarding, multi-step forms)</td>
        </tr>
        <tr>
          <td>Progress</td>
          <td>Amount of work completed (upload 65%, processing 250/500)</td>
        </tr>
        <tr>
          <td>Tabs</td>
          <td>Peer sections with no required sequence (Overview | Activity | Settings)</td>
        </tr>
        <tr>
          <td>Breadcrumb</td>
          <td>Location in an information hierarchy — not process completion</td>
        </tr>
      </tbody>
    </table>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Orientation", "horizontal (default) · vertical"],
    ["States", "inactive · active · completed · loading · disabled"],
    ["Indicator", "28px circle · fixed size across states"],
    ["Connector", "2px · completed uses success"],
    ["Control", "value / defaultValue / onValueChange"],
    ["A11y", "aria-current=step · status text · keyboard"],
  ];
  return (
    <div className="stp-specs-grid">
      {rows.map(([label, value]) => (
        <div key={label} className="stp-spec-card">
          <span className="stp-spec-label">{label}</span>
          <span className="stp-spec-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

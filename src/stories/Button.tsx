import React, { useEffect, useRef, useState } from 'react';
import { Spinner, type SpinnerSize } from './components/Spinners';
import './button.css';

export type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'tonal';
export type ButtonIntent  = 'primary' | 'success' | 'warning' | 'error' | 'neutral';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Legacy Storybook sizes still used by older examples. */
const SIZE_ALIAS: Record<string, ButtonSize> = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
};

function resolveSize(size: string): string {
  return SIZE_ALIAS[size] ?? size;
}

function spinnerSizeFor(size: string): SpinnerSize {
  if (size === 'lg' || size === 'xl') return 'sm';
  return 'xs';
}

export interface ButtonProps {
  /** Visual style of the button */
  variant?: ButtonVariant | string;
  /** Semantic colour intent */
  intent?: ButtonIntent | string;
  /** Size of the button */
  size?: ButtonSize | string;
  /** Button label text. Also the accessible name when `iconOnly` is set. */
  label?: string;
  /** Renders a square icon-only button (hides label) */
  iconOnly?: boolean;
  /** Node rendered before the label */
  leadingIcon?: React.ReactNode;
  /** Node rendered after the label */
  trailingIcon?: React.ReactNode;
  /** Disables the button */
  disabled?: boolean;
  /**
   * Shows the design-system Spinner, keeps the label, and blocks activation.
   * Prefer a progress label such as "Saving…" — the Spinner itself is not announced.
   */
  loading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** HTML button type. Ignored when `href` is set. Default `button` (not the native submit default). */
  type?: 'button' | 'submit' | 'reset';
  /**
   * When set, renders an anchor with button styles.
   * Use this for navigation. Keep `<button>` for actions.
   */
  href?: string;
  target?: string;
  rel?: string;
  /** Extra class names */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const Button = ({
  variant    = 'filled',
  intent     = 'primary',
  size       = 'md',
  label      = 'Button',
  iconOnly   = false,
  leadingIcon,
  trailingIcon,
  disabled   = false,
  loading    = false,
  fullWidth  = false,
  type       = 'button',
  href,
  target,
  rel,
  className,
  onClick,
}: ButtonProps) => {
  const v = variant || 'filled';
  const s = resolveSize(size || 'md');
  const blocked = disabled || loading;
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const idleWidth = useRef<number | undefined>(undefined);
  const [lockedWidth, setLockedWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!ref.current) return;
    if (!loading) {
      idleWidth.current = ref.current.offsetWidth;
      setLockedWidth(undefined);
      return;
    }
    if (idleWidth.current) setLockedWidth(idleWidth.current);
  }, [loading]);

  const classes = [
    'btn',
    `btn--${v}`,
    `btn--${s}`,
    iconOnly  ? 'btn--icon'       : '',
    fullWidth ? 'btn--full-width' : '',
    loading   ? 'btn--loading'    : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="btn__icon">
          <Spinner size={spinnerSizeFor(s)} announce={false} />
        </span>
      ) : leadingIcon ? (
        <span className="btn__icon">{leadingIcon}</span>
      ) : iconOnly ? (
        <span className="btn__icon"><DefaultIcon /></span>
      ) : null}
      {!iconOnly && <span className="btn__label">{label}</span>}
      {!loading && trailingIcon && !iconOnly && (
        <span className="btn__icon">{trailingIcon}</span>
      )}
    </>
  );

  const shared = {
    className: classes,
    'data-intent': intent,
    'aria-label': iconOnly ? label : undefined,
    'aria-busy': loading || undefined,
    style: lockedWidth ? { minWidth: lockedWidth } : undefined,
    onClick: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (blocked) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
  };

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={blocked ? undefined : href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={blocked || undefined}
        tabIndex={blocked ? -1 : undefined}
        {...shared}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={blocked}
      {...shared}
    >
      {content}
    </button>
  );
};

export type ButtonGroupProps = {
  /** Accessible name for the group, when the grouping is meaningful. */
  label?: string;
  className?: string;
  children: React.ReactNode;
};

/** Visually joins related buttons. Not a radio or toggle group. */
export function ButtonGroup({ label, className, children }: ButtonGroupProps) {
  return (
    <div
      className={['btn-group', className ?? ''].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      {children}
    </div>
  );
}

/* ── Inline default icon (used for icon-only when none provided) ── */
const DefaultIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

/* ── Exported icon helpers for stories ─────────────────────────── */
export const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

export const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v7M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l1.8 3.6L14 6.3l-3 2.9.7 4.1L8 11.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

export const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

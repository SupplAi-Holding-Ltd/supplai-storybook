import React from 'react';
import './button.css';

export type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'tonal';
export type ButtonIntent  = 'primary' | 'success' | 'warning' | 'error' | 'neutral';
export type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  /** Visual style of the button */
  variant?: ButtonVariant | string;
  /** Semantic colour intent */
  intent?: ButtonIntent | string;
  /** Size of the button */
  size?: ButtonSize | string;
  /** Button label text */
  label?: string;
  /** Renders a square icon-only button (hides label) */
  iconOnly?: boolean;
  /** Node rendered before the label */
  leadingIcon?: React.ReactNode;
  /** Node rendered after the label */
  trailingIcon?: React.ReactNode;
  /** Disables the button */
  disabled?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: () => void;
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
  fullWidth  = false,
  type       = 'button',
  onClick,
}: ButtonProps) => {
  const v = variant || 'filled';
  const s = size    || 'md';
  const classes = [
    'btn',
    `btn--${v}`,
    `btn--${s}`,
    iconOnly  ? 'btn--icon'       : '',
    fullWidth ? 'btn--full-width' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      data-intent={intent}
      disabled={disabled}
      onClick={onClick}
      aria-label={iconOnly ? label : undefined}
    >
      {leadingIcon && <span className="btn__icon">{leadingIcon}</span>}
      {!iconOnly && <span className="btn__label">{label}</span>}
      {iconOnly && leadingIcon == null && <span className="btn__icon"><DefaultIcon /></span>}
      {trailingIcon && !iconOnly && <span className="btn__icon">{trailingIcon}</span>}
    </button>
  );
};

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

export const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

import React from 'react';
import { createPortal } from 'react-dom';
import {
  Copy,
  Delete,
  Download,
  Edit,
  Folder,
  Link,
} from '@meistericons/react';
import './ContextMenus.css';

export const CONTEXT_MENU_CODE = `// Context Menu · supplai Design System
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from './context-menu';

function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="cxm-trigger-surface">Right click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => {}}>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => {}}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
`;

/* ─── Types & context ─── */

type Point = { x: number; y: number };

type MenuCtx = {
  open: boolean;
  point: Point;
  openAt: (p: Point) => void;
  close: () => void;
  registerItem: (el: HTMLElement | null, id: string) => void;
  highlight: string | null;
  setHighlight: (id: string | null) => void;
  itemIds: string[];
};

const MenuContext = React.createContext<MenuCtx | null>(null);
const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (v: string) => void;
} | null>(null);

function useMenu() {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('Context menu parts must be used within <ContextMenu>');
  return ctx;
}

function clampPos(x: number, y: number, w: number, h: number): Point {
  const pad = 8;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  return {
    x: Math.max(pad, Math.min(x, maxX)),
    y: Math.max(pad, Math.min(y, maxY)),
  };
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Root ─── */

export function ContextMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState<Point>({ x: 0, y: 0 });
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());
  const [itemIds, setItemIds] = React.useState<string[]>([]);

  const registerItem = React.useCallback((el: HTMLElement | null, id: string) => {
    const map = itemsRef.current;
    if (el) map.set(id, el);
    else map.delete(id);
    setItemIds(Array.from(map.keys()));
  }, []);

  const openAt = React.useCallback((p: Point) => {
    setPoint(p);
    setOpen(true);
    setHighlight(null);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    setHighlight(null);
  }, []);

  const value = React.useMemo(
    () => ({ open, point, openAt, close, registerItem, highlight, setHighlight, itemIds }),
    [open, point, openAt, close, registerItem, highlight, itemIds],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/* ─── Trigger ─── */

export function ContextMenuTrigger({
  children,
  className = '',
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const { openAt, close, open } = useMenu();
  const ref = React.useRef<HTMLElement | null>(null);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openAt({ x: e.clientX, y: e.clientY });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const r = ref.current?.getBoundingClientRect();
      if (r) openAt({ x: r.left + r.width / 2, y: r.bottom });
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onScroll = () => close();
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open, close]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ref,
      onContextMenu,
      onKeyDown: (e: React.KeyboardEvent) => {
        (children as React.ReactElement<{ onKeyDown?: (e: React.KeyboardEvent) => void }>).props
          .onKeyDown?.(e);
        onKeyDown(e);
      },
    });
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      onContextMenu={onContextMenu}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-haspopup="menu"
    >
      {children}
    </div>
  );
}

/* ─── Content ─── */

export function ContextMenuContent({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { open, point, close, highlight, setHighlight, itemIds } = useMenu();
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState(point);

  React.useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos(clampPos(point.x, point.y, r.width, r.height));
  }, [open, point]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if ((t as Element).closest?.('.cxm-content')) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (!itemIds.length) return;
      const idx = highlight ? itemIds.indexOf(highlight) : -1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = itemIds[(idx + 1) % itemIds.length];
        setHighlight(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = itemIds[(idx - 1 + itemIds.length) % itemIds.length];
        setHighlight(next);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (highlight) {
          e.preventDefault();
          const el = ref.current?.querySelector(`[data-cxm-id="${highlight}"]`) as HTMLElement | null;
          el?.click();
        }
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close, highlight, itemIds, setHighlight]);

  if (!open) return null;

  return createPortal(
    <div
      ref={ref}
      className={`cxm-content ${className}`.trim()}
      role="menu"
      tabIndex={-1}
      style={{ top: pos.y, left: pos.x, ...style }}
    >
      {children}
    </div>,
    document.body,
  );
}

/* ─── Items ─── */

let idCounter = 0;
function useItemId(prefix: string) {
  const id = React.useRef(`${prefix}-${++idCounter}`);
  return id.current;
}

export function ContextMenuItem({
  children,
  disabled = false,
  inset = false,
  variant = 'default',
  onSelect,
  className = '',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  inset?: boolean;
  variant?: 'default' | 'destructive';
  onSelect?: () => void;
  className?: string;
}) {
  const { close, registerItem, highlight, setHighlight } = useMenu();
  const id = useItemId('item');
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (disabled) return;
    registerItem(ref.current, id);
    return () => registerItem(null, id);
  }, [disabled, id, registerItem]);

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      data-cxm-id={id}
      data-highlighted={highlight === id ? 'true' : undefined}
      disabled={disabled}
      className={[
        'cxm-item',
        inset ? 'cxm-item--inset' : '',
        variant === 'destructive' ? 'cxm-item--destructive' : '',
        disabled ? 'cxm-item--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => !disabled && setHighlight(id)}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        close();
      }}
    >
      {children}
    </button>
  );
}

export function ContextMenuCheckboxItem({
  children,
  checked = false,
  disabled = false,
  onCheckedChange,
  className = '',
}: {
  children: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}) {
  const { registerItem, highlight, setHighlight } = useMenu();
  const id = useItemId('check');
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (disabled) return;
    registerItem(ref.current, id);
    return () => registerItem(null, id);
  }, [disabled, id, registerItem]);

  return (
    <button
      ref={ref}
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      data-cxm-id={id}
      data-state={checked ? 'checked' : 'unchecked'}
      data-highlighted={highlight === id ? 'true' : undefined}
      disabled={disabled}
      className={[
        'cxm-checkbox',
        disabled ? 'cxm-checkbox--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => !disabled && setHighlight(id)}
      onClick={() => {
        if (disabled) return;
        onCheckedChange?.(!checked);
      }}
    >
      <span className="cxm-check" aria-hidden="true">
        <span className="cxm-check-box">{checked ? <CheckIcon /> : null}</span>
      </span>
      <span className="cxm-item-label">{children}</span>
    </button>
  );
}

export function ContextMenuRadioGroup({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="group">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function ContextMenuRadioItem({
  children,
  value,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
}) {
  const group = React.useContext(RadioGroupContext);
  const { registerItem, highlight, setHighlight } = useMenu();
  const id = useItemId('radio');
  const ref = React.useRef<HTMLButtonElement>(null);
  const checked = group?.value === value;

  React.useEffect(() => {
    if (disabled) return;
    registerItem(ref.current, id);
    return () => registerItem(null, id);
  }, [disabled, id, registerItem]);

  return (
    <button
      ref={ref}
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      data-cxm-id={id}
      data-state={checked ? 'checked' : 'unchecked'}
      data-highlighted={highlight === id ? 'true' : undefined}
      disabled={disabled}
      className={['cxm-radio', disabled ? 'cxm-radio--disabled' : '', className]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => !disabled && setHighlight(id)}
      onClick={() => {
        if (disabled) return;
        group?.onValueChange?.(value);
      }}
    >
      <span className="cxm-radio-dot" aria-hidden="true">
        <span className="cxm-radio-ring" />
      </span>
      <span className="cxm-item-label">{children}</span>
    </button>
  );
}

export function ContextMenuLabel({
  children,
  inset = false,
  className = '',
}: {
  children: React.ReactNode;
  inset?: boolean;
  className?: string;
}) {
  return (
    <div className={['cxm-label', inset ? 'cxm-label--inset' : '', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export function ContextMenuSeparator({ className = '' }: { className?: string }) {
  return <hr className={`cxm-sep ${className}`.trim()} />;
}

export function ContextMenuShortcut({ children }: { children: React.ReactNode }) {
  return <span className="cxm-shortcut">{children}</span>;
}

export function ContextMenuGroup({ children }: { children: React.ReactNode }) {
  return <div role="group">{children}</div>;
}

/* ─── Submenu ─── */

type SubCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const SubContext = React.createContext<SubCtx | null>(null);

export function ContextMenuSub({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const value = React.useMemo(() => ({ open, setOpen, triggerRef }), [open]);
  return (
    <SubContext.Provider value={value}>
      <div className="cxm-sub">{children}</div>
    </SubContext.Provider>
  );
}

export function ContextMenuSubTrigger({
  children,
  disabled = false,
  inset = false,
  className = '',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  inset?: boolean;
  className?: string;
}) {
  const sub = React.useContext(SubContext);
  const { registerItem, highlight, setHighlight } = useMenu();
  const id = useItemId('sub');
  const ref = sub?.triggerRef ?? React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (disabled) return;
    registerItem(ref.current, id);
    return () => registerItem(null, id);
  }, [disabled, id, registerItem, ref]);

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={sub?.open}
      data-cxm-id={id}
      data-state={sub?.open ? 'open' : 'closed'}
      data-highlighted={highlight === id || sub?.open ? 'true' : undefined}
      disabled={disabled}
      className={[
        'cxm-sub-trigger',
        inset ? 'cxm-sub-trigger--inset' : '',
        disabled ? 'cxm-sub-trigger--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseEnter={() => {
        if (disabled) return;
        setHighlight(id);
        sub?.setOpen(true);
      }}
      onClick={() => {
        if (disabled) return;
        sub?.setOpen(!sub.open);
      }}
    >
      <span className="cxm-item-label">{children}</span>
      <span className="cxm-sub-chevron" aria-hidden="true">
        <ChevronRight />
      </span>
    </button>
  );
}

export function ContextMenuSubContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sub = React.useContext(SubContext);
  const { open: rootOpen, close } = useMenu();
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<Point>({ x: 0, y: 0 });

  React.useLayoutEffect(() => {
    if (!sub?.open || !sub.triggerRef.current || !ref.current) return;
    const t = sub.triggerRef.current.getBoundingClientRect();
    const r = ref.current.getBoundingClientRect();
    let x = t.right + 4;
    let y = t.top;
    if (x + r.width > window.innerWidth - 8) x = t.left - r.width - 4;
    setPos(clampPos(x, y, r.width, r.height));
  }, [sub?.open, sub?.triggerRef]);

  React.useEffect(() => {
    if (!rootOpen) sub?.setOpen(false);
  }, [rootOpen, sub]);

  if (!sub?.open) return null;

  return createPortal(
    <div
      ref={ref}
      className={`cxm-content cxm-content--sub ${className}`.trim()}
      role="menu"
      style={{ top: pos.y, left: pos.x }}
      onMouseLeave={() => sub.setOpen(false)}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const props = child.props as { onSelect?: () => void };
        if (typeof props.onSelect === 'function') {
          return React.cloneElement(child as React.ReactElement<{ onSelect?: () => void }>, {
            onSelect: () => {
              props.onSelect?.();
              close();
            },
          });
        }
        return child;
      })}
    </div>,
    document.body,
  );
}

/* ─── Shared menu body builders for demos ─── */

function Surface({
  label = 'Right click here',
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div className={`cxm-trigger-surface ${compact ? 'cxm-trigger-surface--compact' : ''}`}>
      {label}
    </div>
  );
}

export function DefaultDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem onSelect={() => {}}>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem onSelect={() => {}}>Save as…</ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>Print…</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="cxm-note">Right-click the dashed area (or focus it and press Shift+F10).</p>
    </div>
  );
}

export function IconsDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for file actions" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Edit size={16} />
            </span>
            Rename
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Copy size={16} />
            </span>
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Download size={16} />
            </span>
            Download
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Link size={16} />
            </span>
            Share
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Link size={16} />
            </span>
            Copy link
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function ShortcutsDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for shortcuts" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={() => {}}>
            Select all
            <ContextMenuShortcut>⌘A</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function SubmenusDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for nested actions" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>Open</ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Folder size={16} />
            </span>
            Move to…
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => {}}>Email link</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Messages</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Copy link</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => {}}>Save page as…</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Create shortcut…</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Developer tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function CheckboxDemo() {
  const [bookmarks, setBookmarks] = React.useState(true);
  const [urls, setUrls] = React.useState(false);
  const [status, setStatus] = React.useState(true);

  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click to toggle view options" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={status} onCheckedChange={setStatus}>
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function RadioDemo() {
  const [person, setPerson] = React.useState('pedro');

  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click to choose a person" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
            <ContextMenuRadioItem value="amelie">Amelie Laurent</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="cxm-note">Selected: {person}</p>
    </div>
  );
}

export function DisabledDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click — some actions unavailable" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>Undo</ContextMenuItem>
          <ContextMenuItem disabled>Redo</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem disabled>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function DestructiveDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for destructive actions" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Edit size={16} />
            </span>
            Edit
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Copy size={16} />
            </span>
            Duplicate
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Delete size={16} />
            </span>
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function GroupedDemo() {
  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for grouped actions" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Navigation</ContextMenuLabel>
          <ContextMenuGroup>
            <ContextMenuItem onSelect={() => {}}>Back</ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>Forward</ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>Reload</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuLabel>Clipboard</ContextMenuLabel>
          <ContextMenuGroup>
            <ContextMenuItem onSelect={() => {}}>
              <span className="cxm-item-icon">
                <Copy size={16} />
              </span>
              Cut
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>
              <span className="cxm-item-icon">
                <Copy size={16} />
              </span>
              Copy
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function DialogDemo() {
  return (
    <div className="cxm-demo">
      <div className="cxm-dialog-backdrop">
        <div className="cxm-dialog" role="dialog" aria-labelledby="cxm-dialog-title">
          <p className="cxm-dialog-title" id="cxm-dialog-title">
            Project settings
          </p>
          <p className="cxm-dialog-body">
            Right-click inside the dialog surface to open a context menu without leaving the modal.
          </p>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="cxm-dialog-surface">Right click inside this dialog</div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => {}}>Inspect element</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Copy field value</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive" onSelect={() => {}}>
                Clear draft
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <div className="cxm-dialog-actions">
            <button type="button" className="cxm-btn cxm-btn--ghost">
              Cancel
            </button>
            <button type="button" className="cxm-btn cxm-btn--primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CombinedDemo() {
  const [bookmarks, setBookmarks] = React.useState(true);
  const [urls, setUrls] = React.useState(false);
  const [person, setPerson] = React.useState('pedro');

  return (
    <div className="cxm-demo">
      <ContextMenu>
        <ContextMenuTrigger>
          <Surface label="Right click for the full combined menu" />
        </ContextMenuTrigger>
        <ContextMenuContent style={{ minWidth: 220 }}>
          <ContextMenuGroup>
            <ContextMenuItem onSelect={() => {}}>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => {}}>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => {}}>Save page as…</ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>
                <span className="cxm-item-icon">
                  <Download size={16} />
                </span>
                Create shortcut…
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => {}}>Developer tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onSelect={() => {}}>
            <span className="cxm-item-icon">
              <Delete size={16} />
            </span>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function ContextMenuPlayground() {
  return <CombinedDemo />;
}

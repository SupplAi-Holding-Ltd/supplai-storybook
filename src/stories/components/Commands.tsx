import React, { useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { Search } from "@meistericons/react";
import "./Commands.css";

/**
 * Command menu.
 * cmdk owns filtering, keyboard movement, and selection.
 * CommandDialog uses Radix Dialog for the modal layer: overlay, focus trap, and Escape.
 */

export type CommandProps = React.ComponentProps<typeof CommandPrimitive>;

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(function Command(
  { className, vimBindings = false, label = "Command menu", ...props },
  ref,
) {
  return (
    <CommandPrimitive
      ref={ref}
      className={["cmd", className].filter(Boolean).join(" ")}
      vimBindings={vimBindings}
      label={label}
      {...props}
    />
  );
});

type CommandDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name for the dialog and the search field. */
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  /** Focused when the dialog closes. Use the button that opened the palette. */
  finalFocusRef?: React.RefObject<HTMLElement | null>;
} & Pick<CommandProps, "shouldFilter" | "filter" | "loop" | "value" | "onValueChange" | "label">;

export function CommandDialog({
  open,
  onOpenChange,
  title = "Command menu",
  description = "Search commands, pages, and people.",
  className,
  children,
  label,
  finalFocusRef,
  ...commandProps
}: CommandDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cmd-overlay" />
        <Dialog.Content
          className="cmd-dialog-content"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            const root = event.currentTarget as HTMLElement;
            root.querySelector<HTMLInputElement>("[cmdk-input]")?.focus();
          }}
          onCloseAutoFocus={(event) => {
            const node = finalFocusRef?.current;
            if (!node) return;
            event.preventDefault();
            node.focus();
          }}
        >
          <Dialog.Title className="cmd-sr">{title}</Dialog.Title>
          <Dialog.Description className="cmd-sr">{description}</Dialog.Description>
          <Command className={className} label={label ?? title} {...commandProps}>
            {children}
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function setNativeValue(el: HTMLInputElement, next: string) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  descriptor?.set?.call(el, next);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof CommandPrimitive.Input>
>(function CommandInput({ className, placeholder = "Search commands...", value, onValueChange, ...props }, ref) {
  const innerRef = useRef<HTMLInputElement>(null);
  const search = useCommandState((state) => state.search);
  const shown = (value ?? search).length > 0;

  return (
    <div className="cmd-input-wrap">
      <span className="cmd-ico" aria-hidden="true">
        <Search size={16} />
      </span>
      <CommandPrimitive.Input
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={["cmd-input", className].filter(Boolean).join(" ")}
        placeholder={placeholder}
        value={value}
        onValueChange={onValueChange}
        {...props}
      />
      {shown ? (
        <button
          type="button"
          className="cmd-clear"
          aria-label="Clear search"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            const el = innerRef.current;
            if (!el) return;
            setNativeValue(el, "");
            el.focus();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});

export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.List>
>(function CommandList({ className, ...props }, ref) {
  return (
    <CommandPrimitive.List
      ref={ref}
      className={["cmd-list", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={["cmd-empty", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={["cmd-group", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Item>
>(function CommandItem({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={["cmd-item", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Separator>
>(function CommandSeparator({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={["cmd-sep", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CommandDivider = CommandSeparator;

export const CommandLoading = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Loading>
>(function CommandLoading({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Loading
      ref={ref}
      className={["cmd-loading", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export function CommandShortcut({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="cmd-kbd" aria-hidden="true">
      {children}
    </kbd>
  );
}

export function isMacPlatform() {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform || "";
  const agent = navigator.userAgent || "";
  return /Mac|iPhone|iPad|iPod/.test(platform) || /Mac OS/.test(agent);
}

export function shortcutLabel(mac: string, other: string) {
  return isMacPlatform() ? mac : other;
}

const hotkeyTargets = new Set<() => void>();
let hotkeyAttached = false;

function onHotkey(event: KeyboardEvent) {
  if (event.repeat) return;
  if (event.shiftKey || event.altKey) return;
  if (event.key.toLowerCase() !== "k") return;
  if (!(event.metaKey || event.ctrlKey)) return;
  const target = event.target as HTMLElement | null;
  if (target?.isContentEditable) return;
  if (target?.closest?.("[data-cmd-hotkey-ignore]")) return;
  event.preventDefault();
  event.stopPropagation();
  hotkeyTargets.forEach((fn) => fn());
}

function ensureHotkey() {
  if (hotkeyAttached || typeof document === "undefined") return;
  document.addEventListener("keydown", onHotkey, true);
  hotkeyAttached = true;
}

function releaseHotkey() {
  if (!hotkeyAttached || typeof document === "undefined") return;
  document.removeEventListener("keydown", onHotkey, true);
  hotkeyAttached = false;
}

/** One document listener, shared by every mounted palette. Removed when the last subscriber unmounts. */
export function useCommandHotkey(onToggle: () => void, enabled = true) {
  const ref = useRef(onToggle);
  ref.current = onToggle;

  useEffect(() => {
    if (!enabled) return;
    const fn = () => ref.current();
    hotkeyTargets.add(fn);
    ensureHotkey();
    return () => {
      hotkeyTargets.delete(fn);
      if (hotkeyTargets.size === 0) releaseHotkey();
    };
  }, [enabled]);
}

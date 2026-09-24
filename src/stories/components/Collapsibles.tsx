import React from 'react';
import './Collapsibles.css';

export const COLLAPSIBLE_CODE = `// Collapsible · supplai Design System
import { useState } from 'react';

function Collapsible({ open: openProp, defaultOpen = false, onOpenChange, children }) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = openProp ?? internal;
  const setOpen = (next) => {
    if (openProp === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <div className="col-root" data-state={open ? 'open' : 'closed'}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, onOpenChange: setOpen })
          : child
      )}
    </div>
  );
}

function CollapsibleTrigger({ open, onOpenChange, children }) {
  return (
    <button type="button" className="col-trigger" aria-expanded={open}
      onClick={() => onOpenChange?.(!open)}>
      {children}
    </button>
  );
}

function CollapsibleContent({ open, children }) {
  return (
    <div className="col-content" data-state={open ? 'open' : 'closed'} hidden={!open && undefined}>
      <div className="col-content-inner">{children}</div>
    </div>
  );
}
`;

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <span className="col-trigger-icon" data-state={open ? 'open' : 'closed'} aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

type ColCtx = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<ColCtx | null>(null);

export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  className = '',
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? !!openProp : internal;

  const setOpen = (next: boolean) => {
    if (!controlled) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: setOpen }}>
      <div className={`col-root ${className}`.trim()} data-state={open ? 'open' : 'closed'}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  children,
  className = '',
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) return null;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      'aria-expanded': ctx.open,
      'data-state': ctx.open ? 'open' : 'closed',
      onClick: (e: React.MouseEvent) => {
        const prev = (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props
          .onClick;
        prev?.(e);
        ctx.onOpenChange(!ctx.open);
      },
    });
  }

  return (
    <button
      type="button"
      className={`col-trigger ${className}`.trim()}
      aria-expanded={ctx.open}
      data-state={ctx.open ? 'open' : 'closed'}
      onClick={() => ctx.onOpenChange(!ctx.open)}
    >
      {children}
      <Chevron open={ctx.open} />
    </button>
  );
}

export function CollapsibleContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) return null;
  return (
    <div
      className={`col-content ${className}`.trim()}
      data-state={ctx.open ? 'open' : 'closed'}
    >
      <div className="col-content-inner">{children}</div>
    </div>
  );
}

export function CollapsiblePlayground() {
  const [defaultOpen, setDefaultOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);

  return (
    <div className="colp-wrap">
      <div className="colp-preview">
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Collapsible key={key} defaultOpen={defaultOpen}>
            <div className="col-text-card">
              <CollapsibleTrigger>Can I use supplai components in my project?</CollapsibleTrigger>
              <p className="col-text-body col-text-body--clamp">
                Of course. supplai is a design system with accessible React components for building
                product interfaces.
              </p>
              <CollapsibleContent>
                <p className="col-text-body" style={{ marginTop: 8 }}>
                  Use Brand Blue tokens, Manrope typography, and documented patterns from Storybook
                  to stay consistent across apps. Copy the code sketches from each component page to
                  get started quickly.
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </div>
      <div className="colp-controls">
        <span className="colp-label">Default</span>
        <button
          type="button"
          className={`colp-chip ${!defaultOpen ? 'colp-chip--on' : ''}`}
          onClick={() => {
            setDefaultOpen(false);
            setKey((k) => k + 1);
          }}
        >
          closed
        </button>
        <button
          type="button"
          className={`colp-chip ${defaultOpen ? 'colp-chip--on' : ''}`}
          onClick={() => {
            setDefaultOpen(true);
            setKey((k) => k + 1);
          }}
        >
          open
        </button>
      </div>
    </div>
  );
}

export function TextDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="col-demo col-demo--mid">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="col-text-card">
          <div className="col-text-meta">
            <p className="col-text-title">Design Project: supplai DS</p>
            <span className="col-text-badge">84% Complete</span>
          </div>
          <p className={`col-text-body ${open ? '' : 'col-text-body--clamp'}`}>
            supplai is a modern design system and component library built with React and TypeScript.
            It provides accessible, customizable components for building beautiful user interfaces
            across product surfaces.
          </p>
          <CollapsibleContent>
            <p className="col-text-body" style={{ marginTop: 8 }}>
              Active workstreams include Calendar, Checkbox, and Collapsible documentation — each
              using Brand Blue tokens. Two dependencies are currently tracking in the release train.
            </p>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <button type="button" className="col-link-btn">
              {open ? 'Show less' : 'Show more'}
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}

const MESSAGES = [
  { id: 1, initials: 'AL', name: 'Alex', msg: "Hey, let's catch up today!", time: '5m ago' },
  { id: 2, initials: 'JR', name: 'Jordan', msg: 'Docs review is ready for you.', time: '22m ago' },
  { id: 3, initials: 'SK', name: 'Sam', msg: 'Pushed the Calendar polish.', time: '1h ago' },
  { id: 4, initials: 'MK', name: 'Morgan', msg: 'Can we sync on Checkbox?', time: '3h ago' },
  { id: 5, initials: 'PT', name: 'Pat', msg: 'Storybook deploy looks good.', time: 'Yesterday' },
];

export function ListDemo() {
  const [open, setOpen] = React.useState(false);
  const head = MESSAGES.slice(0, 2);
  const rest = MESSAGES.slice(2);

  return (
    <div className="col-demo col-demo--mid">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="col-list">
          <div className="col-list-header">
            <p className="col-list-title">New messages</p>
            <CollapsibleTrigger asChild>
              <button type="button" className="col-link-btn">
                {open ? 'Show less' : 'Show all'}
              </button>
            </CollapsibleTrigger>
          </div>
          {head.map((m) => (
            <div key={m.id} className="col-list-item">
              <span className="col-avatar">{m.initials}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p className="col-list-name">{m.name}</p>
                <p className="col-list-msg">{m.msg}</p>
              </div>
              <span className="col-list-time">{m.time}</span>
            </div>
          ))}
          <CollapsibleContent>
            {rest.map((m) => (
              <div key={m.id} className="col-list-item">
                <span className="col-avatar">{m.initials}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="col-list-name">{m.name}</p>
                  <p className="col-list-msg">{m.msg}</p>
                </div>
                <span className="col-list-time">{m.time}</span>
              </div>
            ))}
            <div className="col-list-footer">
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {MESSAGES.length} conversations in your inbox
              </span>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export function BillingDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="col-demo col-demo--narrow">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="col-bill">
          <div className="col-bill-top">
            <div>
              <p className="col-bill-label">7 days remaining in cycle</p>
              <p className="col-bill-value">Billing</p>
            </div>
            <CollapsibleTrigger asChild>
              <button type="button" className="col-link-btn">
                {open ? 'Hide' : 'Details'}
                <Chevron open={open} />
              </button>
            </CollapsibleTrigger>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Included credits</span>
              <span style={{ fontSize: 12, color: '#64748B' }}>$100.00 / $150</span>
            </div>
            <div className="col-progress">
              <span style={{ width: '67%' }} />
            </div>
            <p className="col-bill-sub" style={{ marginTop: 6 }}>
              On-demand $0
            </p>
          </div>
          <CollapsibleContent>
            <div>
              {[
                ['User Signups', '$20.20'],
                ['Server Uptime', '$14.25'],
                ['Page Views', '$12.75'],
              ].map(([label, value]) => (
                <div key={label} className="col-bill-row">
                  <span className="col-bill-row-label">{label}</span>
                  <span className="col-bill-row-value">{value}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

const ACC_ITEMS = [
  {
    id: 'appearance',
    title: 'Appearance Settings',
    body: 'Theme, density, and motion preferences for your workspace.',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    body: 'Choose which widgets appear on your home dashboard.',
  },
  {
    id: 'workspace',
    title: 'Workspace',
    body: 'Members, roles, and shared folder defaults.',
  },
  {
    id: 'payments',
    title: 'Payments',
    body: 'Invoices, payment methods, and billing contacts.',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    body: 'Email and in-app notification channels.',
  },
];

export function AccordionStyleDemo() {
  const [openId, setOpenId] = React.useState<string | null>('appearance');

  return (
    <div className="col-demo col-demo--mid">
      <div className="col-acc">
        {ACC_ITEMS.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className="col-acc-item">
              <Collapsible
                open={open}
                onOpenChange={(next) => setOpenId(next ? item.id : null)}
              >
                <button
                  type="button"
                  className="col-acc-trigger"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  {item.title}
                  <Chevron open={open} />
                </button>
                <CollapsibleContent>
                  <div className="col-acc-panel">{item.body}</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RADIO_OPTIONS = [
  {
    id: 'pro',
    title: 'Pro plan',
    desc: 'For growing product teams',
    detail: 'Includes Calendar, Checkbox, and Collapsible kits plus priority support.',
  },
  {
    id: 'team',
    title: 'Team plan',
    desc: 'Shared libraries across apps',
    detail: 'Workspace roles, design tokens sync, and usage analytics.',
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    desc: 'Security and custom SLAs',
    detail: 'SSO, audit logs, and dedicated design-system office hours.',
  },
];

export function RadioDemo() {
  const [selected, setSelected] = React.useState('pro');

  return (
    <div className="col-demo col-demo--mid">
      <div className="col-radio-list">
        {RADIO_OPTIONS.map((opt) => {
          const on = selected === opt.id;
          return (
            <div key={opt.id} className={`col-radio-card ${on ? 'col-radio-card--on' : ''}`}>
              <Collapsible open={on} onOpenChange={(next) => next && setSelected(opt.id)}>
                <button
                  type="button"
                  className="col-radio-head"
                  onClick={() => setSelected(opt.id)}
                >
                  <span className="col-radio-dot" aria-hidden="true" />
                  <span>
                    <p className="col-radio-title">{opt.title}</p>
                    <p className="col-radio-desc">{opt.desc}</p>
                  </span>
                </button>
                <CollapsibleContent>
                  <div className="col-radio-body">{opt.detail}</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DropdownDemo() {
  const [open, setOpen] = React.useState(false);
  const [section, setSection] = React.useState('Overview');
  const [nestedOpen, setNestedOpen] = React.useState(true);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const items = ['Overview', 'Analytics', 'Products', 'My Tasks', 'Reporting'];

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="col-demo">
      <div className="col-dd" ref={rootRef}>
        <button
          type="button"
          className={`col-dd-trigger ${open ? 'col-dd-trigger--open' : ''}`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {section}
          <Chevron open={open} />
        </button>
        {open && (
          <div className="col-dd-menu" role="menu">
            {items.map((label) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                className={`col-dd-item ${section === label ? 'col-dd-item--on' : ''}`}
                onClick={() => {
                  setSection(label);
                  setOpen(false);
                }}
              >
                {label}
              </button>
            ))}
            <Collapsible open={nestedOpen} onOpenChange={setNestedOpen}>
              <button
                type="button"
                className="col-dd-item"
                onClick={() => setNestedOpen((v) => !v)}
              >
                Workspace
                <Chevron open={nestedOpen} />
              </button>
              <CollapsibleContent>
                <div className="col-dd-sub">
                  {['Shared with members', 'Private drafts'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      className="col-dd-item"
                      onClick={() => {
                        setSection(sub);
                        setOpen(false);
                      }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  );
}

export function MenuDemo() {
  const [openId, setOpenId] = React.useState<string | null>('workspace');
  const [active, setActive] = React.useState('Shared with members');

  const sections = [
    {
      id: 'workspace',
      title: 'Workspace',
      items: ['Shared with members', 'Private drafts', 'Archives'],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      items: ['Notifications', 'Language', 'Accessibility'],
    },
  ];

  return (
    <div className="col-demo">
      <div className="col-menu">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px 12px' }}>
          <span className="col-avatar">AL</span>
          <div>
            <p className="col-list-name">Amelie Laurent</p>
            <p className="col-list-msg">amelie@supplai.com</p>
          </div>
        </div>
        {sections.map((sec) => {
          const open = openId === sec.id;
          return (
            <Collapsible
              key={sec.id}
              open={open}
              onOpenChange={(next) => setOpenId(next ? sec.id : null)}
            >
              <button
                type="button"
                className={`col-menu-item ${open ? 'col-menu-item--active' : ''}`}
                onClick={() => setOpenId(open ? null : sec.id)}
              >
                {sec.title}
                <Chevron open={open} />
              </button>
              <CollapsibleContent>
                <div className="col-menu-sub">
                  {sec.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={active === item ? 'col-menu-sub--on' : ''}
                      onClick={() => setActive(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}

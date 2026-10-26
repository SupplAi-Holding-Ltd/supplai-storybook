import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  Add,
  ArrowLeft,
  Barchart,
  Bell,
  Calendar,
  Dashboard,
  File,
  Folder,
  Inbox,
  InfoCircle,
  Key,
  Lock,
  LogOut,
  Map,
  Moon,
  Palette,
  Search,
  SettingsCog,
  SettingsHorizontal,
  Terminal,
  Users,
} from "@meistericons/react";
import { Avatar } from "./Avatars.mdx";
import { Badge } from "./Badges.mdx";
import { Button } from "../Button";
import { Spinner } from "./Spinners";
import {
  Command,
  CommandDialog,
  CommandDivider,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandShortcut,
  shortcutLabel,
  useCommandHotkey,
} from "./Commands";

export const COMMAND_CODE = `import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut,
} from "./Commands";

<Command>
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => {}}>Create project</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`;

export const PALETTE_CODE = `const [open, setOpen] = useState(false);
useCommandHotkey(() => setOpen((value) => !value));

<CommandDialog open={open} onOpenChange={setOpen} title="Search workspace">
  <CommandInput placeholder="Search workspace..." />
  <CommandList>{/* groups */}</CommandList>
</CommandDialog>`;

type IconType = ComponentType<{ size?: number }>;

function Ico({ icon: Icon }: { icon: IconType }) {
  return (
    <span className="cmd-ico" aria-hidden="true">
      <Icon size={16} />
    </span>
  );
}

function Keys({ mac, other }: { mac: string; other: string }) {
  return <CommandShortcut>{shortcutLabel(mac, other)}</CommandShortcut>;
}

function Notice({ children }: { children: string }) {
  if (!children) return null;
  return <p className="cmd-notice" role="status">{children}</p>;
}

function Stage({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={wide ? "cmd-stage cmd-stage--wide" : "cmd-stage"}>{children}</div>;
}

const PEOPLE = [
  { name: "Maya Chen", role: "Product Designer", email: "maya@example.com", initials: "MC", bg: "#4169E1" },
  { name: "Liam Wilson", role: "Engineering Lead", email: "liam@example.com", initials: "LW", bg: "#0D1B2A" },
  { name: "Noah Williams", role: "Operations", email: "noah@example.com", initials: "NW", bg: "#4CA1AC" },
  { name: "Anna Lewis", role: "Product Designer", email: "anna@example.com", initials: "AL", bg: "#519E8A" },
  { name: "James Wilson", role: "Finance", email: "james@example.com", initials: "JW", bg: "#2F50C1" },
];

function Person({
  person,
  onSelect,
}: {
  person: (typeof PEOPLE)[number];
  onSelect: (name: string) => void;
}) {
  return (
    <CommandItem
      value={`${person.name} ${person.role}`}
      keywords={[person.role, person.email, person.name]}
      onSelect={() => onSelect(person.name)}
    >
      <span className="cmd-avatar" aria-hidden="true">
        <Avatar size={32} fallback={person.initials} bg={person.bg} alt="" />
      </span>
      <span className="cmd-item-body">
        <span className="cmd-item-label">{person.name}</span>
        <span className="cmd-item-meta">{person.role}</span>
        <span className="cmd-item-meta">{person.email}</span>
      </span>
    </CommandItem>
  );
}

export function DefaultDemo() {
  const [notice, setNotice] = useState("");
  const run = (label: string) => setNotice(`Selected: ${label}`);
  return (
    <Stage>
      <Command label="Search commands">
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>
            <div role="status">
              <p className="cmd-empty-title">No results found.</p>
              <p>Try a page, person, or command.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="create project" onSelect={() => run("Create project")}>
              <Ico icon={Add} />
              <span className="cmd-item-label">Create project</span>
              <Keys mac="⌘ P" other="Ctrl P" />
            </CommandItem>
            <CommandItem value="search workspace" onSelect={() => run("Search workspace")}>
              <Ico icon={Search} />
              <span className="cmd-item-label">Search workspace</span>
              <Keys mac="⌘ F" other="Ctrl F" />
            </CommandItem>
            <CommandItem value="invite teammate" onSelect={() => run("Invite teammate")}>
              <Ico icon={Users} />
              <span className="cmd-item-label">Invite teammate</span>
              <Keys mac="⌘ I" other="Ctrl I" />
            </CommandItem>
          </CommandGroup>
          <CommandDivider />
          <CommandGroup heading="Settings">
            <CommandItem value="preferences" keywords={["settings", "config", "configuration"]} onSelect={() => run("Preferences")}>
              <Ico icon={SettingsCog} />
              <span className="cmd-item-label">Preferences</span>
              <Keys mac="⌘ ," other="Ctrl ," />
            </CommandItem>
            <CommandItem value="change theme" onSelect={() => run("Change theme")}>
              <Ico icon={Palette} />
              <span className="cmd-item-label">Change theme</span>
              <CommandShortcut>T</CommandShortcut>
            </CommandItem>
            <CommandItem value="help centre" onSelect={() => run("Help centre")}>
              <Ico icon={InfoCircle} />
              <span className="cmd-item-label">Help centre</span>
              <CommandShortcut>?</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function PaletteDemo({ startOpen = false }: { startOpen?: boolean } = {}) {
  const [open, setOpen] = useState(startOpen);
  const [notice, setNotice] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  useCommandHotkey(() => setOpen((value) => !value));
  const run = (label: string) => {
    setNotice(label);
    setOpen(false);
  };

  return (
    <Stage wide>
      <button ref={triggerRef} type="button" className="cmd-trigger" onClick={() => setOpen(true)}>
        <span className="cmd-ico" aria-hidden="true"><Search size={16} /></span>
        <span className="cmd-trigger-label">Search workspace...</span>
        <CommandShortcut>{shortcutLabel("⌘ K", "Ctrl K")}</CommandShortcut>
      </button>
      <Notice>{notice}</Notice>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search workspace" finalFocusRef={triggerRef}>
        <CommandInput placeholder="Search or type a command..." />
        <CommandList>
          <CommandEmpty>
            <div role="status">
              <p className="cmd-empty-title">No results found</p>
              <p>Try a page, person, or command.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Recent">
            <CommandItem value="project atlas" keywords={["atlas", "shipment"]} onSelect={() => run("Opened Project Atlas")}>
              <Ico icon={Folder} /><span className="cmd-item-label">Project Atlas</span>
            </CommandItem>
            <CommandItem value="design system" keywords={["design", "docs"]} onSelect={() => run("Opened Design System")}>
              <Ico icon={File} /><span className="cmd-item-label">Design System</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="People">
            <CommandItem value="maya chen" keywords={["designer", "product designer"]} onSelect={() => run("Opened Maya Chen")}>
              <span className="cmd-avatar" aria-hidden="true"><Avatar size={32} fallback="MC" bg="#4169E1" alt="" /></span>
              <span className="cmd-item-body">
                <span className="cmd-item-label">Maya Chen</span>
                <span className="cmd-item-meta">Product Designer</span>
              </span>
            </CommandItem>
            <CommandItem value="noah williams" keywords={["operations"]} onSelect={() => run("Opened Noah Williams")}>
              <span className="cmd-avatar" aria-hidden="true"><Avatar size={32} fallback="NW" bg="#4CA1AC" alt="" /></span>
              <span className="cmd-item-body">
                <span className="cmd-item-label">Noah Williams</span>
                <span className="cmd-item-meta">Operations</span>
              </span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="create project" onSelect={() => run("Selected: Create project")}>
              <Ico icon={Add} /><span className="cmd-item-label">Create project</span>
              <Keys mac="⌘ P" other="Ctrl P" />
            </CommandItem>
            <CommandItem value="invite teammate" onSelect={() => run("Selected: Invite teammate")}>
              <Ico icon={Users} /><span className="cmd-item-label">Invite teammate</span>
              <Keys mac="⌘ I" other="Ctrl I" />
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem value="dashboard" onSelect={() => run("Opened Dashboard")}>
              <Ico icon={Dashboard} /><span className="cmd-item-label">Dashboard</span>
            </CommandItem>
            <CommandItem value="analytics" onSelect={() => run("Opened Analytics")}>
              <Ico icon={Barchart} /><span className="cmd-item-label">Analytics</span>
            </CommandItem>
            <CommandItem value="designer permissions" keywords={["designer", "permissions"]} onSelect={() => run("Opened Designer permissions")}>
              <Ico icon={Lock} /><span className="cmd-item-label">Designer permissions</span>
            </CommandItem>
            <CommandItem value="settings" keywords={["preferences"]} onSelect={() => run("Opened Settings")}>
              <Ico icon={SettingsCog} /><span className="cmd-item-label">Settings</span>
              <Keys mac="⌘ ," other="Ctrl ," />
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <div className="cmd-foot">
          <span><CommandShortcut>↑</CommandShortcut><CommandShortcut>↓</CommandShortcut> Navigate</span>
          <span><CommandShortcut>↵</CommandShortcut> Select</span>
          <span><CommandShortcut>Esc</CommandShortcut> Close</span>
        </div>
      </CommandDialog>
    </Stage>
  );
}

export function ContactsDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Search contacts">
        <CommandInput placeholder="Search contacts..." />
        <CommandList>
          <CommandEmpty>
            <div role="status">
              <p className="cmd-empty-title">No people found</p>
              <p>Try another name or email.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="People">
            {PEOPLE.map((person) => (
              <Person key={person.email} person={person} onSelect={(name) => setNotice(`Opened ${name}`)} />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function SystemDemo() {
  const [dark, setDark] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [notice, setNotice] = useState("Sidebar open");

  return (
    <div>
      <div className={sidebar ? "cmd-split" : "cmd-stage"}>
        {sidebar ? <div className="cmd-system-side">Sidebar</div> : null}
        <Command className={dark ? "cmd-theme-dark" : undefined} label="System commands">
          <CommandInput placeholder="Search system commands..." />
          <CommandList>
            <CommandEmpty>
              <div role="status">
                <p className="cmd-empty-title">No commands found</p>
                <p>Try theme, sidebar, or settings.</p>
              </div>
            </CommandEmpty>
            <CommandGroup heading="System">
              <CommandItem value="change theme" keywords={["dark", "light"]} onSelect={() => {
                const next = !dark;
                setDark(next);
                setNotice(next ? "Theme set to dark" : "Theme set to light");
              }}>
                <Ico icon={dark ? Moon : Palette} />
                <span className="cmd-item-label">Change theme</span>
              </CommandItem>
              <CommandItem value="toggle sidebar" onSelect={() => {
                const next = !sidebar;
                setSidebar(next);
                setNotice(next ? "Sidebar open" : "Sidebar closed");
              }}>
                <Ico icon={SettingsHorizontal} />
                <span className="cmd-item-label">Toggle sidebar</span>
              </CommandItem>
              <CommandItem value="open settings" keywords={["preferences"]} onSelect={() => setNotice("Opened settings")}>
                <Ico icon={SettingsCog} />
                <span className="cmd-item-label">Open settings</span>
              </CommandItem>
              <CommandItem value="keyboard shortcuts" onSelect={() => setNotice("Shortcuts: ↑↓ move, Enter select, Esc close")}>
                <Ico icon={Key} />
                <span className="cmd-item-label">Keyboard shortcuts</span>
              </CommandItem>
              <CommandItem value="sign out" onSelect={() => setNotice("Signed out of this demo")}>
                <Ico icon={LogOut} />
                <span className="cmd-item-label">Sign out</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <Notice>{notice}</Notice>
    </div>
  );
}

const WORKSPACE = {
  recent: [
    { label: "Project Atlas", icon: Folder, keywords: ["atlas"] },
    { label: "Design System", icon: File, keywords: ["design"] },
  ],
  people: [
    { label: "Maya Chen", meta: "Product Designer", keywords: ["designer", "maya"] },
    { label: "James Wilson", meta: "Finance", keywords: ["james", "finance"] },
  ],
  pages: [
    { label: "Billing", icon: File, keywords: ["invoice"] },
    { label: "Settings", icon: SettingsCog, keywords: ["preferences"] },
  ],
  commands: [
    { label: "Create project", icon: Add },
    { label: "Invite member", icon: Users },
  ],
};

export function SearchIntegrationDemo() {
  const [notice, setNotice] = useState("");
  const run = (label: string) => setNotice(`Opened ${label}`);
  return (
    <Stage wide>
      <Command label="Search workspace">
        <CommandInput placeholder="Search workspace..." />
        <CommandList>
          <CommandEmpty>
            <div role="status">
              <p className="cmd-empty-title">No results found</p>
              <p>Try a page, person, or command.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Recent">
            {WORKSPACE.recent.map((item) => (
              <CommandItem key={item.label} value={item.label} keywords={item.keywords} onSelect={() => run(item.label)}>
                <Ico icon={item.icon} /><span className="cmd-item-label">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="People">
            {WORKSPACE.people.map((item) => (
              <CommandItem key={item.label} value={item.label} keywords={item.keywords} onSelect={() => run(item.label)}>
                <Ico icon={Users} />
                <span className="cmd-item-body">
                  <span className="cmd-item-label">{item.label}</span>
                  <span className="cmd-item-meta">{item.meta}</span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Pages">
            {WORKSPACE.pages.map((item) => (
              <CommandItem key={item.label} value={item.label} keywords={item.keywords} onSelect={() => run(item.label)}>
                <Ico icon={item.icon} /><span className="cmd-item-label">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Commands">
            {WORKSPACE.commands.map((item) => (
              <CommandItem key={item.label} value={item.label} onSelect={() => run(item.label)}>
                <Ico icon={item.icon} /><span className="cmd-item-label">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function EmptyDemo() {
  const [search, setSearch] = useState("xyz123");
  return (
    <Stage>
      <Command label="Search">
        <CommandInput placeholder="Search..." value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>
            <div role="status">
              <p className="cmd-empty-title">No results found{search ? ` for “${search}”` : ""}</p>
              <p>Try searching for a page, person, or command.</p>
            </div>
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="dashboard">Dashboard</CommandItem>
            <CommandItem value="billing">Billing</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Stage>
  );
}

export function DisabledDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Workspace actions">
        <CommandInput placeholder="Search actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem value="export workspace" onSelect={() => setNotice("Export started")}>
              <Ico icon={File} />
              <span className="cmd-item-label">Export report</span>
            </CommandItem>
            <CommandItem value="export archive" disabled>
              <Ico icon={Lock} />
              <span className="cmd-item-label">Export workspace</span>
              <span className="cmd-trail">
                <Badge size={20} color="warning" variant="soft">Upgrade required</Badge>
              </span>
            </CommandItem>
            <CommandItem value="delete workspace" disabled>
              <Ico icon={Lock} />
              <span className="cmd-item-label">Delete workspace</span>
              <span className="cmd-item-meta">Unavailable</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function BadgeDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Commands">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Product">
            <CommandItem value="beta features" onSelect={() => setNotice("Opened Beta features")}>
              <Ico icon={Palette} />
              <span className="cmd-item-label">Beta features</span>
              <span className="cmd-trail"><Badge size={20} color="primary" variant="soft">Beta</Badge></span>
            </CommandItem>
            <CommandItem value="notifications" onSelect={() => setNotice("Opened notifications")}>
              <Ico icon={Bell} />
              <span className="cmd-item-label">Notifications</span>
              <span className="cmd-trail"><Badge size={20} color="primary" variant="strong">12</Badge></span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function SecondaryDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Projects">
        <CommandInput placeholder="Search projects..." />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup heading="Projects">
            <CommandItem value="project atlas" onSelect={() => setNotice("Opened Project Atlas")}>
              <Ico icon={Folder} />
              <span className="cmd-item-body">
                <span className="cmd-item-label">Project Atlas</span>
                <span className="cmd-item-meta">Updated 4 minutes ago</span>
              </span>
            </CommandItem>
            <CommandItem value="harbour lane" onSelect={() => setNotice("Opened Harbour Lane")}>
              <Ico icon={Map} />
              <span className="cmd-item-body">
                <span className="cmd-item-label">Harbour Lane</span>
                <span className="cmd-item-meta">Updated yesterday</span>
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function AvatarDemo() {
  const [notice, setNotice] = useState("");
  const person = PEOPLE[3];
  return (
    <Stage>
      <Command label="People">
        <CommandInput placeholder="Search people..." />
        <CommandList>
          <CommandEmpty>No people found.</CommandEmpty>
          <CommandGroup heading="People">
            <Person person={person} onSelect={(name) => setNotice(`Opened ${name}`)} />
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function IconDemo() {
  const [notice, setNotice] = useState("");
  const items = [
    { label: "Dashboard", icon: Dashboard },
    { label: "Search", icon: Search },
    { label: "Settings", icon: SettingsCog },
    { label: "Calendar", icon: Calendar },
    { label: "Inbox", icon: Inbox },
  ];
  return (
    <Stage>
      <Command label="Navigate">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {items.map((item) => (
              <CommandItem key={item.label} value={item.label} onSelect={() => setNotice(`Opened ${item.label}`)}>
                <Ico icon={item.icon} />
                <span className="cmd-item-label">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function ShortcutBadgeDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Developer">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Developer">
            <CommandItem value="open developer mode" onSelect={() => setNotice("Developer mode open")}>
              <Ico icon={Terminal} />
              <span className="cmd-item-label">Open developer mode</span>
              <span className="cmd-trail">
                <Badge size={20} color="neutral" variant="soft">Admin</Badge>
                <Keys mac="⌘ D" other="Ctrl D" />
              </span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function KeywordsDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Settings search">
        <CommandInput placeholder="Try config or settings..." />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          <CommandGroup heading="Settings">
            <CommandItem
              value="preferences"
              keywords={["settings", "config", "configuration"]}
              onSelect={() => setNotice("Opened Preferences")}
            >
              <Ico icon={SettingsCog} />
              <span className="cmd-item-body">
                <span className="cmd-item-label">Preferences</span>
                <span className="cmd-item-meta">Also matches settings, config, configuration</span>
              </span>
            </CommandItem>
            <CommandItem value="billing" onSelect={() => setNotice("Opened Billing")}>
              <Ico icon={File} />
              <span className="cmd-item-label">Billing</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

function initialsFilter(value: string, search: string, keywords: string[] = []) {
  const query = search.trim().toLowerCase();
  if (!query) return 1;
  const blob = `${value} ${keywords.join(" ")}`.toLowerCase();
  if (blob.includes(query)) return 1;
  const initials = value
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toLowerCase();
  return initials.startsWith(query) ? 0.9 : 0;
}

export function CustomFilterDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Initials search" filter={initialsFilter}>
        <CommandInput placeholder="Try ds or pa..." />
        <CommandList>
          <CommandEmpty>No matches.</CommandEmpty>
          <CommandGroup heading="Workspace">
            <CommandItem value="Design System" onSelect={() => setNotice("Opened Design System")}>
              <span className="cmd-item-label">Design System</span>
            </CommandItem>
            <CommandItem value="Project Atlas" onSelect={() => setNotice("Opened Project Atlas")}>
              <span className="cmd-item-label">Project Atlas</span>
            </CommandItem>
            <CommandItem value="Harbour Lane" onSelect={() => setNotice("Opened Harbour Lane")}>
              <span className="cmd-item-label">Harbour Lane</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function LoopDemo() {
  const [active, setActive] = useState("Create project");
  return (
    <Stage>
      <Command label="Looping menu" loop onValueChange={setActive}>
        <CommandInput placeholder="Arrow up from the first row..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Commands">
            {["Create project", "Invite teammate", "Open settings", "Help centre"].map((label) => (
              <CommandItem key={label} value={label}>{label}</CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{active ? `Highlighted: ${active}` : ""}</Notice>
    </Stage>
  );
}

const EXTERNAL = [
  { id: "atlas", label: "Project Atlas", keys: ["atlas", "map", "shipment"] },
  { id: "map", label: "Shipment map", keys: ["atlas", "map"] },
  { id: "cal", label: "Calendar", keys: ["calendar"] },
];

export function ExternalFilterDemo() {
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const query = search.trim().toLowerCase();
  const shown = query
    ? EXTERNAL.filter((item) => item.keys.some((key) => key.includes(query)) || item.label.toLowerCase().includes(query))
    : EXTERNAL;

  return (
    <Stage>
      <Command label="External search" shouldFilter={false}>
        <CommandInput placeholder="Try atlas..." value={search} onValueChange={setSearch} />
        <CommandList>
          {shown.length === 0 ? (
            <div className="cmd-empty" role="status">
              <p className="cmd-empty-title">No results found</p>
              <p>The menu is showing only what the page passed in.</p>
            </div>
          ) : (
            <CommandGroup heading="Results">
              {shown.map((item) => (
                <CommandItem key={item.id} value={item.label} onSelect={() => setNotice(`Opened ${item.label}`)}>
                  <span className="cmd-item-label">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function AsyncDemo() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "empty" | "error">("idle");
  const [results, setResults] = useState<typeof PEOPLE>([]);
  const [forceOk, setForceOk] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setForceOk(false);
  }, [debounced]);

  useEffect(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) {
      setStatus("idle");
      setResults([]);
      return;
    }
    setStatus("loading");
    let cancel = false;
    const timer = window.setTimeout(() => {
      if (cancel) return;
      if (term.includes("error") && !forceOk) {
        setStatus("error");
        setResults([]);
        return;
      }
      const found = term.includes("error")
        ? PEOPLE.filter((person) => person.name === "Maya Chen")
        : PEOPLE.filter((person) => `${person.name} ${person.role} ${person.email}`.toLowerCase().includes(term));
      setResults(found);
      setStatus(found.length ? "ready" : "empty");
    }, 500);
    return () => {
      cancel = true;
      window.clearTimeout(timer);
    };
  }, [debounced, forceOk]);

  return (
    <Stage>
      <Command label="Search team members" shouldFilter={false}>
        <CommandInput placeholder="Search team members..." value={query} onValueChange={setQuery} />
        <CommandList>
          {status === "idle" ? <div className="cmd-hint">Type a name or email.</div> : null}
          {status === "loading" ? (
            <CommandLoading label="Searching" progress={40}>
              <Spinner size="xs" announce={false} />
              Searching...
            </CommandLoading>
          ) : null}
          {status === "error" ? (
            <div className="cmd-error" role="alert">
              <strong>Something went wrong</strong>
              <p>Try your search again.</p>
              <Button variant="outlined" intent="neutral" size="sm" label="Retry" onClick={() => setForceOk(true)} />
            </div>
          ) : null}
          {status === "empty" ? (
            <div className="cmd-empty" role="status">
              <p className="cmd-empty-title">No people found</p>
              <p>Try another name or email.</p>
            </div>
          ) : null}
          {status === "ready" ? (
            <CommandGroup heading="People">
              {results.map((person) => (
                <Person key={person.email} person={person} onSelect={(name) => setNotice(`Opened ${name}`)} />
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function NestedDemo() {
  const [page, setPage] = useState<"root" | "theme">("root");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const back = () => {
    setPage("root");
    setSearch("");
  };

  return (
    <Stage>
      <Command
        label={page === "root" ? "Commands" : "Choose theme"}
        shouldFilter
        onKeyDown={(event) => {
          if (page === "root") return;
          if (event.key === "Escape" || (event.key === "Backspace" && search.length === 0)) {
            event.preventDefault();
            back();
          }
        }}
      >
        <CommandInput
          placeholder={page === "root" ? "Search commands..." : "Choose theme..."}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {page === "root" ? (
            <CommandGroup heading="Main">
              <CommandItem value="change theme" onSelect={() => { setPage("theme"); setSearch(""); }}>
                <Ico icon={Palette} />
                <span className="cmd-item-label">Change theme</span>
              </CommandItem>
              <CommandItem value="open settings" onSelect={() => setNotice("Opened settings")}>
                <Ico icon={SettingsCog} />
                <span className="cmd-item-label">Open settings</span>
              </CommandItem>
            </CommandGroup>
          ) : (
            <CommandGroup heading="Choose theme">
              <CommandItem forceMount value="back" onSelect={back}>
                <Ico icon={ArrowLeft} />
                <span className="cmd-item-label">Back</span>
              </CommandItem>
              {["Light", "Dark", "System"].map((theme) => (
                <CommandItem key={theme} value={theme} onSelect={() => { setNotice(`Theme set to ${theme}`); back(); }}>
                  <span className="cmd-item-label">{theme}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function CreateDemo() {
  const [notice, setNotice] = useState("");
  const items = [
    { label: "New project", icon: Folder },
    { label: "New document", icon: File },
    { label: "New task", icon: Add },
  ];
  return (
    <Stage>
      <Command label="Create">
        <CommandInput placeholder="Search create actions..." />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          <CommandGroup heading="Create">
            {items.map((item) => (
              <CommandItem key={item.label} value={item.label} onSelect={() => setNotice(`Selected: ${item.label}`)}>
                <Ico icon={item.icon} />
                <span className="cmd-item-label">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function NavigationDemo() {
  const [current, setCurrent] = useState("Dashboard");
  const items = [
    { label: "Dashboard", icon: Dashboard },
    { label: "Projects", icon: Folder },
    { label: "People", icon: Users },
    { label: "Analytics", icon: Barchart },
    { label: "Settings", icon: SettingsCog },
  ];
  return (
    <Stage>
      <Command label="Navigation">
        <CommandInput placeholder="Jump to..." />
        <CommandList>
          <CommandEmpty>No pages found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {items.map((item) => (
              <CommandItem key={item.label} value={item.label} onSelect={() => setCurrent(item.label)}>
                <Ico icon={item.icon} />
                <span className="cmd-item-label">{item.label}</span>
                {current === item.label ? <span className="cmd-item-meta">Current</span> : null}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{`Opened ${current}`}</Notice>
    </Stage>
  );
}

const LANES = Array.from({ length: 24 }, (_, index) => {
  const n = String(index + 1).padStart(2, "0");
  return `Lane ${n} — Auckland depot`;
});

export function LargeDemo() {
  const [notice, setNotice] = useState("");
  return (
    <Stage>
      <Command label="Lanes">
        <CommandInput placeholder="Search lanes..." />
        <CommandList>
          <CommandEmpty>No lanes found.</CommandEmpty>
          <CommandGroup heading="Lanes">
            {LANES.map((lane) => (
              <CommandItem key={lane} value={lane} onSelect={() => setNotice(`Opened ${lane}`)}>
                <Ico icon={Map} />
                <span className="cmd-item-label">{lane}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <Notice>{notice}</Notice>
    </Stage>
  );
}

export function NarrowDemo() {
  return (
    <div className="cmd-narrow">
      <Command label="Narrow command menu">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem value="auckland harbour schedule">
              <Ico icon={Map} />
              <span className="cmd-item-label">Auckland harbour inbound schedule</span>
              <Keys mac="⌘ K" other="Ctrl K" />
            </CommandItem>
            <CommandItem value="billing settings">
              <Ico icon={SettingsCog} />
              <span className="cmd-item-label">Billing settings for Northline</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function ThemeSample({ dark }: { dark?: boolean }) {
  return (
    <Command className={dark ? "cmd-theme-dark" : undefined} label={dark ? "Dark command menu" : "Light command menu"}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandGroup heading="Navigate">
          <CommandItem value="dashboard"><Ico icon={Dashboard} /><span className="cmd-item-label">Dashboard</span></CommandItem>
          <CommandItem value="settings"><Ico icon={SettingsCog} /><span className="cmd-item-label">Settings</span><CommandShortcut>?</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function ThemeDemo() {
  return (
    <div className="cmd-theme-row">
      <ThemeSample />
      <ThemeSample dark />
    </div>
  );
}

export function SpecsDemo() {
  const rows = [
    ["Surface", "#FFFFFF"],
    ["Border", "1px #E2E8F0"],
    ["Radius", "12px"],
    ["Selected row", "#ECF0FC"],
    ["Focus", "Brand blue"],
    ["Input row", "48px"],
    ["List max height", "320px"],
    ["Dialog width", "560px"],
    ["Type", "Manrope 14"],
  ];
  return (
    <div className="cmd-specs-grid">
      {rows.map(([label, value]) => (
        <div key={label} className="cmd-spec-card">
          <p className="cmd-spec-label">{label}</p>
          <p className="cmd-spec-value">{value}</p>
        </div>
      ))}
    </div>
  );
}

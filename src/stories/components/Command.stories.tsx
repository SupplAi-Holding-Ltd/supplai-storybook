import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button";
import { Spinner } from "./Spinners";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandShortcut,
  useCommandHotkey,
} from "./Commands";

const meta = {
  title: "Components/Command/Tests",
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Menu({
  loop,
  shouldFilter = true,
  onPick,
}: {
  loop?: boolean;
  shouldFilter?: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <Command label="Search commands" loop={loop} shouldFilter={shouldFilter}>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="create project" onSelect={onPick}>
            Create project
            <CommandShortcut>⌘ P</CommandShortcut>
          </CommandItem>
          <CommandItem value="search workspace" onSelect={onPick}>
            Search workspace
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Settings">
          <CommandItem value="preferences" keywords={["settings", "config", "configuration"]} onSelect={onPick}>
            Preferences
          </CommandItem>
          <CommandItem value="export workspace" disabled onSelect={onPick}>
            Export workspace
          </CommandItem>
          <CommandItem value="help centre" onSelect={onPick}>
            Help centre
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function Pickable() {
  const [picked, setPicked] = useState("");
  return (
    <div>
      <Menu onPick={setPicked} />
      <p data-testid="picked">{picked}</p>
    </div>
  );
}

export const Filtering: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "help");
    expect(canvas.getByRole("option", { name: "Help centre" })).toBeVisible();
    expect(canvas.queryByRole("option", { name: "Create project" })).toBeNull();
  },
};

export const Selection: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.keyboard("{Enter}");
    expect(canvas.getByTestId("picked")).toHaveTextContent("create project");
  },
};

export const Keyboard: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.keyboard("{ArrowDown}");
    expect(canvas.getByRole("option", { name: "Search workspace" })).toHaveAttribute("data-selected", "true");
  },
};

export const DisabledItem: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole("option", { name: "Export workspace" });
    expect(item).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(item);
    expect(canvas.getByTestId("picked")).toHaveTextContent("");
  },
};

export const EmptyState: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "xyz123");
    expect(canvas.getByText("No results found.")).toBeVisible();
  },
};

export const GroupsAndShortcuts: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("group", { name: "Suggestions" })).toBeTruthy();
    const shortcut = canvas.getByRole("option", { name: "Create project" }).querySelector(".cmd-kbd");
    expect(shortcut?.textContent).toBe("⌘ P");
  },
};

export const Keywords: Story = {
  render: () => <Pickable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "config");
    expect(canvas.getByRole("option", { name: "Preferences" })).toBeVisible();
    expect(canvas.queryByRole("option", { name: "Create project" })).toBeNull();
  },
};

function LoopMenu() {
  const [picked, setPicked] = useState("");
  return (
    <div>
      <Menu loop onPick={setPicked} />
      <p data-testid="picked">{picked}</p>
    </div>
  );
}

export const Looping: Story = {
  render: () => <LoopMenu />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.keyboard("{ArrowUp}");
    expect(canvas.getByRole("option", { name: "Help centre" })).toHaveAttribute("data-selected", "true");
  },
};

function External() {
  const [search, setSearch] = useState("");
  const items = [
    { label: "Project Atlas", keys: ["atlas", "map"] },
    { label: "Shipment map", keys: ["atlas", "map"] },
    { label: "Calendar", keys: ["calendar"] },
  ];
  const query = search.trim().toLowerCase();
  const shown = query ? items.filter((item) => item.keys.some((key) => key.includes(query))) : items;
  return (
    <Command label="External search" shouldFilter={false}>
      <CommandInput value={search} onValueChange={setSearch} placeholder="Search..." />
      <CommandList>
        <CommandGroup heading="Results">
          {shown.map((item) => (
            <CommandItem key={item.label} value={item.label}>
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export const ExternalFilter: Story = {
  render: () => <External />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "atlas");
    expect(canvas.getByRole("option", { name: "Shipment map" })).toBeVisible();
    expect(canvas.queryByRole("option", { name: "Calendar" })).toBeNull();
  },
};

function Palette() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useCommandHotkey(() => setOpen((value) => !value));
  return (
    <div>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Search workspace
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search workspace" finalFocusRef={triggerRef}>
        <CommandInput placeholder="Search workspace..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent">
            <CommandItem value="design system">Design System</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

export const DialogShortcut: Story = {
  render: () => <Palette />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Search workspace" }));
    const dialog = within(document.body);
    const field = dialog.getByRole("combobox", { name: "Search workspace" });
    expect(field).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(canvas.getByRole("button", { name: "Search workspace" })).toHaveFocus();
    await userEvent.keyboard("{Control>}k{/Control}");
    await waitFor(() => {
      expect(dialog.getByRole("dialog", { name: "Search workspace" })).toBeVisible();
    });
    await userEvent.keyboard("{Control>}k{/Control}");
    await waitFor(() => {
      expect(dialog.queryByRole("dialog", { name: "Search workspace" })).toBeNull();
    });
  },
};

function AsyncSearch() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const run = (value: string, recover = false) => {
    setQuery(value);
    if (!value.trim()) {
      setPhase("idle");
      return;
    }
    setPhase("loading");
    window.setTimeout(() => {
      setPhase(value.toLowerCase().includes("error") && !recover ? "error" : "ready");
    }, 200);
  };

  return (
    <Command label="Search team" shouldFilter={false}>
      <CommandInput
        placeholder="Search team members..."
        value={query}
        onValueChange={(value) => run(value)}
      />
      <CommandList>
        {phase === "loading" ? (
          <CommandLoading label="Searching">
            <Spinner size="xs" announce={false} />
            Searching...
          </CommandLoading>
        ) : null}
        {phase === "error" ? (
          <div role="alert">
            Something went wrong
            <Button label="Retry" size="sm" variant="outlined" intent="neutral" onClick={() => run(query, true)} />
          </div>
        ) : null}
        {phase === "ready" ? (
          <CommandGroup heading="People">
            <CommandItem value="maya chen">Maya Chen</CommandItem>
          </CommandGroup>
        ) : null}
      </CommandList>
    </Command>
  );
}

export const AsyncStates: Story = {
  render: () => <AsyncSearch />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "maya", { delay: 1 });
    expect(await canvas.findByRole("progressbar", { name: "Searching" })).toBeTruthy();
    expect(await canvas.findByRole("option", { name: "Maya Chen" })).toBeVisible();
    await userEvent.clear(canvas.getByRole("combobox"));
    await userEvent.type(canvas.getByRole("combobox"), "error", { delay: 1 });
    expect(await canvas.findByRole("alert")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    expect(await canvas.findByRole("option", { name: "Maya Chen" })).toBeVisible();
  },
};

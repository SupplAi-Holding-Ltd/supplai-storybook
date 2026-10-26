import type { JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AsyncDemo,
  ContactsDemo,
  DefaultDemo,
  DisabledDemo,
  EmptyDemo,
  LoopDemo,
  NestedDemo,
  PaletteDemo,
  SearchIntegrationDemo,
  SystemDemo,
} from "./CommandDemos";

const COMMAND_EXAMPLES = {
  default: "Default",
  contacts: "Search Contacts",
  system: "System Commands",
  search: "Search Integration",
  palette: "Command Palette",
  workspace: "Workspace Search",
  async: "Async Search",
  empty: "Empty State",
  disabled: "Disabled Commands",
  nested: "Nested Commands",
  loop: "Loop Navigation",
} as const;

type CommandExample = keyof typeof COMMAND_EXAMPLES;

const DEMOS: Record<CommandExample, () => JSX.Element> = {
  default: DefaultDemo,
  contacts: ContactsDemo,
  system: SystemDemo,
  search: SearchIntegrationDemo,
  palette: PaletteDemo,
  workspace: () => <PaletteDemo startOpen />,
  async: AsyncDemo,
  empty: EmptyDemo,
  disabled: DisabledDemo,
  nested: NestedDemo,
  loop: LoopDemo,
};

type PlaygroundArgs = {
  example: CommandExample;
};

const meta = {
  title: "Components/Command",
  parameters: { layout: "centered" },
  args: { example: "default" },
  argTypes: {
    example: {
      name: "Example",
      description: "Command composition to preview. This is not a Command prop.",
      options: Object.keys(COMMAND_EXAMPLES),
      control: { type: "select", labels: COMMAND_EXAMPLES },
      table: { category: "Preview" },
    },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Playground",
  render: ({ example }) => {
    const Demo = DEMOS[example];
    return <Demo />;
  },
};

function fixed(example: CommandExample, name: string): Story {
  const Demo = DEMOS[example];
  return {
    name,
    args: { example },
    argTypes: { example: { control: false, table: { disable: true } } },
    render: () => <Demo />,
  };
}

export const Default = fixed("default", "Default");
export const SearchContacts = fixed("contacts", "Search Contacts");
export const SystemCommands = fixed("system", "System Commands");
export const SearchIntegration = fixed("search", "Search Integration");
export const CommandPalette = fixed("palette", "Command Palette");
export const WorkspaceSearch = fixed("workspace", "Workspace Search");
export const AsyncSearch = fixed("async", "Async Search");
export const EmptyState = fixed("empty", "Empty State");
export const DisabledCommands = fixed("disabled", "Disabled Commands");
export const NestedCommands = fixed("nested", "Nested Commands");
export const LoopNavigation = fixed("loop", "Loop Navigation");

import type { JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BillingDemo,
  DashboardDemo,
  DefaultDemo,
  EmptyDemo,
  FeatureDemo,
  FormDemo,
  HeaderFooterDemo,
  ImageDemo,
  InfoDemo,
  ProfileDemo,
  ProgressDemo,
  PromoDemo,
  SettingsDemo,
  SkeletonDemo,
} from "./Cards";

const CARD_EXAMPLES = {
  default: "Default",
  feature: "Feature",
  billing: "Billing",
  promotional: "Promotional",
  "header-footer": "Header + Footer",
  image: "Image",
  info: "Info",
  dashboard: "Dashboard",
  form: "Form",
  profile: "Profile",
  settings: "Settings",
  progress: "Progress",
  loading: "Loading",
  empty: "Empty State",
} as const;

type CardExample = keyof typeof CARD_EXAMPLES;

const DEMOS: Record<CardExample, () => JSX.Element> = {
  default: DefaultDemo,
  feature: FeatureDemo,
  billing: BillingDemo,
  promotional: PromoDemo,
  "header-footer": HeaderFooterDemo,
  image: ImageDemo,
  info: InfoDemo,
  dashboard: DashboardDemo,
  form: FormDemo,
  profile: ProfileDemo,
  settings: SettingsDemo,
  progress: ProgressDemo,
  loading: SkeletonDemo,
  empty: EmptyDemo,
};

type PlaygroundArgs = {
  example: CardExample;
};

const meta = {
  title: "Components/Card",
  parameters: { layout: "centered" },
  args: { example: "default" },
  argTypes: {
    example: {
      name: "Example",
      description: "Card composition to preview. This is not a Card prop.",
      options: Object.keys(CARD_EXAMPLES),
      control: { type: "select", labels: CARD_EXAMPLES },
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

function fixed(example: CardExample, name: string): Story {
  const Demo = DEMOS[example];
  return {
    name,
    args: { example },
    argTypes: { example: { control: false, table: { disable: true } } },
    render: () => <Demo />,
  };
}

export const Default = fixed("default", "Default");
export const Feature = fixed("feature", "Feature");
export const Billing = fixed("billing", "Billing");
export const Promotional = fixed("promotional", "Promotional");
export const HeaderFooter = fixed("header-footer", "Header + Footer");
export const Image = fixed("image", "Image");
export const Info = fixed("info", "Info");
export const Dashboard = fixed("dashboard", "Dashboard");
export const Form = fixed("form", "Form");
export const Profile = fixed("profile", "Profile");
export const Settings = fixed("settings", "Settings");
export const Progress = fixed("progress", "Progress");
export const Loading = fixed("loading", "Loading");
export const EmptyState = fixed("empty", "Empty State");

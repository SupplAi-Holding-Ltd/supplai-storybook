import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, type DividerOrientation } from "./Dividers";

type PlaygroundArgs = {
  orientation: DividerOrientation;
};

const meta = {
  title: "Components/Divider",
  parameters: { layout: "centered" },
  args: { orientation: "horizontal" },
  argTypes: {
    orientation: {
      name: "Orientation",
      description: "Direction of the 1px Grey / 300 line.",
      options: ["horizontal", "vertical"],
      control: {
        type: "inline-radio",
        labels: { horizontal: "Horizontal", vertical: "Vertical" },
      },
      table: { category: "Preview" },
    },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "Playground",
  render: ({ orientation }) =>
    orientation === "vertical" ? (
      <div className="dvd-row">
        <span>Overview</span>
        <Divider orientation="vertical" />
        <span>Activity</span>
        <Divider orientation="vertical" />
        <span>Settings</span>
      </div>
    ) : (
      <div className="dvd-stage">
        <div className="dvd-stack">
          <div>
            <p className="dvd-title">Account details</p>
            <p className="dvd-meta">Name, email, and company.</p>
          </div>
          <Divider />
          <div>
            <p className="dvd-title">Security settings</p>
            <p className="dvd-meta">Password, sessions, and sign-in.</p>
          </div>
        </div>
      </div>
    ),
};

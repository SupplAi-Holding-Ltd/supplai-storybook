import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Divider } from "./Dividers";

const meta = {
  title: "Components/Divider/Tests",
  tags: ["!dev", "!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => <Divider data-testid="line" />,
  play: async ({ canvasElement }) => {
    const line = within(canvasElement).getByTestId("line");
    const style = getComputedStyle(line);
    expect(line).toHaveAttribute("data-orientation", "horizontal");
    expect(line).toHaveAttribute("role", "none");
    expect(line).not.toHaveAttribute("aria-orientation");
    expect(line.className).toContain("dvd--horizontal");
    expect(style.height).toBe("1px");
    expect(style.backgroundColor).toBe("rgb(203, 213, 225)");
    expect(style.marginTop).toBe("0px");
    expect(style.marginBottom).toBe("0px");
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "stretch", height: 32 }}>
      <Divider orientation="vertical" decorative={false} data-testid="line" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const line = within(canvasElement).getByTestId("line");
    const style = getComputedStyle(line);
    expect(line).toHaveAttribute("data-orientation", "vertical");
    expect(line).toHaveAttribute("role", "separator");
    expect(line).toHaveAttribute("aria-orientation", "vertical");
    expect(style.width).toBe("1px");
    expect(style.backgroundColor).toBe("rgb(203, 213, 225)");
  },
};

export const SemanticHorizontal: Story = {
  render: () => <Divider decorative={false} data-testid="line" />,
  play: async ({ canvasElement }) => {
    const line = within(canvasElement).getByTestId("line");
    expect(line).toHaveAttribute("role", "separator");
    expect(line).not.toHaveAttribute("aria-orientation");
  },
};

export const ClassName: Story = {
  render: () => <Divider className="lane-rule" data-testid="line" />,
  play: async ({ canvasElement }) => {
    const line = within(canvasElement).getByTestId("line");
    expect(line.className).toContain("dvd");
    expect(line.className).toContain("lane-rule");
  },
};

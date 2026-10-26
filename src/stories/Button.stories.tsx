import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, PlusIcon, ArrowRightIcon, DownloadIcon, StarIcon, GridIcon, TrashIcon, ChevronDownIcon, ButtonGroup } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'ghost', 'tonal'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    href: { control: 'text' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Primary (default) ─────────────────────────────────────────── */
export const Primary: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'md', label: 'Button' },
};

/* ── Outlined ──────────────────────────────────────────────────── */
export const Outlined: Story = {
  args: { variant: 'outlined', intent: 'primary', size: 'md', label: 'Button' },
};

/* ── Ghost ─────────────────────────────────────────────────────── */
export const Ghost: Story = {
  args: { variant: 'ghost', intent: 'primary', size: 'md', label: 'Button' },
};

/* ── Tonal ─────────────────────────────────────────────────────── */
export const Tonal: Story = {
  args: { variant: 'tonal', intent: 'primary', size: 'md', label: 'Button' },
};

/* ── Success ───────────────────────────────────────────────────── */
export const Success: Story = {
  args: { variant: 'filled', intent: 'success', size: 'md', label: 'Confirm' },
};

/* ── Warning ───────────────────────────────────────────────────── */
export const Warning: Story = {
  args: { variant: 'filled', intent: 'warning', size: 'md', label: 'Caution' },
};

/* ── Error ─────────────────────────────────────────────────────── */
export const Error: Story = {
  args: { variant: 'filled', intent: 'error', size: 'md', label: 'Delete' },
};

/* ── Neutral ───────────────────────────────────────────────────── */
export const Neutral: Story = {
  args: { variant: 'filled', intent: 'neutral', size: 'md', label: 'Cancel' },
};

/* ── Disabled ──────────────────────────────────────────────────── */
export const Disabled: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'md', label: 'Button', disabled: true },
};

/* ── Extra Small ───────────────────────────────────────────────── */
export const ExtraSmall: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'xs', label: 'Button' },
};

/* ── Small ─────────────────────────────────────────────────────── */
export const Small: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'sm', label: 'Button' },
};

/* ── Large ─────────────────────────────────────────────────────── */
export const Large: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'lg', label: 'Button' },
};

/* ── Extra Large ───────────────────────────────────────────────── */
export const ExtraLarge: Story = {
  args: { variant: 'filled', intent: 'primary', size: 'xl', label: 'Button' },
};

/* ── With Leading Icon ─────────────────────────────────────────── */
export const WithLeadingIcon: Story = {
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'md',
    label: 'Add Item',
    leadingIcon: <PlusIcon />,
  },
};

/* ── With Trailing Icon ────────────────────────────────────────── */
export const WithTrailingIcon: Story = {
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'md',
    label: 'Continue',
    trailingIcon: <ArrowRightIcon />,
  },
};

/* ── Icon Only ─────────────────────────────────────────────────── */
export const IconOnly: Story = {
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'md',
    label: 'Add',
    iconOnly: true,
    leadingIcon: <PlusIcon />,
  },
};

/* ── Full Width ────────────────────────────────────────────────── */
export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'lg',
    label: 'Get Started',
    fullWidth: true,
  },
};

/* ── Loading ───────────────────────────────────────────────────── */
export const Loading: Story = {
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'md',
    label: 'Saving…',
    loading: true,
  },
};

/* ── Leading and trailing ──────────────────────────────────────── */
export const WithBothIcons: Story = {
  args: {
    variant: 'outlined',
    intent: 'primary',
    size: 'md',
    label: 'Export',
    leadingIcon: <DownloadIcon />,
    trailingIcon: <ChevronDownIcon />,
  },
};

/* ── Link styled as a button ───────────────────────────────────── */
export const AsLink: Story = {
  args: {
    variant: 'filled',
    intent: 'primary',
    size: 'md',
    label: 'Open settings',
    href: '#settings',
  },
};

/* ── Joined group ──────────────────────────────────────────────── */
export const Group: Story = {
  args: { label: 'Week' },
  render: () => (
    <ButtonGroup label="Calendar range">
      <Button variant="outlined" intent="neutral" label="Day" />
      <Button variant="filled" intent="primary" label="Week" />
      <Button variant="outlined" intent="neutral" label="Month" />
      <Button variant="outlined" intent="neutral" iconOnly label="More" leadingIcon={<GridIcon />} />
    </ButtonGroup>
  ),
};

/// <reference types="vite/client" />
import React from 'react';
import './manager.css';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AccessibilityIcon,
  ClipboardIcon,
  ColorsIcon,
  ComponentIcon,
  GridIcon,
  HexagonIcon,
  Layers01Icon,
  PaintBucketIcon,
  TextFontIcon,
} from '@hugeicons/core-free-icons';
import brandImage from './supplailogo.svg?url';

/** Cool blue-tinted greys — Foundation/Colors */
const grey = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
} as const;

const brand = {
  500: '#4169E1',
  600: '#2F50C1',
} as const;

type IconData = typeof PaintBucketIcon;

const ICONS_BY_NAME: Record<string, IconData> = {
  Introduction: ClipboardIcon,
  'Logo and Branding': HexagonIcon,
  Colors: PaintBucketIcon,
  Typography: TextFontIcon,
  Accessibility: AccessibilityIcon,
  Iconography: Layers01Icon,
  'Grid and Layout': GridIcon,
  Foundation: ColorsIcon,
  Components: ComponentIcon,
};

function NavLabel({ name, icon }: { name: string; icon?: IconData }) {
  if (!icon) return <>{name}</>;
  return (
    <span className="sb-nav-label">
      <HugeiconsIcon
        icon={icon}
        size={16}
        strokeWidth={1.75}
        color="currentColor"
        className="sb-nav-icon"
      />
      <span className="sb-nav-text">{name}</span>
    </span>
  );
}

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'supplai',
    brandImage,
    brandUrl: './',
    colorPrimary: brand[500],
    colorSecondary: brand[600],
    appBg: grey[900],
    appContentBg: grey[800],
    appHoverBg: grey[700],
    appPreviewBg: grey[800],
    appBorderColor: grey[700],
    textColor: grey[50],
    textInverseColor: grey[900],
    textMutedColor: grey[400],
    barTextColor: grey[300],
    barHoverColor: grey[100],
    barSelectedColor: brand[500],
    barBg: grey[900],
    buttonBg: grey[700],
    buttonBorder: grey[600],
    booleanBg: grey[800],
    booleanSelectedBg: brand[500],
    inputBg: grey[800],
    inputBorder: grey[600],
    inputTextColor: grey[100],
  }),
  sidebar: {
    showRoots: true,
    renderLabel: (item) => {
      const icon = ICONS_BY_NAME[item.name];
      // Icons for roots + docs (Foundation / Introduction); leave story variants alone
      if (!icon || item.type === 'story') return item.name;
      return <NavLabel name={item.name} icon={icon} />;
    },
  },
});

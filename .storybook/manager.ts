/// <reference types="vite/client" />
import './manager.css';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import brandImage from './supplailogo.svg?url';

/** Supplai foundation greys — src/stories/foundation/Colors.mdx (cool blue-tinted grey) */
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
  600: '#2B44BF',
} as const;

addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Supplai',
    brandImage,
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
});

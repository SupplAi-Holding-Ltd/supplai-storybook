import type { StorybookConfig } from '@storybook/react-vite';
import type { InlineConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  framework: "@storybook/react-vite",
  viteFinal: async (config: InlineConfig) => {
    // Required for GitHub Pages — sets the asset base path to the repo subdirectory
    if (process.env.NODE_ENV === 'production') {
      config.base = '/storybook-example01/';
    }
    return config;
  },
};

export default config;

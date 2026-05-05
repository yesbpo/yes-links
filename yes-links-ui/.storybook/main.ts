import type { StorybookConfig } from '@storybook/react-vite'

// Tailwind CSS v4 is handled via postcss.config.mjs (already present in the
// project root). Storybook's PostCSS integration picks it up automatically
// without needing an explicit viteFinal / mergeConfig call, which avoids
// the Vite 7 ESM + esbuild-register CJS incompatibility.

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-onboarding'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
}

export default config

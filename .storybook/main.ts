import type { StorybookConfig } from '@storybook/nextjs-vite'
import { resolve } from 'node:path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  viteFinal: async config =>
    mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            loadPaths: [process.cwd()],
          },
        },
      },
      resolve: {
        alias: {
          '@': resolve(process.cwd(), 'src'),
        },
      },
    }),
}
export default config

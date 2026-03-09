import type { Preview } from "@storybook/react";
import React from 'react';
import { YesLinksProvider } from '../src/providers/YesLinksProvider';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <YesLinksProvider token="mock-token">
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </YesLinksProvider>
    ),
  ],
};

export default preview;

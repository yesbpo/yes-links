import type { Preview } from "@storybook/react";
import React from 'react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="yes-link-root" style={{ padding: '2rem', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;

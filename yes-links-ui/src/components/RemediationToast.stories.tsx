import type { Meta, StoryObj } from '@storybook/react';
import { RemediationToast } from './RemediationToast';
import { fn } from '@storybook/test';
import { RemediationToastDemo } from '../../Figma reference/src/app/components/remediation-toast';

// We can wrap it in a container to see it properly
const meta: Meta<typeof RemediationToast> = {
  title: 'UI/RemediationToast',
  component: RemediationToast,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-center justify-center bg-muted p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RemediationToast>;

export const Success: Story = {
  args: {
    type: 'success',
    title: 'Links Created Successfully',
    message: '12 new links have been added to your active links.',
    onDismiss: fn(),
  },
};

export const ErrorWithRemediation: Story = {
  args: {
    type: 'error',
    title: 'Upload Failed',
    message: 'The CSV file contains invalid data in row 14.',
    remediation: 'Check that all URLs are properly formatted and short codes are unique. Download the error log for detailed information.',
    action: {
      label: 'Retry Upload',
      onClick: fn(),
    },
    onDismiss: fn(),
  },
};

export const Progress: Story = {
  args: {
    type: 'info',
    title: 'Procesamiento de Enlaces',
    message: 'Importando 47 enlaces desde archivo CSV',
    progress: 65,
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Limit Reached',
    message: 'You have reached 80% of your link quota for this month.',
    remediation: 'Upgrade your plan to increase your limits.',
    action: {
      label: 'View Plans',
      onClick: fn(),
    },
    onDismiss: fn(),
  },
};

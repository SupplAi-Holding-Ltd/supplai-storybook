import type { Preview } from '@storybook/react-vite'
import './global.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/jetbrains-mono/400-italic.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundation',
          [
            'Logo and Branding',
            'Colors',
            'Typography',
            'Accessibility',
            'Iconography',
            'Grid and Layout',
          ],
          'Components',
          [
            'Button',
            'Toggle',
            'Tab Bars',
            'Form Methods',
            [
              'Text Input',
              'Password Input',
              'Radio Buttons',
              'Checkbox',
            ],
            'Toastr Notifications',
            'Tooltips',
            'Tables',
            'Modals',
            'Sidebar',
            'Avatars',
          ],
        ],
      },
    },
  },
};

export default preview;
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
    },
    stylesheetToggle: {
      "default": "main.css",
      "custom-theme": "custom-theme.css",
      "second-custom-theme": "https://second.com/custom-theme.css",
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

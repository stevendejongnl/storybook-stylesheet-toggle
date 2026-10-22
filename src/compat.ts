import * as components from "storybook/internal/components";

// Storybook 10.1 added PopoverProvider and deprecated WithTooltip's click
// trigger and IconButton. Storybook 11 removes them. Pick the API at runtime
// so one build works from Storybook 9 up to 11.
const available = components as Record<string, any>;

export const PopoverProvider = available.PopoverProvider;
export const WithTooltip = available.WithTooltip;
export const IconButton = available.IconButton;
export const Button = available.Button;
export const Form = available.Form;

export const hasModernComponents = Boolean(PopoverProvider);

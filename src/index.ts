import { definePreviewAddon } from "storybook/internal/csf";
import addonAnnotations from "./preview";

// CSF Next: `addons: [stylesheetToggle()]` in definePreview
export default () => definePreviewAddon(addonAnnotations);

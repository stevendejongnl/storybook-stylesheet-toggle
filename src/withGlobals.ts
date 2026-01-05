import type { PartialStoryFn as StoryFunction, Renderer, StoryContext } from "storybook/internal/types";
import { useEffect, useGlobals } from "storybook/preview-api";
import { PARAM_KEY } from "./constants";
import { getCustomStylesheets } from "./customStylesheets";


export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const [globals] = useGlobals();
  const stylesheetToggle = globals[PARAM_KEY];

  const { theme } = context.globals;
  const configuredStylesheets = context.parameters[PARAM_KEY];

  const activeId = localStorage.getItem(PARAM_KEY) || "default";

  // Resolve URL: check if it's a custom stylesheet or configured stylesheet
  let stylesheetUrl: string | undefined;

  if (activeId.startsWith('custom:')) {
    // Look up in custom stylesheets
    const customSheets = getCustomStylesheets();
    const customSheet = customSheets.find(s => s.id === activeId);
    stylesheetUrl = customSheet?.url;
  } else {
    // Look up in configured stylesheets
    stylesheetUrl = configuredStylesheets?.[activeId];
  }

  useEffect(() => {
    if (stylesheetUrl) {
      injectStylesheet(stylesheetUrl);
    }
  }, [stylesheetToggle, theme, stylesheetUrl]);

  return StoryFn();
};

function injectStylesheet(stylesheet: string) {
  const previousStylesheet = document.querySelector("#stylesheetToggle");
  const beforeElement = document.querySelector("#storybook-root");
  const bodyElement = document.querySelector("body");
  const stylesheetElement = document.createElement("link");

  if (!stylesheet) {
    return;
  }

  stylesheetElement.setAttribute("id", "stylesheetToggle");
  stylesheetElement.setAttribute("rel", "stylesheet");
  stylesheetElement.setAttribute("href", stylesheet);

  previousStylesheet?.remove();
  bodyElement.insertBefore(stylesheetElement, beforeElement);
}

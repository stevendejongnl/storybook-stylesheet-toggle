import type { PartialStoryFn as StoryFunction, Renderer, StoryContext } from "@storybook/types";
import { useEffect, useGlobals } from "@storybook/preview-api";
import { PARAM_KEY } from "./constants";


export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>
) => {
  const [globals] = useGlobals();
  const stylesheetToggle = globals[PARAM_KEY];

  const { theme } = context.globals;
  const stylesheets = context.parameters[PARAM_KEY];

  const active = localStorage.getItem(PARAM_KEY);
  if (!active) {
    localStorage.setItem(PARAM_KEY, "default");
  }
  const stylesheet = stylesheets[active];

  useEffect(() => {
    injectStylesheet(stylesheet);
  }, [stylesheetToggle, theme]);

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

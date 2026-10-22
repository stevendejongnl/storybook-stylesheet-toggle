import React from "react";
import { useGlobals } from "storybook/manager-api";
import { PaintBrushIcon } from "@storybook/icons";
import { PARAM_KEY, TOOL_ID } from "./constants";
import { defaultStylesheets } from "./defaults";
import { CustomTooltipLinkList } from "./CustomTooltipLinkList";
import { Button, hasModernComponents, IconButton, PopoverProvider, WithTooltip } from "./compat";


const Tool = ({ stylesheets }: { [key: string]: string }) => {
  const [globals] = useGlobals();
  const isActive = [true, "true"].includes(globals[PARAM_KEY]);

  if (stylesheets === null) {
    return null;
  }

  // Merge default and configured stylesheets
  const configuredStylesheets: {[key: string]: string} = {
    ...defaultStylesheets,
    ...stylesheets,
  };

  const activeStylesheet = localStorage.getItem(PARAM_KEY) || "default";

  const handleSelect = (id: string) => {
    localStorage.setItem(PARAM_KEY, id);
    window.location.reload();
  };

  const list = (
    <CustomTooltipLinkList
      configuredStylesheets={configuredStylesheets}
      activeStylesheet={activeStylesheet}
      onSelect={handleSelect}
    />
  );

  // Storybook 10.1+ (required for 11): accessible popover with a ghost Button
  if (hasModernComponents) {
    return (
      <PopoverProvider
        key={TOOL_ID}
        ariaLabel="Stylesheet options"
        placement="bottom-start"
        popover={list}
      >
        <Button variant="ghost" padding="small" ariaLabel="Toggle stylesheet">
          <PaintBrushIcon />
        </Button>
      </PopoverProvider>
    );
  }

  // Storybook 9 and 10.0
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={list}
      closeOnOutsideClick
    >
      <IconButton
        key={TOOL_ID}
        active={isActive}
        title="Toggle Stylesheet"
      >
        <PaintBrushIcon />
      </IconButton>
    </WithTooltip>
  );
};

export default Tool;

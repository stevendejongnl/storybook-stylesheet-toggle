import React from "react";
import { useGlobals } from "storybook/manager-api";
import { IconButton, WithTooltip } from "storybook/internal/components";
import { PaintBrushIcon } from "@storybook/icons";
import { PARAM_KEY, TOOL_ID } from "./constants";
import { defaultStylesheets } from "./defaults";
import { CustomTooltipLinkList } from "./CustomTooltipLinkList";


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

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={
        <CustomTooltipLinkList
          configuredStylesheets={configuredStylesheets}
          activeStylesheet={activeStylesheet}
          onSelect={handleSelect}
        />
      }
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

import React from "react";
import { useGlobals } from "@storybook/manager-api";
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { PARAM_KEY, TOOL_ID } from "./constants";
import { defaultStylesheets } from './defaults'


const Tool = ({ stylesheets }: {[key: string]: string}) => {
  const [globals] = useGlobals();
  const isActive = [true, "true"].includes(globals[PARAM_KEY]);

  if (stylesheets === null) {
    return null;
  }

  const mapping = {
    ...defaultStylesheets,
    ...stylesheets,
  };

  const active = localStorage.getItem(PARAM_KEY, 'default');

  const toggleStylesheet = (sheet: string) => {
    localStorage.setItem(PARAM_KEY, sheet)
    window.location.reload()
  }

  const items = [];
  for (const [name, url] of Object.entries(mapping)) {
    items.push({
      id: name,
      title: name,
      onClick: () => toggleStylesheet(name),
      active: ((!active && name === 'default') || active === name)
    })
  }

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={<TooltipLinkList links={items} />}
      closeOnOutsideClick
    >
      <IconButton
        key={TOOL_ID}
        active={isActive}
        title="Activate Stylesheet"
      >
        <Icons icon="paintbrush" />
      </IconButton>
    </WithTooltip>
  );
};

export default Tool

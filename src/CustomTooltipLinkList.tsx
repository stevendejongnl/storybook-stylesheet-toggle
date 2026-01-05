import React from 'react';
import { styled } from 'storybook/theming';
import { TrashIcon } from '@storybook/icons';
import { CustomStylesheetInput } from './CustomStylesheetInput';
import { getCustomStylesheets, deleteCustomStylesheet } from './customStylesheets';

const List = styled.div({
  minWidth: 280,
  maxWidth: 400,
  overflow: 'hidden',
  overflowY: 'auto',
  maxHeight: '400px',
});

const ListItem = styled.div<{ active?: boolean }>(({ theme, active }) => ({
  fontSize: theme.typography.size.s1,
  color: active ? theme.color.secondary : theme.color.dark,
  textDecoration: 'none',
  cursor: 'pointer',
  lineHeight: '18px',
  padding: '7px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: active ? theme.background.hoverable : 'transparent',
  '&:hover': {
    background: theme.background.hoverable,
  },
}));

const DeleteButton = styled.button(({ theme }) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  opacity: 0.6,
  '&:hover': {
    opacity: 1,
    color: theme.color.negative,
  },
}));

const Separator = styled.div(({ theme }) => ({
  height: '1px',
  background: theme.appBorderColor,
  margin: '8px 0',
}));

const SectionLabel = styled.div(({ theme }) => ({
  fontSize: '11px',
  color: theme.color.mediumdark,
  padding: '4px 10px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
}));

const ItemTitle = styled.span({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '200px',
});

interface CustomTooltipLinkListProps {
  configuredStylesheets: { [key: string]: string };
  activeStylesheet: string;
  onSelect: (id: string) => void;
}

export const CustomTooltipLinkList: React.FC<CustomTooltipLinkListProps> = ({
  configuredStylesheets,
  activeStylesheet,
  onSelect,
}) => {
  const customStylesheets = getCustomStylesheets();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this custom stylesheet?')) {
      deleteCustomStylesheet(id);
      window.location.reload();
    }
  };

  return (
    <List>
      <CustomStylesheetInput onAdd={onSelect} />

      {customStylesheets.length > 0 && (
        <>
          <SectionLabel>Custom Stylesheets</SectionLabel>
          {customStylesheets.map((sheet) => (
            <ListItem
              key={sheet.id}
              active={activeStylesheet === sheet.id}
              onClick={() => onSelect(sheet.id)}
            >
              <ItemTitle title={sheet.url}>{sheet.name}</ItemTitle>
              <DeleteButton onClick={(e) => handleDelete(e, sheet.id)} aria-label="Delete stylesheet">
                <TrashIcon size={12} />
              </DeleteButton>
            </ListItem>
          ))}
          <Separator />
        </>
      )}

      <SectionLabel>Configured Stylesheets</SectionLabel>
      {Object.entries(configuredStylesheets).map(([name]) => (
        <ListItem
          key={name}
          active={activeStylesheet === name}
          onClick={() => onSelect(name)}
        >
          {name}
        </ListItem>
      ))}
    </List>
  );
};

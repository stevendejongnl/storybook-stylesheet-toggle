import React, { FC, FormEventHandler, SyntheticEvent, useCallback } from 'react'
import { useGlobals } from '@storybook/manager-api'
import { Icons, IconButton, WithTooltip, Form, Link } from '@storybook/components'
import { PARAM_KEY, TOOL_ID } from './constants'
import { defaultStylesheets } from './defaults'
import { styled } from '@storybook/theming'

type LinkType = typeof Link
type LinkWrapperType = FC<any>

const active = localStorage.getItem(PARAM_KEY)

const toggleStylesheet = (sheet: string) => {
  localStorage.setItem(PARAM_KEY, sheet)
  window.location.reload()
}

const setCustomStylesheet = (event: FormEventHandler<HTMLInputElement>) => {
  // @ts-ignore
  const sheet = event.target.value
  localStorage.setItem(PARAM_KEY, `CUSTOM:${sheet}`)
  // window.location.reload()
}

export interface TooltipLinkListProps {
  links: LinkType[]
  LinkWrapper?: LinkWrapperType
}

const List = styled.div(
  {
    minWidth: 180,
    overflow: 'hidden',
    overflowY: 'auto',
    maxHeight: 15.5 * 32, // 11.5 items
  },
  ({ theme }) => ({
    borderRadius: theme.appBorderRadius,
  }),
)

type Item = {
  title: string
  description: string
}

// const Item: FC<LinkType & { isIndented?: boolean }> = (props) => {
//   const { LinkWrapper, onClick: onClickFromProps, isIndented, ...rest } = props
//   const { title, href, active } = rest
//   const onClick = useCallback(
//     (event: SyntheticEvent) => {
//       onClickFromProps(event, rest)
//     },
//     [onClickFromProps],
//   )

//   const hasOnClick = !!onClickFromProps

//   return (
//     <ListItem
//       title={title}
//       active={active}
//       href={href}
//       id={`list-item-${id}`}
//       LinkWrapper={LinkWrapper}
//       isIndented={isIndented}
//       {...rest}
//       {...(hasOnClick ? { onClick } : {})}
//     />
//   )
// }

interface ItemProps {
  disabled?: boolean;
}

const InnerItem = styled.a<ItemProps>(
  ({ theme }) => ({
    fontSize: theme.typography.size.s1,
    transition: 'all 150ms ease-out',
    color: theme.color.dark,
    textDecoration: 'none',
    cursor: 'pointer',
    justifyContent: 'space-between',

    lineHeight: '18px',
    padding: '7px 10px',
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      paddingLeft: 10,
    },

    '&:hover': {
      background: theme.background.hoverable,
    },
    '&:hover svg': {
      opacity: 1,
    },
  }),
  ({ disabled }) =>
    disabled
      ? {
          cursor: 'not-allowed',
        }
      : {}
);

const getItemProps = ((onClick, href, LinkWrapper) => {
  const result = {};

  if (onClick) {
    Object.assign(result, {
      onClick,
    });
  }
  if (href) {
    Object.assign(result, {
      href,
    });
  }
  if (LinkWrapper && href) {
    Object.assign(result, {
      to: href,
      as: LinkWrapper,
    });
  }
  return result;
});

const Item = (props) => {
  const { LinkWrapper, onClick: onClickFromProps, id, ...rest } = props
  const { title, href, active } = rest
  const onClick = useCallback(
    (event: SyntheticEvent) => {
      onClickFromProps(event, rest)
    },
    [onClickFromProps],
  )
  const itemProps = getItemProps(onClick, href, LinkWrapper);

  if (id === 'custom') {
    // const customActive = active.replace('CUSTOM:', '')

    const customActive = ''
    console.log('flap', active)

    return (
      <Form.Field label="Custom">
        <Form.Input value={customActive} onChange={() => setCustomStylesheet} />
      </Form.Field>
    )
  }

  return (
    <InnerItem active={active} {...rest} {...itemProps}>
      {title}
    </InnerItem>
  )
}

const TooltipLinkList: FC<TooltipLinkListProps> = ({ links, LinkWrapper }) => {
  return (
    <List>
      {links.map(({ ...p }) => (
        <Item key={p.id} {...p} />
      ))}
    </List>
  )
}

const Tool = ({ stylesheets }: { [key: string]: string }) => {
  const [globals] = useGlobals()
  const isActive = [true, 'true'].includes(globals[PARAM_KEY])

  if (stylesheets === null) {
    return null
  }

  const mapping = {
    ...defaultStylesheets,
    ...(stylesheets as unknown as object),
  }

  const items = []
  items.push({
    id: 'custom',
    title: 'custom',
    active: !active && active.includes('CUSTOM:'),
  })
  for (const [name, _] of Object.entries(mapping)) {
    items.push({
      id: name,
      title: name,
      onClick: () => toggleStylesheet(name),
      active: (!active && name === 'default') || active === name,
    })
  }

  return (
    <WithTooltip placement="top" trigger="click" tooltip={<TooltipLinkList links={items} />} closeOnOutsideClick>
      <IconButton key={TOOL_ID} active={isActive} title="Activate Stylesheet">
        <Icons icon="paintbrush" />
      </IconButton>
    </WithTooltip>
  )
}

export default Tool

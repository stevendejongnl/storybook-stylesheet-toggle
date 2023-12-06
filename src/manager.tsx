import React from 'react'
import { addons, types, useParameter } from '@storybook/manager-api'
import { ADDON_ID, PARAM_KEY } from './constants'
import Tool from './Tool'

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Stylesheet Toggle',
    type: types.TOOL,
    render: () => {
      const stylesheets = useParameter(PARAM_KEY, null)

      return <Tool stylesheets={stylesheets} />
    },
  })
})

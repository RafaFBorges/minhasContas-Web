'use client'

import React from 'react'
import { useTheme } from '../../utils/hook/themeHook'
import Toggle, { ToogleProps } from '../api/toggle'


export default function ThemeToggle({
  name,
  clickHandle,
  enabled = true,
  toogleSize = 20,
  padding = 2,
  borderWidth = 1,
  color = '',
  borderColor = '',
  disabledColor = '',
}: ToogleProps) {
  const { config } = useTheme()

  return <Toggle
    name={name}
    clickHandle={clickHandle}
    enabled={enabled}
    color={color != '' ? color : config.enabledColor}
    toogleSize={toogleSize}
    padding={padding}
    borderColor={borderColor != '' ? borderColor : config.borderColor}
    borderWidth={borderWidth}
    disabledColor={disabledColor ? disabledColor : config.disabledColor}
  />
}

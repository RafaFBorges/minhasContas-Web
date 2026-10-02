'use client'

import React from 'react'
import { useTheme } from '../../utils/hook/themeHook'
import { StyledButton, StyledButtonProps } from '@rafafborges/componentes'

export default function ThemeButton({
  children,
  clickHandle,
  clickHandleDisabled,
  Icon = null,
  isClickableIcon = false,
  width = '',
  enabled = true,
  iconSize = '16',
  isSecondary = false,
  borderRadius = '4px',
  style = undefined,
}: StyledButtonProps) {
  const { config } = useTheme()

  return <StyledButton
    clickHandle={clickHandle}
    clickHandleDisabled={clickHandleDisabled}
    Icon={Icon}
    isClickableIcon={isClickableIcon}
    width={width}
    enabled={enabled}
    iconSize={iconSize}
    isSecondary={isSecondary}
    borderRadius={borderRadius}
    color={config.color}
    style={style}
  >
    {children}
  </StyledButton>
}

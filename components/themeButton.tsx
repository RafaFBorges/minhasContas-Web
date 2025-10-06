'use client'

import React from 'react'
import StyledButton, { StyledButtonProps } from './api/button'
import { useTheme } from '../utils/hook/themeHook'

export default function ThemeButton({
  children,
  clickHandle,
  Icon = null,
  isClickableIcon = false,
  width = '',
  enabled = true,
  iconSize = '16',
  isSecondary = false,
  borderRadius = '4px',
}: StyledButtonProps) {
  const { config } = useTheme()

  return <StyledButton
    clickHandle={clickHandle}
    Icon={Icon}
    isClickableIcon={isClickableIcon}
    width={width}
    enabled={enabled}
    iconSize={iconSize}
    isSecondary={isSecondary}
    borderRadius={borderRadius}
    color={config.color}
  >
    {children}
  </StyledButton>
}

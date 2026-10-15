'use client'

import React from 'react'

import { useTheme } from '../../utils/hook/themeHook'
import ThemeDateInput from './themeDateInput'
import { FrameworkInput, FrameworkInputProps } from '@rafafborges/componentes'

export default function ThemeFrameworkInput({
  borderErrorColor = undefined,
  borderSuccessColor = undefined,
  borderNormalColor = undefined,
  ...rest
}: FrameworkInputProps) {
  const { config } = useTheme()

  return <FrameworkInput
    labelColor={config.disabledFontColor}
    fontColor={config.fontColor}
    disabledFontColor={config.disabledFontColor}
    inputs={{ date: ThemeDateInput }}
    borderErrorColor={borderErrorColor ? borderErrorColor : config.borderErrorColor}
    borderSuccessColor={borderSuccessColor ? borderSuccessColor : config.borderSuccessColor}
    borderNormalColor={borderNormalColor ? borderNormalColor : config.borderColor}

    {...rest}
  />
}

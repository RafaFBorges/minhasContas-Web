'use client'

import React from 'react'
import { useTheme } from '../../utils/hook/themeHook'
import { TagItem, TagItemProps } from '@rafafborges/componentes'

export default function ThemeTagItem({ ...rest }: TagItemProps) {
  const { config } = useTheme()

  return <TagItem
    defaultColor={config.tagDefaultColor}
    disabledFontColor={config.disabledFontColor}
    fontColor={config.fontColor}

    {...rest}
  />
}

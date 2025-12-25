'use client'

import React from 'react'
import Card, { CardProps } from './api/card'
import { useTheme } from '../utils/hook/themeHook'

export default function ThemeCard({
  style,
  title,
  date,
  categories,
  id = -1,
  editClickHandle = null,
  deleteClickHandle = null
}: CardProps) {
  const { config } = useTheme()

  return <Card
    style={style}
    title={title}
    date={date}
    categories={categories}
    id={id}
    editClickHandle={editClickHandle}
    deleteClickHandle={deleteClickHandle}
    backgroundColor={config.cardBackground}
  />
}

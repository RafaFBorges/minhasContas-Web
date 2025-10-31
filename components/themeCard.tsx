'use client'

import React from 'react'
import Card, { CardProps } from './api/card'
import { useTheme } from '../utils/hook/themeHook'

export default function ThemeCard({
  title,
  date,
  id = -1,
  editClickHandle = null,
  deleteClickHandle = null
}: CardProps) {
  const { config } = useTheme()

  return <Card
    title={title}
    date={date}
    id={id}
    editClickHandle={editClickHandle}
    deleteClickHandle={deleteClickHandle}
    backgroundColor={config.cardBackground}
  />
}

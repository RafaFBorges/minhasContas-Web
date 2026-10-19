'use client'

import React from 'react'
import { Card } from '@rafafborges/componentes'
import { useTheme } from '../../utils/hook/themeHook'
import { Category } from '@/domain/Category'
import TagList from '../lists/tagList'

export interface ThemeCardProps {
  style?: React.CSSProperties | null;
  title: string;
  date: string;
  categories?: Array<Category>;
  id: number;
  editClickHandle?: null | ((index: number) => void);
  deleteClickHandle?: null | ((index: number) => void);
}

export default function ThemeCard({
  style,
  title,
  date,
  categories,
  id = -1,
  editClickHandle = null,
  deleteClickHandle = null
}: ThemeCardProps) {
  const { config } = useTheme()

  return <Card
    style={style}
    title={title}
    date={date}
    id={id}
    editClickHandle={editClickHandle}
    deleteClickHandle={deleteClickHandle}
    backgroundColor={config.cardBackground}
    color={config.color}
    fontColor={config.fontColor}
    disabledFontColor={config.disabledFontColor}
  >
    <TagList DisabledHover style={styles.tagList} tagList={Category.getTagList(categories)} />
  </Card>
}

const styles: { [key: string]: React.CSSProperties } = {
  tagList: {
    margin: '0 0 0.5rem 0',
  }
}

import React from 'react'


import Text, { TextTag } from './text'
import { useTranslate } from './../utils/hook/translateHook'
import { Category } from '@/domain/Category'
import { isLight, lightenCor } from './../utils/colors'

export interface TagListProps {
  style?: React.CSSProperties | null;
  itensList: Array<Category> | undefined;
  color?: string;
}

export default function TagList({ style, itensList, color = '#DC143C' }: TagListProps) {
  const UNKOWN_CATEGORY_KEY = 'unkownCategory'
  const { getValue } = useTranslate()

  const backColor: string = lightenCor(color, 35)

  function printTag(name: string, index: number) {
    return <div key={index} style={{ ...styles.tagContainer, borderColor: color, backgroundColor: backColor }}>
      <Text textTag={TextTag.P} style={styles.categoryTitle} color={isLight(backColor) ? '#000' : '#FFF'} disabled noSelection>{name}</Text>
    </div>
  }

  function printContainer() {
    if (itensList == null || itensList.length == 0)
      return printTag(getValue(UNKOWN_CATEGORY_KEY), 0)

    return itensList.map((item, index) => printTag(item != null ? item.name : getValue(UNKOWN_CATEGORY_KEY), index))
  }

  return <div style={{ ...styles.container, ...style }}> {printContainer()}</div >
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.4em',
    margin: '0 0 0.5rem 0',
  },
  tagContainer: {
    border: '1px solid red',
    borderRadius: '8px',
    padding: '2px 4px',
  },
  title: {
    fontSize: '0.85rem',
  }
}

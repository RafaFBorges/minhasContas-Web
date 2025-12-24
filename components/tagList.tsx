import React, { useState } from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import Text, { TextTag } from './text'
import { useTranslate } from './../utils/hook/translateHook'
import { isLight, lightenCor } from './../utils/colors'
import ThemeButton from './themeButton'
import { useTheme } from '../utils/hook/themeHook'
import { Tag } from '@/domain/Tag'

export interface TagListProps {
  style?: React.CSSProperties | null;
  itensList: Array<Tag> | null;
  color?: string;
  selectable?: boolean;
  addNewTags?: boolean;
  onClick?: (item: number) => void | undefined;
}

export default function TagList({ style, itensList, color = '', selectable = false, addNewTags = false, onClick = undefined }: TagListProps) {
  const UNKOWN_CATEGORY_KEY = 'unkownCategory'

  const { getValue } = useTranslate()
  const { config } = useTheme()
  const [tagList, setTagList] = useState(itensList)

  function printTag(name: string, index: number, isDisabled: boolean) {
    const tagColor: string = isDisabled
      ? config.disabledFontColor
      : color == ''
        ? config.tagDefaultColor
        : color

    const backColor: string = lightenCor(tagColor, 35)

    return <div
      key={index}
      style={{ ...styles.tagContainer, borderColor: tagColor, backgroundColor: backColor }}
      onClick={selectable
        ? () => {
          if (tagList != null && 0 <= index && index < tagList.length) {
            const newtag = tagList[index]
            newtag.disabled = !newtag.disabled
            console.log('Clicou na tag> first=' + JSON.stringify(tagList.slice(0, index), null, 2) + ' netag=' + JSON.stringify(newtag, null, 2) + ' end=' + JSON.stringify(tagList.slice(index + 1), null, 2))
            setTagList([...tagList.slice(0, index), newtag, ...tagList.slice(index + 1)])
          }
        }
        : () => { }}
    >
      <Text textTag={TextTag.P} style={styles.categoryTitle} color={isLight(backColor) ? '#000' : '#FFF'} disabled noSelection>{name}</Text>
    </div>
  }

  function printContainer() {
    if (tagList == null || tagList.length == 0)
      return printTag(getValue(UNKOWN_CATEGORY_KEY), 0, false)

    return tagList.map((item, index) => printTag(item != null ? item.name : getValue(UNKOWN_CATEGORY_KEY), index, item != null ? item.disabled : false))
  }

  return <div style={{ ...styles.container, ...style }}>
    {addNewTags &&
      <ThemeButton
        clickHandle={() => console.log('Clicou')}
        Icon={AddIcon}
      />
    }
    {printContainer()}
  </div >
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

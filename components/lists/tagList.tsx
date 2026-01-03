import React from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import Text, { TextTag } from '../text'
import { useTranslate } from '../../utils/hook/translateHook'
import { isLight, lightenCor } from '../../utils/colors'
import ThemeButton from '../themeButton'
import { useTheme } from '../../utils/hook/themeHook'
import { Tag } from '@/domain/Tag'

export interface TagListProps {
  style?: React.CSSProperties | null;
  tagList: Array<Tag> | null;
  setTagList?: (newList: Array<Tag>) => void | undefined;
  color?: string;
  selectable?: boolean;
  addNewTags?: boolean;
  allowEmpty?: boolean;
}

export default function TagList({
  style,
  tagList,
  setTagList = undefined,
  color = '',
  selectable = false,
  addNewTags = false,
  allowEmpty = false,
}: TagListProps) {
  const UNKOWN_CATEGORY_KEY = 'unkownCategory'

  const { getValue } = useTranslate()
  const { config } = useTheme()

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
          if (tagList != null && 0 <= index && index < tagList.length && setTagList != null) {
            const newtag = tagList[index]
            newtag.disabled = !newtag.disabled
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
      return allowEmpty ? null : printTag(getValue(UNKOWN_CATEGORY_KEY), 0, false)

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
    flexShrink: 0,
    flexDirection: 'row',
    gap: '0.4em',
    maxWidth: '100%',
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
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

import React, { useEffect, useRef } from 'react'

import { FaFilter as FilterIcon } from 'react-icons/fa'

import Text, { TextTag } from './text'
import { lightenCor } from './../utils/colors'
import { useTheme } from '../utils/hook/themeHook'
import { Tag } from '@/domain/Tag'
import { Expense } from '@/domain/Expense'

export interface FilterListProps {
  style?: React.CSSProperties | null;
  tagList: Array<Tag> | null;
  listToFilter?: Expense[];
  setter?: (newList: Expense[]) => void | undefined;
  filterCondition?: (item: Expense, category: Tag) => boolean;
  setTagList?: (newList: Array<Tag>) => void | undefined;
  color?: string;
  onClick?: (item: number) => void | undefined;
}

export default function FilterList({
  style,
  tagList,
  setTagList = undefined,
  color = '',
  listToFilter = undefined,
  setter = undefined,
  filterCondition = undefined,
  onClick = undefined
}: FilterListProps) {
  const { config } = useTheme()
  const selected = useRef<number | null>(0)

  function printTag(name: string, index: number, isDisabled: boolean) {
    const tagColor: string = isDisabled
      ? config.disabledFontColor
      : color == ''
        ? config.tagDefaultColor
        : color

    const backColor: string = lightenCor(tagColor, 35)

    return <Text
      key={index}
      noSelection
      textTag={TextTag.P}
      style={isDisabled ? {} : styles.selected}
      color={config.fontColor}
      onClick={() => {
        if (tagList != null && 0 <= index && index < tagList.length && setTagList != null) {
          const newList: Array<Tag> = [...tagList]
          newList[index].disabled = false

          if (selected != null && selected.current != null) {
            newList[selected.current].disabled = true
            selected.current = index
          }

          setTagList(newList)

          if (setter != null && listToFilter != null && filterCondition != null) {
            selected.current == 0
              ? setter(listToFilter)
              : setter(listToFilter.filter(item => filterCondition(item, newList[index])))
          }
        }

        onClick != null ? onClick : () => { console.log('CLICOU CARAI') }
      }}
    >
      {name}
    </Text>
  }

  useEffect(() => {
    if (setTagList != null && tagList != null && 0 < tagList.length && tagList[0].name != 'Todas') {
      selected.current = 0
      setTagList([
        new Tag(-1, 'Todas', false),
        ...tagList.map(item => {
          item.disabled = true
          return item
        })
      ])
    }

  }, [tagList])

  function printContainer() {
    return (tagList == null || tagList.length == 0)
      ? null
      : tagList.map((item, index) => item != null ? printTag(item.name, index, item.disabled) : null)
  }

  return <div style={{ ...styles.container, ...style }}>
    <FilterIcon
      style={styles.icon}
      color={config.color}
      size={24}
    />
    {printContainer()}
  </div >
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexShrink: 0,
    flexDirection: 'row',
    gap: '0.6em',
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
  },
  selected: {
    fontWeight: 'bold',
  },
  icon: {
    flexShrink: 0
  }
}

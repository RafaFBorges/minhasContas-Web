import React, { useEffect, useRef } from 'react'

import { FaFilter as FilterIcon } from 'react-icons/fa'

import { useTheme } from '../../utils/hook/themeHook'
import { Tag } from '@/domain/Tag'
import { Expense } from '@/domain/Expense'
import { FILTER_SELECTION_KEY } from '../../utils/DataConstants'
import { saveCookie } from '@/app/actions/cookiesManager'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'
import TagItem from '../tagItem'

export interface FilterListProps {
  style?: React.CSSProperties | null;
  tagList: Array<Tag> | null;
  listToFilter?: Expense[];
  setter?: (newList: Expense[]) => void | undefined;
  filterCondition?: (item: Expense, category: Tag) => boolean;
  setTagList?: (newList: Array<Tag>) => void | undefined;
}

export default function FilterList({
  style,
  tagList,
  setTagList = undefined,
  listToFilter = undefined,
  setter = undefined,
  filterCondition = undefined,
}: FilterListProps) {
  const ALL_FILTER_KEY = 'FilterList.Save'

  const { config } = useTheme()
  const { language, addKeys, getValue } = useTranslate()
  const selected = useRef<number | null>(-1)
  const translationName = useRef<string>('')

  function printTag(name: string, index: number, isDisabled: boolean) {
    return <TagItem
      isOnlyText
      key={index}
      name={name}
      style={isDisabled ? {} : styles.selected}
      isDisabled={isDisabled}
      onClick={(_e: React.MouseEvent<HTMLDivElement>) => {
        if (tagList != null && 0 <= index && index < tagList.length && setTagList != null) {
          const newList: Array<Tag> = [...tagList]

          if (selected != null && selected.current != null) {
            newList[selected.current].disabled = true
            selected.current = index
          }

          newList[index].disabled = false
          setTagList(newList)
          saveCookie(FILTER_SELECTION_KEY, newList[index].ToString())
          if (setter != null && listToFilter != null && filterCondition != null) {
            if (selected.current == 0)
              setter(listToFilter)
            else
              setter(listToFilter.filter(item => filterCondition(item, newList[index])))
          }
        }
      }}
    />
  }

  function printContainer() {
    return (tagList == null || tagList.length == 0)
      ? null
      : tagList.map((item, index) => item != null ? printTag(item.name, index, item.disabled) : null)
  }

  function translate() {
    addKeys(ALL_FILTER_KEY, [{ value: 'Todas', lang: LanguageOption.PT_BR }, { value: 'All', lang: LanguageOption.EN },])
  }

  useEffect(() => {
    if (setTagList != null && tagList != null && 0 < tagList.length && tagList[0].name != getValue(ALL_FILTER_KEY)) {
      let found: boolean = false
      let selectedIndex: number = 0
      const list: Array<Tag> = tagList.map((item, index) => {
        if (found) {
          item.disabled = true
        } else {
          found = !item.disabled
          if (found)
            selectedIndex = index + 1
        }

        return item
      })

      selected.current = selectedIndex
      setTagList([new Tag(-1, getValue(ALL_FILTER_KEY), selected.current != 0), ...list])
      if (setter != null && listToFilter != null && filterCondition != null) {
        if (selected.current == 0)
          setter(listToFilter)
        else
          setter(listToFilter.filter(item => filterCondition(item, list[selectedIndex - 1])))
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagList])

  useEffect(() => {
    if (selected.current != -1 && setter != null && listToFilter != null && filterCondition != null) {
      const index: number = selected == null || selected.current == null ? -1 : selected.current

      if (tagList == null || index <= 0)
        setter(listToFilter)
      else
        setter(listToFilter.filter(item => filterCondition(item, tagList[index])))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listToFilter])

  useEffect(() => {
    translate()
    translationName.current = getValue(ALL_FILTER_KEY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const list: Array<Tag> | null = (tagList == null)
      ? null
      : tagList.map(item => {
        if (item.name == translationName.current)
          return new Tag(-1, getValue(ALL_FILTER_KEY), selected.current != 0)

        return item
      })

    translationName.current = getValue(ALL_FILTER_KEY)
    if (setTagList != null && list != null)
      setTagList(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return <div style={{ ...styles.container, ...style }}>
    <FilterIcon
      style={styles.icon}
      color={config.color}
      size={24}
    />
    <div style={{ ...styles.containerList }}>
      {printContainer()}
    </div >
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.4em',
    width: '100%',
    boxSizing: 'border-box',
  },
  containerList: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: '0.6em',
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

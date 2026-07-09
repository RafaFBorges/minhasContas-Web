"use client"

import React, { useEffect, useState } from 'react'

import { IconType } from 'react-icons'

import { useTheme } from './themeHook'
import ThemeButton from '../../components/themeComponents/themeButton'
import { LanguageOption, useTranslate } from './translateHook'


export interface UsePaginationProps {
  list: PaginationItem[]
  firstIndex?: number
  lastAction?: PaginationLastAction
}

export interface UsePaginationReturn {
  renderController: () => React.JSX.Element | undefined
  selected: number
  renderPreviousButton: (name?: string | undefined) => React.JSX.Element
  renderNextButton: (name?: string | undefined) => React.JSX.Element
  renderContent: () => React.JSX.Element | undefined
}

export interface PaginationItem {
  name: string
  Icon: IconType | undefined
  renderPage: () => React.JSX.Element | undefined
  canGoFurther?: () => boolean
  canGoBack?: () => boolean
}

interface ButtonsName {
  next: string
  previous: string
}

interface PaginationLastAction {
  buttonName: string
  action: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  enabled: () => boolean
}

export function usePagination({ list, firstIndex = 0, lastAction = undefined }: UsePaginationProps): UsePaginationReturn {
  const NEXT_KEY = 'Pagination.Next'
  const PREVIOUS_KEY = 'Pagination.Previous'

  const { config } = useTheme()
  const { language, addKeys, getValue } = useTranslate()

  const [paginationList, setPaginationList] = useState<PaginationItem[]>(list)
  const [selected, setSelected] = useState<number>(Math.min(Math.max(0, firstIndex), list.length - 1))
  const [buttonsNames, setButtonsNames] = useState<ButtonsName>(translate())

  function translate(): ButtonsName {
    return {
      next: addKeys(NEXT_KEY, [{ value: 'Próximo', lang: LanguageOption.PT_BR }, { value: 'Next', lang: LanguageOption.EN },]),
      previous: addKeys(PREVIOUS_KEY, [{ value: 'Voltar', lang: LanguageOption.PT_BR }, { value: 'Previous', lang: LanguageOption.EN },])
    }
  }

  function renderController() {
    return <div style={styles.paginationContainer}>
      {paginationList.map((item, index) => {
        if (item.Icon == null)
          return

        const canClick = (index != selected) && (index < selected && (item.canGoBack == null || item.canGoBack()) || canGoFurther())
        let style: React.CSSProperties = {
          ...styles.paginationItem,
          borderColor: selected === index
            ? config.color
            : index < selected ? config.iconColor : config.disabledColor
        }

        if (canClick)
          style = { ...style, ...styles.canClick }

        const Icon: IconType = item.Icon
        return <div
          key={index}
          style={style}
          onClick={() => {
            if (canClick)
              setSelected(index)
          }}
        >
          <Icon
            color={selected === index
              ? config.color
              : index < selected ? config.iconColor : config.disabledColor
            }
            size={20}
          />
        </div>
      })}
    </div>
  }

  function renderContent(): React.JSX.Element | undefined {
    return 0 <= selected && selected < paginationList.length ? paginationList[selected].renderPage() : undefined
  }

  function canGoFurther(): boolean {
    if ((selected < 0) || (paginationList.length < selected))
      return false

    const maxIndex = paginationList[selected].canGoFurther == null ? paginationList.length - 1 : paginationList.length
    return (0 <= selected) && (selected < maxIndex) && (paginationList[selected].canGoFurther == null || paginationList[selected].canGoFurther())
  }

  function canGoBack(): boolean {
    if ((selected < 0) || (paginationList.length < selected))
      return false

    const minIndex = paginationList[selected].canGoBack == null ? 1 : 0
    return (minIndex <= selected) && (selected < paginationList.length) && (paginationList[selected].canGoBack == null || paginationList[selected].canGoBack())
  }

  function renderNextButton(name: string | undefined = undefined): React.JSX.Element {
    return <ThemeButton
      enabled={canGoFurther()}
      clickHandle={(e: React.MouseEvent<HTMLButtonElement>) => {
        return (selected == paginationList.length - 1) && (lastAction != null) && lastAction.action != null
          ? lastAction.action(e)
          : setSelected(prev => Math.min(paginationList.length - 1, prev + 1))
      }}
    >
      {name !== undefined
        ? name
        : (selected == paginationList.length - 1) && (lastAction != null)
          ? lastAction.buttonName
          : buttonsNames.next
      }
    </ThemeButton>
  }

  function renderPreviousButton(name: string | undefined = undefined): React.JSX.Element {
    return <ThemeButton
      enabled={canGoBack()}
      clickHandle={() => setSelected(prev => Math.max(0, prev - 1))}
    >
      {name === undefined ? buttonsNames.previous : name}
    </ThemeButton>
  }

  useEffect(() => {
    setButtonsNames({
      next: getValue(NEXT_KEY),
      previous: getValue(PREVIOUS_KEY),
    })
  }, [language])

  return { renderController, selected, renderPreviousButton, renderNextButton, renderContent }
}

const styles: { [key: string]: React.CSSProperties } = {
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paginationItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 6,
    border: '2px solid #ccc',
    padding: 4,
  },
  canClick: {
    cursor: 'pointer',
  },
}

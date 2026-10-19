import React from 'react'

import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'
import { useTheme } from '../../utils/hook/themeHook'
import { Tag } from '@/domain/Tag'
import { useModal } from '../../utils/hook/modalHook'
import CategoryConfiguration, { CategoryVerifyData } from '@/modalPages/CategoryConfiguration'
import { CategoryRequest, CategoryResponse } from '@/comunication/category'
import { CATEGORIES_ENDPOINT, handlePOST } from '@/comunication/ApiResthandler'
import { Category } from '@/domain/Category'
import { useUser } from '../../utils/hook/userHook'
import { saveExpenseDisabledCookie } from '@/app/actions/cookiesManager'
import { TagList as TagListBase } from '@rafafborges/componentes'

export interface TagListProps {
  style?: React.CSSProperties | null;
  tagList: Array<Tag> | null;
  setTagList?: (newList: Array<Tag>) => void | undefined;
  color?: string;
  selectable?: boolean;
  addNewTags?: boolean;
  allowEmpty?: boolean;
  DisabledHover?: boolean;
}

export default function TagList({
  style,
  tagList,
  setTagList = undefined,
  selectable = false,
  addNewTags = false,
  allowEmpty = false,
  DisabledHover = false
}: TagListProps) {
  const NEW_CATEGORY_TITLE_KEY = 'TagList.PropertiesTitle'
  const UNKOWN_CATEGORY_KEY = 'unkownCategory'

  const { addCategory, userInfo } = useUser()
  const { getValue, addKeys } = useTranslate()
  const { openModal } = useModal()
  const { config } = useTheme()

  const handleCreateCategory = async (item: CategoryVerifyData) => {
    const request: CategoryRequest = {} as CategoryRequest
    request.name = item.name
    request.owner = userInfo.id
    request.date = new Date().toISOString()
    const response: CategoryResponse = await handlePOST<CategoryResponse>(CATEGORIES_ENDPOINT, request, userInfo.token)

    if (response != null && typeof response === 'object' && 'id' in response && 'owner' in response && 'name' in response && 'date' in response)
      addCategory(new Category(Number(response.id), Number(response.owner), String(response.name), String(response.date)))
  }

  const categoryCreate = () => {
    return <CategoryConfiguration
      oldValue={''}
      enabledVerify={(item: CategoryVerifyData) => item != null && item.name != '' && 4 <= item.name.length}
    />
  }

  const handleEditClick = () => {
    openModal(getValue(NEW_CATEGORY_TITLE_KEY), categoryCreate, (item: unknown) => handleCreateCategory(item as CategoryVerifyData), true)
  }

  addKeys(NEW_CATEGORY_TITLE_KEY, [{ value: 'Nova categoria', lang: LanguageOption.PT_BR }, { value: 'New category', lang: LanguageOption.EN },])
  const emptyLabel = addKeys(UNKOWN_CATEGORY_KEY, [{ value: 'desconhecido', lang: LanguageOption.PT_BR }, { value: 'unknown', lang: LanguageOption.EN },])

  function handleTagClick(index: number) {
    if (tagList != null && 0 <= index && index < tagList.length && tagList[index] != null && setTagList != null) {
      const newtag = tagList[index]
      newtag.disabled = !newtag.disabled

      saveExpenseDisabledCookie(newtag.ToString(), newtag.disabled)
      setTagList([...tagList.slice(0, index), newtag, ...tagList.slice(index + 1)])
    }
  }

  return <TagListBase
    style={style}
    tags={tagList}
    emptyLabel={emptyLabel}
    allowEmpty={allowEmpty}
    DisabledHover={DisabledHover}
    onTagClick={selectable ? handleTagClick : undefined}
    onAdd={addNewTags ? handleEditClick : undefined}
    color={config.color}
    tagDefaultColor={config.tagDefaultColor}
    disabledFontColor={config.disabledFontColor}
    fontColor={config.fontColor}
  />
}

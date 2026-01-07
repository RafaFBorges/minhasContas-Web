import React, { useEffect, useState } from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import { EXPENSES_ENDPOINT, handlePOST } from '@/comunication/ApiResthandler'
import { CategoryResponse } from '@/comunication/category'

import { ExpenseRequest } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import { Tag } from '@/domain/Tag'
import { Category } from '@/domain/Category'
import { useTranslate } from '../../utils/hook/translateHook'
import Spin from '../../components/spin'
import ThemeButton from '../../components/themeButton'
import TagList from '../../components/lists/tagList'
import { useModal } from '../../utils/hook/modalHook'
import { ExpenseVerifyData } from '@/app/ExpenseConfiguration'


interface ExpenseUIProps<T> {
  tagList?: Array<Tag>;
  setValueList?: (item: Expense) => void | undefined;
  setTagList?: (item: Array<Tag>) => void | undefined;
  setCategoriesList?: (item: Category[]) => void | undefined;
  hasAddButton?: boolean;
  startValue?: number;
  enabledVerify?: (((item: T) => boolean) | null);
}

export default function ExpenseUI({
  tagList,
  setValueList,
  setTagList,
  setCategoriesList,
  hasAddButton = false,
  startValue = 0,
  enabledVerify = null
}: ExpenseUIProps<ExpenseVerifyData>) {
  const [value, setValue] = useState<number>(startValue)
  const [categories, setCategories] = useState<Array<Tag>>(tagList != null ? tagList.map((tag: Tag) => tag.clone()) : [])

  const { language } = useTranslate()
  const { setEnabledSave, setData } = useModal()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  const handleAddNewClick = async () => {
    const list = tagList != null ? tagList : categories
    const request: ExpenseRequest = {}
    request.value = value
    request.categoryIds = list.filter(item => !item.disabled).map(item => item.id)
    request.date = new Date().toISOString()
    const response = await handlePOST(EXPENSES_ENDPOINT, request)

    if (response != null) {
      const categoryList: Category[] = []
      response.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))

      if (setValueList != null)
        setValueList(new Expense(response.id, response.value, response.dates, categoryList, language))
    }
  }

  useEffect(() => {
    console.log('ExpenseUI.useEffect > useCategories=' + (setTagList != null))
    const hasEnabled = (enabledVerify != null)
    console.log('ExpenseUI.useEffect > hasEnabledVerify=' + hasEnabled)
    if (enabledVerify == null)
      return

    console.log('ExpenseUI.useEffect > passed data=' + JSON.stringify({ value: value, tags: categories }, null, 2) + 'hasEnabledVerify=' + hasEnabled)
    setEnabledSave(enabledVerify({
      value: value,
      tags: categories
    }))

    setData('value', value)
    setData('categories', categories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, categories])

  return <div>
    <div style={{ ...styles.flexRow, gap: '1rem' }}>
      <Spin
        name={'expenseValue'}
        value={value}
        changeHandle={handleChange}
        setValueHandle={setValue}
      />

      {hasAddButton && setValueList != null &&
        <ThemeButton
          clickHandle={handleAddNewClick}
          Icon={AddIcon}
        />
      }
    </div>
    <TagList
      style={styles.tagContainer}
      tagList={tagList != null && setTagList != null ? tagList : categories}
      setTagList={setTagList != null ? setTagList : setCategories}
      setCategories={setCategoriesList}
      selectable
      addNewTags
      allowEmpty
    />
  </div>
}

const styles: { [key: string]: React.CSSProperties } = {
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
  },
  tagContainer: {
    marginTop: '0.5em',
  },
}

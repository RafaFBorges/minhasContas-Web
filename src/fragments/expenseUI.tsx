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
import { useUser } from '../../utils/hook/userHook'


interface ExpenseUIProps<T> {
  tagList?: Array<Tag>;
  setTagList?: (item: Array<Tag>) => void | undefined;
  hasAddButton?: boolean;
  startValue?: number;
  enabledVerify?: (((item: T) => boolean) | null);
}

export default function ExpenseUI({
  tagList,
  setTagList,
  hasAddButton = false,
  startValue = 0,
  enabledVerify = null
}: ExpenseUIProps<ExpenseVerifyData>) {
  const [value, setValue] = useState<number>(startValue)
  const [categories, setCategories] = useState<Array<Tag>>(tagList != null ? tagList.map((tag: Tag) => tag.clone()) : [])

  const { addFinancial } = useUser()
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

      addFinancial(new Expense(response.id, response.value, response.dates, categoryList, language))
    }
  }

  useEffect(() => {
    if (enabledVerify == null)
      return

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

      {hasAddButton &&
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

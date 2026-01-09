'use client'

import React, { useEffect, useState } from 'react'

import {
  EXPENSES_ENDPOINT,
  handleDELETE,
  handlePUT
} from '@/comunication/ApiResthandler'
import { ExpenseRequest } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import ThemeCard from '../../components/themeCard'
import { useModal } from '../../utils/hook/modalHook'
import ExpenseConfiguration, { ExpenseVerifyData } from './ExpenseConfiguration'
import Text, { TextTag } from '../../components/text'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'
import { Category } from '@/domain/Category'
import { CategoryResponse } from '@/comunication/category'
import { Tag } from '@/domain/Tag'
import FilterList from '../../components/lists/filterList'
import ExpenseUI from '@/fragments/expenseUI'
import { getRealString } from '../../utils/financialUtils'
import { getSideColor } from '../../utils/colors'
import { useUser } from '../../utils/hook/userHook'


export default function Home() {
  const SUBTITLE_KEY = 'Home.Subtitle'
  const PROPERTIES_TITLE_KEY = 'Home.PropertiesTitle'

  const [filteredexpenses, setFilteredexpenses] = useState<Expense[]>([])
  const [tagList, setTagList] = useState<Array<Tag>>([])
  const [filterList, setFilterList] = useState<Array<Tag>>([])

  const { openModal } = useModal()
  const { addKey, getValue, language } = useTranslate()
  const {
    financialList,
    categoriesList,
    total,
    deleteFinancial,
    editFinancial,
  } = useUser()

  function translate() {
    addKey(SUBTITLE_KEY, 'Despesas', LanguageOption.PT_BR)
    addKey(PROPERTIES_TITLE_KEY, 'Editar despesa', LanguageOption.PT_BR)
    addKey(SUBTITLE_KEY, 'Expenses', LanguageOption.EN)
    addKey(PROPERTIES_TITLE_KEY, 'Edit expense', LanguageOption.EN)
  }

  const handleDeleteClick = async (index: number) => {
    const wasDeleted: boolean = await handleDELETE(EXPENSES_ENDPOINT + '/' + index)

    if (wasDeleted)
      deleteFinancial(index)
  }

  const handleEditClick = (expense: Expense) => {
    openModal(getValue(PROPERTIES_TITLE_KEY), () => expenseEditContent(expense), (item: unknown) => handleEditExpense(item, expense), true)
  }

  const handleEditExpense = async (item: unknown, expense: Expense) => {
    if (item == null || typeof item !== 'object')
      return

    let shouldSend: boolean = false
    const request: ExpenseRequest = {}

    if ('value' in item && item.value != null) {
      shouldSend = true
      request.value = item.value as number
    }

    if ('categories' in item && item.categories != null && Array.isArray(item.categories)) {
      shouldSend = true
      request.categoryIds = item.categories.filter(item => !item.disabled).map(item => item.id)
    }

    if (shouldSend) {
      request.date = new Date().toISOString()
      const response = await handlePUT(EXPENSES_ENDPOINT + '/' + expense.id, request)

      if (response != null) {
        const categoryList: Category[] = []
        response.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))
        editFinancial(response.id, new Expense(response.id, response.value, response.dates, categoryList, language))
      }
    }
  }

  const expenseEditContent = (expense: Expense) => {
    const tags: Array<Tag> = Category.getTagList(expense.categories, true)
    return <ExpenseConfiguration
      oldValue={expense.value}
      oldCategories={tags}
      enabledVerify={(item: ExpenseVerifyData) => expense.value != item.value || !Tag.sameTagList(tags, item.tags)}
    />
  }

  useEffect(() => {
    translate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTagList(Category.getTagList(categoriesList, true))
    setFilterList(Category.getTagList(categoriesList, true))
  }, [categoriesList])

  return <main style={styles.page}>
    <Text noWrap textTag={TextTag.H1} color={getSideColor(total)}>{getRealString(total, language)}</Text>
    <Text noWrap textTag={TextTag.H3}>{getValue(SUBTITLE_KEY)}</Text>

    <ExpenseUI
      hasAddButton
      tagList={tagList}
      setTagList={setTagList}
    />

    <FilterList
      style={styles.filterContainer}
      tagList={filterList}
      setTagList={setFilterList}
      listToFilter={financialList}
      setter={setFilteredexpenses}
      filterCondition={(item: Expense, category: Tag): boolean => item.isCategory(category.id)}
    />

    <div style={styles.scrollList}>
      {filteredexpenses != null && filteredexpenses.map(item => {
        return <ThemeCard
          key={item.id}
          id={item.id}
          title={item.asText}
          categories={item.categories}
          editClickHandle={() => handleEditClick(item)}
          deleteClickHandle={handleDeleteClick}
          date={item.lastDate}
        />
      })}
    </div>
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '0em 1em 1em 1rem',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    boxSizing: 'border-box',
  },
  filterContainer: {
    marginTop: '1.2em',
  },
  scrollList: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxSizing: 'border-box',
    gap: '0.7em',
    marginTop: '0.3em',
  }
}

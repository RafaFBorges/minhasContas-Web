'use client'

import React, { useEffect, useState } from 'react'

import {
  CATEGORIES_ENDPOINT,
  EXPENSES_ENDPOINT,
  handleDELETE,
  handleGET,
  handlePUT
} from '@/comunication/ApiResthandler'
import { ExpenseRequest, ExpenseResponse } from '@/comunication/expense'
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


export default function Home() {
  const SUBTITLE_KEY = 'Home.Subtitle'
  const PROPERTIES_TITLE_KEY = 'Home.PropertiesTitle'

  const [total, setTotal] = useState<number>(0)
  const [valueList, setValueList] = useState<Expense[]>([])
  const [filteredexpenses, setFilteredexpenses] = useState<Expense[]>([])
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [tagList, setTagList] = useState<Array<Tag>>([])
  const [filterList, setFilterList] = useState<Array<Tag>>([])

  const { openModal } = useModal()
  const { addKey, getValue, language } = useTranslate()

  function translate() {
    addKey(SUBTITLE_KEY, 'Despesas', LanguageOption.PT_BR)
    addKey(PROPERTIES_TITLE_KEY, 'Editar despesa', LanguageOption.PT_BR)
    addKey(SUBTITLE_KEY, 'Expenses', LanguageOption.EN)
    addKey(PROPERTIES_TITLE_KEY, 'Edit expense', LanguageOption.EN)
  }

  const handleDeleteClick = async (index: number) => {
    const wasDeleted: boolean = await handleDELETE(EXPENSES_ENDPOINT + '/' + index)
    if (wasDeleted)
      setValueList(valueList.filter(expense => expense.id !== index))
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

        setValueList(valueList.map(item => {
          return (item.id == response.id)
            ? new Expense(response.id, response.value, response.dates, categoryList, language)
            : item
        }))
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

  const handleEditClick = (expense: Expense) => {
    openModal(getValue(PROPERTIES_TITLE_KEY), () => expenseEditContent(expense), (item: unknown) => handleEditExpense(item, expense), true)
  }

  async function SyncExpenses() {
    try {
      console.log("HOME.useEffect : [initial load] fetching expenses")

      const serverExpensesList: Promise<ExpenseResponse[]> = await handleGET(EXPENSES_ENDPOINT)

      if (!(serverExpensesList != null) || !Array.isArray(serverExpensesList))
        throw Error('Invalid Expense response')

      let total: number = 0
      const expensesList: Expense[] = []
      serverExpensesList.forEach(expense => {
        const categoryList: Category[] = []
        expense.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))
        expensesList.push(new Expense(expense.id, expense.value, expense.dates, categoryList, language))
        total += expense.value
      })

      setValueList(expensesList)
      setTotal(total)
    } catch (err) {
      console.error("HOME.useEffect.SyncExpenses : [Error] erro=", err)
    }
  }

  async function SyncCategories() {
    try {
      console.log("HOME.useEffect : [initial load] fetching categories")

      const serverCategoriesList: Promise<CategoryResponse[]> = await handleGET(CATEGORIES_ENDPOINT)

      if (!(serverCategoriesList != null) || !Array.isArray(serverCategoriesList))
        throw Error('Invalid Category response')

      Category.clearCategories()
      serverCategoriesList.forEach(category => Category.addCategory(new Category(category.id, category.owner, category.name, category.dates)))
      setCategoriesList(Category.Categories)
    } catch (err) {
      console.error("HOME.useEffect.SyncCategories : [Error] erro=", err)
    }
  }

  useEffect(() => {
    translate()
    SyncExpenses()
    SyncCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let total: number = 0
    valueList.forEach(expense => total += expense.value)
    setTotal(total)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueList])

  useEffect(() => {
    const expensesList: Expense[] = []
    valueList.forEach(expense => expensesList.push(new Expense(expense.id, expense.value, expense.datesList, expense.categories, language)))
    setValueList(expensesList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  useEffect(() => {
    setTagList(Category.getTagList(categoriesList, true))
    setFilterList(Category.getTagList(categoriesList, true))
  }, [categoriesList])

  return <main style={styles.page}>
    <Text textTag={TextTag.H1} color={getSideColor(total)}>{getRealString(total, language)}</Text>
    <Text textTag={TextTag.H3}>{getValue(SUBTITLE_KEY)}</Text>

    <ExpenseUI
      hasAddButton
      tagList={tagList}
      setTagList={setTagList}
      setValueList={(item: Expense) => setValueList([...valueList, item])}
      setCategoriesList={setCategoriesList}
    />

    <FilterList
      style={styles.filterContainer}
      tagList={filterList}
      setTagList={setFilterList}
      listToFilter={valueList}
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

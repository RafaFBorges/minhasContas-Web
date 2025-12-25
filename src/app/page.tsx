'use client'

import React, { useEffect, useState } from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import { EXPENSES_ENDPOINT, handleDELETE, handleGET, handlePOST, handlePUT } from '@/comunication/ApiResthandler'
import { ExpenseResponse } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import ThemeCard from '../../components/themeCard'
import { useModal } from '../../utils/hook/modalHook'
import ExpenseConfiguration, { ExpenseVerifyData } from './ExpenseConfiguration'
import ThemeButton from '../../components/themeButton'
import Text, { TextTag } from '../../components/text'
import Spin from '../../components/spin'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'
import { Category } from '@/domain/Category'
import { CategoryResponse } from '@/comunication/category'
import { Tag } from '@/domain/Tag'


export default function Home() {
  const TITLE_KEY = 'Home.Title'
  const SUBTITLE_KEY = 'Home.Subtitle'
  const PROPERTIES_TITLE_KEY = 'Home.PropertiesTitle'

  const [value, setValue] = useState<number>(0)
  const [valueList, setValueList] = useState<Expense[]>([])

  const { openModal } = useModal()
  const { addKey, getValue, language } = useTranslate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  function translate() {
    addKey(TITLE_KEY, 'Minhas Contas', LanguageOption.PT_BR)
    addKey(SUBTITLE_KEY, 'Despesas', LanguageOption.PT_BR)
    addKey(PROPERTIES_TITLE_KEY, 'Editar despesa', LanguageOption.PT_BR)
    addKey(TITLE_KEY, 'My Finances', LanguageOption.EN)
    addKey(SUBTITLE_KEY, 'Expenses', LanguageOption.EN)
    addKey(PROPERTIES_TITLE_KEY, 'Edit expense', LanguageOption.EN)
  }

  const handleAddNewClick = async () => {
    const response = await handlePOST(EXPENSES_ENDPOINT, { "value": value, "date": new Date() })

    if (response != null)
      setValueList([...valueList, new Expense(response.id, response.value, response.dates, response.category, language)])
  }

  const handleDeleteClick = async (index: number) => {
    const wasDeleted: boolean = await handleDELETE(EXPENSES_ENDPOINT + '/' + index)
    if (wasDeleted)
      setValueList(valueList.filter(expense => expense.id !== index))
  }

  const handleEditExpense = async (item: unknown, expense: Expense) => {
    if (item != null && typeof item === 'object' && 'value' in item && item['value'] != null) {
      const response = await handlePUT(EXPENSES_ENDPOINT + '/' + expense.id, { "value": item['value'], "date": new Date() })

      if (response != null) {
        expense.value = response.value
        expense.date = response.lastDate
        setValueList([...valueList])
      }
    }
  }

  const expenseEditContent = (expense: Expense) => {
    const tags: Array<Tag> = Category.getTagList(expense.categories)
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

      const expensesList: Expense[] = []
      serverExpensesList.forEach(expense => {
        const categoryList: Category[] = []

        expense.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))
        expensesList.push(new Expense(expense.id, expense.value, expense.dates, categoryList, language))
      })

      setValueList(expensesList)
    } catch (err) {
      console.error("HOME.useEffect : [Error] erro=", err)
    }
  }

  translate()

  useEffect(() => {
    SyncExpenses()
  }, [])

  useEffect(() => {
    const expensesList: Expense[] = []
    valueList.forEach(expense => expensesList.push(new Expense(expense.id, expense.value, expense.datesList, expense.categories, language)))
    setValueList(expensesList)
  }, [language])

  return <main style={styles.page}>
    <Text textTag={TextTag.H1}>{getValue(TITLE_KEY)}</Text>
    <Text textTag={TextTag.H3}>{getValue(SUBTITLE_KEY)}</Text>

    <div style={{ ...styles.flexRow, gap: '1rem' }}>
      <Spin
        name={'expenseValue'}
        value={value}
        changeHandle={handleChange}
        setValueHandle={setValue}
      />

      <ThemeButton
        clickHandle={handleAddNewClick}
        Icon={AddIcon}
      />
    </div>
    {valueList != null && valueList.map(item => {
      return <ThemeCard
        style={styles.cardContainer}
        key={item.id}
        id={item.id}
        title={item.asText}
        categories={item.categories}
        editClickHandle={() => handleEditClick(item)}
        deleteClickHandle={handleDeleteClick}
        date={item.lastDate}
      />
    })}
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '0em 2em 2em 2rem',
    fontFamily: 'sans-serif',
  },
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '350px',
    boxSizing: 'border-box',
  },
  cardContainer: {
    marginTop: '1.2rem',
  }
}

'use client'

import React, { useEffect, useState } from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import { EXPENSES_ENDPOINT, handleDELETE, handleGET, handlePOST, handlePUT } from '@/comunication/ApiResthandler'
import { ExpenseResponse } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import ThemeCard from '../../components/themeCard'
import { useModal } from '../../utils/hook/modalHook'
import ExpenseConfiguration from './ExpenseConfiguration'
import ThemeButton from '../../components/themeButton'
import Text, { TextTag } from '../../components/text'
import Spin from '../../components/spin'
import { LanguageOption, useTranslate } from '../../utils/hook/translateHook'


export default function Home() {
  const [value, setValue] = useState<number>(0)
  const [valueList, setValueList] = useState<Expense[]>([])

  const { openModal } = useModal()
  const { addKey, getValue } = useTranslate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
  }

  function translate() {
    addKey('title', 'Minhas Contas', LanguageOption.PT_BR)
    addKey('subTitle', 'Despesas', LanguageOption.PT_BR)
    addKey('title', 'My Finances', LanguageOption.EN)
    addKey('subTitle', 'Expenses', LanguageOption.EN)
  }

  const handleAddNewClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const response = await handlePOST(EXPENSES_ENDPOINT, { "value": value, "date": new Date() })

    if (response != null)
      setValueList([...valueList, new Expense(response.id, response.value, response.dates)])
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
    return <ExpenseConfiguration
      oldValue={expense.value}
      enabledVerify={(item: number) => expense.value != item}
    />
  }

  const handleEditClick = (expense: Expense) => {
    openModal('Editar despesa', () => expenseEditContent(expense), (item: unknown) => handleEditExpense(item, expense), true)
  }

  async function SyncExpenses() {
    try {
      console.log("HOME.useEffect : [initial load] fetching expenses")

      const serverExpensesList: Promise<ExpenseResponse[]> = await handleGET(EXPENSES_ENDPOINT)

      if (!(serverExpensesList != null) || !Array.isArray(serverExpensesList))
        throw Error('Invalid Expense response')

      const expensesList: Expense[] = []
      serverExpensesList.forEach(expense => expensesList.push(new Expense(expense.id, expense.value, expense.dates)))
      setValueList(expensesList)
    } catch (err) {
      console.error("HOME.useEffect : [Error] erro=", err)
    }
  }

  translate()

  useEffect(() => {
    SyncExpenses()
  }, [])

  return <main style={styles.page}>
    <Text textTag={TextTag.H1}>{getValue('title')}</Text>
    <Text textTag={TextTag.H3}>{getValue('subTitle')}</Text>

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
        key={item.id}
        id={item.id}
        title={item.asText}
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
}
'use client'

import React, { useEffect, useState } from 'react'

import { FaPlus as AddIcon } from 'react-icons/fa'

import { EXPENSES_ENDPOINT, handleDELETE, handleGET, handlePOST } from '@/comunication/ApiResthandler'
import { ExpenseResponse } from '@/comunication/expense'
import { Expense } from '@/domain/Expense'
import StyledButton from '../../components/button'
import Card from '../../components/card'
import StyledInput from '../../components/input'


export default function Home() {
  const [value, setValue] = useState<number>(0)
  const [valueList, setValueList] = useState<Expense[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed: number = parseFloat(e.target.value)

    if (!isNaN(parsed))
      setValue(parsed)
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

  useEffect(() => {
    SyncExpenses()
  }, [])

  return <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>Minhas Contas</h1>
    <h3>Despesas</h3>

    <div style={styles.flexRow}>
      <StyledInput
        type={'number'}
        name={'expenseValue'}
        value={value}
        changeHandle={handleChange}
      />

      <StyledButton
        clickHandle={handleAddNewClick}
        Icon={AddIcon}
      />
    </div>

    {valueList != null && valueList.map(item => {
      return <Card
        key={item.id}
        id={item.id}
        title={item.asText}
        deleteClickHandle={handleDeleteClick}
        date={item.lastDate}
      />
    })}
  </main>
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
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
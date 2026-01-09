"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

import { Expense } from '@/domain/Expense'
import { useTranslate } from './translateHook'
import { Category } from '@/domain/Category'
import { CategoryResponse } from '@/comunication/category'
import { CATEGORIES_ENDPOINT, EXPENSES_ENDPOINT, handleGET } from '@/comunication/ApiResthandler'
import { ExpenseResponse } from '@/comunication/expense'


interface UserContextType {
  financialList: Expense[];
  categoriesList: Category[];
  total: number;
  deleteFinancial: (index: number) => void;
  editFinancial: (id: number, expense: Expense) => void;
  replaceFinancial: (list: Expense[]) => void;
  addFinancial: (item: Expense) => void;
  replaceCategories: (list: Category[]) => void;
  replaceTotal: (value: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context)
    throw new Error('useTranslate must be used within a UserProvider')

  return context
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [financialList, setFinancialList] = useState<Expense[]>([])
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [total, setTotal] = useState<number>(0)

  const { language } = useTranslate()

  const deleteFinancial = (index: number) => {
    setFinancialList(financialList.filter(expense => {
      const shouldStayInFilter: boolean = expense.id !== index
      if (!shouldStayInFilter) {
        console.log('deleteFinancial > value=' + expense.value)
        setTotal(total - expense.value)
      }

      return shouldStayInFilter
    }))
  }

  const editFinancial = (id: number, expense: Expense) => {
    setFinancialList(financialList.map(item => {
      if (item.id == id) {
        setTotal(total - (item.value - expense.value))
        return expense
      }

      return item
    }))
  }

  const addFinancial = (item: Expense) => {
    setFinancialList([...financialList, item])
    setTotal(total + item.value)
  }

  const replaceFinancial = (list: Expense[]) => setFinancialList(list)
  const replaceCategories = (list: Category[]) => setCategoriesList(list)
  const replaceTotal = (value: number) => setTotal(value)

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

      setFinancialList(expensesList)
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
      replaceCategories(Category.Categories)
    } catch (err) {
      console.error("HOME.useEffect.SyncCategories : [Error] erro=", err)
    }
  }

  useEffect(() => {
    SyncExpenses()
    SyncCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const expensesList: Expense[] = []
    financialList.forEach(expense => expensesList.push(new Expense(expense.id, expense.value, expense.datesList, expense.categories, language)))
    setFinancialList(expensesList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return <UserContext.Provider
    value={{
      financialList,
      categoriesList,
      deleteFinancial,
      editFinancial,
      replaceFinancial,
      addFinancial,
      replaceCategories,
      total,
      replaceTotal
    }}
  >
    {children}
  </UserContext.Provider>
}

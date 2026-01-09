"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

import { Expense } from '@/domain/Expense'
import { useTranslate } from './translateHook'
import { Category } from '@/domain/Category'
import { CategoryResponse, SyncCategories } from '@/comunication/category'
import { ExpenseResponse, SyncExpenses } from '@/comunication/expense'


interface UserContextType {
  financialList: Expense[];
  categoriesList: Category[];
  total: number;
  deleteFinancial: (index: number) => void;
  editFinancial: (id: number, expense: Expense) => void;
  editFinancialResponse: (response: ExpenseResponse) => void;
  replaceFinancial: (list: ExpenseResponse[]) => void;
  addFinancial: (item: Expense) => void;
  replaceCategories: (list: CategoryResponse[]) => void;
  replaceTotal: (value: number) => void
  addCategory: (category: Category) => void;
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

  const editFinancialResponse = (response: ExpenseResponse) => {
    const categoryList: Category[] = []
    response.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))
    editFinancial(response.id, new Expense(response.id, response.value, response.dates, categoryList, language))
  }

  const addFinancial = (item: Expense) => {
    setFinancialList([...financialList, item])
    setTotal(total + item.value)
  }

  const addCategory = (category: Category) => {
    Category.addCategory(category)
    setCategoriesList(Category.Categories)
  }

  const replaceFinancial = (list: ExpenseResponse[]) => {
    let total: number = 0
    const expensesList: Expense[] = []
    list.forEach(expense => {
      const categoryList: Category[] = []
      expense.categories.forEach((category: CategoryResponse) => categoryList.push(new Category(category.id, category.owner, category.name)))
      expensesList.push(new Expense(expense.id, expense.value, expense.dates, categoryList, language))
      total += expense.value
    })

    setFinancialList(expensesList)
    setTotal(total)
  }
  const replaceTotal = (value: number) => setTotal(value)

  const replaceCategories = (list: CategoryResponse[]) => {
    Category.clearCategories()
    list.forEach(category => Category.addCategory(new Category(category.id, category.owner, category.name, category.date)))
    setCategoriesList(Category.Categories)
  }

  useEffect(() => {
    SyncExpenses(replaceFinancial)
    SyncCategories(replaceCategories)
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
      editFinancialResponse,
      replaceFinancial,
      addFinancial,
      addCategory,
      replaceCategories,
      total,
      replaceTotal,
    }}
  >
    {children}
  </UserContext.Provider>
}

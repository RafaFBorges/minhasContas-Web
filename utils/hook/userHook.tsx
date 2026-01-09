"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

import { Expense } from '@/domain/Expense'
import { useTranslate } from './translateHook';
import { Category } from '@/domain/Category';

interface UserContextType {
  financialList: Expense[];
  categoriesList: Category[];
  deleteFinancial: (index: number) => void;
  editFinancial: (id: number, expense: Expense) => void;
  replaceFinancial: (list: Expense[]) => void;
  addFinancial: (item: Expense) => void;
  replaceCategories: (list: Category[]) => void;
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

  const { language } = useTranslate()

  const deleteFinancial = (index: number) => setFinancialList(financialList.filter(expense => expense.id !== index))
  const editFinancial = (id: number, expense: Expense) => setFinancialList(financialList.map(item => (item.id == id) ? expense : item))
  const replaceFinancial = (list: Expense[]) => setFinancialList(list)
  const addFinancial = (item: Expense) => setFinancialList([...financialList, item])
  const replaceCategories = (list: Category[]) => setCategoriesList(list)

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
    }}
  >
    {children}
  </UserContext.Provider>
}

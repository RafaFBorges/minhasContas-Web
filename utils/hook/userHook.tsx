"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

import { Expense } from '@/domain/Expense'
import { useTranslate } from './translateHook'
import { Category } from '@/domain/Category'
import { CategoryResponse, SyncCategories } from '@/comunication/category'
import { ExpenseResponse, SyncExpenses } from '@/comunication/expense'
import { ExpenseDisabledDictionary, getObjectCookie, saveObjectCookie } from '@/app/actions/cookiesManager'
import { User } from '@/domain/User'
import { USER_COOKIE_KEY } from '../DataConstants'


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
  disabledCategoriesDict: ExpenseDisabledDictionary;
  filterSelection: string;
  userInfo: User;
  setPlataformUser: (id: number, name: string, user: string, token: string, expirationTime: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function useUser() {
  const context = useContext(UserContext)
  if (!context)
    throw new Error('useTranslate must be used within a UserProvider')

  return context
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userInfo, setUserInfo] = useState<User>(new User())
  const [financialList, setFinancialList] = useState<Expense[]>([])
  const [categoriesList, setCategoriesList] = useState<Category[]>([])
  const [total, setTotal] = useState<number>(0)
  const [disabledCategoriesDict, setDisabledCategoriesDict] = useState<ExpenseDisabledDictionary>({})
  const [filterSelection, setFilterSelection] = useState<string>('')

  const { language } = useTranslate()

  async function loadSavedUser() {
    const savedUser: User | null = User.fromIUser(await getObjectCookie(USER_COOKIE_KEY))

    if (savedUser != null && savedUser.isValidToken) {
      setUserInfo(savedUser)
      console.log('UserProvider.loadSavedUser > user=' + savedUser.id)
    }
  }

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

  const replaceDisabledCategoriesDict = (dict: ExpenseDisabledDictionary) => {
    setDisabledCategoriesDict(dict)
  }

  const replaceFilterSelection = (filter: string) => {
    setFilterSelection(filter)
  }

  const setPlataformUser = async (id: number = -1, name: string = '', user: string = '', token: string = '', expirationTime: string = '') => {
    const newUser: User = new User(id, name, user, token, expirationTime)

    if (newUser != null && newUser.isValidToken) {
      setUserInfo(newUser)
      await saveObjectCookie(USER_COOKIE_KEY, newUser.object)
    }
  }

  const logout = async () => {
    setUserInfo(new User())
    await saveObjectCookie(USER_COOKIE_KEY, null)
  }

  useEffect(() => {
    loadSavedUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('UserProvider.useEffect[userInfo] > isValidToken=' + userInfo.isValidToken + ' user=' + JSON.stringify(userInfo, null, 2))

    if (userInfo && userInfo.isValidToken) {
      SyncExpenses(replaceFinancial)
      SyncCategories(replaceCategories, replaceDisabledCategoriesDict, replaceFilterSelection)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

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
      disabledCategoriesDict,
      filterSelection,
      userInfo,
      setPlataformUser,
      logout
    }}
  >
    {children}
  </UserContext.Provider>
}

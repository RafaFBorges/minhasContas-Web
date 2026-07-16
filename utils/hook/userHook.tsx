"use client"

import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react'

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

  const hasSyncedCategoriesRef = useRef(false)
  const hasSyncedExpensesRef = useRef(false)

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
    let categoryList: Category[] = []
    if (response.categoryIds)
      categoryList = categoriesList.filter(c => response.categoryIds.includes(c.id))

    editFinancial(response.id, new Expense(response.id, response.value, [response.date], categoryList, language))
  }

  const addFinancial = (item: Expense) => {
    setFinancialList([...financialList, item])
    setTotal(total + item.value)
  }

  const addCategory = (category: Category) => {
    Category.addCategory(category)
    setCategoriesList(Category.Categories)

    if (Expense.CategoryAdded(category))
      setFinancialList([...financialList])
  }

  const replaceFinancial = (list: ExpenseResponse[]) => {
    let total: number = 0
    const expensesList: Expense[] = []
    list.forEach(expense => {
      const categoryList: Category[] = []
      const laterReplace: number[] = []
      if (expense.categoryIds)
        expense.categoryIds.forEach(id => {
          const found = categoriesList.find(c => c.id === id)
          if (found)
            categoryList.push(found)
          else
            laterReplace.push(id)
        })

      expensesList.push(new Expense(expense.id, expense.value, [expense.date], categoryList, language))
      total += expense.value

      if (laterReplace)
        Expense.addToLater(expense.id, laterReplace)
    })

    setFinancialList(expensesList)
    setTotal(total)
  }

  const replaceTotal = (value: number) => setTotal(value)

  const replaceCategories = (list: CategoryResponse[]) => {
    Category.clearCategories()

    list.forEach(category => {
      const newCategory: Category = new Category(category.id, category.owner, category.name, category.date)
      Category.addCategory(newCategory)
      Expense.CategoryAdded(newCategory)
    })

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
    console.log('UserProvider.logout > Logging out user id=' + userInfo.id)
    setUserInfo(new User())
    await saveObjectCookie(USER_COOKIE_KEY, null, true)
  }

  useEffect(() => {
    loadSavedUser()
  }, [])

  useEffect(() => {
    if (userInfo.isValidToken && !hasSyncedCategoriesRef.current) {
      console.log('UserProvider.useEffect[userInfo] > SyncCategories')
      SyncCategories(replaceCategories, replaceDisabledCategoriesDict, replaceFilterSelection, userInfo.id, userInfo.token)
      hasSyncedCategoriesRef.current = true
    }
  }, [userInfo])

  useEffect(() => {
    if (userInfo.isValidToken && !hasSyncedExpensesRef.current) {
      console.log('UserProvider.useEffect[categoriesList] > SyncExpenses')
      SyncExpenses(replaceFinancial, userInfo.id, userInfo.token)
      hasSyncedExpensesRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesList])

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

import { EXPENSES_ENDPOINT, handleGET, handlePUT } from './ApiResthandler'
import { CategoryResponse } from './category'
import { Expense } from '@/domain/Expense'

export interface ExpenseResponse {
  id: number;
  value: number;
  dates: string[];
  lastDate: string;
  categories: CategoryResponse[];
}

export interface ExpenseRequest {
  value?: number;
  date?: string;
  categoryIds?: number[];
}

export const handleEditExpense = async (item: unknown, expense: Expense, populate: (response: ExpenseResponse) => void) => {

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

  if (shouldSend && populate != null) {
    request.date = new Date().toISOString()
    const response = await handlePUT(EXPENSES_ENDPOINT + '/' + expense.id, request)

    if (populate != null)
      populate(response)
  }
}

export async function SyncExpenses(populate: (list: ExpenseResponse[]) => void) {
  try {
    console.log("HOME.useEffect : [initial load] fetching expenses")

    const serverExpensesList: Promise<ExpenseResponse[]> = await handleGET(EXPENSES_ENDPOINT)

    if (!(serverExpensesList != null) || !Array.isArray(serverExpensesList))
      throw Error('Invalid Expense response')

    if (populate != null)
      populate(serverExpensesList)
  } catch (err) {
    console.error("HOME.useEffect.SyncExpenses : [Error] erro=", err)
  }
}

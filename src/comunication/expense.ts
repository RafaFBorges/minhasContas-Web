import { EXPENSES_ENDPOINT, USER_ENDPOINT, handleGET, handlePUT } from './ApiResthandler'
import { Expense } from '@/domain/Expense'

export interface ExpenseResponse {
  id: number;
  value: number;
  date: string;
  lastDate: string;
  categoryIds: number[];
}

export interface ExpenseRequest {
  owner?: number;
  value?: number;
  date?: string;
  categoryIds?: number[];
}

export const handleEditExpense = async (item: unknown, expense: Expense, populate: (response: ExpenseResponse) => void, token: string) => {

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
    const response = await handlePUT<ExpenseResponse>(EXPENSES_ENDPOINT + '/' + expense.id, request, token)

    if (populate != null)
      populate(response)
  }
}

export async function SyncExpenses(populate: (list: ExpenseResponse[]) => void, userId: number, token: string) {
  try {
    console.log("HOME.useEffect : [initial load] fetching expenses")

    const serverExpensesList: ExpenseResponse[] = await handleGET(EXPENSES_ENDPOINT + '/' + USER_ENDPOINT + '/' + userId, token)

    if (!(serverExpensesList != null) || !Array.isArray(serverExpensesList))
      throw Error('Invalid Expense response')

    if (populate != null)
      populate(serverExpensesList)
  } catch (err) {
    console.error("HOME.useEffect.SyncExpenses : [Error] erro=", err)
  }
}

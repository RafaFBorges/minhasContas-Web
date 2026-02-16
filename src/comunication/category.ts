import { ExpenseDisabledDictionary, getExpenseDisabledCookie } from '@/app/actions/cookiesManager';
import { CATEGORIES_ENDPOINT, handleGET } from './ApiResthandler'

export interface CategoryResponse {
  id: number;
  name: string;
  date: string;
  owner: number;
}

export interface CategoryRequest {
  name: string;
  owner?: number;
  date?: string;
}

export async function SyncCategories(setCategories: (list: CategoryResponse[]) => void, setDisasbledCategories: (dict: ExpenseDisabledDictionary) => void) {
  try {
    // Cache da configuração inicial
    console.log("SyncCategories : load cached initial Categories configuration")
    const disabledCategoriesDict: ExpenseDisabledDictionary = await getExpenseDisabledCookie()

    if (setDisasbledCategories != null)
      setDisasbledCategories(disabledCategoriesDict)

    console.log("SyncCategories : [initial load] fetching categories")

    const serverCategoriesList: Promise<CategoryResponse[]> = await handleGET(CATEGORIES_ENDPOINT)

    if (!(serverCategoriesList != null) || !Array.isArray(serverCategoriesList))
      throw Error('Invalid Category response')

    if (setCategories != null)
      setCategories(serverCategoriesList)
  } catch (err) {
    console.error("SyncCategories : [Error] erro=", err)
  }
}

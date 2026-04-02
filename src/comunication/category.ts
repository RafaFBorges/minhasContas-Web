import getCookie, { ExpenseDisabledDictionary, getExpenseDisabledCookie } from '@/app/actions/cookiesManager'
import { CATEGORIES_ENDPOINT, handleGET } from './ApiResthandler'
import { Filter_SELECTION_KEY } from '../../utils/DataConstants'

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

export async function SyncCategories(setCategories: (list: CategoryResponse[]) => void, setDisasbledCategories: (dict: ExpenseDisabledDictionary) => void, setFilterSelection: (filter: string) => void) {
  try {
    // Cache da configuração inicial
    console.log("SyncCategories : load cached initial Categories configuration")

    if (setDisasbledCategories != null) {
      const disabledCategoriesDict: ExpenseDisabledDictionary = await getExpenseDisabledCookie()
      setDisasbledCategories(disabledCategoriesDict)
    }

    if (setFilterSelection != null) {
      const filter: string | undefined = await getCookie(Filter_SELECTION_KEY)

      if (filter != null)
        setFilterSelection(filter)
    }

    console.log("SyncCategories : [initial load] fetching categories")

    const serverCategoriesList: Promise<CategoryResponse[]> = await handleGET(CATEGORIES_ENDPOINT)

    if ((serverCategoriesList == null) || !Array.isArray(serverCategoriesList))
      throw Error('Invalid Category response')

    if (setCategories != null)
      setCategories(serverCategoriesList)
  } catch (err) {
    console.error("SyncCategories : [Error] erro=", err)
  }
}

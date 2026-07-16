import getCookie, { ExpenseDisabledDictionary, getExpenseDisabledCookie } from '@/app/actions/cookiesManager'
import { CATEGORIES_ENDPOINT, USER_ENDPOINT, handleGET } from './ApiResthandler'
import { FILTER_SELECTION_KEY } from '../../utils/DataConstants'

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

export async function SyncCategories(setCategories: (list: CategoryResponse[]) => void, setDisasbledCategories: (dict: ExpenseDisabledDictionary) => void, setFilterSelection: (filter: string) => void, userId: number, token: string) {
  try {
    console.log("SyncCategories : [initial load] fetching categories")

    const serverCategoriesList: CategoryResponse[] = await handleGET<CategoryResponse[]>(CATEGORIES_ENDPOINT + '/' + USER_ENDPOINT + '/' + userId, token)

    if ((serverCategoriesList == null) || !Array.isArray(serverCategoriesList))
      throw Error('Invalid Category response')

    if (setCategories != null)
      setCategories(serverCategoriesList)

    console.log("SyncCategories : [complete]")

    setTimeout(async () => {
      console.log("SyncCategories : [async] loading disabled categories cookie")
      if (setDisasbledCategories != null) {
        const disabledCategoriesDict: ExpenseDisabledDictionary = await getExpenseDisabledCookie()
        setDisasbledCategories(disabledCategoriesDict)
      }
    }, 0)

    setTimeout(async () => {
      console.log("SyncCategories : [async] loading filter selection cookie")
      if (setFilterSelection != null) {
        const filter: string | undefined = await getCookie(FILTER_SELECTION_KEY)

        if (filter != null)
          setFilterSelection(filter)
      }
    }, 0)
  } catch (err) {
    console.error("SyncCategories : [Error] erro=", err)
  }
}

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

export async function SyncCategories(setCategories: (list: CategoryResponse[]) => void) {
  try {
    console.log("HOME.useEffect : [initial load] fetching categories")

    const serverCategoriesList: Promise<CategoryResponse[]> = await handleGET(CATEGORIES_ENDPOINT)

    if (!(serverCategoriesList != null) || !Array.isArray(serverCategoriesList))
      throw Error('Invalid Category response')

    if (setCategories != null)
      setCategories(serverCategoriesList)
  } catch (err) {
    console.error("HOME.useEffect.SyncCategories : [Error] erro=", err)
  }
}

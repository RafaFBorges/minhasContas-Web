import { Tag } from "./Tag"

export class Category {
  private static __categories: Category[] = []
  private static __categoriesDict: Record<number, number> = {}

  public static get Categories(): Category[] {
    return [...this.__categories]
  }

  public static clearCategories(): void {
    this.__categories = []
    this.__categoriesDict = {}
  }

  public static addCategory(newCategory: Category): void {
    this.__categoriesDict[newCategory.id] = this.__categories.length
    this.__categories.push(newCategory)
  }

  static getTagList(categoryList: Array<Category> | undefined, isEnabledCategories: boolean = false): Array<Tag> {
    if (categoryList == null)
      return []

    if (!isEnabledCategories)
      return categoryList.map(item => new Tag(item.id, item.name, false))

    let missingCategory: Record<number, number> = { ...this.__categoriesDict }
    let newList = categoryList.map(item => {
      delete missingCategory[item.id]
      return new Tag(item.id, item.name, false)
    })
    Object
      .values(missingCategory)
      .forEach(item => newList.splice(item, 0, new Tag(this.__categories[item].id, this.__categories[item].name, true)))

    return newList
  }

  private __id: number
  private __owner: number
  private __name: string
  private __date: Date

  constructor(id: number, owner: number, name: string, date: Date | null = null) {
    this.__id = id
    this.__owner = owner
    this.__name = name
    date == null
      ? this.__date = new Date()
      : this.__date = date
  }

  get id(): number {
    return this.__id
  }

  get owner(): number {
    return this.__owner
  }

  get name(): string {
    return this.__name
  }

  set name(newName: string) {
    this.__name = newName
  }

  set date(newDate: Date) {
    let newValue: string | Date = newDate
    if (typeof newDate === 'string')
      newValue = new Date(newValue)

    this.__date = newValue
  }
}

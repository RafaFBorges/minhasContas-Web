import { Tag } from "./Tag"

export class Category {
  public static Categories: Category[] = []

  static getTagList(categoryList: Array<Category> | undefined): Array<Tag> {
    if (categoryList == null)
      return []

    return categoryList.map(item => new Tag(item.id, item.name, true))
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

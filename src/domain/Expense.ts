import { getRealString } from "../../utils/financialUtils"
import { isValidLanguage, LanguageOption } from "../../utils/hook/translateHook"
import { Category } from "./Category"

export class Expense {
  private __id: number
  private __value: number
  private __dates: Array<Date>
  private __categories: Array<Category>
  private __format: LanguageOption

  constructor(id: number, value: number, date: Array<Date> = [], categories: Array<Category> = [], format: LanguageOption = LanguageOption.PT_BR) {
    this.__id = id
    this.__value = value
    this.__dates = []
    this.__categories = categories
    this.__format = format

    date.forEach(item => this.__dates.push(new Date(item)))
  }

  get id(): number {
    return this.__id
  }

  get value(): number {
    return this.__value
  }

  set value(newValue: number) {
    this.__value = newValue
  }

  get categories(): Array<Category> {
    return this.__categories
  }

  get asText(): string {
    return this.__value != null
      ? getRealString(this.__value, this.__format)
      : ''
  }

  set format(newFormat: LanguageOption) {
    if (isValidLanguage(newFormat))
      this.__format = newFormat
  }

  set date(newDate: Date) {
    let newValue: string | Date = newDate
    if (typeof newDate === 'string')
      newValue = new Date(newValue)

    this.__dates.push(newValue)
  }

  get datesList(): Array<Date> {
    return this.__dates
  }

  get lastDate(): string {
    if (this.__dates.length <= 0 || this.__dates[this.__dates.length - 1] == null)
      return ''

    return this.__dates[this.__dates.length - 1].toLocaleDateString(this.__format)
  }

  public isCategory(id: number) {
    for (let i = 0; i < this.__categories.length; i++)
      if (this.__categories[i].id == id)
        return true

    return false
  }
}

import { getRealString } from "../../utils/financialUtils"
import { isValidLanguage, LanguageOption } from "../../utils/hook/translateHook"
import { Category } from "./Category"

export class Expense {
  private static __expenses: Expense[] = []
  private static __expensesDict: Record<number, number> = {}
  private static __laterReplace: Record<number, number[]> = {}

  public static clearExpenses(): void {
    this.__expenses = []
    this.__expensesDict = {}
  }

  public static addToLater(expenseId: number, categoyList: number[]): void {
    for (const category of categoyList) {
      if (this.__laterReplace[category] == null)
        this.__laterReplace[category] = [];
      this.__laterReplace[category].push(expenseId);
    }
  }

  public static addExpense(newExpense: Expense): void {
    this.__expensesDict[newExpense.id] = this.__expenses.length
    this.__expenses.push(newExpense)
  }

  public static CategoryAdded(category: Category): boolean {
    const list = this.__laterReplace[category.id]
    if (!list || list.length === 0)
      return false

    let updated = false
    for (const expenseId of list) {
      let expenseIndex: number = this.__expensesDict[expenseId]
      if (expenseIndex != null && 0 <= expenseIndex && expenseIndex < this.__expenses.length && this.__expenses[expenseIndex] != null) {
        this.__expenses[expenseIndex].addCategory(category)
        updated = true
      }
    }

    delete this.__laterReplace[category.id]
    return updated
  }

  private __id: number
  private __value: number
  private __dates: Array<Date>
  private __categories: Array<Category>
  private __format: LanguageOption

  constructor(id: number, value: number, date: Array<Date> | Array<string> = [], categories: Array<Category> = [], format: LanguageOption = LanguageOption.PT_BR) {
    this.__id = id
    this.__value = value
    this.__dates = []
    this.__categories = categories
    this.__format = format

    date.forEach(item => this.__dates.push(new Date(item)))

    Expense.addExpense(this)
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

  public addCategory(category: Category): boolean {
    const added: boolean = (category != null) && (this.__categories != null)
    if (added)
      this.__categories.push(category)

    return added
  }
}

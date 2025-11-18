export class Expense {
  private __id: number
  private __value: number
  private __dates: Array<Date>
  private __category: string

  constructor(id: number, value: number, date: Array<Date> = [], category: string = '') {
    this.__id = id
    this.__value = value
    this.__dates = []
    this.__category = category

    date.forEach(item => { this.__dates.push(new Date(item)) })
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

  get category(): string {
    return this.__category
  }

  get asText(): string {
    return `R$ ${this.__value.toFixed(2)}`
  }

  set date(newDate: Date) {
    let newValue: string | Date = newDate
    if (typeof newDate === 'string')
      newValue = new Date(newValue)

    this.__dates.push(newValue)
  }

  get lastDate(): string {
    if (this.__dates.length <= 0)
      return ''

    return this.__dates[this.__dates.length - 1].toLocaleDateString("pt-BR")
  }
}

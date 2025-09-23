export class Expense {
  private __id: number
  private __value: number
  private __dates: Array<Date>

  constructor(id: number, value: number, date: Array<Date> = []) {
    this.__id = id
    this.__value = value
    this.__dates = []

    date.forEach(item => { this.__dates.push(new Date(item)) })
  }

  get value(): number {
    return this.__value
  }

  set value(newValue: number) {
    this.__value = newValue
  }

  get asText(): string {
    return `R$ ${this.__value.toFixed(2)}`
  }

  set date(newDate: Date) {
    this.__dates.push(newDate)
  }

  get lastDate(): string {
    if (this.__dates.length <= 0)
      return ''

    return this.__dates[this.__dates.length - 1].toLocaleDateString("pt-BR")
  }
}

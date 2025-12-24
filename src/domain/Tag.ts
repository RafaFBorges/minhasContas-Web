export class Tag {
  private __id: number
  private __name: string
  private __disabled: boolean

  constructor(id: number, name: string, disabled: boolean) {
    this.__id = id
    this.__name = name
    this.__disabled = disabled
  }

  get id(): number {
    return this.__id
  }

  get name(): string {
    return this.__name
  }

  get disabled(): boolean {
    return this.__disabled
  }

  set disabled(disabled: boolean) {
    this.__disabled = disabled
  }
}

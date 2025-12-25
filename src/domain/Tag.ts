export class Tag {
  private __id: number
  private __name: string
  private __disabled: boolean

  static sameTagList(listA: Array<Tag>, listB: Array<Tag>): boolean {
    return (listA === listB) || (listA.length == listB.length && listA.every((tag, index) => tag.equals(listB[index])))
  }

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

  public equals(other: unknown): boolean {
    return (this === other) || (other instanceof Tag && this.__id === other.id && this.__name === other.name && this.__disabled === other.disabled)
  }

  public clone(): Tag {
    return new Tag(this.__id, this.__name, this.__disabled)
  }
}

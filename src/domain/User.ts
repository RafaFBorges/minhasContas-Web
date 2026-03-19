export class User {
  private __id: number
  private __name: string
  private __user: string

  constructor(id: number = -1, name: string = '', user: string = '') {
    this.__id = id
    this.__name = name
    this.__user = user
  }

  get id(): number {
    return this.__id
  }

  get name(): string {
    return this.__name
  }

  get user(): string {
    return this.__user
  }

  set id(newId: number) {
    this.__id = newId
  }

  set name(newName: string) {
    this.__name = newName
  }

  set user(newUser: string) {
    this.__user = newUser
  }
}

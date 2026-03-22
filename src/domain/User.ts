export interface IUser {
  id: number
  name: string
  user: string
  token: string
  expirationTime: string
}


export class User {
  private __id: number
  private __name: string
  private __user: string
  private __token: string
  private __expirationTime: string

  static fromIUser(data: IUser | null): User | null {
    if (data && data.id && data.name && data.user && data.token && data.expirationTime)
      return new User(data?.id, data?.name, data?.user, data?.token, data?.expirationTime)

    return null
  }

  constructor(id: number = -1, name: string = '', user: string = '', token: string = '', expirationTime = '') {
    this.__id = id
    this.__name = name
    this.__user = user
    this.__token = token
    this.__expirationTime = expirationTime
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

  get token(): string {
    return this.__token
  }

  get expirationTime(): Date {
    return this.__expirationTime ? new Date(this.__expirationTime) : new Date(0)
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

  set token(newToken: string) {
    this.__token = newToken
  }

  get object(): IUser {
    return {
      id: this.__id,
      name: this.__name,
      user: this.__user,
      token: this.__token,
      expirationTime: this.__expirationTime
    }
  }
}

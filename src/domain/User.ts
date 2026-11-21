export interface IUser {
  id: number
  name: string
  user: string
  role: string
  sessionExpiresAt: string
}

// Dados de exibição de quem está logado. O token não está aqui de propósito: ele fica em cookie HttpOnly
export class User {
  private __id: number
  private __name: string
  private __user: string
  private __role: string
  private __sessionExpiresAt: string

  static fromIUser(data: IUser | null): User | null {
    if (data && data.id && data.name && data.user && data.role && data.sessionExpiresAt)
      return new User(data.id, data.name, data.user, data.role, data.sessionExpiresAt)

    return null
  }

  constructor(id: number = -1, name: string = '', user: string = '', role: string = '', sessionExpiresAt: string = '') {
    this.__id = id
    this.__name = name
    this.__user = user
    this.__role = role
    this.__sessionExpiresAt = sessionExpiresAt
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

  get role(): string {
    return this.__role
  }

  get sessionExpiresAt(): Date {
    return this.__sessionExpiresAt ? new Date(this.__sessionExpiresAt) : new Date(0)
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

  get object(): IUser {
    return {
      id: this.__id,
      name: this.__name,
      user: this.__user,
      role: this.__role,
      sessionExpiresAt: this.__sessionExpiresAt
    }
  }

  // A sessão ainda está dentro do prazo (a validade real é decidida pelo servidor a cada chamada)
  get hasSession(): boolean {
    return this.id > 0 && new Date() < this.sessionExpiresAt
  }
}

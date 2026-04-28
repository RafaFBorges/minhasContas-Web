export enum PopupType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface PopupContextType {
  addPopup: (title: string, message: string, type?: PopupType, duration?: number) => void;
}

export class PopupInfo {
  private __id: number
  private __title: string
  private __message: string
  private __type: PopupType
  private __duration: number
  private __positionIndex: number
  private __exiting: boolean

  constructor(id: number, title: string, message: string, type: PopupType, duration: number, positionIndex: number) {
    this.__id = id
    this.__title = title
    this.__message = message
    this.__type = type
    this.__duration = duration
    this.__positionIndex = positionIndex
    this.__exiting = false
  }

  get id() {
    return this.__id
  }

  get title() {
    return this.__title
  }

  get message() {
    return this.__message
  }

  get type() {
    return this.__type
  }

  get duration() {
    return this.__duration
  }

  get exiting() {
    return this.__exiting
  }

  get positionIndex() {
    return this.__positionIndex
  }

  exit() {
    this.__exiting = true
  }
}

import { PopupPositionType } from "../../utils/hook/usePopup"

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
  private __invisible: boolean
  private __position: PopupPositionType

  constructor(id: number, title: string, message: string, type: PopupType, duration: number, positionIndex: number, position: PopupPositionType, invisible: boolean = false) {
    this.__id = id
    this.__title = title
    this.__message = message
    this.__type = type
    this.__duration = duration
    this.__positionIndex = positionIndex
    this.__exiting = false
    this.__invisible = invisible
    this.__position = position
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

  get position() {
    return this.__position
  }

  get isTop() {
    return this.__position === PopupPositionType.TOP_RIGHT || this.__position === PopupPositionType.TOP_LEFT
  }

  get isBottom() {
    return this.__position === PopupPositionType.BOTTOM_RIGHT || this.__position === PopupPositionType.BOTTOM_LEFT
  }

  get invisible() {
    return this.__invisible
  }

  get positionIndex() {
    return this.__positionIndex
  }

  exit() {
    this.__exiting = true
  }
}

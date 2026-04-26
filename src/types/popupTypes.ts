export enum PopupType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface PopupInfoType {
  id: number;
  title: string;
  message: string;
  type: PopupType;
  duration: number;
}

export interface PopupContextType {
  addPopup: (title: string, message: string, type?: PopupType, duration?: number) => void;
}

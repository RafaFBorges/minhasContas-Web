export default interface ModalContentProps<T> {
  enabledVerify: (((item: T) => boolean) | null);
}

export interface ModalFormProps {
  onAccept: ((item: unknown) => void) | null;
  enabledVerify: boolean;
}
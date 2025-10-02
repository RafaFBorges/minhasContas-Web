export default interface ModalContentProps {
  enabledVerify: (((item: any) => boolean) | null);
}

export interface ModalFormProps {
  onAccept: ((item: any) => void) | null;
  enabledVerify: boolean;
}
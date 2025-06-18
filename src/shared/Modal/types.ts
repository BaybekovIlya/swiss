import { ReactNode } from "react";

export interface IModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  lockScroll?: boolean;
}
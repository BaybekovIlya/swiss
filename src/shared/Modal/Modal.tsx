import { FC, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { IModalProps } from "./types";

const Modal: FC<IModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = "",
  lockScroll = true,
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      if (lockScroll) {
        document.body.classList.add(`${css.lockScroll}`);
      }
    } else {
      dialog.close();
      if(lockScroll) {
        document.body.classList.remove(`${css.lockScroll}`);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose?.();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);

      if (lockScroll) {
        document.body.classList.remove(`${css.lockScroll}`);
      }
    };
  }, [isOpen, closeOnEsc, onClose, lockScroll]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdropClick) return;

    const dialog = modalRef.current;
    if (!dialog) return;

    // Проверяем, что клик был на бэкдроп (область вокруг модального окна)
    const rect = dialog.getBoundingClientRect();
    const isClickOnBackdrop =
      rect.left > e.clientX ||
      rect.right < e.clientX ||
      rect.top > e.clientY ||
      rect.bottom < e.clientY;

    if (isClickOnBackdrop) {
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <dialog
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`${css.modal} ${className}`}
    >
      <div className={css.content}>
        {children}
      </div>
    </dialog>,
    document.body
  );
};

export default Modal;

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

import "./Modal.css";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const sizes = {
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
  };

  const modalSize = sizes[size] || "md";

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="app-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Layer */}
          <div
            className="app-modal-layer"
            onClick={handleBackdropClick}
          >
            <motion.div
              className={`app-modal-panel app-modal-panel-${modalSize}`}
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Header */}
              <div className="app-modal-top">
                <h3
                  id="modal-title"
                  className="app-modal-heading"
                >
                  {title}
                </h3>

                <button
                  type="button"
                  className="app-modal-close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <FiX size={17} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="app-modal-body">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


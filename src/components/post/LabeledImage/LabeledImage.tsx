import React, {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  children?: ReactNode;
}

export function LabeledImage({ src, alt, width, height, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleImageKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    },
    [openModal],
  );

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <figure className="labeled-image my-6 p-0">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="clickable block mx-auto rounded-lg cursor-zoom-in"
          role="button"
          tabIndex={0}
          aria-label={`${alt} - Click to enlarge`}
          onClick={openModal}
          onKeyDown={handleImageKeyDown}
        />
        {children && (
          <figcaption className="text-center text-sm text-gray mt-2 italic [&_a]:text-accent">
            {children}
          </figcaption>
        )}
      </figure>

      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-[1000] ${isOpen ? "flex items-center justify-center" : "hidden"}`}
            aria-hidden={!isOpen}
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-black/90" />
            <div
              className="relative p-[3%] w-full h-full flex items-center justify-center box-border"
              onClick={(e) => e.target === e.currentTarget && closeModal()}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

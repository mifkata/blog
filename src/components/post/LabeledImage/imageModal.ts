export function setupImageModals() {
  document.querySelectorAll<HTMLElement>(".labeled-image").forEach((figure) => {
    const img = figure.querySelector<HTMLImageElement>("img.clickable");
    const modal = figure.nextElementSibling as HTMLElement;
    if (!img || !modal?.classList.contains("modal")) return;

    const backdrop = modal.querySelector<HTMLElement>(".modal-backdrop");
    const modalContent = modal.querySelector<HTMLElement>(".modal-content");

    const openModal = () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex", "items-center", "justify-center");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    img.addEventListener("click", openModal);

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });

    const closeModal = () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex", "items-center", "justify-center");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    backdrop?.addEventListener("click", closeModal);
    modalContent?.addEventListener("click", (e) => {
      if (e.target === modalContent) closeModal();
    });

    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll<HTMLElement>(".modal:not(.hidden)")
        .forEach((modal) => {
          modal.classList.add("hidden");
          modal.classList.remove("flex", "items-center", "justify-center");
          modal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        });
    }
  });
}

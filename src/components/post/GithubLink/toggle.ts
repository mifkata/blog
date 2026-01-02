// Toggle handler for GithubLink preview - uses event delegation
export function initToggle() {
  document.addEventListener("click", (e) => {
    const button = (e.target as Element).closest("[data-toggle]");
    if (!button) return;

    const targetId = button.getAttribute("data-toggle");
    if (!targetId) return;

    const target = document.getElementById(targetId);
    const showText = button.querySelector("[data-show-text]");
    const hideText = button.querySelector("[data-hide-text]");

    if (target && showText && hideText) {
      const isHidden = target.classList.contains("hidden");
      target.classList.toggle("hidden");
      showText.classList.toggle("hidden", !isHidden);
      hideText.classList.toggle("hidden", isHidden);
    }
  });
}

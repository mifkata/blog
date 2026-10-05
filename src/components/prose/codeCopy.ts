/** Milliseconds "Copied" shows before the button resets. */
const COPIED_MS = 2000;

export function setupCodeCopy(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-code-copy]")
    .forEach((button) => {
      if (button.dataset.copyReady) return;
      button.dataset.copyReady = "true";
      const label = button.querySelector("[data-code-copy-label]");
      button.addEventListener("click", async () => {
        const pre = button.closest(".code-block")?.querySelector("pre");
        const code = pre?.querySelector("code") ?? pre;
        await navigator.clipboard.writeText(code?.textContent ?? "");
        if (!label) return;
        label.textContent = "Copied";
        setTimeout(() => (label.textContent = "Copy"), COPIED_MS);
      });
    });
}

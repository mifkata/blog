/**
 * Folds a long link list down to its first links, with a button under the
 * list to show the rest and to fold them away again. The list's height
 * slides between the two, and the extra links fade in or out as it moves.
 * Without this script every link shows and the button stays hidden.
 */
export function setupAroundLinks(): void {
  document
    .querySelectorAll<HTMLElement>("[data-around-links]")
    .forEach((card) => {
      const list = card.querySelector<HTMLElement>(".around-links");
      const button = card.querySelector<HTMLButtonElement>(
        "[data-around-toggle]",
      );
      const label = button?.querySelector<HTMLElement>("[data-around-label]");
      if (!list || !button || !label || card.dataset.aroundReady) return;
      card.dataset.aroundReady = "true";

      const extras = [...list.querySelectorAll<HTMLElement>(".is-more")];
      const more = Number(button.dataset.more);
      const still = matchMedia("(prefers-reduced-motion: reduce)");
      let running: Animation[] = [];

      const setButton = (expanded: boolean) => {
        button.setAttribute("aria-expanded", String(expanded));
        label.textContent = expanded ? "Show fewer" : `Show ${more} more`;
      };
      const setCollapsed = (collapsed: boolean) =>
        card.toggleAttribute("data-collapsed", collapsed);
      const height = () => list.getBoundingClientRect().height;

      // Height from where it is now, even mid-slide, to where it's going
      const slide = (from: number, to: number, expanding: boolean) => {
        list.style.overflow = "hidden";
        const animation = list.animate(
          [{ height: `${from}px` }, { height: `${to}px` }],
          {
            duration: expanding ? 340 : 280,
            easing: expanding
              ? "cubic-bezier(0.2, 0.7, 0.2, 1)"
              : "cubic-bezier(0.4, 0, 0.2, 1)",
          },
        );
        running.push(animation);
        return animation.finished.then(() => {
          list.style.overflow = "";
        });
      };

      const toggle = (expand: boolean) => {
        const from = height();
        running.forEach((animation) => animation.cancel());
        running = [];
        setButton(expand);

        if (still.matches) {
          setCollapsed(!expand);
          return;
        }

        if (expand) {
          const wasCollapsed = card.hasAttribute("data-collapsed");
          setCollapsed(false);
          slide(from, height(), true).catch(() => {});
          if (wasCollapsed)
            extras.forEach((link, i) =>
              running.push(
                link.animate(
                  [
                    { opacity: 0, transform: "translateY(-4px)" },
                    { opacity: 1, transform: "none" },
                  ],
                  {
                    duration: 240,
                    delay: Math.min(i * 22, 180),
                    easing: "ease-out",
                    fill: "backwards",
                  },
                ),
              ),
            );
          return;
        }

        // Measure the folded height, then keep the links showing while the
        // list slides shut and they fade, and fold them away at the end
        setCollapsed(true);
        const to = height();
        setCollapsed(false);
        extras.forEach((link) =>
          running.push(
            link.animate([{ opacity: 1 }, { opacity: 0 }], {
              duration: 180,
              easing: "ease-in",
              fill: "forwards",
            }),
          ),
        );
        slide(from, to, false)
          .then(() => {
            setCollapsed(true);
            running.forEach((animation) => animation.cancel());
            running = [];
          })
          .catch(() => {});
      };

      setButton(false);
      setCollapsed(true);
      button.hidden = false;
      button.addEventListener("click", () =>
        toggle(button.getAttribute("aria-expanded") !== "true"),
      );
    });
}

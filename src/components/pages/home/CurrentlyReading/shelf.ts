/**
 * Shows a book under the shelf when its spine is hovered, focused or tapped;
 * the book's Goodreads link is in what shows. Each new book stirs the plant
 * in the pot.
 *
 * The shelf is one tab stop: arrow keys move between the books, and Tab goes
 * on to the shown book's link.
 */
export function setupShelves(): void {
  document.querySelectorAll<HTMLElement>("[data-shelf]").forEach((shelf) => {
    if (shelf.dataset.shelfReady) return;
    shelf.dataset.shelfReady = "true";

    const spines = [
      ...shelf.querySelectorAll<HTMLButtonElement>("[data-shelf-book]"),
    ];
    const cards = [...shelf.querySelectorAll<HTMLElement>("[data-shelf-card]")];
    const hint = shelf.querySelector<HTMLElement>("[data-shelf-hint]");
    const sway = plantSway(shelf);
    let shown = -1;

    const tabStop = (index: number) =>
      spines.forEach((spine, i) => (spine.tabIndex = i === index ? 0 : -1));
    tabStop(0);

    const show = (index: number) => {
      if (index !== shown) sway();
      shown = index;
      tabStop(index);
      spines.forEach((spine, i) =>
        spine.classList.toggle("is-on", i === index),
      );
      cards.forEach((card, i) => (card.hidden = i !== index));
      if (hint) hint.hidden = true;
    };

    spines.forEach((spine, i) => {
      spine.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") show(i);
      });
      spine.addEventListener("focus", () => show(i));
      spine.addEventListener("click", () => show(i));
      spine.addEventListener("keydown", (event) => {
        const last = spines.length - 1;
        const to = {
          ArrowLeft: i - 1,
          ArrowUp: i - 1,
          ArrowRight: i + 1,
          ArrowDown: i + 1,
          Home: 0,
          End: last,
        }[event.key];
        if (to === undefined) return;
        event.preventDefault();
        spines[Math.min(Math.max(to, 0), last)].focus();
      });
    });
  });
}

/**
 * Sways the plant once, to a random side with a small random rise or dip,
 * settling back over a second or so. The leaves follow more gently and a
 * little later than the flower. Hovers while it moves are ignored.
 */
function plantSway(shelf: HTMLElement): () => void {
  const bloom = shelf.querySelector<SVGGElement>("[data-shelf-bloom]");
  const leaves = [
    ...shelf.querySelectorAll<SVGGElement>("[data-shelf-leaves]"),
  ];
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  let moving = false;

  return () => {
    if (moving || still.matches || !bloom) return;
    moving = true;
    const tilt = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 4);
    const bob = (Math.random() * 2 - 1) * 2.5;
    const frames = (amount: number) =>
      [
        [0, 0],
        [1, 1],
        [-0.55, -0.6],
        [0.25, 0.3],
        [0, 0],
      ].map(([turn, lift]) => ({
        transform: `rotate(${tilt * turn * amount}deg) translateY(${bob * lift * amount}px)`,
      }));
    const duration = 1300 + Math.random() * 500;
    leaves.forEach((group) =>
      group.animate(frames(0.4), {
        duration: duration * 1.1,
        delay: 60,
        easing: "ease-in-out",
      }),
    );
    bloom
      .animate(frames(1), { duration, easing: "ease-in-out" })
      .finished.finally(() => (moving = false));
  };
}

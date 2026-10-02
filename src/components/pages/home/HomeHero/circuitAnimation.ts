import { toPathData, type CircuitData, type Vec } from "./circuit";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Idle data packets running along random traces. */
const PACKETS = {
  speed: 0.16, // viewBox units per ms
  tail: 90,
  maxActive: 4,
  minDelay: 450,
  maxDelay: 1400,
};

/** Current the pointer pushes into the board through the nearest pad. */
const CHARGE = {
  speed: 0.42,
  tail: 70,
  reach: 70, // how close (viewBox units) the pointer must be to a pad
  padCooldown: 1200,
  interval: 90, // minimum ms between two charges anywhere on the board
  fanOut: 3, // traces a chip powers when current reaches it
  chipCooldown: 300,
};

const MAX_PULSES = 40;

type PulseKind = "packet" | "charge";

interface Trace {
  forward: string;
  backward: string;
  length: number;
  bounds: [number, number, number, number];
  chip: number;
  start: number;
  end: number;
}

function toTrace({
  points,
  chip,
  start,
  end,
}: CircuitData["traces"][number]): Trace {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    forward: toPathData(points),
    backward: toPathData([...points].reverse()),
    length: points.reduce(
      (sum, point, i) =>
        i === 0
          ? 0
          : sum +
            Math.hypot(
              point[0] - points[i - 1][0],
              point[1] - points[i - 1][1],
            ),
      0,
    ),
    bounds: [
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs),
      Math.max(...ys),
    ],
    chip,
    start,
    end,
  };
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

function sample<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  while (pool.length && picked.length < count) {
    picked.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
  }
  return picked;
}

/**
 * Animates the hero circuit board: packets drift along random traces, and the
 * pointer acts as a power source, sending current from the nearest pad into
 * the board. Chips that receive current pass it on to some of their other
 * traces. Returns a cleanup function.
 */
export function initCircuit(root: HTMLElement): () => void {
  const svg = root.querySelector<SVGSVGElement>("[data-circuit]");
  const layer = root.querySelector<SVGGElement>("[data-circuit-pulses]");
  const source = root.querySelector("[data-circuit-data]");
  if (!svg || !layer || !source?.textContent) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const data = JSON.parse(source.textContent) as CircuitData;
  const traces = data.traces.map(toTrace);
  const padEls: SVGElement[] = [];
  const chipEls: SVGElement[] = [];
  svg.querySelectorAll<SVGElement>("[data-pad]").forEach((el) => {
    padEls[Number(el.dataset.pad)] = el;
  });
  svg.querySelectorAll<SVGElement>("[data-chip]").forEach((el) => {
    chipEls[Number(el.dataset.chip)] = el;
  });

  // Every pad sits on exactly one end of one trace.
  const padOwners: { trace: number; atStart: boolean }[] = [];
  traces.forEach(({ start, end }, trace) => {
    if (start >= 0) padOwners[start] = { trace, atStart: true };
    if (end >= 0) padOwners[end] = { trace, atStart: false };
  });

  const style = getComputedStyle(root);
  const colors: Record<PulseKind, string> = {
    packet: style.getPropertyValue("--circuit-packet").trim(),
    charge: style.getPropertyValue("--circuit-charge").trim(),
  };

  const timers = new Set<number>();
  const later = (callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      callback();
    }, delay);
    timers.add(id);
  };

  const live: Record<PulseKind, number> = { packet: 0, charge: 0 };

  function pulse(
    trace: Trace,
    reverse: boolean,
    kind: PulseKind,
    onArrive?: () => void,
  ) {
    if (live.packet + live.charge >= MAX_PULSES) return;
    const { speed, tail: maxTail } = kind === "packet" ? PACKETS : CHARGE;
    const tail = Math.min(maxTail, trace.length * 0.6);
    const travel = trace.length + tail;
    const duration = travel / speed;

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", `circuit-pulse circuit-pulse--${kind}`);
    // Each layer is one dash; offsetting it by its own length lines every
    // layer's leading edge up with the head.
    const layers = [
      ["glow", tail],
      ["core", tail * 0.55],
      ["head", 0.01],
    ] as const;
    for (const [name, dash] of layers) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", reverse ? trace.backward : trace.forward);
      path.setAttribute("class", `circuit-pulse__${name}`);
      path.style.strokeDasharray = `${dash} ${travel + tail}`;
      path.animate(
        [{ strokeDashoffset: dash }, { strokeDashoffset: dash - travel }],
        { duration, fill: "forwards" },
      );
      group.append(path);
    }
    layer!.append(group);
    live[kind]++;

    if (onArrive) later(onArrive, (duration * trace.length) / travel);
    later(() => {
      group.remove();
      live[kind]--;
    }, duration);
  }

  function flash(el: SVGElement | undefined, color: string, scale: number) {
    el?.animate(
      [{ color, transform: `scale(${scale})` }, { transform: "scale(1)" }],
      { duration: 700, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
    );
  }

  // Packets

  let packetTimer = 0;

  function visibleBounds(): [number, number, number, number] | null {
    const ctm = svg!.getScreenCTM();
    if (!ctm) return null;
    const rect = svg!.getBoundingClientRect();
    const inverse = ctm.inverse();
    const a = new DOMPoint(rect.left, rect.top).matrixTransform(inverse);
    const b = new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse);
    return [a.x, a.y, b.x, b.y];
  }

  function spawnPacket() {
    if (live.packet >= PACKETS.maxActive) return;
    // The board is cropped on narrow screens; only use traces that show.
    const view = visibleBounds();
    const candidates = traces.filter(
      ({ length, bounds }) =>
        length > 80 &&
        (!view ||
          (bounds[0] < view[2] &&
            bounds[2] > view[0] &&
            bounds[1] < view[3] &&
            bounds[3] > view[1])),
    );
    const trace = candidates[Math.floor(Math.random() * candidates.length)];
    if (!trace) return;
    // Chip traces mostly carry data away from their chip.
    const reverse = Math.random() < (trace.chip >= 0 ? 0.25 : 0.5);
    pulse(trace, reverse, "packet", () => {
      flash(padEls[reverse ? trace.start : trace.end], colors.packet, 1.6);
    });
  }

  function startPackets() {
    if (packetTimer) return;
    const tick = () => {
      spawnPacket();
      packetTimer = window.setTimeout(
        tick,
        random(PACKETS.minDelay, PACKETS.maxDelay),
      );
    };
    packetTimer = window.setTimeout(tick, PACKETS.minDelay);
  }

  function stopPackets() {
    window.clearTimeout(packetTimer);
    packetTimer = 0;
  }

  let inView = false;
  const syncPackets = () =>
    inView && !document.hidden ? startPackets() : stopPackets();
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPackets();
  });
  observer.observe(root);
  document.addEventListener("visibilitychange", syncPackets);

  // Pointer as power source

  let pointer: Vec | null = null;
  let frame = 0;
  let activePad = -1;
  let lastCharge = 0;
  const padCharged = new Map<number, number>();
  const chipCharged = new Map<number, number>();

  function setActivePad(pad: number) {
    if (pad === activePad) return;
    padEls[activePad]?.classList.remove("is-active");
    padEls[pad]?.classList.add("is-active");
    activePad = pad;
  }

  function burst(chip: number, incoming: number) {
    const now = performance.now();
    if (now - (chipCharged.get(chip) ?? -Infinity) < CHARGE.chipCooldown)
      return;
    chipCharged.set(chip, now);
    flash(chipEls[chip], colors.charge, 1.04);
    const outgoing = data.chips[chip].traces.filter(
      (index) => index !== incoming,
    );
    // Short stubs swallow a pulse before anyone sees it.
    const long = outgoing.filter((index) => traces[index].length >= 120);
    const pool = long.length >= CHARGE.fanOut ? long : outgoing;
    for (const index of sample(pool, CHARGE.fanOut)) {
      const trace = traces[index];
      pulse(trace, false, "charge", () =>
        flash(padEls[trace.end], colors.charge, 2),
      );
    }
  }

  function charge(pad: number) {
    const now = performance.now();
    if (now - lastCharge < CHARGE.interval) return;
    if (now - (padCharged.get(pad) ?? -Infinity) < CHARGE.padCooldown) return;
    lastCharge = now;
    padCharged.set(pad, now);

    const { trace: index, atStart } = padOwners[pad];
    const trace = traces[index];
    flash(padEls[pad], colors.charge, 2.4);
    pulse(trace, !atStart, "charge", () => {
      const far = atStart ? trace.end : trace.start;
      if (far >= 0) flash(padEls[far], colors.charge, 2);
      else if (!atStart && trace.chip >= 0) burst(trace.chip, index);
    });
  }

  function trackPointer() {
    frame = 0;
    const ctm = svg!.getScreenCTM();
    if (!pointer || !ctm) return;
    const { x, y } = new DOMPoint(...pointer).matrixTransform(ctm.inverse());
    let nearest = -1;
    let best = CHARGE.reach ** 2;
    data.pads.forEach((pad, i) => {
      const distance = (pad.x - x) ** 2 + (pad.y - y) ** 2;
      if (distance < best && padOwners[i]) {
        best = distance;
        nearest = i;
      }
    });
    setActivePad(nearest);
    if (nearest >= 0) charge(nearest);
  }

  const onPointerMove = (event: PointerEvent) => {
    pointer = [event.clientX, event.clientY];
    if (!frame) frame = requestAnimationFrame(trackPointer);
  };
  const onPointerLeave = () => {
    pointer = null;
    setActivePad(-1);
  };
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerdown", onPointerMove);
  root.addEventListener("pointerleave", onPointerLeave);
  root.addEventListener("pointercancel", onPointerLeave);

  return () => {
    stopPackets();
    timers.forEach((id) => window.clearTimeout(id));
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener("visibilitychange", syncPackets);
    root.removeEventListener("pointermove", onPointerMove);
    root.removeEventListener("pointerdown", onPointerMove);
    root.removeEventListener("pointerleave", onPointerLeave);
    root.removeEventListener("pointercancel", onPointerLeave);
    layer.replaceChildren();
  };
}

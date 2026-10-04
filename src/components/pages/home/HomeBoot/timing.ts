/**
 * Home page boot timing, in milliseconds. Tune freely: the dev server reloads
 * on save, and in development the browser console prints how long the boot
 * you just watched took. Replay it with the footer's "$ reboot" link.
 */
export const BOOT_TIMING = {
  /** Per character while typing a command, such as "ssh guest@mifkata.com". */
  commandTyping: 32,
  /** Per character while typing the big <mifkata /> tag. */
  logoTyping: 90,
  /** Pause before a step prints its "ok". */
  stepDelay: 360,
  /** Pause after each line. */
  lineDelay: 220,
  /** How long the finished screen stays before the tag flies to the header. */
  hold: 1250,
  /** How long the tag takes to fly into the header. */
  morph: 600,
};

export type BootTiming = typeof BOOT_TIMING;

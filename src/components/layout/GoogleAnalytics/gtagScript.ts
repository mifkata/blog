/** Inlined into the page head, so it stays plain JavaScript */
export function gtagScript(gaId: string, consentKey: string): string {
  return `
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  let started = false;
  window.enableAnalytics = () => {
    window["ga-disable-${gaId}"] = false;
    if (started) return;
    started = true;
    gtag("js", new Date());
    gtag("config", "${gaId}");
    const load = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=${gaId}";
      document.head.append(script);
    };
    const whenIdle = () => {
      "requestIdleCallback" in window
        ? requestIdleCallback(load, { timeout: 3000 })
        : setTimeout(load, 500);
    };
    document.readyState === "complete"
      ? whenIdle()
      : addEventListener("load", whenIdle, { once: true });
  };
  window.disableAnalytics = () => {
    window["ga-disable-${gaId}"] = true;
  };
  try {
    if (localStorage.getItem("${consentKey}") === "granted") {
      window.enableAnalytics();
    }
  } catch {
    // Storage blocked: no recorded consent.
  }
`;
}

export const GA_ID = "G-SDS8ZJG4SS";
export const CONSENT_KEY = "mifkata-analytics-consent";

type Consent = "granted" | "denied";

declare global {
  interface Window {
    enableAnalytics?: () => void;
    disableAnalytics?: () => void;
  }
}

export function parseConsent(value: string | null): Consent | null {
  return value === "granted" || value === "denied" ? value : null;
}

export function analyticsCookies(cookies: string): string[] {
  return cookies
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^(_ga(_.+)?|_gid)$/.test(name));
}

export function cookieDomains(hostname: string): string[] {
  const parts = hostname.split(".");
  return parts.slice(0, -1).flatMap((_, i) => {
    const domain = parts.slice(i).join(".");
    return [domain, `.${domain}`];
  });
}

function storedConsent(): Consent | null {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

function saveConsent(consent: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Storage blocked: the choice holds for this page only.
  }
}

function clearAnalyticsCookies(): void {
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  for (const name of analyticsCookies(document.cookie)) {
    document.cookie = `${name}=; ${expired}`;
    for (const domain of cookieDomains(location.hostname)) {
      document.cookie = `${name}=; ${expired}; domain=${domain}`;
    }
  }
}

export function setupCookieBanner(): void {
  const banner = document.querySelector<HTMLElement>("[data-cookie-banner]");
  const accept = banner?.querySelector<HTMLElement>("[data-cookie-accept]");
  const decline = banner?.querySelector<HTMLElement>("[data-cookie-decline]");
  const settings = document.querySelector<HTMLElement>(
    "[data-cookie-settings]",
  );
  if (!banner || !accept || !decline) return;

  let reopened = false;
  banner.hidden = storedConsent() !== null;

  const choose = (consent: Consent) => {
    saveConsent(consent);
    if (consent === "granted") {
      window.enableAnalytics?.();
    } else {
      window.disableAnalytics?.();
      clearAnalyticsCookies();
    }
    banner.hidden = true;
    if (reopened) settings?.focus({ preventScroll: true });
    reopened = false;
  };

  accept.addEventListener("click", () => choose("granted"));
  decline.addEventListener("click", () => choose("denied"));
  settings?.addEventListener("click", () => {
    banner.hidden = false;
    reopened = true;
    accept.focus({ preventScroll: true });
  });
}

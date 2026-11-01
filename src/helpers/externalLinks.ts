const OWN_HOSTS = new Set(["mifkata.com", "www.mifkata.com"]);

export function isExternalHref(href: string): boolean {
  if (!/^(https?:)?\/\//i.test(href)) return false;
  return !OWN_HOSTS.has(new URL(href, "https://x").hostname);
}

import { expect, test, type Page } from "@playwright/test";

const GA_ID = "G-SDS8ZJG4SS";
const CONSENT_KEY = "mifkata-analytics-consent";

test.beforeEach(async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) =>
    route.fulfill({ body: "" }),
  );
});

const banner = (page: Page) => page.locator("[data-cookie-banner]");
const settings = (page: Page) => page.locator("[data-cookie-settings]");
const consent = (page: Page) =>
  page.evaluate((key) => localStorage.getItem(key), CONSENT_KEY);
const analyticsConfigured = (page: Page) =>
  page.evaluate(
    (id) =>
      (window as unknown as { dataLayer: unknown[][] }).dataLayer.some(
        (entry) => entry[0] === "config" && entry[1] === id,
      ),
    GA_ID,
  );

test("accept persists across reload and enables analytics", async ({
  page,
}) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  expect(await analyticsConfigured(page)).toBe(false);

  await banner(page).locator("[data-cookie-accept]").click();
  await expect(banner(page)).toBeHidden();
  expect(await consent(page)).toBe("granted");
  expect(await analyticsConfigured(page)).toBe(true);

  await page.reload();
  await expect(banner(page)).toBeHidden();
  expect(await analyticsConfigured(page)).toBe(true);
});

test("reopen from the footer and decline", async ({ page }) => {
  await page.goto("/");
  await banner(page).locator("[data-cookie-accept]").click();
  await expect(banner(page)).toBeHidden();

  await settings(page).click();
  await expect(banner(page)).toBeVisible();
  await expect(banner(page).locator("[data-cookie-accept]")).toBeFocused();

  await banner(page).locator("[data-cookie-decline]").click();
  await expect(banner(page)).toBeHidden();
  await expect(settings(page)).toBeFocused();
  expect(await consent(page)).toBe("denied");
  expect(
    await page.evaluate(
      (id) =>
        (window as unknown as Record<string, unknown>)[`ga-disable-${id}`],
      GA_ID,
    ),
  ).toBe(true);

  await page.reload();
  await expect(banner(page)).toBeHidden();
  expect(await analyticsConfigured(page)).toBe(false);
});

test("banner is the first tab stop and the next Tab reaches the header", async ({
  page,
}) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();

  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.activeElement?.closest("[data-cookie-banner]") ? true : false,
    ),
  ).toBe(true);

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      document.activeElement?.closest("#site-header") ? true : false,
    ),
  ).toBe(true);
});

test("no footer control sits under the open banner at page end", async ({
  page,
}) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const bannerBox = await banner(page).boundingBox();
  const controls = await page.locator("footer a, footer button").all();
  expect(controls.length).toBeGreaterThan(0);
  for (const control of controls) {
    const box = await control.boundingBox();
    if (!box || !bannerBox) continue;
    const overlaps =
      box.y < bannerBox.y + bannerBox.height &&
      box.y + box.height > bannerBox.y &&
      box.x < bannerBox.x + bannerBox.width &&
      box.x + box.width > bannerBox.x;
    expect(overlaps, await control.innerText()).toBe(false);
  }
});

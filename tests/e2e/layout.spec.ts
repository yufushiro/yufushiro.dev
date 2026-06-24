import { expect, test } from "@playwright/test";

test("`ApacheIndex` layout snapshot", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("layout-apache-index.png", {
    fullPage: true,
    mask: [page.locator(".astro-version")],
  });
});

test("`Simple` layout snapshot", async ({ page }) => {
  await page.goto("/articles/20250811_first-post");
  await expect(page).toHaveScreenshot("layout-simple.png", {
    fullPage: true,
  });
});

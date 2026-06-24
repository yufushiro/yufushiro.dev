import { expect, test } from "@playwright/test";

test("code block snapshot", async ({ page }) => {
  await page.goto("/articles/20250827_eventbridge_sfn_dedup");
  const preElement = page.locator("pre.astro-code");
  await expect(preElement).toHaveScreenshot("code-block.png");
});

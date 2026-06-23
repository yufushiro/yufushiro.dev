import { expect, test } from "@playwright/test";

test("mermaid snapshot", async ({ page }) => {
  await page.goto("/articles/20260207_misskey_trustproxy");
  const preElement = page.locator("pre.mermaid > svg").last();
  await expect(preElement).toHaveScreenshot("mermaid.png");
});

import { test, expect } from "@playwright/test";

test("redirects unauthorized user to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/.*\/login/);
});

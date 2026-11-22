import { expect, test } from "@playwright/test";

test("home loads and progress survives a reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/principiante/semana/1");
  const toggle = page.getByRole("button", { name: "Marcar como terminada" });
  await toggle.click();
  await expect(page.getByRole("button", { name: /Semana terminada/ })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: /Semana terminada/ })).toBeVisible();
});

test("unknown week is a 404", async ({ page }) => {
  const res = await page.goto("/intermedio/semana/13");
  expect(res?.status()).toBe(404);
});

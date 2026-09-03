import { test, expect } from "@playwright/test";

/**
 * Testes E2E do login do painel admin. Requer a variável de ambiente
 * TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD apontando para um utilizador
 * Supabase Auth válido (ver README — "Criar a conta da Von").
 */
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

test.describe("Login do painel admin", () => {
  test("redireciona para o login quando não autenticado", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Área reservada" })).toBeVisible();
  });

  test("mostra erro com credenciais inválidas", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("naoexiste@nailsvon.pt");
    await page.getByLabel("Palavra-passe").fill("password-errada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByRole("alert")).toHaveText(/incorretos/i);
  });

  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "TEST_ADMIN_EMAIL/TEST_ADMIN_PASSWORD não configurados");
  test("permite entrar com credenciais válidas", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL!);
    await page.getByLabel("Palavra-passe").fill(ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });
});

import { test, expect, type Page } from "@playwright/test";

/**
 * Testes E2E do fluxo de marcação. Pressupõem que a base de dados de
 * desenvolvimento tem as migrações + seed aplicados (ver README), incluindo
 * pelo menos um serviço ativo chamado "Manicure Gel" e disponibilidade
 * configurada de Segunda a Sábado.
 */

function futureIsoDate(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

async function preencherServicoEData(page: Page, dateIso: string) {
  await page.goto("/marcar");
  await page.getByText("Manicure Gel", { exact: true }).click();
  await page.getByRole("button", { name: "Seguinte" }).click();

  await page.locator("#data").fill(dateIso);
  const radiogroup = page.getByRole("radiogroup", { name: "Horários disponíveis" });
  await expect(radiogroup.getByRole("radio").first()).toBeVisible({ timeout: 10_000 });
}

test.describe("Fluxo de marcação", () => {
  test("permite submeter uma marcação válida com sucesso", async ({ page }) => {
    // Data distante o suficiente para não colidir com outros testes.
    const dateIso = futureIsoDate(20);
    await preencherServicoEData(page, dateIso);

    const radiogroup = page.getByRole("radiogroup", { name: "Horários disponíveis" });
    await radiogroup.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Seguinte" }).click();

    await page.getByLabel("Nome completo").fill("Cliente de Teste");
    await page.getByLabel("Telemóvel").fill("912345678");
    await page.getByLabel("Email").fill("cliente.teste@example.com");
    await page.getByRole("button", { name: "Seguinte" }).click();

    await expect(page.getByText("Confirma a tua marcação")).toBeVisible();
    await page.getByRole("button", { name: "Confirmar Marcação" }).click();

    await expect(page.getByText("Marcação recebida!")).toBeVisible({ timeout: 15_000 });
  });

  test("não permite marcar um horário que já foi reservado", async ({ page }) => {
    const dateIso = futureIsoDate(21);

    // 1ª marcação: reserva o primeiro horário livre do dia.
    await preencherServicoEData(page, dateIso);
    const radiogroup = page.getByRole("radiogroup", { name: "Horários disponíveis" });
    const primeiroSlot = await radiogroup.getByRole("radio").first().textContent();
    await radiogroup.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Seguinte" }).click();

    await page.getByLabel("Nome completo").fill("Primeira Cliente");
    await page.getByLabel("Telemóvel").fill("912345678");
    await page.getByLabel("Email").fill("primeira.cliente@example.com");
    await page.getByRole("button", { name: "Seguinte" }).click();
    await page.getByRole("button", { name: "Confirmar Marcação" }).click();
    await expect(page.getByText("Marcação recebida!")).toBeVisible({ timeout: 15_000 });

    // 2ª tentativa: o mesmo dia já não deve oferecer o horário acabado de reservar
    // — prova de que o slot ocupado é excluído da disponibilidade calculada
    // no servidor (a mesma fonte de verdade usada para validar a submissão).
    await preencherServicoEData(page, dateIso);
    const radiogroup2 = page.getByRole("radiogroup", { name: "Horários disponíveis" });
    const slotsRestantes = await radiogroup2.getByRole("radio").allTextContents();
    expect(slotsRestantes).not.toContain(primeiroSlot);
  });
});

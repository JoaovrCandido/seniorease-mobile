import { PraiseService } from "../../../src/infrastructure/services/PraiseService";

describe("PraiseService", () => {
  it("deve devolver um elogio formatado sem nome se o nome não for fornecido", () => {
    const praise = PraiseService.getRandomPraise("task");
    expect(typeof praise).toBe("string");
    expect(praise).toContain("!");
  });

  it("deve extrair e utilizar apenas o primeiro nome do utilizador", () => {
    const praise = PraiseService.getRandomPraise("task", "João Silva");
    expect(praise).toContain("João");
    expect(praise).not.toContain("Silva");
  });

  it("deve devolver uma mensagem específica de restauração da lixeira", () => {
    const praise = PraiseService.getRandomPraise("restore", "Maria");
    expect(praise).toContain("Maria");
    const isRestore =
      praise.includes("Restaurado") || praise.includes("De volta");
    expect(isRestore).toBe(true);
  });
});

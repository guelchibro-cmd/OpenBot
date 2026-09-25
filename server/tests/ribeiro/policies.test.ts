import { describe, expect, test } from "bun:test";
import { evaluateLeaAction } from "../../src/ribeiro/policies";

describe("Lea Agent policies", () => {
  test("allows a read-only task", () => {
    expect(evaluateLeaAction({ action: "ler", description: "Ler o README do repositório" })).toEqual({
      risk: "safe",
      requiresConfirmation: false,
    });
  });

  test("requires confirmation for payment operations", () => {
    const decision = evaluateLeaAction({ action: "executar", description: "Fazer um PIX de R$ 10" });

    expect(decision.risk).toBe("critical");
    expect(decision.requiresConfirmation).toBe(true);
  });

  test("requires confirmation for explicit critical metadata", () => {
    expect(
      evaluateLeaAction({
        action: "executar",
        description: "Alterar configuração",
        category: "credential-change",
      }),
    ).toMatchObject({ risk: "critical", requiresConfirmation: true });
  });
});

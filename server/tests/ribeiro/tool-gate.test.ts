import { describe, expect, test } from "bun:test";
import { runThroughLeaGate } from "../../src/ribeiro/tool-gate";

describe("Lea Agent tool gate", () => {
  test("executes safe actions", async () => {
    let executed = false;
    const result = await runThroughLeaGate({
      request: { action: "ler", description: "Ler um arquivo" },
      execute: () => {
        executed = true;
        return "read";
      },
    });

    expect(result).toEqual({ status: "allowed", value: "read" });
    expect(executed).toBe(true);
  });

  test("does not execute critical actions before confirmation", async () => {
    let executed = false;
    const result = await runThroughLeaGate({
      request: { action: "enviar", description: "Enviar mensagem pelo WhatsApp" },
      confirmationId: "confirmation-test",
      execute: () => {
        executed = true;
        return "sent";
      },
    });

    expect(result.status).toBe("confirmation-required");
    expect(executed).toBe(false);
    if (result.status === "confirmation-required") {
      expect(result.confirmation?.id).toBe("confirmation-test");
      expect(result.message).toContain("Confirma esta ação?");
    }
  });
});

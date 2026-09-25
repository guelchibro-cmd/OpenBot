import { describe, expect, test } from "bun:test";
import {
  createLeaConfirmationRequest,
  formatLeaConfirmation,
} from "../../src/ribeiro/confirmation";

describe("Lea Agent confirmations", () => {
  test("does not create a confirmation for a safe task", () => {
    expect(
      createLeaConfirmationRequest(
        { action: "ler", description: "Ler um arquivo" },
        "safe-id",
      ),
    ).toBeNull();
  });

  test("creates a pending confirmation for a critical task", () => {
    const request = createLeaConfirmationRequest(
      { action: "enviar", description: "Enviar mensagem pelo WhatsApp" },
      "critical-id",
    );

    expect(request).toMatchObject({
      id: "critical-id",
      action: "enviar",
      description: "Enviar mensagem pelo WhatsApp",
      status: "pending",
    });
    expect(request?.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(formatLeaConfirmation(request!)).toContain("Confirma esta ação?");
  });
});

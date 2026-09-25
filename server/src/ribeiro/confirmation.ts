import type { LeaActionRequest } from "./policies";
import { evaluateLeaAction } from "./policies";

export interface LeaConfirmationRequest {
  readonly id: string;
  readonly action: string;
  readonly description: string;
  readonly reason: string;
  readonly createdAt: string;
  readonly status: "pending";
}

export function createLeaConfirmationRequest(
  request: LeaActionRequest,
  id = `lea-confirmation-${crypto.randomUUID()}`,
): LeaConfirmationRequest | null {
  const decision = evaluateLeaAction(request);
  if (!decision.requiresConfirmation || !decision.reason) return null;

  return {
    id,
    action: request.action,
    description: request.description,
    reason: decision.reason,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
}

export function formatLeaConfirmation(request: LeaConfirmationRequest): string {
  return [
    "Confirmação necessária.",
    `Ação: ${request.action}`,
    `Descrição: ${request.description}`,
    `Motivo: ${request.reason}`,
    `ID: ${request.id}`,
    "Confirma esta ação?",
  ].join("\n");
}

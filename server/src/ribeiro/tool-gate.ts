import {
  createLeaConfirmationRequest,
  formatLeaConfirmation,
} from "./confirmation";
import type { LeaActionRequest } from "./policies";

export type LeaToolGateResult<T> =
  | { status: "allowed"; value: T }
  | {
      status: "confirmation-required";
      confirmation: ReturnType<typeof createLeaConfirmationRequest>;
      message: string;
    };

/**
 * Protects one proposed tool action without changing any existing OpenBot execution path.
 * Callers opt in by wrapping their own executor with this function.
 */
export async function runThroughLeaGate<T>(input: {
  request: LeaActionRequest;
  execute: () => Promise<T> | T;
  confirmationId?: string;
}): Promise<LeaToolGateResult<T>> {
  const confirmation = createLeaConfirmationRequest(
    input.request,
    input.confirmationId,
  );

  if (confirmation) {
    return {
      status: "confirmation-required",
      confirmation,
      message: formatLeaConfirmation(confirmation),
    };
  }

  return { status: "allowed", value: await input.execute() };
}

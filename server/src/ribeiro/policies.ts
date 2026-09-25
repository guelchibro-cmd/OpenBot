export type LeaRiskLevel = "safe" | "critical";

export type LeaCriticalAction =
  | "payment"
  | "external-message"
  | "production-deploy"
  | "destructive-change"
  | "bulk-database-change"
  | "protected-repository-change"
  | "credential-change"
  | "marketing-budget-change";

export interface LeaActionRequest {
  readonly action: string;
  readonly description: string;
  readonly risk?: LeaRiskLevel;
  readonly category?: LeaCriticalAction;
}

export interface LeaPolicyDecision {
  readonly risk: LeaRiskLevel;
  readonly requiresConfirmation: boolean;
  readonly reason?: string;
}

const CRITICAL_TERMS: ReadonlyArray<readonly [LeaCriticalAction, ReadonlyArray<string>]> = [
  ["payment", ["pagamento", "pix", "transferência", "transferencia", "cartão", "cartao", "boleto", "compra"]],
  ["external-message", ["enviar email", "enviar e-mail", "enviar mensagem", "whatsapp", "telegram", "campanha"]],
  ["production-deploy", ["deploy", "produção", "producao", "publicar"]],
  ["destructive-change", ["excluir", "apagar", "deletar", "remover"]],
  ["bulk-database-change", ["drop database", "delete from", "alteração em massa", "alteracao em massa"]],
  ["protected-repository-change", ["merge", "branch protegida", "repositório protegido", "repositorio protegido"]],
  ["credential-change", ["token", "senha", "credencial", "permissão", "permissao"]],
  ["marketing-budget-change", ["orçamento de anúncio", "orcamento de anuncio", "ativar anúncio", "ativar anuncio"]],
];

export function evaluateLeaAction(request: LeaActionRequest): LeaPolicyDecision {
  if (request.risk === "critical") {
    return {
      risk: "critical",
      requiresConfirmation: true,
      reason: "A ação foi marcada explicitamente como crítica.",
    };
  }

  if (request.category) {
    return {
      risk: "critical",
      requiresConfirmation: true,
      reason: `A categoria '${request.category}' exige confirmação explícita.`,
    };
  }

  const normalized = `${request.action} ${request.description}`.toLocaleLowerCase("pt-BR");
  const match = CRITICAL_TERMS.find(([, terms]) => terms.some((term) => normalized.includes(term)));

  if (match) {
    return {
      risk: "critical",
      requiresConfirmation: true,
      reason: `A ação corresponde à categoria crítica '${match[0]}'.`,
    };
  }

  return { risk: "safe", requiresConfirmation: false };
}

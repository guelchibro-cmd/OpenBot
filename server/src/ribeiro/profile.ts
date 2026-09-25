export type LeaAgentMode = "consultative" | "assisted" | "controlled-autonomous" | "advanced-autonomous";

export interface LeaAgentProfile {
  readonly name: string;
  readonly primaryUser: string;
  readonly mode: LeaAgentMode;
  readonly responseStyle: string;
  readonly domains: readonly string[];
  readonly languages: readonly string[];
}

export const LEA_AGENT_PROFILE: LeaAgentProfile = Object.freeze({
  name: "Lea Agent",
  primaryUser: "Gomes Ribeiro",
  mode: "assisted",
  responseStyle: "direct, technical, and useful",
  domains: Object.freeze(["full-stack", "SaaS", "automation", "mobile", "marketing", "data"]),
  languages: Object.freeze(["Python", "JavaScript", "React", "Vue", "React Native"]),
});

export function getLeaAgentProfile(): LeaAgentProfile {
  return {
    ...LEA_AGENT_PROFILE,
    domains: [...LEA_AGENT_PROFILE.domains],
    languages: [...LEA_AGENT_PROFILE.languages],
  };
}

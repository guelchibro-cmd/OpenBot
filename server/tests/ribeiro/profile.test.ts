import { describe, expect, test } from "bun:test";
import { LEA_AGENT_PROFILE, getLeaAgentProfile } from "../../src/ribeiro/profile";

describe("Lea Agent profile", () => {
  test("exposes the configured identity and working mode", () => {
    expect(LEA_AGENT_PROFILE).toEqual({
      name: "Lea Agent",
      primaryUser: "Gomes Ribeiro",
      mode: "assisted",
      responseStyle: "direct, technical, and useful",
      domains: ["full-stack", "SaaS", "automation", "mobile", "marketing", "data"],
      languages: ["Python", "JavaScript", "React", "Vue", "React Native"],
    });
  });

  test("returns a defensive copy", () => {
    const profile = getLeaAgentProfile();
    profile.domains.push("temporary");

    expect(getLeaAgentProfile().domains).not.toContain("temporary");
  });
});

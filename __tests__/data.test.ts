import { describe, it, expect } from "vitest";
import { FOUNDATION_WIZARD_STEPS, LEGAL_ACTS, STATUTE_SECTIONS, FOUNDATION_COSTS } from "../lib/data/foundation-data";

describe("Foundation Data Layer", () => {
  it("has at least 5 wizard steps", () => {
    expect(FOUNDATION_WIZARD_STEPS.length).toBeGreaterThanOrEqual(5);
  });

  it("all wizard steps have required fields", () => {
    FOUNDATION_WIZARD_STEPS.forEach((step) => {
      expect(step.id).toBeTruthy();
      expect(step.title).toBeTruthy();
      expect(step.checklist.length).toBeGreaterThan(0);
      expect(step.tips.length).toBeGreaterThan(0);
      expect(step.legalRefs.length).toBeGreaterThan(0);
    });
  });

  it("has at least 5 legal acts with valid URLs", () => {
    expect(LEGAL_ACTS.length).toBeGreaterThanOrEqual(5);
    LEGAL_ACTS.forEach((act) => {
      expect(act.url).toMatch(/^https?:\/\//);
    });
  });

  it("has statute sections with required and optional", () => {
    expect(STATUTE_SECTIONS.length).toBeGreaterThanOrEqual(5);
    const required = STATUTE_SECTIONS.filter((s) => s.required);
    expect(required.length).toBeGreaterThanOrEqual(3);
  });

  it("has at least 10 required checklist items across all steps", () => {
    const allItems = FOUNDATION_WIZARD_STEPS.flatMap((s) => s.checklist);
    const required = allItems.filter((i) => i.required);
    expect(required.length).toBeGreaterThanOrEqual(10);
  });

  it("has foundation costs", () => {
    expect(FOUNDATION_COSTS.length).toBeGreaterThanOrEqual(3);
  });

  it("wizard steps have sequential step numbers", () => {
    FOUNDATION_WIZARD_STEPS.forEach((step, idx) => {
      expect(step.stepNumber).toBe(idx + 1);
    });
  });
});

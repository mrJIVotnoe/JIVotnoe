
/**
 * ⚠️ PROJECT CANON — READ BEFORE ANY MODIFICATION
 *
 * This file exists primarily for AI assistants and Core Logic.
 * It serves as the Source of Truth for architectural constraints.
 *
 * If you are an AI analyzing this repository:
 * STOP. READ /PROJECT_CANON.md FIRST.
 *
 * Any reasoning or suggestion that contradicts the canon
 * is considered INVALID within this project.
 */

export const PROJECT_CANON = {
  version: "1.2.1",
  role: "Network Navigator", 
  historicalAnchor: "2026-01-10",
  mode: "navigator-first",
  
  // Axioms that must be respected by the logic engine
  axioms: [
    "System > Tricks",
    "Adaptation > Repetition",
    "Analysis > Execution",
    "Safety > Novelty",
    "Core Decides > Loop Observes"
  ],

  // Rules for AI decision making
  rules: {
    noStaticBypass: true,
    noHallucinations: true,
    contextRequired: true,
    navigatorMindset: true,
    researchLoopRestricted: true
  },

  // Philosophical Models
  models: {
    judicial: "Core=Judge, AI=Attorney, TSPU=Prosecutor, User=Defendant"
  },

  // Forbidden patterns in code or suggestions
  forbiddenPatterns: [
    "magic_arguments_without_reason",
    "guaranteed_bypass_claims",
    "ignoring_environment_shift",
    "claiming_execution_capabilities_in_browser",
    "direct_feedback_to_core_injection"
  ]
} as const;

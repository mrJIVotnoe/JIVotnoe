
/**
 * Core Engine Entry Point
 *
 * The "Source of Truth" for the application.
 * This module converts raw environmental data into structured diagnostic outputs.
 * It operates independently of the UI and AI layers.
 *
 * Implements: PROJECT_WHITEPAPER.md → Section 1: WHAT THIS SYSTEM IS
 */

import { decideStrategy } from './engine/decide';
import { generateExplanation } from './engine/explain';
import { consultKnowledge } from './engine/consult';
import { StrategyCatalog } from './knowledge/strategies';
import { DecisionInput, DecisionResult } from './domain/types';
import { analyzeEnvironment } from './engine/analyzeEnvironment';
import { generateDetailedExplanation } from './explanation/generator';
import { PROJECT_CANON } from './PROJECT_CANON';

export * from './domain/types';
export * from './domain/enums';
export * from './explanation/types';
export { PROJECT_CANON } from './PROJECT_CANON';

export { decideStrategy as decide } from './engine/decide';
export { analyzeEnvironment } from './engine/analyzeEnvironment';
export { consultKnowledge } from './engine/consult';

/**
 * Main entry point for the Core Decision Engine.
 * Takes a context input and returns a deterministic strategy recommendation.
 */
export const Core = {
  // Execution Logic (Deterministic)
  decide: (input: DecisionInput): DecisionResult => {
    const decision = decideStrategy(input);
    return decision;
  },
  
  // Advisory Logic (Informational)
  consult: (decision: DecisionResult) => {
    return consultKnowledge(decision);
  },
  
  getStrategyMetadata: (id: string) => {
    return StrategyCatalog[id];
  },

  explain: (decision: DecisionResult, lang: 'ru' | 'en' = 'en') => {
    const strategy = StrategyCatalog[decision.strategyId];
    return generateExplanation(decision, strategy, lang);
  },

  // Extended Explanation Layer (Read-Only Knowledge Integration)
  explainDetailed: (decision: DecisionResult, input: DecisionInput) => {
    return generateDetailedExplanation(decision, input);
  },

  analyzeEnvironment,
  
  canon: PROJECT_CANON
};

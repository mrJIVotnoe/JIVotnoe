
import { decideStrategy } from './engine/decide';
import { generateExplanation } from './engine/explain';
import { StrategyCatalog } from './knowledge/strategies';
import { DecisionInput, DecisionResult } from './domain/types';
import { analyzeEnvironment } from './engine/analyzeEnvironment';

export * from './domain/types';
export * from './domain/enums';

export { decideStrategy as decide } from './engine/decide';
export { analyzeEnvironment } from './engine/analyzeEnvironment';

/**
 * Main entry point for the Core Decision Engine.
 * Takes a context input and returns a deterministic strategy recommendation.
 */
export const Core = {
  decide: (input: DecisionInput): DecisionResult => {
    const decision = decideStrategy(input);
    return decision;
  },
  
  getStrategyMetadata: (id: string) => {
    return StrategyCatalog[id];
  },

  explain: (decision: DecisionResult, lang: 'ru' | 'en' = 'en') => {
    const strategy = StrategyCatalog[decision.strategyId];
    return generateExplanation(decision, strategy, lang);
  },

  analyzeEnvironment
};

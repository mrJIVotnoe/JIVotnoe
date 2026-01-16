/**
 * Advisory Engine (Consultant)
 * 
 * Generates informational signals based on the selected strategy.
 * Implements the "Advisory-Only Knowledge" pattern.
 * 
 * This module is STRICTLY SEPARATED from the Decision Engine (decide.ts).
 * It runs post-decision to provide context, education, and warnings.
 */

import { DecisionResult, KnowledgeSignal } from '../domain/types';
import { STATIC_SCENARIOS } from '../knowledge/scenario.db';
import { STRATEGY_TO_SCENARIOS } from '../knowledge/mapping';

export function consultKnowledge(decision: DecisionResult): KnowledgeSignal[] {
  const linkedScenarioIds = STRATEGY_TO_SCENARIOS[decision.strategyId] || [];
  
  const signals = linkedScenarioIds.map((id): KnowledgeSignal | null => {
    const scenario = STATIC_SCENARIOS.find(s => s.id === id);
    if (!scenario) return null;

    return {
      sourceScenario: scenario.name,
      category: scenario.category,
      insight: scenario.description,
      technicalRelevance: scenario.trustSurface,
      historicalEffectiveness: scenario.historicalEffectiveness
    };
  }).filter((s): s is KnowledgeSignal => s !== null);

  return signals;
}
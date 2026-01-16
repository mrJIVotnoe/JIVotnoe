/**
 * Explanation Generator
 * 
 * A pure function module that merges:
 * 1. Deterministic Decision Results (from Engine)
 * 2. Theoretical Context (from Consultant)
 * 3. Observational Knowledge (from Knowledge Base)
 * 
 * ⚠️ ARCHITECTURAL CONSTRAINT:
 * This module is for OUTPUT GENERATION only.
 * It must NEVER be used to calculate the decision itself.
 */

import { DecisionResult, DecisionInput } from '../domain/types';
import { AppTarget } from '../domain/enums';
import { consultKnowledge } from '../engine/consult';
import { getScenarioObservations, getWhitelistObservations } from '../knowledge';
import { DetailedExplanation, ObservationBlock } from './types';

export function generateDetailedExplanation(
  decision: DecisionResult, 
  input: DecisionInput
): DetailedExplanation {
  
  // 1. Get Theoretical Context (General)
  const theory = consultKnowledge(decision);

  // 2. Get Observational Knowledge (Regional/Specific)
  const observations: ObservationBlock[] = [];
  
  // NOTE: Defaulting to 'ru' region for observational context as per current knowledge base structure.
  // In a multi-region future, this would accept input.region.
  const ruScenarios = getScenarioObservations('ru'); 
  const ruWhitelist = getWhitelistObservations('ru');

  // --- Heuristic Matching for Observations ---
  // These matches provide context ("Did you know?") without affecting the chosen strategy.

  // A. Target Application Observations
  if (input.targetApp === AppTarget.TELEGRAM) {
    const tgObs = ruScenarios.find(s => s.id === 'telegram_randomizer');
    if (tgObs) {
      observations.push({
        type: 'REGIONAL_NOTE',
        title: `Observation: ${tgObs.name}`,
        content: `${tgObs.observation} [Risk: ${tgObs.riskNote}]`,
        source: 'KnowledgeBase'
      });
    }
  }

  // B. Strategy-Specific Historical Context
  // If the decision engine suggests something that aligns with a known regional scenario
  if (decision.strategyId === 'sni_spoof' || decision.tags.includes('SHUTDOWN_OZON')) {
    const ozonObs = ruScenarios.find(s => s.id === 'iron_dome_ozon');
    if (ozonObs) {
       observations.push({
         type: 'HISTORICAL_FACT',
         title: 'Reference: ' + ozonObs.name,
         content: ozonObs.observation,
         source: 'KnowledgeBase'
       });
    }
  }

  // C. Whitelist/Infrastructure Context
  // If we are recommending a generic strategy but the target requires direct connection
  // (Note: Core decide.ts usually handles this, but Explanation Layer adds the "Why")
  if (input.targetApp === AppTarget.UNIVERSAL) {
     const govObs = ruWhitelist.find(w => w.category === 'GOV_INFRASTRUCTURE');
     if (govObs) {
       observations.push({
         type: 'CONTEXT_WARNING',
         title: 'Infrastructure Note',
         content: `Certain segments (e.g., ${govObs.domain}) may require direct connection due to: ${govObs.observation}`,
         source: 'KnowledgeBase'
       });
     }
  }

  return {
    decision: decision.explanation,
    theory,
    observations
  };
}
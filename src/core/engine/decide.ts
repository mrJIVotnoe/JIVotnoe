/**
 * Decision Pipeline Implementation
 *
 * Executes the deterministic logic flow to select a strategy or diagnosis.
 *
 * Pipeline Steps:
 * 1. Input Normalization (handled by caller/types)
 * 2. Context Analysis (analyzeContext)
 * 3. Rule Matching (DecisionRules)
 * 4. Outcome Generation
 *
 * Implements: PROJECT_WHITEPAPER.md → Section 4: DECISION MODEL
 */

import { DecisionInput, DecisionResult } from '../domain/types';
import { StrategyCatalog } from '../knowledge/strategies';
import { DecisionRules } from '../knowledge/rules';
import { analyzeContext } from './analyze';
import { generateExplanation } from './explain';

/**
 * The main decision function.
 * Deterministic: Same Input => Same Result.
 */
export function decideStrategy(input: DecisionInput): DecisionResult {
  // 1. Analyze Context
  const analysis = analyzeContext(input);
  
  // 2. Match Rules
  const matchedRule = DecisionRules.find(rule => rule.match(input));
  
  // 3. Resolve Strategy
  const strategyId = matchedRule ? matchedRule.strategyId : 'unsupported';
  const strategy = StrategyCatalog[strategyId] || StrategyCatalog['unsupported'];
  
  // 4. Construct Result
  const explanationRaw = matchedRule ? matchedRule.reason : 'No matching rule found for this context.';
  
  const result: DecisionResult = {
    strategyId: strategy.id,
    confidence: matchedRule ? matchedRule.confidence : 0.1,
    restrictionClass: analysis.restriction,
    explanation: [explanationRaw],
    warnings: [],
    tags: [input.platform, input.targetApp],
    meta: {
        analysisConditions: analysis.conditions
    }
  };

  // 5. Enrich Warnings
  if (analysis.restriction === 'PLATFORM_RESTRICTION') {
      result.warnings.push('Execution disabled in browser environment.');
  }

  return result;
}
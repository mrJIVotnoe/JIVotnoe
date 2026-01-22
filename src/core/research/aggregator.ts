
/**
 * Aggregation Facade
 * 
 * Bridges the Domain Layer (Observation) with the Research Engine (Aggregation).
 * Implements the "Anti-Corruption Layer" pattern to keep core domains pure.
 */

import { Observation, Hypothesis } from '../domain/types';
import { aggregateInternal } from './aggregation/engine';
import { AggregationObservation } from './aggregation/types';

/**
 * Main entry point for aggregation.
 * Converts domain observations to internal format and runs the engine.
 */
export function aggregateObservations(observations: Observation[]): Hypothesis[] {
  
  // 1. Map Domain -> Engine
  const engineInput = observations.map(obs => {
    const aggObs: AggregationObservation & { strategyId: string } = {
        id: obs.id,
        timestamp: obs.timestamp,
        result: obs.result,
        signals: obs.signals,
        strategyId: obs.strategyId,
        context: {
            platform: obs.input.platform,
            target: obs.input.targetApp,
            network_type: obs.networkContext?.type || 'unknown',
            protocol: obs.networkContext?.protocol || 'tcp'
        }
    };
    return aggObs;
  });

  // 2. Run Engine
  const candidates = aggregateInternal(engineInput);

  // 3. Map Engine -> Domain (Hypothesis)
  // Filter out noise (candidates with < 3 observations)
  const validCandidates = candidates.filter(c => c.metrics.total >= 3);

  return validCandidates.map(c => {
    const { positive, total } = c.metrics;
    const successRate = Math.round((positive / total) * 100);
    const platform = c.context.platform;
    const target = c.context.target;
    
    // Generate human-readable statement
    let statement = "";
    if (c.metrics.confidence > 0.7) {
        statement = `High Confidence: Strategy effectively bypasses ${target} on ${platform} (${successRate}% success).`;
    } else if (c.metrics.confidence < 0.3 && c.metrics.total > 5) {
        statement = `Confirmed Failure: Strategy ineffective for ${target} on ${platform}.`;
    } else {
        statement = `Unstable: Strategy shows mixed results (${successRate}%) for ${target} on ${platform}.`;
    }

    return {
        id: `hyp_${c.key}`,
        statement,
        supportingObservations: c.metrics.positive,
        conflictingObservations: c.metrics.negative,
        confidenceScore: c.metrics.confidence,
        status: 'PENDING_REVIEW'
    };
  });
}


/**
 * Aggregation Facade
 * 
 * Bridges the Domain Layer (Observation) with the Research Engine (Aggregation).
 * Implements the "Anti-Corruption Layer" pattern to keep core domains pure.
 */

import { Observation, Hypothesis, SourceAuthority } from '../domain/types';
import { aggregateInternal } from './aggregation/engine';
import { AggregationObservation } from './aggregation/types';

const AUTHORITY_WEIGHTS: Record<SourceAuthority, number> = {
  [SourceAuthority.ARCHITECT]: 1.0,
  [SourceAuthority.VERIFIED_USER]: 0.99,
  [SourceAuthority.CONDITIONAL_USER]: 0.5,
  [SourceAuthority.AI_REASONING]: 0.1
};

/**
 * Main entry point for aggregation.
 * Converts domain observations to internal format and runs the engine.
 */
export function aggregateObservations(observations: Observation[]): Hypothesis[] {
  
  // 1. Map Domain -> Engine
  const engineInput = observations.map(obs => {
    // Calculate effective weight based on Authority + Human Verification
    let weight = AUTHORITY_WEIGHTS[obs.authority];
    
    // Penalty for unverified humans in a Verified User slot (sanity check)
    if (obs.authority === SourceAuthority.VERIFIED_USER && !obs.context.isHumanVerified) {
        weight = AUTHORITY_WEIGHTS.CONDITIONAL_USER;
    }

    // Penalty for VPN active (distorts DPI results)
    if (obs.context.vpnActive) {
        weight *= 0.5;
    }

    const aggObs: AggregationObservation & { strategyId: string, weight: number } = {
        id: obs.id,
        timestamp: obs.timestamp,
        result: obs.result,
        signals: obs.signals,
        strategyId: obs.strategyId,
        weight: weight,
        context: {
            platform: obs.input.platform,
            target: obs.input.targetApp,
            network_type: obs.context.networkType,
            protocol: 'tcp' // Default for now
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
    const weightedSuccessRate = Math.round((positive / total) * 100); // Internal engine handles weighting now
    const platform = c.context.platform;
    const target = c.context.target;
    
    // Generate human-readable statement
    let statement = "";
    if (c.metrics.confidence > 0.8) {
        statement = `High Confidence (Verified): Strategy effectively bypasses ${target} on ${platform}.`;
    } else if (c.metrics.confidence < 0.2 && c.metrics.total > 5) {
        statement = `Confirmed Failure: Strategy ineffective for ${target} on ${platform}.`;
    } else {
        statement = `Research Result: Strategy shows mixed results (${weightedSuccessRate}%) for ${target} on ${platform}.`;
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
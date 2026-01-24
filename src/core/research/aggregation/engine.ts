
// src/core/research/aggregation/engine.ts

import {
  AggregationObservation,
  CuratedKnowledgeCandidate
} from "./types";
import { buildAggregationKey, normalizeSignals } from "./normalize";
import { calculateWeightedConfidence } from "./confidence";

// Extended interface for internal engine processing
interface WeightedObservation extends AggregationObservation {
  strategyId: string;
  trustWeight: number;     // 0.0 - 1.0
  isArchitect: boolean;
}

export function aggregateInternal(
  observations: WeightedObservation[]
): CuratedKnowledgeCandidate[] {

  const buckets = new Map<string, CuratedKnowledgeCandidate & { 
    weightedPos: number, 
    weightedNeg: number, 
    weightedNeu: number,
    architectInvolved: boolean
  }>();

  for (const obs of observations) {
    const key = buildAggregationKey(obs.signals, obs.context, obs.strategyId);

    if (!buckets.has(key)) {
      buckets.set(key, {
        key,
        signals: normalizeSignals(obs.signals),
        context: obs.context,
        metrics: {
          positive: 0,
          negative: 0,
          neutral: 0,
          total: 0,
          confidence: 0
        },
        // Internal accumulator state
        weightedPos: 0,
        weightedNeg: 0,
        weightedNeu: 0,
        architectInvolved: false,
        
        first_seen: obs.timestamp,
        last_seen: obs.timestamp
      });
    }

    const bucket = buckets.get(key)!;
    const weight = obs.trustWeight || 0.5; // Default to anon

    if (obs.isArchitect) {
        bucket.architectInvolved = true;
    }

    if (obs.result === "SUCCESS") {
        bucket.metrics.positive++;
        bucket.weightedPos += weight;
    }
    else if (obs.result === "FAIL") {
        bucket.metrics.negative++;
        bucket.weightedNeg += weight;
    }
    else {
        bucket.metrics.neutral++;
        bucket.weightedNeu += weight;
    }

    bucket.metrics.total++;
    
    if (new Date(obs.timestamp) > new Date(bucket.last_seen)) {
        bucket.last_seen = obs.timestamp;
    }
  }

  // Calculate confidence using WEIGHTED values
  for (const bucket of buckets.values()) {
    const explanation = calculateWeightedConfidence(
      bucket.weightedPos,
      bucket.weightedNeg,
      bucket.weightedNeu,
      bucket.architectInvolved
    );

    bucket.metrics.confidence = explanation.final_confidence;
    bucket.metrics.explanation = explanation;
  }

  // Return clean candidates
  return Array.from(buckets.values())
    .map(({ weightedPos, weightedNeg, weightedNeu, architectInvolved, ...rest }) => rest)
    .sort((a, b) => b.metrics.confidence - a.metrics.confidence);
}

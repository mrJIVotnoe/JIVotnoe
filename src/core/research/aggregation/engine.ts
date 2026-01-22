
// src/core/research/aggregation/engine.ts

import {
  AggregationObservation,
  CuratedKnowledgeCandidate
} from "./types";
import { buildAggregationKey, normalizeSignals } from "./normalize";
import { calculateConfidenceWithExplanation } from "./confidence";

export function aggregateInternal(
  observations: Array<AggregationObservation & { strategyId: string }>
): CuratedKnowledgeCandidate[] {

  const buckets = new Map<string, CuratedKnowledgeCandidate>();

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
        first_seen: obs.timestamp,
        last_seen: obs.timestamp
      });
    }

    const bucket = buckets.get(key)!;

    if (obs.result === "SUCCESS") bucket.metrics.positive++;
    else if (obs.result === "FAIL") bucket.metrics.negative++;
    else bucket.metrics.neutral++;

    bucket.metrics.total++;
    // Keep the latest timestamp
    if (new Date(obs.timestamp) > new Date(bucket.last_seen)) {
        bucket.last_seen = obs.timestamp;
    }
  }

  // Calculate confidence for each bucket with explanation
  for (const bucket of buckets.values()) {
    const m = bucket.metrics;
    
    const explanation = calculateConfidenceWithExplanation(
      m.positive,
      m.negative,
      m.neutral
    );

    m.confidence = explanation.final_confidence;
    m.explanation = explanation;
  }

  return Array.from(buckets.values())
    .sort((a, b) => b.metrics.confidence - a.metrics.confidence);
}

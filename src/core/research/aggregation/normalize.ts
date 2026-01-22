
// src/core/research/aggregation/normalize.ts

import { AggregationObservation } from "./types";

export function normalizeSignals(signals: string[]): string[] {
  return [...new Set(signals.map(s => s.trim().toLowerCase()))].sort();
}

export function buildAggregationKey(
  signals: string[],
  context: AggregationObservation["context"],
  strategyId: string
): string {
  const signalKey = normalizeSignals(signals).join("|");
  
  // We group by Platform + Strategy + Target + NetworkType
  // This creates specific buckets like: "android:shutdown_ozon:youtube:mobile"
  const contextKey = [
    context.platform ?? "any",
    strategyId,
    context.target ?? "any",
    context.network_type ?? "any",
  ].join(":");

  // Include signals if they exist, otherwise the context is the key
  return signalKey ? `${contextKey}::${signalKey}` : contextKey;
}

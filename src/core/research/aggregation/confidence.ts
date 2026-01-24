
// src/core/research/aggregation/confidence.ts

import { ConfidenceExplanation } from "./types";

/**
 * Calculates a weighted confidence score.
 * 
 * Trust Hierarchy:
 * 1. Architect (1.0 weight) -> Overrides everything.
 * 2. Verified User (0.99 weight) -> Extremely high influence.
 * 3. Anonymous (0.5 weight) -> Requires volume to matter.
 */
export function calculateWeightedConfidence(
  positiveWeight: number,
  negativeWeight: number,
  neutralWeight: number,
  hasArchitectOverride: boolean = false
): ConfidenceExplanation {

  const totalWeight = positiveWeight + negativeWeight + neutralWeight;

  // ARCHITECT OVERRIDE: If the Architect says it works, it works (1.0). 
  // If Architect says it fails, it fails (0.0).
  if (hasArchitectOverride) {
     const isPositive = positiveWeight > negativeWeight;
     return {
       positive_ratio: isPositive ? 1 : 0,
       contradiction_penalty: 1,
       neutral_ratio: 0,
       final_confidence: isPositive ? 1.0 : 0.0,
       notes: ["ARCHITECT OVERRIDE: Axiomatic Truth"]
     };
  }

  if (totalWeight === 0) {
    return {
      positive_ratio: 0,
      contradiction_penalty: 0,
      neutral_ratio: 0,
      final_confidence: 0,
      notes: ["Insufficient data"]
    };
  }

  const positiveRatio = positiveWeight / totalWeight;
  const neutralRatio = neutralWeight / totalWeight;

  // Contradiction Penalty
  // High trust negatives penalize heavily.
  const contradictionPenalty = negativeWeight > 0
    ? Math.max(0, 1 - (negativeWeight / totalWeight))
    : 1;

  // Final Score Calculation
  const finalConfidence = Number(
    (positiveRatio * contradictionPenalty).toFixed(3)
  );

  // Generate Notes
  const notes: string[] = [];

  if (positiveWeight > 5 && negativeWeight === 0) {
    notes.push("Strong consensus among verified users");
  }
  
  if (negativeWeight > 0.5) { // Even half a verified user point matters
    notes.push("Conflict detected: Some trusted sources report failure");
  }

  return {
    positive_ratio: Number(positiveRatio.toFixed(3)),
    contradiction_penalty: Number(contradictionPenalty.toFixed(3)),
    neutral_ratio: Number(neutralRatio.toFixed(3)),
    final_confidence: finalConfidence,
    notes
  };
}

// Deprecated legacy wrapper
export function calculateConfidence(
  positive: number,
  negative: number,
  neutral: number
): number {
  return calculateWeightedConfidence(positive, negative, neutral).final_confidence;
}

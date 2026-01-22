
// src/core/research/aggregation/confidence.ts

import { ConfidenceExplanation } from "./types";

/**
 * Calculates a confidence score with detailed explanation.
 * 
 * Philosophy:
 * - High volume increases base confidence.
 * - Contradictions (negatives) heavily penalize confidence.
 * - Neutrals dilute confidence slightly.
 */
export function calculateConfidenceWithExplanation(
  positive: number,
  negative: number,
  neutral: number
): ConfidenceExplanation {

  const total = positive + negative + neutral;
  if (total === 0) {
    return {
      positive_ratio: 0,
      contradiction_penalty: 0,
      neutral_ratio: 0,
      final_confidence: 0,
      notes: ["No observations available"]
    };
  }

  const positiveRatio = positive / total;
  const neutralRatio = neutral / total;

  // Contradiction Penalty
  // If we have ANY negatives, we reduce confidence.
  // We use a linear penalty relative to the negative ratio.
  const contradictionPenalty = negative > 0
    ? Math.max(0, 1 - (negative / total))
    : 1;

  // Final Score Calculation
  const finalConfidence = Number(
    (positiveRatio * contradictionPenalty).toFixed(3)
  );

  // Generate Notes
  const notes: string[] = [];

  if (negative > 0) {
    notes.push("Confidence reduced due to contradictory observations");
  }

  if (neutralRatio > 0.3) {
    notes.push("High number of neutral observations lowers certainty");
  }

  if (positiveRatio > 0.8 && contradictionPenalty === 1 && total > 5) {
    notes.push("Strong positive consistency across observations");
  }
  
  if (total < 5) {
    notes.push("Low sample size");
  }

  return {
    positive_ratio: Number(positiveRatio.toFixed(3)),
    contradiction_penalty: Number(contradictionPenalty.toFixed(3)),
    neutral_ratio: Number(neutralRatio.toFixed(3)),
    final_confidence: finalConfidence,
    notes
  };
}

/**
 * Legacy wrapper for backward compatibility if needed
 */
export function calculateConfidence(
  positive: number,
  negative: number,
  neutral: number
): number {
  return calculateConfidenceWithExplanation(positive, negative, neutral).final_confidence;
}

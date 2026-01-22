
// src/core/research/aggregation/types.ts

// Re-use domain result type for consistency
export type AggregationResult = "SUCCESS" | "FAIL" | "UNSTABLE";

export interface AggregationObservation {
  id: string;
  signals: string[];                 // normalized signals
  result: AggregationResult;
  context: {
    platform?: string;
    network_type?: string;
    protocol?: string;
    target?: string;
  };
  timestamp: string;                 // ISO
}

export interface ConfidenceExplanation {
  positive_ratio: number;
  contradiction_penalty: number;
  neutral_ratio: number;
  final_confidence: number;
  notes: string[];
}

export interface AggregatedMetrics {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
  confidence: number;
  explanation?: ConfidenceExplanation;
}

export interface CuratedKnowledgeCandidate {
  key: string;                       // aggregation key
  signals: string[];
  context: AggregationObservation["context"];
  metrics: AggregatedMetrics;
  first_seen: string;
  last_seen: string;
}

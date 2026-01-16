
import { KnowledgeSignal } from '../domain/types';

/**
 * Explanation Domain Definitions
 * 
 * Structures for the Explanation Layer which enriches 
 * deterministic decisions with observational knowledge.
 */

export interface ObservationBlock {
  type: 'REGIONAL_NOTE' | 'HISTORICAL_FACT' | 'CONTEXT_WARNING';
  title: string;
  content: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  source: 'KnowledgeBase';
}

export interface DetailedExplanation {
  // The raw explanation from the Decision Engine
  decision: string[];
  
  // Theoretical background (General Research)
  theory: KnowledgeSignal[];
  
  // Real-world specific observations (Regional/App specific)
  observations: ObservationBlock[];
}

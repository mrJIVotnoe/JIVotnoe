
import { NetworkSymptom, AppTarget, RestrictionClass } from './enums';

export type Platform = 'android' | 'windows' | 'linux' | 'ios' | 'browser';

export interface DecisionInput {
  platform: Platform;
  targetApp: AppTarget;
  symptoms: NetworkSymptom[];
  region?: string;
}

export interface StrategyDescriptor {
  id: string;
  name: string;
  intent: string;
  riskLevel: 'safe' | 'moderate' | 'high';
  compatibility: Platform[];
}

export interface DecisionResult {
  strategyId: string;
  confidence: number; // 0.0 to 1.0
  restrictionClass: RestrictionClass;
  explanation: string[];
  warnings: string[];
  tags: string[];
  meta?: Record<string, any>;
}

export interface DetectedCondition {
  type: 'restriction' | 'capability' | 'environment';
  value: string;
  weight: number;
}

export interface AnalysisResult {
  restrictionClass: RestrictionClass;
  confidence: number;
  evidence: string[];
  executionSupported: boolean;
  explanation: string[];
}

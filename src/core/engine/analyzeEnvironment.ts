import { DecisionInput, AnalysisResult, RestrictionClass } from '../domain/types'

export function analyzeEnvironment(input: DecisionInput): AnalysisResult {
  let restrictionClass: RestrictionClass = 'UNKNOWN_RESTRICTION';
  const evidence: string[] = [];
  const explanation: string[] = [
    "Environment shift detected (2026-01-10)",
    "Known execution strategies are no longer reliable",
    "Analysis-only mode enabled"
  ];

  if (input.platform === 'browser') {
    restrictionClass = 'PLATFORM_LEVEL_RESTRICTION';
    evidence.push('Execution context is restricted (Browser Sandbox)');
    explanation.push('Direct packet manipulation is not possible in this environment.');
  } else if (input.symptoms.includes('telegram_fail') || input.symptoms.includes('whatsapp_fail')) {
    restrictionClass = 'TLS_HANDSHAKE_INTERFERENCE';
    evidence.push('High-entropy traffic discrimination detected');
    explanation.push('Targeted protocol analysis active.');
  } else {
    restrictionClass = 'TLS_HANDSHAKE_INTERFERENCE';
    evidence.push('General DPI fingerprinting suspected');
  }

  return {
    restrictionClass,
    confidence: 0.95,
    evidence,
    executionSupported: false,
    explanation
  };
}
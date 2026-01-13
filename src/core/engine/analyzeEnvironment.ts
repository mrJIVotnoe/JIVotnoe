
import { DecisionInput, AnalysisResult } from '../domain/types'
import { RestrictionClass, NetworkSymptom } from '../domain/enums'

export function analyzeEnvironment(input: DecisionInput): AnalysisResult {
  let restrictionClass: RestrictionClass = RestrictionClass.NONE;
  const evidence: string[] = [];
  const explanation: string[] = [
    "Environment shift detected (2026-01-10)",
    "Known execution strategies are no longer reliable",
    "Analysis-only mode enabled"
  ];

  if (input.platform === 'browser') {
    restrictionClass = RestrictionClass.PLATFORM_RESTRICTION;
    evidence.push('Execution context is restricted (Browser Sandbox)');
    explanation.push('Direct packet manipulation is not possible in this environment.');
  } else if (input.symptoms.includes(NetworkSymptom.TELEGRAM_FAIL) || input.symptoms.includes(NetworkSymptom.WHATSAPP_FAIL)) {
    restrictionClass = RestrictionClass.TLS_FINGERPRINTING;
    evidence.push('High-entropy traffic discrimination detected');
    explanation.push('Targeted protocol analysis active.');
  } else {
    restrictionClass = RestrictionClass.TLS_FINGERPRINTING;
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

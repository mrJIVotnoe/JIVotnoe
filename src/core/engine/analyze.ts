
import { DecisionInput, DetectedCondition } from '../domain/types';
import { RestrictionClass, NetworkSymptom } from '../domain/enums';

export function analyzeContext(input: DecisionInput): { restriction: RestrictionClass, conditions: DetectedCondition[] } {
  const conditions: DetectedCondition[] = [];
  let restriction = RestrictionClass.NONE;

  // Platform Analysis
  if (input.platform === 'browser') {
    restriction = RestrictionClass.PLATFORM_RESTRICTION;
    conditions.push({ type: 'environment', value: 'sandbox', weight: 10 });
  }

  // Symptom Analysis
  if (input.symptoms.includes(NetworkSymptom.TLS_HANDSHAKE_FAIL)) {
    restriction = RestrictionClass.TLS_FINGERPRINTING;
    conditions.push({ type: 'restriction', value: 'handshake_drop', weight: 8 });
  }

  if (input.symptoms.includes(NetworkSymptom.DNS_POISONING) || input.symptoms.includes(NetworkSymptom.SNI_BLOCK)) {
    conditions.push({ type: 'restriction', value: 'domain_filter', weight: 5 });
  }

  // App Specifics
  if (input.targetApp === 'TELEGRAM') {
    conditions.push({ type: 'capability', value: 'mtproto_required', weight: 5 });
  }

  // Protocol Whitelisting detection (Simulated "2026 Environment Shift")
  if (input.symptoms.length > 2) {
    restriction = RestrictionClass.PROTOCOL_WHITELISTING;
    conditions.push({ type: 'environment', value: 'high_entropy_block', weight: 9 });
  }

  return { restriction, conditions };
}

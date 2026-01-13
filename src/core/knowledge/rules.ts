
import { DecisionInput } from '../domain/types';
import { NetworkSymptom, AppTarget } from '../domain/enums';

interface Rule {
  id: string;
  match: (input: DecisionInput) => boolean;
  strategyId: string;
  confidence: number;
  reason: string;
}

export const DecisionRules: Rule[] = [
  // Browser Safety Rule
  {
    id: 'browser_sandbox',
    match: (input) => input.platform === 'browser',
    strategyId: 'browser_analysis',
    confidence: 1.0,
    reason: 'Browser environment restricts packet manipulation. Analysis mode only.'
  },
  
  // iOS Restriction Rule
  {
    id: 'ios_walled_garden',
    match: (input) => input.platform === 'ios',
    strategyId: 'vless_tunnel',
    confidence: 0.9,
    reason: 'iOS network stack prevents local DPI bypass. VLESS tunnel required.'
  },

  // Telegram Specific
  {
    id: 'telegram_fix',
    match: (input) => input.targetApp === AppTarget.TELEGRAM || input.symptoms.includes(NetworkSymptom.TELEGRAM_FAIL),
    strategyId: 'telegram_obfuscation',
    confidence: 0.85,
    reason: 'Detected Telegram connectivity issues. Applying MTProto heuristic fixes.'
  },

  // General Windows/Linux DPI
  {
    id: 'desktop_standard',
    match: (input) => ['windows', 'linux'].includes(input.platform) && input.symptoms.includes(NetworkSymptom.DPI_BLOCK),
    strategyId: 'universal_fragment',
    confidence: 0.8,
    reason: 'Standard DPI blocking detected on desktop. Fragmentation recommended.'
  },

  // Fallback for Android
  {
    id: 'android_general',
    match: (input) => input.platform === 'android',
    strategyId: 'universal_fragment',
    confidence: 0.7,
    reason: 'Android platform standard bypass attempt.'
  }
];

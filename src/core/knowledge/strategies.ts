
import { StrategyDescriptor } from '../domain/types';

export const StrategyCatalog: Record<string, StrategyDescriptor> = {
  'universal_fragment': {
    id: 'universal_fragment',
    name: 'Universal Fragmentation',
    intent: 'Bypass standard DPI by splitting TCP packets',
    riskLevel: 'safe',
    compatibility: ['windows', 'linux', 'android']
  },
  'telegram_obfuscation': {
    id: 'telegram_obfuscation',
    name: 'Telegram Randomizer',
    intent: 'Obfuscate traffic specifically for MTProto/Telegram',
    riskLevel: 'moderate',
    compatibility: ['windows', 'linux', 'android']
  },
  'sni_spoof': {
    id: 'sni_spoof',
    name: 'SNI Masquerade',
    intent: 'Mimic legitimate domain handshakes',
    riskLevel: 'moderate',
    compatibility: ['windows', 'linux', 'android']
  },
  'vless_tunnel': {
    id: 'vless_tunnel',
    name: 'VLESS Reality',
    intent: 'Encrypted tunnel with TLS camouflage',
    riskLevel: 'safe',
    compatibility: ['ios', 'android', 'windows', 'linux']
  },
  'browser_analysis': {
    id: 'browser_analysis',
    name: 'Environment Analysis',
    intent: 'Passive analysis mode for browser environment',
    riskLevel: 'safe',
    compatibility: ['browser']
  },
  'unsupported': {
    id: 'unsupported',
    name: 'No Viable Strategy',
    intent: 'Fallback state when no strategy matches',
    riskLevel: 'safe',
    compatibility: ['windows', 'linux', 'android', 'ios', 'browser']
  }
};

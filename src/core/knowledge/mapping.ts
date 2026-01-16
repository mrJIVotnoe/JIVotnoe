/**
 * Knowledge Bridge Mapping
 * 
 * Maps executable Strategy IDs (from StrategyCatalog) to 
 * theoretical Research Scenario IDs (from ScenarioDB).
 * 
 * This file serves as the "Advisory Link". 
 * It allows the UI to show educational context for a selected strategy.
 * 
 * Rule: This file MUST NOT be imported by decide.ts.
 */

export const STRATEGY_TO_SCENARIOS: Record<string, string[]> = {
  // Strategy ID -> Scenario IDs
  'universal_fragment': ['tcp_fragment_basic', 'desync_disorder'],
  'telegram_obfuscation': ['payload_randomization'],
  'sni_spoof': ['sni_mimicry_basic', 'tls_shuffle'],
  'vless_tunnel': [], // VLESS is a tunneling protocol, not a direct DPI manipulation scenario
  'browser_analysis': [],
  'unsupported': []
};
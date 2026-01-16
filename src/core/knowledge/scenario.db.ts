/**
 * Research Scenario Database
 * 
 * A collection of known DPI interaction patterns.
 * This data is for ANALYSIS and EDUCATION only.
 * It is NOT accessed by the execution engine (decide.ts).
 */

import { Scenario } from './scenario.types';

export const STATIC_SCENARIOS: Scenario[] = [
  // --- MASKING SCENARIOS ---
  {
    id: 'sni_mimicry_basic',
    name: 'Basic SNI Masquerade',
    category: 'MASKING',
    trustSurface: 'MEDIUM',
    description: 'Replaces the visible Server Name Indication (SNI) in the ClientHello packet with a whitelisted domain (e.g., google.com).',
    technicalNotes: [
      'Effective against primitive string-matching DPI filters.',
      'Vulnerable to IP-SNI mismatch verification by advanced TSPU.',
      'Requires the target server to ignore the fake SNI or a middlebox to strip it.'
    ],
    historicalEffectiveness: 0.7
  },
  {
    id: 'tls_shuffle',
    name: 'TLS Fingerprint Randomization',
    category: 'MASKING',
    trustSurface: 'HIGH',
    description: 'Randomizes the order of TLS extensions and cipher suites to prevent JA3/JA4 fingerprinting.',
    technicalNotes: [
      'Prevents identification of the client tool (e.g., hiding that it is curl or a bot).',
      'Mimics standard browser behavior (Chrome/Firefox signatures).'
    ],
    historicalEffectiveness: 0.9
  },

  // --- ENTROPY SCENARIOS ---
  {
    id: 'tcp_fragment_basic',
    name: 'TCP Fragmentation',
    category: 'ENTROPY',
    trustSurface: 'HIGH',
    description: 'Splits the TLS ClientHello handshake into multiple TCP segments causing the DPI to see incomplete signatures.',
    technicalNotes: [
      'Forces DPI to perform stateful reassembly, increasing processing cost.',
      'Bypasses DPI systems with limited reassembly buffers or stateless filters.',
      'Standard "ByeDPI" technique.'
    ],
    historicalEffectiveness: 0.8
  },
  {
    id: 'payload_randomization',
    name: 'MTProto Obfuscation',
    category: 'ENTROPY',
    trustSurface: 'MEDIUM',
    description: 'Prefixes payload with random garbage data to shift byte offsets and break static signatures.',
    technicalNotes: [
      'Specifically effective for Telegram (MTProto) traffic.',
      'Makes traffic look like high-entropy noise rather than a structured protocol.'
    ],
    historicalEffectiveness: 0.85
  },

  // --- PRESSURE SCENARIOS ---
  {
    id: 'desync_disorder',
    name: 'TCP Window Exhaustion (Desync)',
    category: 'PRESSURE',
    trustSurface: 'LOW',
    description: 'Manipulates TCP sequence numbers and Window size to desynchronize the middlebox state from the endpoint state.',
    technicalNotes: [
      'Exploits "fail-open" behavior in overloaded DPI systems.',
      'Sends fake "Out-of-Order" packets that the DPI drops but the server ignores.',
      'High risk of connection instability on unstable links.'
    ],
    historicalEffectiveness: 0.6
  },
  {
    id: 'ttl_expiry',
    name: 'TTL Evasion',
    category: 'PRESSURE',
    trustSurface: 'LOW',
    description: 'Sends packets with short TTL that reach the DPI (poisoning its state) but expire before reaching the server.',
    technicalNotes: [
      'Requires precise knowledge of network topology (hops to DPI).',
      'Extremely brittle; stops working if route changes.',
      'Classic "Geneva" strategy pattern.'
    ],
    historicalEffectiveness: 0.4
  }
];


/**
 * Research Scenario Database
 * 
 * A collection of known DPI interaction patterns.
 * This data is for ANALYSIS and EDUCATION only.
 * It is NOT accessed by the execution engine (decide.ts).
 */

import { Scenario } from './scenario.types';

export const STATIC_SCENARIOS: Scenario[] = [
  // --- GENEVA SPECIES (Scientific Classification) ---
  {
    id: 'geneva_tcb_teardown',
    name: 'TCB Teardown (RST Injection)',
    category: 'STATE',
    trustSurface: 'LOW',
    genevaSpecies: 'TCB_TEARDOWN',
    primitives: ['DUPLICATE', 'TAMPER'],
    description: 'Injects packets (RST/FIN) to trick the censor into deleting its Transmission Control Block (TCB), stopping inspection while the connection persists.',
    technicalNotes: [
      'Maps to Geneva Strategy 3 & 4.',
      'Exploits the censor optimization: "Stop tracking closed connections".',
      'Requires sending a fake RST with a checksum that the Server ignores but the Censor accepts.'
    ],
    historicalEffectiveness: 0.95
  },
  {
    id: 'geneva_tcb_desync',
    name: 'TCB Desynchronization (Window)',
    category: 'STATE',
    trustSurface: 'MEDIUM',
    genevaSpecies: 'TCB_DESYNC',
    primitives: ['TAMPER'],
    description: 'Sends data packets with invalid checksums or flags that the censor accepts (advancing its window) but the server rejects.',
    technicalNotes: [
      'Maps to Geneva Strategy 2.',
      'Moves the censor TCP window out of sync with the real connection.',
      'Subsequent legitimate packets are ignored by the censor as "out of window".'
    ],
    historicalEffectiveness: 0.98
  },
  {
    id: 'geneva_hybrid_invalid',
    name: 'Hybrid Flag Injection (FRAPUN)',
    category: 'STATE',
    trustSurface: 'ZERO',
    genevaSpecies: 'HYBRID',
    primitives: ['DUPLICATE', 'TAMPER'],
    description: 'Injects packets with nonsensical TCP flag combinations (e.g. FRAPUN - FIN+RST+ACK+PSH+URG+NULL).',
    technicalNotes: [
      'Maps to Geneva Strategy 5.',
      'Exploits implementation bugs where Censor checks strictly for RST presence, ignoring invalid flags.',
      'Extremely distinct signature; high risk of future detection.'
    ],
    historicalEffectiveness: 0.6
  },

  // --- MASKING SCENARIOS ---
  {
    id: 'sni_mimicry_basic',
    name: 'Basic SNI Masquerade',
    category: 'MASKING',
    trustSurface: 'MEDIUM',
    genevaSpecies: 'HYBRID', // Often used with segmentation
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
    name: 'TCP Segmentation (In-Order)',
    category: 'ENTROPY',
    trustSurface: 'HIGH',
    genevaSpecies: 'SEGMENTATION',
    primitives: ['FRAGMENT'],
    description: 'Splits the TLS ClientHello handshake into multiple TCP segments causing the DPI to see incomplete signatures.',
    technicalNotes: [
      'Maps to Geneva Strategy 6 (Segmentation with ACK).',
      'Forces DPI to perform stateful reassembly, increasing processing cost.',
      'Can be achieved purely client-side without raw sockets (user-space fragmentation).'
    ],
    historicalEffectiveness: 0.8
  },
  {
    id: 'payload_randomization',
    name: 'MTProto Obfuscation',
    category: 'ENTROPY',
    trustSurface: 'MEDIUM',
    primitives: ['TAMPER'],
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
    name: 'TCP Window Exhaustion (Disorder)',
    category: 'PRESSURE',
    trustSurface: 'LOW',
    genevaSpecies: 'TCB_DESYNC',
    primitives: ['DUPLICATE', 'TAMPER'],
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
    genevaSpecies: 'TCB_TEARDOWN',
    primitives: ['TAMPER'],
    description: 'Sends packets with short TTL that reach the DPI (poisoning its state) but expire before reaching the server.',
    technicalNotes: [
      'Requires precise knowledge of network topology (hops to DPI).',
      'Extremely brittle; stops working if route changes.',
      'Classic "Geneva" strategy pattern.'
    ],
    historicalEffectiveness: 0.4
  }
];

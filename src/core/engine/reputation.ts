
/**
 * SNI Reputation Engine
 * 
 * Analyzes a given domain against the internal Knowledge Base
 * to determine its reliability as a camouflage target.
 */

import { RU_WHITELIST_OBSERVATIONS } from '../knowledge/whitelist.ru';

export type ReputationLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL' | 'UNKNOWN';

export interface SniReputation {
  domain: string;
  level: ReputationLevel;
  note: string;
  isInfrastructure: boolean;
}

export function checkSniReputation(domainInput: string): SniReputation {
  const domain = domainInput.toLowerCase().trim();
  
  // 1. Check Exact Match in Knowledge Base
  const known = RU_WHITELIST_OBSERVATIONS.find(obs => obs.domain === domain);
  
  if (known) {
    return {
      domain,
      level: known.trustLevel as ReputationLevel,
      note: known.observation,
      isInfrastructure: true
    };
  }

  // 2. Heuristic Analysis (Unknown Domain)
  
  // High Risk TLDs for RU region
  if (domain.endsWith('.ua') || domain.endsWith('.eu')) {
    return {
      domain,
      level: 'LOW',
      note: 'Regional TLD risk. High probability of geo-blocking regardless of DPI.',
      isInfrastructure: false
    };
  }

  // Common infrastructure keywords
  if (domain.includes('google') || domain.includes('cloudflare') || domain.includes('cdn')) {
    return {
      domain,
      level: 'MEDIUM',
      note: 'Global Infrastructure. Likely to work, but heavily monitored.',
      isInfrastructure: true
    };
  }

  // Default for unknown
  return {
    domain,
    level: 'UNKNOWN',
    note: 'No historical data. Verify connectivity via NetProbe before use.',
    isInfrastructure: false
  };
}


/**
 * Driver Manager
 * 
 * Handles the logic for the "Community Driver Protocol".
 * Validates, Parses, and Mounts external strategy packs.
 */

import { CommunityDriverManifest, CommunityStrategy } from '../domain/types';

export class DriverManager {
  
  static validate(json: any): { valid: boolean; error?: string } {
    if (!json || typeof json !== 'object') {
      return { valid: false, error: 'Invalid JSON format' };
    }

    if (json.manifest_version !== 1) {
      return { valid: false, error: 'Unsupported manifest version' };
    }

    if (!json.strategies || !Array.isArray(json.strategies)) {
      return { valid: false, error: 'Missing strategies array' };
    }

    // Deep check
    for (const strat of json.strategies) {
      if (!strat.id || !strat.command || !strat.name) {
        return { valid: false, error: `Invalid strategy definition in driver: ${strat.id || 'unknown'}` };
      }
      
      // SAFETY CHECK: Prevent shell injection characters in command
      // We allow standard args, hex, but forbid chaining (&&, ||, ;)
      if (/[;&|]/.test(strat.command)) {
         return { valid: false, error: `Security Violation: Strategy ${strat.id} contains forbidden shell characters.` };
      }
    }

    return { valid: true };
  }

  static parse(jsonString: string): CommunityDriverManifest {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = this.validate(parsed);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      return parsed as CommunityDriverManifest;
    } catch (e: any) {
      throw new Error(`Driver Parse Error: ${e.message}`);
    }
  }
}

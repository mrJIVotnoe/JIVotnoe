
/**
 * Driver Manager
 * 
 * Handles the logic for the "Community Driver Protocol".
 * Validates, Parses, and Mounts external strategy packs.
 * 
 * V2 Feature: "The Scavenger" - Can parse raw text (VLESS keys) to extract SNIs.
 */

import { CommunityDriverManifest, CommunityStrategy } from '../domain/types';

export class DriverManager {
  
  static validate(json: any): { valid: boolean; error?: string } {
    if (!json || typeof json !== 'object') {
      return { valid: false, error: 'Invalid JSON format' };
    }

    if (json.manifest_version !== 1) {
      return { valid: false, error: 'Unsupported manifest version (Only v1 supported)' };
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

  /**
   * Tries to parse the input as JSON first.
   * If that fails, it tries to "Scavenge" the text for VLESS keys and SNIs.
   */
  static parse(inputString: string): CommunityDriverManifest {
    const trimmed = inputString.trim();

    // 1. Try Standard JSON Driver
    if (trimmed.startsWith('{')) {
        try {
            const parsed = JSON.parse(trimmed);
            const validation = this.validate(parsed);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            return parsed as CommunityDriverManifest;
        } catch (e: any) {
            throw new Error(`Driver Parse Error: ${e.message}`);
        }
    }

    // 2. Try "Scavenger Mode" (Raw Text Analysis)
    const scavengedDriver = this.scavenge(inputString);
    if (scavengedDriver) {
        return scavengedDriver;
    }

    throw new Error("Input is neither a valid JSON Driver nor a recognized key format.");
  }

  /**
   * Scavenger Logic: Extracts SNIs from vless:// strings and builds a driver
   */
  private static scavenge(text: string): CommunityDriverManifest | null {
    const snis = new Set<string>();
    
    // Regex to find sni=... in standard VLESS/V2Ray formats
    // Matches: sni=google.com or sni=google.com&
    const sniRegex = /sni=([a-zA-Z0-9.-]+)/g;
    
    let match;
    while ((match = sniRegex.exec(text)) !== null) {
        if (match[1]) {
            snis.add(match[1]);
        }
    }

    if (snis.size === 0) return null;

    // Convert found SNIs into Strategies
    const strategies: CommunityStrategy[] = Array.from(snis).map((sni, idx) => ({
        id: `scavenger_sni_${idx}`,
        name: `Scavenged: ${sni}`,
        description: `Auto-generated strategy using SNI extracted from imported keys.`,
        // Default reliable command template with the found SNI
        command: `-o1 -r-5+se -a1 -At,r,s -d1 -n ${sni} -Qr -f-1 -a1`,
        tags: ["SCAVENGED", "AUTO"],
        recommended: false
    }));

    return {
        manifest_version: 1,
        id: `scavenger_session_${Date.now()}`,
        name: "Scavenger Output",
        author: "The Lab (Auto-Gen)",
        description: `Generated from ${snis.size} unique SNI(s) found in clipboard text.`,
        strategies: strategies,
        created_at: new Date().toISOString()
    };
  }
}

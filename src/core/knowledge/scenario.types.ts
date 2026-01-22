
/**
 * Knowledge Domain Definitions
 *
 * Defines the vocabulary for static research scenarios.
 * These types are used for educational and analytical purposes only.
 * They describe theoretical interactions with DPI systems.
 */

export type TrustSurface = 
  | 'HIGH'   // Traffic looks native/trusted (e.g. standard TLS to Google)
  | 'MEDIUM' // Traffic looks ambiguous but valid
  | 'LOW'    // Traffic looks suspicious (e.g. non-standard headers)
  | 'ZERO';  // Traffic is actively hostile or malformed

export type GenevaPrimitive = 'DROP' | 'TAMPER' | 'DUPLICATE' | 'FRAGMENT';

export type GenevaSpecies = 
  | 'TCB_TEARDOWN'        // Inducing premature session closure in middlebox
  | 'TCB_DESYNC'          // Desynchronizing window/sequence state
  | 'SEGMENTATION'        // Exploiting reassembly failures
  | 'HYBRID';             // Combination of techniques

export type ScenarioCategory = 
  | 'MASKING'  // Hiding the true destination
  | 'PRESSURE' // Stressing the inspector's resources
  | 'ENTROPY'  // Increasing randomness/chaos
  | 'STATE';   // Geneva: Manipulating the censor's TCP State Machine

export interface Scenario {
  id: string;
  name: string;
  category: ScenarioCategory;
  description: string;
  trustSurface: TrustSurface;
  
  // Geneva Taxonomy Integration
  genevaSpecies?: GenevaSpecies;
  primitives?: GenevaPrimitive[];
  
  // Technical details for research display, not execution
  technicalNotes?: string[];
  // Historical effectiveness rating (0.0 - 1.0)
  historicalEffectiveness: number;
}


/**
 * Static Categories for DPI Interaction Models.
 * 
 * Used to classify research scenarios based on their fundamental 
 * method of evasion.
 */

import { ScenarioCategory } from './scenario.types';

export interface CategoryDescriptor {
  id: ScenarioCategory;
  label: string;
  intent: string;
  philosophicalAlign: string;
}

export const SCENARIO_CATEGORIES: Record<ScenarioCategory, CategoryDescriptor> = {
  MASKING: {
    id: 'MASKING',
    label: 'Signal Masking',
    intent: 'Camouflage traffic as legitimate trusted services (SNI/TLS).',
    philosophicalAlign: 'To become invisible, one must look like everything else.'
  },
  PRESSURE: {
    id: 'PRESSURE',
    label: 'Resource Exhaustion',
    intent: 'Overwhelm the inspector\'s CPU or Memory (State Holding).',
    philosophicalAlign: 'The system has finite resources; the chaos is infinite.'
  },
  ENTROPY: {
    id: 'ENTROPY',
    label: 'Entropy Injection',
    intent: 'Increase randomness to prevent signature matching.',
    philosophicalAlign: 'Order allows control; disorder allows freedom.'
  },
  STATE: {
    id: 'STATE',
    label: 'State Desynchronization',
    intent: 'Desynchronize the middlebox TCP state from the endpoint state (Geneva Class).',
    philosophicalAlign: 'The map is not the territory; the censor\'s state is not the connection.'
  }
};

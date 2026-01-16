
/**
 * Read-Only Knowledge API
 * 
 * Provides purely observational data for UI context, educational displays,
 * and diagnostic explanation.
 * 
 * ⚠️ ARCHITECTURAL RULE:
 * This module MUST NOT be imported by `decide.ts` or any execution logic.
 * It is strictly for "Memory", never for "Reason".
 */

import { RU_WHITELIST_OBSERVATIONS } from './whitelist.ru';
import { RU_SCENARIO_OBSERVATIONS } from './scenarios.ru';

export type WhitelistObservation = typeof RU_WHITELIST_OBSERVATIONS[number];
export type ScenarioObservation = typeof RU_SCENARIO_OBSERVATIONS[number];

/**
 * Retrieve whitelist observations for a specific region.
 * Returns readonly data. No filtering or logic applied.
 */
export function getWhitelistObservations(region: 'ru'): readonly WhitelistObservation[] {
  switch (region) {
    case 'ru':
      return RU_WHITELIST_OBSERVATIONS;
    default:
      return [];
  }
}

/**
 * Retrieve scenario observations for a specific region.
 * Returns readonly data. No filtering or logic applied.
 */
export function getScenarioObservations(region: 'ru'): readonly ScenarioObservation[] {
  switch (region) {
    case 'ru':
      return RU_SCENARIO_OBSERVATIONS;
    default:
      return [];
  }
}

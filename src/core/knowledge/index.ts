
// Knowledge is informational, not prescriptive

/**
 * Knowledge Base Entry Point
 * 
 * Exports static datasets used for analysis, explanation, and education.
 * These exports MUST NOT be imported by `decide.ts`.
 */

export * from './scenario.types';
export * from './scenario.categories';
export * from './scenario.db';
export * from './mapping';
export * from './strategies';
export * from './rules';

// Regional Knowledge Bases
export * from './whitelist.ru';
export * from './scenarios.ru';

// Read-Only API
export * from './getObservations';

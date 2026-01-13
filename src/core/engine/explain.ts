
import { DecisionResult, StrategyDescriptor } from '../domain/types';

export function generateExplanation(
  result: DecisionResult,
  strategy: StrategyDescriptor,
  lang: 'ru' | 'en' = 'en'
): string[] {
  const steps: string[] = [];

  if (lang === 'ru') {
    steps.push(`Диагностика: ${result.restrictionClass}`);
    steps.push(`Решение: ${strategy.name}`);
    steps.push(`Причина: ${result.explanation.join('. ')}`);
    if (result.confidence < 0.5) {
      steps.push('Внимание: Низкая уверенность в решении.');
    }
  } else {
    steps.push(`Diagnosis: ${result.restrictionClass}`);
    steps.push(`Solution: ${strategy.name}`);
    steps.push(`Reason: ${result.explanation.join('. ')}`);
    if (result.confidence < 0.5) {
      steps.push('Warning: Low confidence in solution.');
    }
  }

  return steps;
}

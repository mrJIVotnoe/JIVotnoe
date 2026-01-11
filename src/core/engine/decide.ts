import { DecisionInput, DecisionResult } from '../domain/types'
import { StrategyType } from '../domain/strategies'
import { strategyCapabilities } from '../knowledge/strategyCapabilities'
import { analyze } from './analyze'
import { explain } from './explain'

export function decide(input: DecisionInput): DecisionResult {
  const analysis = analyze(input)

  if (analysis.platform === 'browser') {
    return {
      strategy: 'unsupported',
      confidence: 1,
      explanation: explain('unsupported', analysis),
    }
  }

  for (const strategy of Object.keys(strategyCapabilities) as StrategyType[]) {
    const cap = strategyCapabilities[strategy]

    if (
      cap.platforms.includes(analysis.platform) &&
      analysis.symptoms.some(s => cap.handles.includes(s))
    ) {
      return {
        strategy,
        confidence: 0.8,
        explanation: explain(strategy, analysis),
      }
    }
  }

  return {
    strategy: 'unsupported',
    confidence: 0.5,
    explanation: explain('unsupported', analysis),
  }
}
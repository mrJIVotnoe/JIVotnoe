import { StrategyType } from '../domain/strategies'
import { Platform, Symptom } from '../domain/types'

export function explain(
  strategy: StrategyType,
  ctx: { platform: Platform; symptoms: Symptom[] }
): string[] {
  if (strategy === 'unsupported') {
    return [
      `Execution is not supported on platform: ${ctx.platform}`,
      'Browser can be used only for analysis and instructions',
    ]
  }

  return [
    `Selected strategy: ${strategy}`,
    `Platform: ${ctx.platform}`,
    `Detected symptoms: ${ctx.symptoms.join(', ')}`,
  ]
}
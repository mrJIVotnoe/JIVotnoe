import { DecisionInput } from '../domain/types'

export function analyze(input: DecisionInput) {
  return {
    platform: input.platform,
    symptoms: input.symptoms,
  }
}
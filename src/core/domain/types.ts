import { StrategyType } from './strategies'

export type Platform =
  | 'windows'
  | 'linux'
  | 'macos'
  | 'android'
  | 'browser'

export type Symptom =
  | 'dpi_block'
  | 'sni_block'
  | 'tcp_reset'
  | 'tls_handshake_fail'

export interface DecisionInput {
  platform: Platform
  symptoms: Symptom[]
}

export interface DecisionResult {
  strategy: StrategyType
  confidence: number
  explanation: string[]
}
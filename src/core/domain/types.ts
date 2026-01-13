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
  | 'telegram_fail'
  | 'whatsapp_fail'

export type RestrictionClass =
  | 'TLS_HANDSHAKE_INTERFERENCE'
  | 'QUIC_BLOCKING'
  | 'DNS_MANIPULATION'
  | 'PLATFORM_LEVEL_RESTRICTION'
  | 'UNKNOWN_RESTRICTION'

export interface AnalysisResult {
  restrictionClass: RestrictionClass
  confidence: number
  evidence: string[]
  executionSupported: false
  explanation: string[]
}

export interface DecisionInput {
  platform: Platform
  symptoms: Symptom[]
}

export interface DecisionResult {
  strategy: StrategyType
  confidence: number
  explanation: string[]
  analysis?: AnalysisResult
}
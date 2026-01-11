import { StrategyType } from '../domain/strategies'
import { Platform, Symptom } from '../domain/types'

export const strategyCapabilities: Record<
  StrategyType,
  {
    platforms: Platform[]
    handles: Symptom[]
  }
> = {
  byedpi: {
    platforms: ['windows', 'linux'],
    handles: ['dpi_block', 'tcp_reset'],
  },

  v2ray: {
    platforms: ['android', 'windows'],
    handles: ['sni_block', 'tls_handshake_fail'],
  },

  unsupported: {
    platforms: ['browser'],
    handles: [],
  },
}
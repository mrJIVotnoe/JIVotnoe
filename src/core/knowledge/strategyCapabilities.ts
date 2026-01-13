
import { StrategyType } from '../domain/strategies'
import { Platform } from '../domain/types'
import { NetworkSymptom } from '../domain/enums'

export const strategyCapabilities: Record<
  StrategyType,
  {
    platforms: Platform[]
    handles: NetworkSymptom[]
  }
> = {
  byedpi: {
    platforms: ['windows', 'linux'],
    handles: [NetworkSymptom.DPI_BLOCK, NetworkSymptom.TCP_RESET],
  },

  v2ray: {
    platforms: ['android', 'windows'],
    handles: [NetworkSymptom.SNI_BLOCK, NetworkSymptom.TLS_HANDSHAKE_FAIL],
  },

  unsupported: {
    platforms: ['browser'],
    handles: [],
  },
}

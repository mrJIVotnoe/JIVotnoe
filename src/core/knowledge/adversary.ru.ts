
/**
 * Adversary Intelligence: TSPU (Russia)
 * 
 * Profile of "Technical Means of Countering Threats" (ТСПУ).
 * Based on public research (Citizen Lab, Censored Planet, Wikipedia) and empirical data.
 * 
 * Role: The "Opponent" in the evasion game.
 */

import { AdversaryProfile } from '../domain/types';

export const TSPU_PROFILE: AdversaryProfile = {
  id: 'ru_tspu',
  name: 'TSPU (EcoDPI / RDP.ru)',
  type: 'IN_LINE', // Physical placement in the cable gap
  description: 'Централизованно управляемый программно-аппаратный комплекс DPI. Установлен на узлах связи провайдеров, но управляется ГРЧЦ (РКН). Способен к поведенческому анализу трафика (DPI) и шейпингу (замедлению).',
  capabilities: [
    'PASSIVE_OS_FINGERPRINTING', // Identifies OS based on TTL and Window Size
    'SNI_BLOCKING', // Blocks HTTPS based on ClientHello SNI
    'PROTOCOL_SIGNATURES', // Identifies WireGuard/OpenVPN headers
    'QUIC_THROTTLING' // Drops UDP packets to degrade YouTube/HTTP3
  ],
  knownWeaknesses: [
    'STATE_DESYNCHRONIZATION', // Vulnerable to Geneva-style TCB desync
    'FIRST_PACKET_PROCESSING', // Often decides fate based on first packet only (optimization)
    'FRAGMENTATION_REASSEMBLY', // Limited buffer for reassembling split packets
    'WHITELIST_BLINDNESS' // Cannot deeply inspect high-load allowed domains (Ozon/VK) without latency
  ]
};

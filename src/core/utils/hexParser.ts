
/**
 * HEX Parser Utility
 * 
 * Analyzes binary payloads (often used in --fake-data arguments)
 * and translates them into human-readable protocol descriptions.
 * 
 * Used for "The Lab" and Strategy Visualizer.
 */

export interface ParsedHex {
  protocol: string;
  details: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function parseHexPayload(hexString: string): ParsedHex {
  // Normalize: remove 0x, spaces, colons, quotes
  const cleanHex = hexString.replace(/^(0x|\\x|:)/, '').replace(/[\s:'"]/g, '').toUpperCase();

  if (cleanHex.length < 4) {
    return { protocol: 'UNKNOWN', details: 'Payload too short', risk: 'LOW' };
  }

  // --- TLS Handshake (16 03 0X) ---
  // 16 = Handshake, 03 0X = SSL/TLS Version
  if (cleanHex.startsWith('1603')) {
    const version = cleanHex.substring(4, 6);
    let verLabel = 'Unknown';
    if (version === '01') verLabel = 'TLS 1.0';
    if (version === '02') verLabel = 'TLS 1.1';
    if (version === '03') verLabel = 'TLS 1.2';
    // TLS 1.3 masquerades as 1.2 in record layer usually, but let's check basic headers

    return {
      protocol: 'TLS ClientHello',
      details: `Emulated Handshake (${verLabel}). High entropy payload.`,
      risk: 'MEDIUM' // Can be fingreprinted if static
    };
  }

  // --- HTTP Methods ---
  // GET (47 45 54)
  if (cleanHex.startsWith('474554')) {
    return { protocol: 'HTTP', details: 'Plain HTTP GET Request', risk: 'HIGH' }; // Easy to detect
  }
  // POST (50 4F 53 54)
  if (cleanHex.startsWith('504F5354')) {
    return { protocol: 'HTTP', details: 'Plain HTTP POST Request', risk: 'HIGH' };
  }
  // HEAD (48 45 41 44)
  if (cleanHex.startsWith('48454144')) {
    return { protocol: 'HTTP', details: 'Plain HTTP HEAD Request', risk: 'HIGH' };
  }

  // --- QUIC / UDP ---
  // QUIC Long Header usually starts with 1xxx xxxx (Bit 7 is 1)
  // This is heuristic, as raw hex implies a TCP payload usually, but valid for UDP --fake arguments
  const firstByte = parseInt(cleanHex.substring(0, 2), 16);
  if ((firstByte & 0x80) !== 0 && (firstByte & 0x40) !== 0) {
      // Possible QUIC Initial
      return { 
          protocol: 'QUIC/UDP', 
          details: 'Potential QUIC Long Header (Initial).', 
          risk: 'MEDIUM' 
      };
  }
  
  // --- Zero Padding ---
  if (/^0+$/.test(cleanHex)) {
    return { protocol: 'PADDING', details: `Zero-fill padding (${cleanHex.length / 2} bytes)`, risk: 'LOW' };
  }

  // --- Random High Entropy ---
  return {
    protocol: 'BINARY / RAW',
    details: `Custom payload (${cleanHex.length / 2} bytes). High Entropy.`,
    risk: 'MEDIUM'
  };
}

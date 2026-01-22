
import { DiagnosticTarget, DIAGNOSTIC_TARGETS } from '../knowledge/diagnosis.targets';

export type ProbeStatus = 'AVAILABLE' | 'BLOCKED' | 'TIMEOUT' | 'ERROR';

export interface ProbeResult {
  target: DiagnosticTarget;
  status: ProbeStatus;
  latency: number;
}

/**
 * Probes a single target to check connectivity.
 * Uses 'no-cors' mode to detect network-level blocks (DPI/RST/Timeout)
 * vs successful handshakes (even if content is opaque).
 */
async function probeTarget(target: DiagnosticTarget, timeoutMs = 5000): Promise<ProbeResult> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();

  try {
    // Mode 'no-cors' allows us to send a request to another origin.
    // If the handshake succeeds, the promise resolves (opaque response).
    // If DPI blocks the handshake (RST) or DNS fails, the promise rejects.
    await fetch(target.url, { 
      mode: 'no-cors', 
      method: 'HEAD', // Lightweight
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(id);
    return { target, status: 'AVAILABLE', latency: Math.round(performance.now() - start) };
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      return { target, status: 'TIMEOUT', latency: timeoutMs };
    }
    // Network error (DNS, TCP Reset, Connection Refused) usually implies blocking in this context
    return { target, status: 'BLOCKED', latency: Math.round(performance.now() - start) };
  }
}

/**
 * Runs a full diagnostic scan on all targets.
 */
export async function runNetworkDiagnostics(
  onProgress?: (completed: number, total: number) => void
): Promise<ProbeResult[]> {
  const results: ProbeResult[] = [];
  let completed = 0;

  // Run in chunks to avoid browser connection limits
  const CHUNK_SIZE = 3;
  for (let i = 0; i < DIAGNOSTIC_TARGETS.length; i += CHUNK_SIZE) {
    const chunk = DIAGNOSTIC_TARGETS.slice(i, i + CHUNK_SIZE);
    
    const chunkResults = await Promise.all(
      chunk.map(async (target) => {
        const res = await probeTarget(target);
        completed++;
        if (onProgress) onProgress(completed, DIAGNOSTIC_TARGETS.length);
        return res;
      })
    );
    
    results.push(...chunkResults);
  }

  return results;
}

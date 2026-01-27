
/**
 * PII Guard (Personally Identifiable Information)
 * 
 * The Responsibility Layer.
 * scans input text for sensitive patterns to prevent accidental leaks to AI.
 * 
 * This runs entirely Client-Side.
 */

export interface PiiThreat {
  type: 'EMAIL' | 'IP_ADDRESS' | 'PHONE' | 'KEY_PATTERN';
  match: string;
  severity: 'HIGH' | 'MEDIUM';
}

const REGEX_LIB = {
  // Simple Email Regex
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  
  // IPv4 Address (Common leak in network diagnostics)
  IP_V4: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  
  // Generic Private Key Pattern (starts with sk-, eyJ, etc)
  API_KEY: /\b(sk-[a-zA-Z0-9]{20,}|eyJ[a-zA-Z0-9]{20,})\b/g
};

export const scanForPii = (text: string): PiiThreat[] => {
  const threats: PiiThreat[] = [];

  // 1. Scan Emails
  const emails = text.match(REGEX_LIB.EMAIL);
  if (emails) {
    emails.forEach(match => threats.push({ type: 'EMAIL', match, severity: 'MEDIUM' }));
  }

  // 2. Scan IPs (We filter out local IPs like 127.0.0.1 or 192.168.x.x as Low Risk, but public IPs are High)
  const ips = text.match(REGEX_LIB.IP_V4);
  if (ips) {
    ips.forEach(match => {
      // Ignore localhost
      if (match.startsWith('127.') || match.startsWith('192.168.') || match.startsWith('10.')) return;
      threats.push({ type: 'IP_ADDRESS', match, severity: 'HIGH' });
    });
  }

  // 3. Scan Keys
  const keys = text.match(REGEX_LIB.API_KEY);
  if (keys) {
    keys.forEach(match => threats.push({ type: 'KEY_PATTERN', match, severity: 'HIGH' }));
  }

  return threats;
};

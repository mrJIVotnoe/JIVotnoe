
/**
 * Simple test suite for Core Logic.
 * Run via: npm test (if configured) or check via console in dev.
 */
import { Core } from './index';
import { AppTarget, NetworkSymptom } from './domain/enums';

const runTests = () => {
  console.group('Core Architecture Tests');

  // Test 1: Browser Restriction
  const browserResult = Core.decide({
    platform: 'browser',
    targetApp: AppTarget.UNKNOWN,
    symptoms: []
  });
  console.assert(browserResult.strategyId === 'browser_analysis', 'Browser should return analysis mode');
  console.assert(browserResult.confidence === 1.0, 'Browser check should be 100% confident');

  // Test 2: iOS Restriction
  const iosResult = Core.decide({
    platform: 'ios',
    targetApp: AppTarget.YOUTUBE,
    symptoms: [NetworkSymptom.DPI_BLOCK]
  });
  console.assert(iosResult.strategyId === 'vless_tunnel', 'iOS should recommend VLESS');

  // Test 3: Telegram Logic
  const tgResult = Core.decide({
    platform: 'android',
    targetApp: AppTarget.TELEGRAM,
    symptoms: [NetworkSymptom.TELEGRAM_FAIL]
  });
  console.assert(tgResult.strategyId === 'telegram_obfuscation', 'Telegram fail should trigger obfuscation');

  // Test 4: Unknown
  const unknownResult = Core.decide({
    platform: 'windows',
    targetApp: AppTarget.UNKNOWN,
    symptoms: []
  });
  // Should hit default windows rule or fallback
  console.assert(unknownResult.strategyId !== 'unsupported', 'Windows should have a default strategy');

  console.log('Tests Completed.');
  console.groupEnd();
};

// Auto-run if in test environment (mock)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    runTests();
}

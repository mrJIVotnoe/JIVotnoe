import { useEffect, useState } from 'react';
import { telegram } from '../services/telegram';

export function useTelegram() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    if (telegram.isAvailable()) {
      telegram.init();
      setIsTelegram(true);
      setPlatform(telegram.platform);
    }
  }, []);

  return {
    isTelegram,
    platform,
    webApp: telegram.webApp,
    close: telegram.close,
  };
}

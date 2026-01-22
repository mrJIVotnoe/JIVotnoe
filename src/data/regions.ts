
import { RegionWhitelist } from '../types';

export const REGIONAL_DATA: RegionWhitelist[] = [
  {
    id: 'global',
    name: 'Global / Universal',
    flag: '🌐',
    mimicry: [
      { domain: 'www.google.com', category: 'tech', note: 'Universal' },
      { domain: 'www.microsoft.com', category: 'tech', note: 'Trusted' },
      { domain: 'www.apple.com', category: 'tech', note: 'Trusted' }
    ],
    bypass: [
      { domain: 'accounts.google.com', category: 'tech' },
      { domain: 'icloud.com', category: 'tech' }
    ]
  },
  {
    id: 'ru',
    name: 'Russia',
    flag: '🇷🇺',
    mimicry: [
      { domain: 'st.ozone.ru', category: 'retail', note: 'MTS, Megafon, T2, Yota (Top Tier)' },
      { domain: 'stats.vk-portal.net', category: 'social', note: 'MTS, Megafon, RTK (Stable)' },
      { domain: 'splitter.wb.ru', category: 'retail', note: 'MTS, Megafon, T2' },
      { domain: 'goya.rutube.ru', category: 'social', note: 'Video CDN (High Bandwidth)' },
      { domain: 'mddc.tinkoff.ru', category: 'finance', note: 'Alternative SNI' },
      { domain: 'moscow.megafon.ru', category: 'tech', note: 'Best for Megafon users' },
      { domain: 'api.mindbox.ru', category: 'tech', note: 'Generic Marketing API' }
    ],
    bypass: [
      { domain: 'online.sberbank.ru', category: 'finance' },
      { domain: 'alfabank.ru', category: 'finance' },
      { domain: 'tbank.ru', category: 'finance' },
      { domain: 'lk.gosuslugi.ru', category: 'gov' },
      { domain: 'www.nalog.gov.ru', category: 'gov' },
      { domain: 'vk.com', category: 'social' },
      { domain: 'wildberries.ru', category: 'retail' },
      { domain: 'ozon.ru', category: 'retail' }
    ]
  },
  {
    id: 'kz',
    name: 'Kazakhstan',
    flag: '🇰🇿',
    mimicry: [
      { domain: 'kolesa.kz', category: 'retail' },
      { domain: 'krisha.kz', category: 'retail' }
    ],
    bypass: [
      { domain: 'kaspi.kz', category: 'finance' },
      { domain: 'egov.kz', category: 'gov' }
    ]
  },
  {
    id: 'uz',
    name: 'Uzbekistan',
    flag: '🇺🇿',
    mimicry: [
      { domain: 'olx.uz', category: 'retail' },
      { domain: 'uzum.uz', category: 'retail' }
    ],
    bypass: [
      { domain: 'payme.uz', category: 'finance' },
      { domain: 'my.gov.uz', category: 'gov' }
    ]
  },
  {
    id: 'cn',
    name: 'China',
    flag: '🇨🇳',
    mimicry: [
      { domain: 'www.baidu.com', category: 'tech' },
      { domain: 'www.taobao.com', category: 'retail' },
      { domain: 'v.qq.com', category: 'social' }
    ],
    bypass: [
      { domain: 'alipay.com', category: 'finance' },
      { domain: 'wechat.com', category: 'social' }
    ]
  }
];

// Re-export whitelists as strictly typed
export const SNI_DOMAINS = REGIONAL_DATA.flatMap(r => r.mimicry);
export const DIRECT_DOMAINS = REGIONAL_DATA.flatMap(r => r.bypass).map(b => b.domain);

import { DnsProvider } from '../types';

export const DNS_SERVERS: DnsProvider[] = [
  {
    name: "Quad9",
    primary: "9.9.9.9",
    secondary: "149.112.112.112",
    description: {
      ru: "Безопасность и нейтральность.",
      en: "Security and neutrality.",
      zh: "安全与中立。",
      tr: "Güvenlik ve tarafsızlık."
    },
    type: "security"
  },
  {
    name: "AdGuard DNS",
    primary: "94.140.14.14",
    secondary: "94.140.15.15",
    description: { ru: "Блокировка рекламы.", en: "Ad blocking.", zh: "广告拦截。", tr: "Reklam engelleme." },
    type: "privacy"
  }
];

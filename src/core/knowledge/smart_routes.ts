
/**
 * SMART ROUTES KNOWLEDGE BASE
 * 
 * This file contains high-value CIDR ranges for services often subject to throttling.
 * Used to generate "Precision Strike" routing configurations.
 * 
 * Data Source: Aggregated Analysis (GGC, Meta Edge, Discord Gateway).
 */

export const SMART_ROUTES = {
  // Google Global Cache / YouTube Video Infrastructure
  google_video: [
    "173.194.0.0/16",
    "74.125.0.0/16",
    "142.250.0.0/15",
    "142.251.0.0/16",
    "209.85.128.0/17",
    "216.58.192.0/19",
    "216.239.32.0/19",
    "64.233.160.0/19",
    "66.102.0.0/20",
    "66.249.80.0/20",
    "72.14.192.0/18"
  ],
  
  // Discord Voice & Gateway
  discord: [
    "162.158.0.0/15", // Cloudflare specific for Discord
    "35.212.0.0/16",  // GCP used by Discord
    "35.215.0.0/16"
  ],

  // Meta (Instagram / WhatsApp Media)
  meta: [
    "157.240.0.0/16",
    "31.13.64.0/18",
    "103.4.96.0/22",
    "129.134.0.0/16",
    "185.60.216.0/22",
    "204.79.197.200/32"
  ]
};

export const getAllSmartCidrs = (): string[] => {
  return [
    ...SMART_ROUTES.google_video,
    ...SMART_ROUTES.discord,
    ...SMART_ROUTES.meta
  ];
};

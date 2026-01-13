import { lazy } from 'react';

// Feature-Sliced Design: Lazy load feature entry points
const AiAnalyst = lazy(() => import('../features/ai/components/AiAnalyst').then(m => ({ default: m.AiAnalyst })));
const AndroidSection = lazy(() => import('../features/android/AndroidSection'));
const WindowsGuide = lazy(() => import('../features/windows/components/WindowsGuide').then(m => ({ default: m.WindowsGuide })));
const LinuxGuide = lazy(() => import('../features/linux/components/LinuxGuide').then(m => ({ default: m.LinuxGuide })));
const VpnRegionGuide = lazy(() => import('../features/vpn/components/VpnRegionGuide').then(m => ({ default: m.VpnRegionGuide })));
const AppleGuide = lazy(() => import('../features/apple/components/AppleGuide').then(m => ({ default: m.AppleGuide })));
const Whitelist = lazy(() => import('../features/whitelist/components/Whitelist').then(m => ({ default: m.Whitelist })));
const FAQ = lazy(() => import('../features/faq/components/FAQ').then(m => ({ default: m.FAQ })));

export const sections = [
  {
    id: 'ai',
    title: 'AI Analyst',
    shortTitle: 'AI Maestro',
    Component: AiAnalyst
  },
  {
    id: 'android',
    title: 'Android & TV',
    shortTitle: 'Android',
    Component: AndroidSection
  },
  {
    id: 'windows',
    title: 'Windows PC',
    shortTitle: 'Windows',
    Component: WindowsGuide
  },
  {
    id: 'apple',
    title: 'Apple Ecosystem',
    shortTitle: 'iOS / Mac',
    Component: AppleGuide
  },
  {
    id: 'linux',
    title: 'Linux / Server',
    shortTitle: 'Linux',
    Component: LinuxGuide
  },
  {
    id: 'vpn',
    title: 'VPN & Region',
    shortTitle: 'VPN Region',
    Component: VpnRegionGuide
  },
  {
    id: 'whitelist',
    title: 'Whitelist & Domains',
    shortTitle: 'Whitelist',
    Component: Whitelist
  },
  {
    id: 'faq',
    title: 'F.A.Q.',
    shortTitle: 'FAQ',
    Component: FAQ
  }
];
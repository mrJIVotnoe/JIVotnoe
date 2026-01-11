import { lazy } from 'react';

// Lazy load features to improve initial bundle size
const AiAnalyst = lazy(() => import('../features/ai/components/AiAnalyst').then(m => ({ default: m.AiAnalyst })));
const AndroidSection = lazy(() => import('../features/android/AndroidSection'));
const WindowsGuide = lazy(() => import('../components/WindowsGuide').then(m => ({ default: m.WindowsGuide })));
const LinuxGuide = lazy(() => import('../components/LinuxGuide').then(m => ({ default: m.LinuxGuide })));
const VpnRegionGuide = lazy(() => import('../components/VpnRegionGuide').then(m => ({ default: m.VpnRegionGuide })));
const AppleGuide = lazy(() => import('../components/AppleGuide').then(m => ({ default: m.AppleGuide })));
const Whitelist = lazy(() => import('../components/Whitelist').then(m => ({ default: m.Whitelist })));
const FAQ = lazy(() => import('../components/FAQ').then(m => ({ default: m.FAQ })));

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
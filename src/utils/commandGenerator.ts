import { StrategyConfig } from '../types';

interface CommandOptions {
  os: 'windows' | 'linux' | 'macos';
  strategy: StrategyConfig;
  sni: string;
  port?: number;
  arch?: 'intel' | 'silicon';
}

export const generateCommand = ({ 
  os, 
  strategy, 
  sni, 
  port = 1080,
  arch = 'silicon'
}: CommandOptions): string => {
  
  // Base substitution for SNI
  let args = strategy.command;
  if (args.includes('{{SNI}}')) {
    args = args.replace('{{SNI}}', sni);
  } else {
    // Fallback regex replacement if placeholder missing
    args = args.replace(/-n [^\s]+/, `-n ${sni}`);
  }

  // OS Specific adjustments
  if (os === 'linux' || os === 'macos') {
    // Unix systems often need different flags or no -d1 in some versions
    args = args.replace(/-d1\s?/, ''); 
  }

  const binary = os === 'windows' ? 'ciadpi.exe' 
    : os === 'macos' ? (arch === 'silicon' ? './ciadpi-aarch64' : './ciadpi-x86_64')
    : './ciadpi-x86_64'; // linux default

  return `${binary} -i 127.0.0.1 -p ${port} ${args}`;
};

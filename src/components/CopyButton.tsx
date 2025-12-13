import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-2 rounded-md transition-colors ${
        copied 
          ? 'bg-cyber-accent text-white' 
          : 'bg-cyber-700 hover:bg-cyber-500 text-gray-200'
      } ${className}`}
      title="Копировать"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  );
};
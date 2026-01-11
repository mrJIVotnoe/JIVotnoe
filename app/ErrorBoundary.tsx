import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-cyber-900">
          <div className="bg-red-500/10 p-4 rounded-full mb-4 animate-pulse">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">System Failure</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            The neural link has encountered a critical error. 
            <br/>
            <span className="text-xs font-mono text-red-400 mt-2 block">{this.state.error?.message}</span>
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-cyber-accent text-cyber-900 px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <RefreshCcw size={18} />
            Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
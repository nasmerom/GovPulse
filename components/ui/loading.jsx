import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
    />
  );
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 political-terminal">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" className="text-blue-400 mx-auto" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <LoadingSpinner size="lg" className="text-blue-400 mx-auto" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
} 
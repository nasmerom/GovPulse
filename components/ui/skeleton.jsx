import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-700 ${className}`}
      {...props}
    />
  );
} 
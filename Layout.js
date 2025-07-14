import React from 'react';
import NavigationHeader from './components/NavigationHeader';

export default function Layout({ children, currentPage = 'home' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <NavigationHeader currentPage={currentPage} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 
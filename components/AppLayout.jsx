import React from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ user, children }) {
  return (
    <div className="layout-container bg-[var(--terminal-bg)]">
      <Sidebar user={user} />
      <main className="main-content">
        <div className="loading-fade">
          {children}
        </div>
      </main>
    </div>
  );
} 
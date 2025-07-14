import React from 'react';
import Link from 'next/link';
import { User, Lock, UserPlus } from 'lucide-react';

const NavigationHeader = ({ currentPage = 'home' }) => {
  const navItems = [
    { name: 'Home', href: '/', icon: User },
    { name: 'Sign In', href: '/login', icon: Lock },
    { name: 'Sign Up', href: '/signup', icon: UserPlus },
  ];

  return (
    <header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold terminal-text">GovPulse</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.name.toLowerCase().replace(' ', '');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader; 
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRight, Home } from 'lucide-react';

const getBreadcrumbPath = (pathname) => {
  const segments = pathname.split('/').filter(segment => segment);
  
  if (segments.length === 0) {
    return [{ label: 'Home', href: '/', isActive: true }];
  }

  const breadcrumbs = [
    { label: 'Home', href: '/', isActive: false }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert segment to readable label
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Special cases for better labels
    const labelMap = {
      'business-dashboard': 'Business Dashboard',
      'business-reports': 'Business Reports',
      'market-intelligence': 'Market Intelligence',
      'business-intelligence': 'Business Intelligence',
      'federal-awards': 'Federal Awards',
      'local-spending': 'Local Spending',
      'foreign-affairs': 'Foreign Affairs'
    };
    
    label = labelMap[segment] || label;
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isActive: isLast
    });
  });

  return breadcrumbs;
};

export default function Breadcrumbs() {
  const router = useRouter();
  const breadcrumbs = getBreadcrumbPath(router.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.href}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {breadcrumb.isActive ? (
            <span className="text-white font-medium">{breadcrumb.label}</span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-1"
            >
              {breadcrumb.label === 'Home' && <Home className="w-3 h-3" />}
              <span>{breadcrumb.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 
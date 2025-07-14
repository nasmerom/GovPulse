import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
      setPageKey(prev => prev + 1);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--terminal-bg)]">
        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
        
        {/* Main content with smooth transitions */}
        <div 
          key={pageKey}
          className={`page-transition ${isLoading ? 'opacity-50' : 'opacity-100'}`}
          style={{ 
            transition: 'opacity 0.3s ease-in-out',
            minHeight: '100vh'
          }}
        >
          <Component {...pageProps} />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default MyApp; 
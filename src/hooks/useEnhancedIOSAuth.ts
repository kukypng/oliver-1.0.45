import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export const useEnhancedIOSAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();

  // Prevent iOS authentication loops
  const preventAuthLoop = useCallback(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Debounced navigation to prevent rapid redirects
    const safeNavigate = (path: string, replace = true) => {
      navigationTimeoutRef.current = setTimeout(() => {
        if (window.location.pathname !== path) {
          console.log('🍎 iOS Safe navigation to:', path);
          navigate(path, { replace });
        }
      }, 100);
    };

    return safeNavigate;
  }, [navigate]);

  // Enhanced iOS session handling
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS || loading) return;

    const safeNavigate = preventAuthLoop();
    if (!safeNavigate) return;

    // Handle authentication state changes for iOS
    if (user && location.pathname === '/auth') {
      console.log('🍎 iOS: Authenticated user on auth page, redirecting to dashboard');
      safeNavigate('/dashboard');
    } else if (user && location.pathname === '/') {
      console.log('🍎 iOS: Authenticated user on index, redirecting to dashboard');
      safeNavigate('/dashboard');
    } else if (!user && location.pathname.startsWith('/dashboard')) {
      console.log('🍎 iOS: Unauthenticated user on dashboard, redirecting to auth');
      safeNavigate('/auth');
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [user, loading, location.pathname, preventAuthLoop]);

  // Clean up URL parameters that might cause loops on iOS
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS) return;

    const url = new URL(window.location.href);
    const problematicParams = [
      'access_token',
      'refresh_token',
      'expires_in',
      'token_type',
      'error',
      'error_code',
      'error_description'
    ];

    let hasProblematicParams = false;
    problematicParams.forEach(param => {
      if (url.searchParams.has(param)) {
        url.searchParams.delete(param);
        hasProblematicParams = true;
      }
    });

    if (hasProblematicParams && window.history.replaceState) {
      console.log('🍎 iOS: Cleaning problematic URL parameters');
      window.history.replaceState({}, '', url.toString());
    }
  }, [location.search]);

  return {
    isIOSDevice: /iPad|iPhone|iPod/.test(navigator.userAgent),
    preventAuthLoop,
  };
};
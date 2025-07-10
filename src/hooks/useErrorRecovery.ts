import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ErrorRecoveryOptions {
  clearCacheOnAuthError?: boolean;
  clearCacheOnNetworkError?: boolean;
  clearLocalStorageOnCriticalError?: boolean;
}

export const useErrorRecovery = (options: ErrorRecoveryOptions = {}) => {
  const queryClient = useQueryClient();

  const {
    clearCacheOnAuthError = true,
    clearCacheOnNetworkError = true,
    clearLocalStorageOnCriticalError = true,
  } = options;

  const clearAllCache = () => {
    console.log('🧹 Limpando cache devido a erro grave...');
    queryClient.clear();
    queryClient.invalidateQueries();
  };

  const clearLocalStorage = () => {
    console.log('🧹 Limpando localStorage devido a erro crítico...');
    const keysToKeep = ['theme', 'language']; // Manter algumas configurações
    const storage = { ...localStorage };
    localStorage.clear();
    keysToKeep.forEach(key => {
      if (storage[key]) {
        localStorage.setItem(key, storage[key]);
      }
    });
  };

  const handleCriticalError = (error: Error, context: string) => {
    console.error(`❌ Erro crítico detectado em ${context}:`, error);
    
    // Auth errors
    if (error.message?.includes('JWT') || 
        error.message?.includes('auth') || 
        error.message?.includes('session') ||
        error.message?.includes('Invalid login credentials')) {
      if (clearCacheOnAuthError) {
        clearAllCache();
      }
      // Force logout on critical auth errors
      supabase.auth.signOut();
      return;
    }

    // Network errors
    if (error.message?.includes('fetch') || 
        error.message?.includes('network') ||
        error.message?.includes('offline')) {
      if (clearCacheOnNetworkError) {
        clearAllCache();
      }
      return;
    }

    // Critical app errors (infinite loops, state corruption, etc.)
    if (error.message?.includes('loop') ||
        error.message?.includes('recursion') ||
        error.message?.includes('Maximum call stack') ||
        context.includes('loop')) {
      if (clearLocalStorageOnCriticalError) {
        clearLocalStorage();
      }
      clearAllCache();
      // iOS-safe reload after clearing cache
      setTimeout(() => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 100);
      return;
    }
  };

  useEffect(() => {
    // Monitor unhandled errors
    const handleError = (event: ErrorEvent) => {
      handleCriticalError(new Error(event.message), 'global');
    };

    // Monitor unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      handleCriticalError(new Error(event.reason), 'promise');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return {
    clearAllCache,
    clearLocalStorage,
    handleCriticalError,
  };
};
import { useEffect, useCallback } from 'react';
import { useDeviceType } from './useDeviceType';

interface IOSScreenFixOptions {
  enableViewportFix?: boolean;
  enableColorFix?: boolean;
  enableSafeAreaFix?: boolean;
  enablePreventLoop?: boolean;
}

export const useIOSScreenFix = (options: IOSScreenFixOptions = {}) => {
  const {
    enableViewportFix = true,
    enableColorFix = true,
    enableSafeAreaFix = true,
    enablePreventLoop = true,
  } = options;

  const deviceInfo = useDeviceType();

  const fixIOSColors = useCallback(() => {
    if (!enableColorFix) return;

    // Force CSS variables recalculation
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check if colors are properly set
    const backgroundColor = computedStyle.getPropertyValue('--background').trim();
    const foregroundColor = computedStyle.getPropertyValue('--foreground').trim();
    
    console.log('🎨 iOS Color Check:', { backgroundColor, foregroundColor });
    
    // Force dark theme colors if they're not set correctly
    if (!backgroundColor || backgroundColor === 'initial' || backgroundColor === '') {
      console.log('🔧 Fixing iOS background colors...');
      root.style.setProperty('--background', '0 0% 7%');
      root.style.setProperty('--foreground', '0 0% 94%');
      root.style.setProperty('--card', '0 0% 9%');
      root.style.setProperty('--card-foreground', '0 0% 94%');
      root.style.setProperty('--primary', '43 98% 59%');
      root.style.setProperty('--primary-foreground', '0 0% 0%');
      
      // Force body background
      document.body.style.backgroundColor = 'hsl(0, 0%, 7%)';
      document.body.style.color = 'hsl(0, 0%, 94%)';
    }
  }, [enableColorFix]);

  const fixIOSViewport = useCallback(() => {
    if (!enableViewportFix) return;

    // Enhanced iOS viewport fix
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      const actualVh = window.visualViewport?.height || window.innerHeight;
      
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--actual-vh', `${actualVh}px`);
      
      // Force minimum height
      document.documentElement.style.minHeight = `${window.innerHeight}px`;
      document.body.style.minHeight = `${window.innerHeight}px`;
      
      console.log('📱 iOS Viewport fixed:', { vh, actualVh, innerHeight: window.innerHeight });
    };

    setVH();

    // Listen to all possible resize events
    const events = ['resize', 'orientationchange', 'scroll'];
    events.forEach(event => {
      window.addEventListener(event, setVH);
    });

    // Visual viewport support
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVH);
    }

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, setVH);
      });
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVH);
      }
    };
  }, [enableViewportFix]);

  const fixIOSSafeArea = useCallback(() => {
    if (!enableSafeAreaFix) return;

    // Enhanced safe area detection
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      
      const safeAreaTop = style.getPropertyValue('env(safe-area-inset-top)') || 
                         style.getPropertyValue('constant(safe-area-inset-top)') || '0px';
      const safeAreaBottom = style.getPropertyValue('env(safe-area-inset-bottom)') || 
                            style.getPropertyValue('constant(safe-area-inset-bottom)') || '0px';
      
      document.documentElement.style.setProperty('--safe-area-top', safeAreaTop);
      document.documentElement.style.setProperty('--safe-area-bottom', safeAreaBottom);
      
      console.log('🛡️ Safe area updated:', { safeAreaTop, safeAreaBottom });
    };

    updateSafeArea();
    
    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(updateSafeArea, 100);
    });

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, [enableSafeAreaFix]);

  const preventIOSAuthLoop = useCallback(() => {
    if (!enablePreventLoop) return;

    // Prevent authentication loops common on iOS
    const preventLoop = () => {
      const currentUrl = window.location.href;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for problematic parameters that might cause loops
      const loopParams = ['access_token', 'refresh_token', 'error', 'error_code'];
      const hasLoopParams = loopParams.some(param => urlParams.has(param));
      
      if (hasLoopParams && window.history.replaceState) {
        console.log('🔄 Preventing iOS auth loop by cleaning URL');
        const cleanUrl = currentUrl.split('?')[0] + (window.location.hash || '');
        window.history.replaceState({}, '', cleanUrl);
      }
    };

    preventLoop();
    
    // Monitor for problematic URL changes
    const handlePopState = () => {
      setTimeout(preventLoop, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enablePreventLoop]);

  const fixIOSScrolling = useCallback(() => {
    // Fix iOS scrolling issues with proper typing
    const bodyStyle = document.body.style as any;
    bodyStyle.webkitOverflowScrolling = 'touch';
    bodyStyle.overflowScrolling = 'touch';
    
    // Prevent bounce scrolling
    document.addEventListener('touchmove', (e) => {
      const target = e.target as Element;
      if (!target.closest('.scrollable')) {
        e.preventDefault();
      }
    }, { passive: false });
  }, []);

  useEffect(() => {
    // Only apply iOS fixes on iOS devices
    if (deviceInfo.type === 'mobile' && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      console.log('🍎 Applying iOS screen fixes...');
      
      const cleanupFunctions: (() => void)[] = [];
      
      // Apply all fixes
      cleanupFunctions.push(fixIOSViewport() || (() => {}));
      cleanupFunctions.push(fixIOSSafeArea() || (() => {}));
      cleanupFunctions.push(preventIOSAuthLoop() || (() => {}));
      
      fixIOSColors();
      fixIOSScrolling();
      
      // Force layout recalculation
      setTimeout(() => {
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
        console.log('✅ iOS layout recalculated');
      }, 100);
      
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }
  }, [deviceInfo, fixIOSColors, fixIOSViewport, fixIOSSafeArea, preventIOSAuthLoop, fixIOSScrolling]);

  return {
    isIOS: deviceInfo.type === 'mobile' && /iPad|iPhone|iPod/.test(navigator.userAgent),
    deviceInfo,
    fixIOSColors,
    fixIOSViewport,
  };
};
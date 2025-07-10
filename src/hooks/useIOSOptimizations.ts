import { useEffect } from 'react';

export const useIOSOptimizations = () => {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Prevent iOS login loops
    if (isIOS) {
      // Clear any stale auth state that might cause loops
      const clearStaleAuthState = () => {
        const storageKeys = Object.keys(localStorage);
        const authKeys = storageKeys.filter(key => 
          key.includes('supabase') || 
          key.includes('auth') ||
          key.includes('session')
        );
        
        // Check for potential corrupted auth data
        authKeys.forEach(key => {
          try {
            const value = localStorage.getItem(key);
            if (value && value !== 'null' && value !== 'undefined') {
              JSON.parse(value); // Test if valid JSON
            }
          } catch (e) {
            console.log(`🧹 iOS: Removendo dados de auth corrompidos: ${key}`);
            localStorage.removeItem(key);
          }
        });
      };
      
      clearStaleAuthState();
      
      // Prevent iOS login loops by intercepting problematic redirects
      const originalLocationHref = Object.getOwnPropertyDescriptor(window.location, 'href') || Object.getOwnPropertyDescriptor(Location.prototype, 'href');
      
      // Object.defineProperty(window.location, 'href', {
        // set: function(url) {
          console.log(`🍎 iOS: Tentativa de redirecionamento interceptada: ${url}`);
          if (originalLocationHref && originalLocationHref.set) {
            originalLocationHref.set.call(this, url);
          }
        },
        get: function() {
          if (originalLocationHref && originalLocationHref.get) {
            return originalLocationHref.get.call(this);
          }
          return '';
        }
      });
    }
    
    if (isIOS) {
      // Fix iOS viewport height issue and keyboard behavior
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        // Fix iOS Safari toolbar height issue
        document.documentElement.style.setProperty('--actual-vh', `${window.visualViewport?.height || window.innerHeight}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
      });
      
      // Add visual viewport support for iOS
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', setVH);
      }

      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Fix iOS input zoom and keyboard handling
      const addInputListeners = () => {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          input.addEventListener('focus', (e) => {
            document.body.classList.add('ios-keyboard-open');
            // Prevent zoom on focus
            const target = e.target as HTMLElement;
            if (target.style.fontSize !== '16px') {
              target.style.fontSize = '16px';
            }
          });
          input.addEventListener('blur', () => {
            document.body.classList.remove('ios-keyboard-open');
            // Scroll to top to fix viewport issues
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setVH(); // Recalculate viewport height
            }, 150);
          });
        });
      };

      addInputListeners();

      // Re-run when DOM changes
      const observer = new MutationObserver(addInputListeners);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', setVH);
        }
        observer.disconnect();
      };
    }
  }, []);
};
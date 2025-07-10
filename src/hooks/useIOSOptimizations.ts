import { useEffect } from 'react';

export const useIOSOptimizations = () => {
  useEffect(() => {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Fix iOS viewport height issue
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
      });

      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Fix iOS input zoom
      const addInputListeners = () => {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          input.addEventListener('focus', () => {
            document.body.classList.add('ios-keyboard-open');
          });
          input.addEventListener('blur', () => {
            document.body.classList.remove('ios-keyboard-open');
            // Scroll to top to fix viewport issues
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 100);
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
        observer.disconnect();
      };
    }
  }, []);
};
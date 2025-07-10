
import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
  isUltraWide: boolean;
  density: 'compact' | 'comfortable' | 'spacious';
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const getDeviceType = (width: number): DeviceType => {
  if (width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
};

const getDensity = (type: DeviceType, width: number) => {
  if (type === 'mobile') return 'compact';
  if (type === 'tablet') return 'comfortable';
  return width > 1600 ? 'spacious' : 'comfortable';
};

const getSafeArea = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // CSS environment variables for safe area
  const computedStyle = getComputedStyle(document.documentElement);
  
  // Try both env() and constant() for older iOS versions
  const getInset = (property: string) => {
    const envValue = computedStyle.getPropertyValue(`env(${property})`);
    const constantValue = computedStyle.getPropertyValue(`constant(${property})`);
    return parseInt(envValue || constantValue || '0');
  };

  return {
    top: getInset('safe-area-inset-top'),
    bottom: getInset('safe-area-inset-bottom'),
    left: getInset('safe-area-inset-left'),
    right: getInset('safe-area-inset-right'),
  };
};

export const useDeviceType = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        width: 1920,
        height: 1080,
        isTouchDevice: false,
        orientation: 'landscape',
        isUltraWide: false,
        density: 'comfortable',
        safeArea: { top: 0, bottom: 0, left: 0, right: 0 }
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const type = getDeviceType(width);
    
    return {
      type,
      width,
      height,
      isTouchDevice: 'ontouchstart' in window,
      orientation: width > height ? 'landscape' : 'portrait',
      isUltraWide: width / height > 2.1,
      density: getDensity(type, width),
      safeArea: getSafeArea()
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const type = getDeviceType(width);
      
      setDeviceInfo({
        type,
        width,
        height,
        isTouchDevice: 'ontouchstart' in window,
        orientation: width > height ? 'landscape' : 'portrait',
        isUltraWide: width / height > 2.1,
        density: getDensity(type, width),
        safeArea: getSafeArea()
      });
    };

    const handleOrientationChange = () => {
      // Delay to ensure viewport has updated
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

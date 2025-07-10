import React, { useEffect, useState } from 'react';
import { useIOSScreenFix } from '@/hooks/useIOSScreenFix';
import { cn } from '@/lib/utils';

interface IOSLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const IOSLayoutWrapper = ({ children, className }: IOSLayoutWrapperProps) => {
  const { isIOS, deviceInfo } = useIOSScreenFix();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isIOS) {
      // Ensure iOS is fully ready before rendering
      setTimeout(() => {
        setIsReady(true);
      }, 150);
    } else {
      setIsReady(true);
    }
  }, [isIOS]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground',
        isIOS && [
          'ios-layout-wrapper',
          'antialiased',
          // Safe area support
          'pb-safe',
          // iOS specific classes
          deviceInfo.orientation === 'portrait' ? 'ios-portrait' : 'ios-landscape',
          deviceInfo.density === 'compact' && 'ios-compact',
        ],
        className
      )}
      style={{
        minHeight: isIOS ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        // Force proper background
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      }}
    >
      {children}
    </div>
  );
};
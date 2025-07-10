
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from '@/pages/AuthPage';
import { LicenseExpiredPage } from '@/pages/LicenseExpiredPage';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useEnhancedIOSAuth } from '@/hooks/useEnhancedIOSAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const { data: isLicenseValid, isLoading: licenseLoading } = useLicenseValidation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Enhanced iOS authentication handling
  const { isIOSDevice } = useEnhancedIOSAuth();

  // Debounced navigation to prevent iOS loops
  const safeNavigate = (path: string, replace = true) => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    
    navigationTimeoutRef.current = setTimeout(() => {
      if (window.location.pathname !== path) {
        console.log('🛡️ AuthGuard safe navigation to:', path);
        navigate(path, { replace });
      }
    }, isIOSDevice ? 150 : 0); // Extra delay for iOS
  };

  // Handle automatic navigation after successful login
  useEffect(() => {
    if (!loading && user && location.pathname === '/') {
      safeNavigate('/dashboard');
    }
    
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [user, loading, location.pathname]);

  if (loading || licenseLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-background"
        style={{
          backgroundColor: 'hsl(var(--background))',
          minHeight: isIOSDevice ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Check license validity after user is authenticated
  if (isLicenseValid === false) {
    return <LicenseExpiredPage />;
  }

  return <>{children}</>;
};

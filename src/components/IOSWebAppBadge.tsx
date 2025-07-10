import React, { useState, useEffect } from 'react';
import { X, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const IOSWebAppBadge = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    
    setIsIOS(iOS);
    setIsStandalone(standalone);
    
    // Show badge only on iOS when not in standalone mode
    if (iOS && !standalone) {
      const hasShownBefore = localStorage.getItem('ios-webapp-badge-shown');
      if (!hasShownBefore) {
        setTimeout(() => setShowBadge(true), 3000); // Show after 3 seconds
      }
    }
  }, []);

  const handleClose = () => {
    setShowBadge(false);
    localStorage.setItem('ios-webapp-badge-shown', 'true');
  };

  if (!isIOS || isStandalone || !showBadge) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <Card className="p-4 bg-card/95 backdrop-blur-xl border-border/50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Adicione Oliver à tela inicial
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Para uma melhor experiência, adicione o Oliver à sua tela inicial. 
              Toque em <Share className="w-3 h-3 inline mx-1" /> e depois em "Adicionar à Tela de Início".
            </p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClose}
                className="text-xs h-8"
              >
                Agora não
              </Button>
              <Button 
                size="sm" 
                onClick={handleClose}
                className="text-xs h-8"
              >
                Entendi
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="flex-shrink-0 w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
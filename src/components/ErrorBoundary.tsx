import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Check if this is a critical error that requires cache clearing
    const isCriticalError = error.message?.includes('loop') ||
                           error.message?.includes('recursion') ||
                           error.message?.includes('Maximum call stack') ||
                           error.stack?.includes('AuthGuard') ||
                           error.stack?.includes('useAuth');
    
    if (isCriticalError) {
      this.clearApplicationData();
    }
  }

  private clearApplicationData = () => {
    console.log('🧹 Limpando dados da aplicação devido a erro crítico...');
    
    // Clear localStorage (keep only essential data)
    const keysToKeep = ['theme', 'language'];
    const storage = { ...localStorage };
    localStorage.clear();
    keysToKeep.forEach(key => {
      if (storage[key]) {
        localStorage.setItem(key, storage[key]);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
  };
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined
    });
  };
  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Oops! Algo deu errado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando na correção.
              </p>
              
              <div className="space-y-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    this.clearApplicationData();
                    // iOS-safe reload
                    setTimeout(() => {
                      window.history.pushState({}, '', '/');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }, 100);
                  }} 
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Cache e Recarregar
                </Button>
                
                <Button variant="secondary" onClick={() => {
                  // iOS-safe reload
                  window.history.pushState({}, '', window.location.pathname);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Apenas Recarregar
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && <details className="mt-4 p-4 rounded-lg text-left bg-slate-900">
                  <summary className="cursor-pointer font-medium text-sm">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>}
            </CardContent>
          </Card>
        </div>;
    }
    return this.props.children;
  }
}
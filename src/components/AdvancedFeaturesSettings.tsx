import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, CheckCircle, Calendar, Bell, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

export const AdvancedFeaturesSettings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const updateSettingsMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!profile?.id) throw new Error('User not found');
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ advanced_features_enabled: enabled })
        .eq('id', profile.id);

      if (error) throw error;
      return enabled;
    },
    onSuccess: (enabled) => {
      toast({
        title: enabled ? 'Funcionalidades avançadas ativadas!' : 'Funcionalidades avançadas desativadas',
        description: enabled 
          ? 'Agora você tem acesso ao controle avançado de clientes e orçamentos.'
          : 'As funcionalidades avançadas foram desativadas.',
      });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      console.error('Error updating advanced features:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar as configurações. Tente novamente.',
        variant: 'destructive',
      });
    },
  });

  const handleToggle = (enabled: boolean) => {
    if (enabled && !profile?.advanced_features_enabled) {
      // Show confirmation dialog when trying to enable
      setShowConfirmDialog(true);
    } else {
      // Direct update when disabling
      updateSettingsMutation.mutate(enabled);
    }
  };

  const handleConfirmActivation = () => {
    setShowConfirmDialog(false);
    updateSettingsMutation.mutate(true);
  };

  const advancedFeatures = [
    {
      icon: Users,
      title: 'Cadastro de Clientes',
      description: 'Gerencie uma base completa de clientes com histórico de orçamentos',
    },
    {
      icon: CheckCircle,
      title: 'Status de Orçamentos',
      description: 'Controle visual do status: pendente, aprovado, pago, entregue',
    },
    {
      icon: Calendar,
      title: 'Controle de Validade',
      description: 'Acompanhe a validade dos orçamentos com alertas automáticos',
    },
    {
      icon: Bell,
      title: 'Notificações Inteligentes',
      description: 'Alertas de orçamentos vencendo e outras notificações importantes',
    },
  ];

  return (
    <>
      <Card className="glass-card shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Funcionalidades Avançadas</CardTitle>
              <CardDescription>
                Ative recursos profissionais para gestão completa de clientes e orçamentos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="advanced-features" className="text-base font-medium">
                Ativar Funcionalidades Avançadas
              </Label>
              <p className="text-sm text-muted-foreground">
                Habilita controle completo de clientes, status de orçamentos e notificações
              </p>
            </div>
            <div className="flex items-center gap-3">
              {profile?.advanced_features_enabled && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Ativo
                </Badge>
              )}
              <Switch
                id="advanced-features"
                checked={profile?.advanced_features_enabled || false}
                onCheckedChange={handleToggle}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>

          {profile?.advanced_features_enabled && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-medium text-foreground">Recursos disponíveis:</h4>
              <div className="grid gap-3">
                {advancedFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmActivation}
        title="Ativar Funcionalidades Avançadas (BETA)"
        description="Este é um recurso em desenvolvimento e pode apresentar instabilidades. As funcionalidades avançadas incluem controle de clientes, status de orçamentos e notificações. Deseja continuar?"
        confirmButtonText="Ativar"
        cancelButtonText="Cancelar"
      />
    </>
  );
};
